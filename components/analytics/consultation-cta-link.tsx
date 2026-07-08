"use client";

import Link from "next/link";
import { Button, type ButtonProps } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/events";

/**
 * Wraps the "Book Free Consultation" CTA so every entry point across the
 * site fires the same consultation_cta_clicked analytics event before
 * navigating — without turning the sections that use it into Client
 * Components.
 */
export function ConsultationCtaLink({
  source,
  children,
  className,
  size,
  variant,
}: {
  source: string;
  children: React.ReactNode;
  className?: string;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
}) {
  return (
    <Button asChild size={size} variant={variant} className={className}>
      <Link
        href="/book-consultation"
        onClick={() => trackEvent("consultation_cta_clicked", { source })}
      >
        {children}
      </Link>
    </Button>
  );
}
