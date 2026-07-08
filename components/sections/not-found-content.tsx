import Link from "next/link";
import { Compass } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function NotFoundContent() {
  return (
    <section className="flex min-h-[70vh] items-center bg-navy-950 py-24 text-white">
      <Container className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-gold-300">
          <Compass className="h-8 w-8" aria-hidden="true" />
        </span>
        <p className="mt-6 font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
          404
        </p>
        <h1 className="mt-3 text-balance font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold">
          This Page Couldn&rsquo;t Be Found
        </h1>
        <p className="mt-4 max-w-md text-white/70">
          The page you&rsquo;re looking for may have moved. Let&rsquo;s get
          you back on course.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
