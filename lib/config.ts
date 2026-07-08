/**
 * Central site configuration.
 * All business-identity facts live here so they are never hardcoded
 * redundantly across components. Values sourced from environment
 * variables are read once and exposed with explicit "isConfigured"
 * flags so the UI can degrade gracefully when a credential/URL has not
 * been supplied yet (e.g. WhatsApp number, social links).
 */

export const business = {
  name: "VIA ABROAD OVERSEAS",
  shortName: "VIA ABROAD",
  category: "Study Abroad & Overseas Education Consultancy",
  descriptor: "Study Abroad | Visa Services | Career Counseling",
  phoneDisplay: "+91 86399 96069",
  phoneE164: "+918639996069",
  phoneDial: "8639996069",
  email: "viaabroadoverseas@gmail.com",
  address: {
    line1: "Shop 4, Srujana Avenues",
    line2: "KTR Colony Road No.5",
    locality: "Nizampet",
    city: "Hyderabad",
    postalCode: "500090",
    country: "India",
    countryCode: "IN",
  },
} as const;

export const addressFull = `${business.address.line1}, ${business.address.line2}, ${business.address.locality}, ${business.address.city} - ${business.address.postalCode}, ${business.address.country}`;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

/**
 * WhatsApp is intentionally NOT assumed to be the same as the business
 * phone number. The floating action and hero secondary CTA only render
 * as fully active once NEXT_PUBLIC_WHATSAPP_NUMBER is set to a valid
 * E.164-style number (digits only, optional leading +).
 */
const rawWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || "";
const whatsappDigits = rawWhatsapp.replace(/[^\d]/g, "");
export const whatsapp = {
  isConfigured: whatsappDigits.length >= 10,
  number: whatsappDigits,
  defaultMessage:
    "Hello VIA ABROAD OVERSEAS, I would like to know more about studying abroad.",
  href(message?: string) {
    if (!whatsappDigits) return undefined;
    const text = encodeURIComponent(message ?? whatsapp.defaultMessage);
    return `https://wa.me/${whatsappDigits}?text=${text}`;
  },
};

function socialLink(envValue: string | undefined) {
  const value = envValue?.trim();
  if (!value) return { isConfigured: false as const, url: undefined };
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:") return { isConfigured: false as const, url: undefined };
    return { isConfigured: true as const, url: value };
  } catch {
    return { isConfigured: false as const, url: undefined };
  }
}

export const social = {
  instagram: socialLink(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  facebook: socialLink(process.env.NEXT_PUBLIC_FACEBOOK_URL),
  linkedin: socialLink(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  youtube: socialLink(process.env.NEXT_PUBLIC_YOUTUBE_URL),
};

export const callHref = `tel:${business.phoneE164}`;
export const emailHref = `mailto:${business.email}`;

export const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
export const isAnalyticsConfigured = gaMeasurementId.length > 0;

export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
export const isTurnstileConfigured = turnstileSiteKey.length > 0;

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);
