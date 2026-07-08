import "server-only";
import { getServiceSupabaseClient } from "@/lib/supabase/service";

export type NewEnquiryRecord = {
  enquiry_type: "general" | "consultation";
  full_name: string;
  phone: string;
  email: string;
  interested_country?: string;
  service_required?: string;
  current_qualification?: string;
  interested_course?: string;
  message?: string;
  source_path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  consent: boolean;
  abuse_fingerprint?: string;
};

/**
 * Inserts a new enquiry using the secret-key client, bypassing RLS by
 * design — this is the one legitimate server-side write path for public
 * form submissions. The caller (the Route Handler) is responsible for
 * having already validated input, verified the bot challenge, and
 * applied rate limiting before this is ever called.
 */
export async function insertEnquiry(record: NewEnquiryRecord) {
  const supabase = getServiceSupabaseClient();

  const { data, error } = await supabase
    .from("enquiries")
    .insert({
      ...record,
      consent_at: record.consent ? new Date().toISOString() : null,
    })
    .select("id, created_at")
    .single();

  if (error) {
    throw new Error(`Failed to insert enquiry: ${error.message}`);
  }

  return data as { id: string; created_at: string };
}
