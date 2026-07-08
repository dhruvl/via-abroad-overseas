/**
 * PII-safe GA4 event tracking helper.
 *
 * Callers must never pass personal data (name, email, phone, message
 * contents) — only structured, non-identifying context such as source
 * location or enquiry type. Events silently no-op when analytics is not
 * configured or consent has not been granted, so call sites never need to
 * branch on configuration state.
 */

export type AnalyticsEventName =
  | "consultation_cta_clicked"
  | "consultation_form_started"
  | "consultation_submitted"
  | "enquiry_form_started"
  | "enquiry_submitted"
  | "whatsapp_clicked"
  | "call_clicked"
  | "destination_viewed"
  | "service_viewed";

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __analyticsConsent?: boolean;
  }
}

export function trackEvent(name: AnalyticsEventName, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  if (!window.__analyticsConsent) return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export function hasAnalyticsConsent() {
  if (typeof window === "undefined") return false;
  return Boolean(window.__analyticsConsent);
}
