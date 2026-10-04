import "server-only";
import { Resend } from "resend";
import { BusinessNotificationEmail } from "@/emails/business-notification-email";
import { StudentConfirmationEmail } from "@/emails/student-confirmation-email";
import type { EnquiryEmailData } from "@/lib/email/types";
import { business } from "@/lib/config";

const isEmailConfigured = Boolean(process.env.RESEND_API_KEY);
const resend = isEmailConfigured ? new Resend(process.env.RESEND_API_KEY) : null;

const fromAddress =
  process.env.RESEND_FROM_EMAIL || "VIA ABROAD OVERSEAS <onboarding@resend.dev>";
const businessRecipient = process.env.BUSINESS_NOTIFICATION_EMAIL || business.email;

export type EmailResult = { success: boolean; skipped?: boolean };

/**
 * Both send functions are intentionally fail-safe: a failure here must
 * never roll back or block the enquiry, which has already been persisted
 * to the database by the time these are called. Failures are logged
 * (safely — no secrets, no full message bodies) for monitoring so a human
 * can follow up, but the API route always still reports success to the
 * user because their enquiry genuinely was saved.
 */
export async function sendBusinessNotificationEmail(
  data: EnquiryEmailData
): Promise<EmailResult> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not configured — skipping business notification email.");
    return { success: false, skipped: true };
  }

  try {
    const result = await resend.emails.send({
      from: fromAddress,
      to: businessRecipient,
      subject: `New ${data.enquiryType === "consultation" ? "Consultation Request" : "Enquiry"} — ${data.fullName}`,
      react: BusinessNotificationEmail({ data }),
    });
    if (result.error) {
      console.error("[email] Business notification send failed.");
      return { success: false };
    }
    return { success: true };
  } catch {
    console.error("[email] Business notification send threw.");
    return { success: false };
  }
}

export async function sendStudentConfirmationEmail(
  toEmail: string,
  fullName: string
): Promise<EmailResult> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not configured — skipping student confirmation email.");
    return { success: false, skipped: true };
  }

  try {
    const result = await resend.emails.send({
      from: fromAddress,
      to: toEmail,
      subject: `We received your enquiry — ${business.name}`,
      react: StudentConfirmationEmail({ fullName }),
    });
    if (result.error) {
      console.error("[email] Student confirmation send failed.");
      return { success: false };
    }
    return { success: true };
  } catch {
    console.error("[email] Student confirmation send threw.");
    return { success: false };
  }
}
