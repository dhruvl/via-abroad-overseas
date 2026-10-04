import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { ConsultationCtaLink } from "@/components/analytics/consultation-cta-link";
import { business } from "@/lib/config";

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 text-white md:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_100%,rgba(200,169,107,0.14),transparent)]"
        aria-hidden="true"
      />
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <Reveal>
          <Eyebrow light className="justify-center">
            Your Next Chapter Starts Here.
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="text-balance font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold">
            Ready to make the move?
          </h2>
        </Reveal>
        <Reveal delay={0.12} className="max-w-xl text-lg text-white/70">
          Let&rsquo;s turn your study abroad ambition into a clear,
          personalised plan.
        </Reveal>
        <Reveal delay={0.18}>
          <ConsultationCtaLink source="home_final_cta" size="lg">
            Book Free Consultation
          </ConsultationCtaLink>
        </Reveal>
        <Reveal delay={0.24} className="text-sm text-white/60">
          Or call {business.phoneDisplay} to speak with a counselor directly.
        </Reveal>
      </Container>
    </section>
  );
}
