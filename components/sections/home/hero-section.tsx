import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/sections/home/hero-visual";
import { HeroCopyReveal } from "@/components/sections/home/hero-copy-reveal";
import { ConsultationCtaLink } from "@/components/analytics/consultation-cta-link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-20 pt-32 text-white md:pb-28 md:pt-40">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_20%,rgba(53,97,159,0.35),transparent),radial-gradient(45%_40%_at_90%_75%,rgba(200,169,107,0.16),transparent)]"
        aria-hidden="true"
      />
      <Container className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <HeroCopyReveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            Study Abroad &bull; University Admissions &bull; Visa Guidance
          </p>
          <h1 className="mt-6 text-balance font-display text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.1]">
            Your dream.
            <br />
            Your destination.
            <br />
            <span className="text-gold-400">Your global future.</span>
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg text-white/75">
            Personalised guidance to help you choose the right country,
            university and course — and confidently make your move abroad.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ConsultationCtaLink source="home_hero" size="lg">
              Book Free Consultation
            </ConsultationCtaLink>
            <Button asChild size="lg" variant="outline">
              <Link href="/destinations">
                Explore Destinations
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <p className="mt-6 max-w-[82%] text-sm text-white/50 sm:max-w-none">
            From profile evaluation to pre-departure support — we&rsquo;re
            with you every step.
          </p>
        </HeroCopyReveal>

        <div className="relative h-[320px] sm:h-[420px] lg:h-[540px]">
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}
