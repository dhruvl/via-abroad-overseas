import "server-only";
import type { createServerSupabaseClient } from "@/lib/supabase/server";
import type { EnquiryFilters } from "@/lib/validation/admin";

type SupabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

export type EnquiryRow = {
  id: string;
  enquiry_type: "general" | "consultation";
  full_name: string;
  phone: string;
  email: string;
  interested_country: string | null;
  service_required: string | null;
  current_qualification: string | null;
  interested_course: string | null;
  message: string | null;
  status: "new" | "contacted" | "qualified" | "closed" | "spam";
  source_path: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  consent: boolean;
  created_at: string;
  updated_at: string;
};

export async function getDashboardMetrics(supabase: SupabaseClient) {
  const [totalNew, totalContacted, totalQualified, totalConsultations, recent] =
    await Promise.all([
      supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase
        .from("enquiries")
        .select("id", { count: "exact", head: true })
        .eq("status", "contacted"),
      supabase
        .from("enquiries")
        .select("id", { count: "exact", head: true })
        .eq("status", "qualified"),
      supabase
        .from("enquiries")
        .select("id", { count: "exact", head: true })
        .eq("enquiry_type", "consultation"),
      supabase
        .from("enquiries")
        .select(
          "id, full_name, email, enquiry_type, status, interested_country, created_at"
        )
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

  return {
    newCount: totalNew.count ?? 0,
    contactedCount: totalContacted.count ?? 0,
    qualifiedCount: totalQualified.count ?? 0,
    consultationCount: totalConsultations.count ?? 0,
    recent: (recent.data ?? []) as Pick<
      EnquiryRow,
      "id" | "full_name" | "email" | "enquiry_type" | "status" | "interested_country" | "created_at"
    >[],
  };
}

export async function listEnquiries(supabase: SupabaseClient, filters: EnquiryFilters) {
  let query = supabase.from("enquiries").select("*", { count: "exact" });

  if (filters.type) query = query.eq("enquiry_type", filters.type);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.country) query = query.eq("interested_country", filters.country);
  if (filters.search) {
    const term = filters.search.replace(/[%_]/g, "\\$&");
    query = query.or(
      `full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`
    );
  }

  query = query.order("created_at", { ascending: filters.sort === "oldest" });

  const from = (filters.page - 1) * filters.pageSize;
  const to = from + filters.pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(`Failed to list enquiries: ${error.message}`);

  return { rows: (data ?? []) as EnquiryRow[], total: count ?? 0 };
}

export async function getEnquiryById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to load enquiry: ${error.message}`);
  return data as EnquiryRow | null;
}

export async function updateEnquiryStatus(
  supabase: SupabaseClient,
  enquiryId: string,
  status: EnquiryRow["status"],
  adminProfileId: string
) {
  const { data: existing } = await supabase
    .from("enquiries")
    .select("status")
    .eq("id", enquiryId)
    .maybeSingle();

  const { error } = await supabase
    .from("enquiries")
    .update({ status })
    .eq("id", enquiryId);

  if (error) throw new Error(`Failed to update status: ${error.message}`);

  await supabase.from("audit_logs").insert({
    admin_user_id: adminProfileId,
    action: "enquiry_status_updated",
    entity_type: "enquiry",
    entity_id: enquiryId,
    safe_metadata: { from_status: existing?.status ?? null, to_status: status },
  });
}

export async function listAdminNotes(supabase: SupabaseClient, enquiryId: string) {
  const { data, error } = await supabase
    .from("admin_notes")
    .select("id, note, created_at, admin_user_id, admin_profiles(display_name)")
    .eq("enquiry_id", enquiryId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to load notes: ${error.message}`);
  return data ?? [];
}

export async function addAdminNote(
  supabase: SupabaseClient,
  enquiryId: string,
  adminProfileId: string,
  note: string
) {
  const { error } = await supabase.from("admin_notes").insert({
    enquiry_id: enquiryId,
    admin_user_id: adminProfileId,
    note,
  });
  if (error) throw new Error(`Failed to add note: ${error.message}`);

  await supabase.from("audit_logs").insert({
    admin_user_id: adminProfileId,
    action: "note_added",
    entity_type: "enquiry",
    entity_id: enquiryId,
    safe_metadata: { note_length: note.length },
  });
}

export async function listEnquiriesForExport(
  supabase: SupabaseClient,
  filters: Omit<EnquiryFilters, "page" | "pageSize">
) {
  let query = supabase.from("enquiries").select("*");

  if (filters.type) query = query.eq("enquiry_type", filters.type);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.country) query = query.eq("interested_country", filters.country);
  if (filters.search) {
    const term = filters.search.replace(/[%_]/g, "\\$&");
    query = query.or(
      `full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`
    );
  }

  query = query.order("created_at", { ascending: filters.sort === "oldest" }).limit(5000);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to export enquiries: ${error.message}`);
  return (data ?? []) as EnquiryRow[];
}
