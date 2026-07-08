import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { enquiryFiltersSchema } from "@/lib/validation/admin";
import { listEnquiriesForExport } from "@/lib/database/admin-queries";
import { rowsToCsv } from "@/lib/utils/csv";

export async function GET(request: NextRequest) {
  // requireAdmin() redirects unauthenticated/unauthorized callers, which
  // is the correct behavior even for a GET endpoint hit directly.
  const { supabase } = await requireAdmin();

  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = enquiryFiltersSchema
    .omit({ page: true, pageSize: true })
    .safeParse(searchParams);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid export filters." }, { status: 400 });
  }

  const rows = await listEnquiriesForExport(supabase, parsed.data);

  const headers = [
    "ID",
    "Type",
    "Status",
    "Full Name",
    "Phone",
    "Email",
    "Interested Country",
    "Service Required",
    "Current Qualification",
    "Interested Course",
    "Message",
    "Source Path",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "Consent",
    "Created At",
  ];

  const csvRows = rows.map((row) => [
    row.id,
    row.enquiry_type,
    row.status,
    row.full_name,
    row.phone,
    row.email,
    row.interested_country,
    row.service_required,
    row.current_qualification,
    row.interested_course,
    row.message,
    row.source_path,
    row.utm_source,
    row.utm_medium,
    row.utm_campaign,
    row.consent ? "Yes" : "No",
    row.created_at,
  ]);

  const csv = rowsToCsv(headers, csvRows);
  const filename = `via-abroad-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
