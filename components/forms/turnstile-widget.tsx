"use client";

import * as React from "react";
import Script from "next/script";
import { isTurnstileConfigured, turnstileSiteKey } from "@/lib/config";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

/**
 * Renders the Cloudflare Turnstile widget once the site key is
 * configured. When it isn't, the form remains fully usable — a small
 * explanatory note is shown instead of a broken/empty widget, and the
 * server independently decides whether unverified submissions are
 * permitted (fails closed by default, see lib/security/turnstile.ts).
 */
export function TurnstileWidget({ onVerify }: { onVerify: (token: string) => void }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const widgetId = React.useRef<string | null>(null);
  const [scriptReady, setScriptReady] = React.useState(false);

  React.useEffect(() => {
    if (!scriptReady || !containerRef.current || !window.turnstile) return;
    widgetId.current = window.turnstile.render(containerRef.current, {
      sitekey: turnstileSiteKey,
      callback: onVerify,
      "expired-callback": () => onVerify(""),
      "error-callback": () => onVerify(""),
    });
    return () => {
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptReady]);

  if (!isTurnstileConfigured) {
    return (
      <p className="rounded-lg border border-dashed border-border-strong bg-surface-muted px-4 py-3 text-xs text-ink-faint">
        Bot protection will be enabled once Turnstile is configured for this
        environment.
      </p>
    );
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
        onReady={() => setScriptReady(true)}
      />
      <div ref={containerRef} />
    </>
  );
}
