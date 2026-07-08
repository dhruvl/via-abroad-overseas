import { NextResponse } from "next/server";
import { contactFormSchema, attributionSchema, HONEYPOT_FIELD } from "@/lib/validation/enquiry";
import { MAX_REQUEST_BYTES } from "@/lib/security/spam-checks";
import { runEnquiryPipeline } from "@/lib/server/enquiry-pipeline";

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

  const parsed = contactFormSchema.safeParse(payload);
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
      interested_country: data.interestedCountry,
      service_required: data.serviceRequired,
      message: data.message || undefined,
      consent: data.consent,
    },
    attribution: attribution.success ? attribution.data : {},
  });
}
