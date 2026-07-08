import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { ConsultationCtaLink } from "@/components/analytics/consultation-cta-link";

export function SuccessTeaserSection() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[2rem] border border-gold-200 bg-gradient-to-br from-navy-900 via-navy-900 to-navy-800 px-8 py-16 text-center text-white sm:px-16">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(212,175,55,0.18),transparent)]"
            aria-hidden="true"
          />
          <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-300">
            <Sparkles className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="relative mt-6 text-balance font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold">
            Your Success Story Could Be Next
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/70">
            We are committed to helping students achieve their dreams of
            studying abroad.
          </p>
          <div className="relative mt-8 flex justify-center">
            <ConsultationCtaLink source="home_success_teaser" size="lg">
              Start Your Journey
            </ConsultationCtaLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
