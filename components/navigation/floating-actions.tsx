"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Phone } from "lucide-react";
import { whatsapp, callHref } from "@/lib/config";
import { trackEvent } from "@/lib/analytics/events";

/**
 * Tasteful floating contact actions.
 * Positioned above safe-area / mobile viewport chrome, single subtle
 * entrance animation (no continuous pulsing per spec), and hidden
 * entirely when WhatsApp is not configured rather than rendering a
 * dead link.
 */
export function FloatingActions() {
  const href = whatsapp.href();

  return (
    <div
      className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 md:bottom-6 md:right-6"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <motion.a
        href={callHref}
        initial={{ opacity: 0, scale: 0.8, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => trackEvent("call_clicked", { source: "floating_action" })}
        aria-label="Call VIA ABROAD OVERSEAS"
        className="flex h-13 w-13 items-center justify-center rounded-full bg-navy-900 text-white shadow-lg ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
      </motion.a>

      {href && (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => trackEvent("whatsapp_clicked", { source: "floating_action" })}
          aria-label="Chat with VIA ABROAD OVERSEAS on WhatsApp"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
        >
          <WhatsAppIcon className="h-6 w-6" />
        </motion.a>
      )}
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.94 9.94 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm5.83 14.24c-.25.7-1.24 1.28-2.02 1.44-.55.11-1.26.2-3.65-.78-3.06-1.27-5.03-4.36-5.19-4.56-.15-.2-1.24-1.65-1.24-3.15 0-1.5.79-2.24 1.07-2.55.28-.3.6-.38.8-.38.2 0 .4 0 .57.01.19.01.44-.07.68.53.25.6.85 2.1.92 2.25.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.78.84 2.08.99.3.15.5.22.57.35.08.13.08.72-.17 1.42Z" />
    </svg>
  );
}
