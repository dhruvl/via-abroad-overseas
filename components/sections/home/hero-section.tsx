import { MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GlobeHero } from "@/components/three/globe-hero";
import { HeroCopyReveal } from "@/components/sections/home/hero-copy-reveal";
import { ConsultationCtaLink } from "@/components/analytics/consultation-cta-link";
import { whatsapp } from "@/lib/config";

export function HeroSection() {
  const whatsappHref = whatsapp.href();

  return (
    <section className="relative overflow-hidden bg-navy-950 pb-20 pt-32 text-white md:pb-28 md:pt-40">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_20%,rgba(53,97,159,0.35),transparent),radial-gradient(45%_40%_at_90%_75%,rgba(212,175,55,0.16),transparent)]"
        aria-hidden="true"
      />
      <Container className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <HeroCopyReveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            Study Abroad &amp; Overseas Education Consultancy
          </p>
          <h1 className="mt-6 text-balance font-display text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.08]">
            Your Gateway to <span className="italic text-gold-400">Global</span>{" "}
            Education
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg text-white/75">
            Helping students achieve their dreams of studying abroad with
            expert counseling, university admissions support, and complete
            visa assistance.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ConsultationCtaLink source="home_hero" size="lg">
              Book Free Consultation
            </ConsultationCtaLink>
            {whatsappHref ? (
              <Button asChild size="lg" variant="outline">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp Now
                </a>
              </Button>
            ) : (
              <span
                className="inline-flex h-14 cursor-not-allowed items-center gap-2 rounded-full border border-white/15 px-8 text-base font-semibold text-white/40"
                aria-disabled="true"
                title="WhatsApp will be available once the business number is configured"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp Now
              </span>
            )}
          </div>

          <p className="mt-6 text-sm text-white/50">
            Personalized guidance from course selection to pre-departure
            support.
          </p>
        </HeroCopyReveal>

        <div className="relative h-[320px] sm:h-[420px] lg:h-[540px]">
          <GlobeHero />
        </div>
      </Container>
    </section>
  );
}
