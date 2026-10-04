import { NextResponse } from "next/server";
import {
  findMyOptionsSchema,
  attributionSchema,
  budgetRangeLabels,
  HONEYPOT_FIELD,
} from "@/lib/validation/enquiry";
import { MAX_REQUEST_BYTES } from "@/lib/security/spam-checks";
import { runEnquiryPipeline } from "@/lib/server/enquiry-pipeline";

/**
 * Reuses the exact same validated enquiry pipeline as /contact and
 * /consultation (honeypot -> timing -> rate limit -> Turnstile -> DB
 * insert -> best-effort email), with its own schema. No database schema
 * change: `budgetRange` has no dedicated column, so it is folded into the
 * free-text `message` field alongside the chosen education level and
 * destination. See the redesign report's "Backend Integration Required"
 * note for the smallest structured follow-up if the business wants a
 * dedicated, queryable budget column later.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  if (rawBody.length > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Request payload too large." }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = findMyOptionsSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const attribution = attributionSchema.safeParse(
    typeof payload === "object" && payload !== null ? payload : {}
  );

  const data = parsed.data;
  const budgetLabel = budgetRangeLabels[data.budgetRange] ?? data.budgetRange;

  return runEnquiryPipeline({
    request,
    honeypotValue: (payload as Record<string, unknown>)[HONEYPOT_FIELD] as string | undefined,
    formRenderedAt: data.formRenderedAt,
    turnstileToken: data.turnstileToken,
    record: {
      enquiry_type: "general",
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      interested_country: data.preferredDestination,
      service_required: "Find My Options",
      current_qualification: data.educationLevel,
      message: `Find My Options enquiry. Approximate budget: ${budgetLabel}.`,
      consent: data.consent,
    },
    attribution: attribution.success ? attribution.data : {},
  });
}
