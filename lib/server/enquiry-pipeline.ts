import "server-only";
import { NextResponse } from "next/server";
import { verifyTurnstileToken } from "@/lib/security/turnstile";
import { formFingerprintLimiter, formContactLimiter } from "@/lib/rate-limit/limiter";
import { hashRequestFingerprint, getClientIp } from "@/lib/security/fingerprint";
import { isHoneypotTripped, isSuspiciouslyFast, isFormStale } from "@/lib/security/spam-checks";
import { insertEnquiry, type NewEnquiryRecord } from "@/lib/database/enquiries";
import { sendBusinessNotificationEmail, sendStudentConfirmationEmail } from "@/lib/email/send";
import type { Attribution } from "@/lib/validation/enquiry";

export type EnquiryPipelineInput = {
  request: Request;
  honeypotValue: string | undefined;
  formRenderedAt: number;
  turnstileToken: string;
  record: Omit<NewEnquiryRecord, "abuse_fingerprint">;
  attribution: Attribution;
};

const GENERIC_ERROR = {
  error: "We couldn't process your submission. Please try again in a moment.",
};

export async function runEnquiryPipeline({
  request,
  honeypotValue,
  formRenderedAt,
  turnstileToken,
  record,
  attribution,
}: EnquiryPipelineInput): Promise<NextResponse> {
  // 1. Honeypot — silently pretend success so bots don't learn anything.
  if (isHoneypotTripped(honeypotValue)) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // 2. Timing heuristics — one signal among several, never sole authority.
  if (isFormStale(formRenderedAt) || isSuspiciouslyFast(formRenderedAt)) {
    return NextResponse.json(GENERIC_ERROR, { status: 400 });
  }

  const ip = getClientIp(request.headers);
  const userAgent = request.headers.get("user-agent") || "unknown";
  const fingerprint = await hashRequestFingerprint(ip, userAgent);

  // 3. Distributed rate limiting — coarse fingerprint + stricter contact-pair limit.
  const [fingerprintResult, contactResult] = await Promise.all([
    formFingerprintLimiter.limit(fingerprint),
    formContactLimiter.limit(`${record.email.toLowerCase()}:${record.phone}`),
  ]);

  if (!fingerprintResult.success || !contactResult.success) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  // 4. Bot challenge — always re-verified server-side.
  const turnstileValid = await verifyTurnstileToken(turnstileToken, ip);
  if (!turnstileValid) {
    return NextResponse.json(
      { error: "We couldn't verify your submission. Please try again." },
      { status: 400 }
    );
  }

  // 5. Persist — the database insert is the source of truth for success.
  let inserted: { id: string; created_at: string };
  try {
    inserted = await insertEnquiry({
      ...record,
      ...attribution,
      abuse_fingerprint: fingerprint,
    });
  } catch (error) {
    console.error(
      "[enquiry] Database insert failed:",
      error instanceof Error ? error.message : "unknown error"
    );
    return NextResponse.json(GENERIC_ERROR, { status: 500 });
  }

  // 6. Notifications — best-effort, never block or fail the response.
  // A failure here is logged for monitoring but the enquiry is already
  // safely stored, so the user still receives a genuine success response.
  const notifyPromise = sendBusinessNotificationEmail({
    enquiryType: record.enquiry_type,
    fullName: record.full_name,
    phone: record.phone,
    email: record.email,
    interestedCountry: record.interested_country,
    serviceRequired: record.service_required,
    currentQualification: record.current_qualification,
    interestedCourse: record.interested_course,
    message: record.message,
    sourcePath: attribution.source_path,
    submittedAt: inserted.created_at,
  }).then((result) => {
    if (!result.success && !result.skipped) {
      console.error(
        `[enquiry] Business notification failed for enquiry ${inserted.id}. Lead is safely stored; manual follow-up on the notification may be required.`
      );
    }
  });

  const confirmPromise = sendStudentConfirmationEmail(record.email, record.full_name);

  await Promise.allSettled([notifyPromise, confirmPromise]);

  return NextResponse.json({ success: true, id: inserted.id }, { status: 201 });
}
