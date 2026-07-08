/**
 * Captures utm_source/utm_medium/utm_campaign from the landing URL into
 * sessionStorage so later form submissions on the same visit can attribute
 * the enquiry to a campaign, even if the user navigates before converting.
 */
const STORAGE_KEY = "vao_utm_attribution";

export type UtmAttribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  source_path?: string;
  referrer?: string;
};

export function captureUtmFromLocation() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");
  const utmMedium = params.get("utm_medium");
  const utmCampaign = params.get("utm_campaign");

  if (!utmSource && !utmMedium && !utmCampaign) return;

  const attribution: UtmAttribution = {
    utm_source: utmSource || undefined,
    utm_medium: utmMedium || undefined,
    utm_campaign: utmCampaign || undefined,
    referrer: document.referrer || undefined,
  };

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // sessionStorage unavailable (private browsing etc.) — attribution is best-effort only.
  }
}

export function getStoredUtmAttribution(): UtmAttribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmAttribution) : {};
  } catch {
    return {};
  }
}
