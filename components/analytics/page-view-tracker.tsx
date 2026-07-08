"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics/events";

export function PageViewTracker({
  event,
  slug,
}: {
  event: AnalyticsEventName;
  slug: string;
}) {
  useEffect(() => {
    trackEvent(event, { slug });
  }, [event, slug]);

  return null;
}
