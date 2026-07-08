"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { business, callHref } from "@/lib/config";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Detailed error stays in server/monitoring logs (Sentry once configured);
    // only a generic message is ever shown to the user below.
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] items-center bg-surface-muted py-24">
      <Container className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-error-bg text-error">
          <TriangleAlert className="h-8 w-8" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-balance font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold text-navy-900">
          Something Went Wrong
        </h1>
        <p className="mt-4 max-w-md text-ink-muted">
          We&rsquo;re sorry, an unexpected error occurred. Please try again,
          or contact us directly at {business.phoneDisplay} if the problem
          continues.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button size="lg" onClick={() => reset()}>
            Try Again
          </Button>
          <Button asChild size="lg" variant="outlineNavy">
            <a href={callHref}>Call Us</a>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
