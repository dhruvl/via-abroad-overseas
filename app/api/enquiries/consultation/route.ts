import { NextResponse } from "next/server";
import { consultationFormSchema, attributionSchema, HONEYPOT_FIELD } from "@/lib/validation/enquiry";
import { MAX_REQUEST_BYTES } from "@/lib/security/spam-checks";
import { readBoundedJson } from "@/lib/server/bounded-json";
import { runEnquiryPipeline } from "@/lib/server/enquiry-pipeline";

export async function POST(request: Request) {
  const body = await readBoundedJson(request, MAX_REQUEST_BYTES);
  if (body.status === "unsupported_media_type") {
    return NextResponse.json({ error: "Content-Type must be application/json." }, { status: 415 });
  }
  if (body.status === "too_large") {
    return NextResponse.json({ error: "Request payload too large." }, { status: 413 });
  }
  if (body.status === "malformed_json") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const payload = body.value;

  const parsed = consultationFormSchema.safeParse(payload);
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
    expectedTurnstileAction: "consultation",
    record: {
      enquiry_type: "consultation",
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      interested_country: data.preferredCountry,
      current_qualification: data.currentQualification,
      interested_course: data.interestedCourse || undefined,
      message: data.message || undefined,
      consent: data.consent,
    },
    attribution: attribution.success ? attribution.data : {},
  });
}
