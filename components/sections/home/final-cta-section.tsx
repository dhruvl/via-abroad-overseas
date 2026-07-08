import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { ConsultationCtaLink } from "@/components/analytics/consultation-cta-link";
import { business } from "@/lib/config";

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 text-white md:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_100%,rgba(212,175,55,0.14),transparent)]"
        aria-hidden="true"
      />
      <Container className="relative flex flex-col items-center gap-8 text-center">
        <Reveal>
          <h2 className="text-balance font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold">
            Ready to Start Your Study Abroad Journey?
          </h2>
        </Reveal>
        <Reveal delay={0.08} className="max-w-xl text-lg text-white/70">
          Book your FREE consultation with our experts today.
        </Reveal>
        <Reveal delay={0.16}>
          <ConsultationCtaLink source="home_final_cta" size="lg">
            Book Consultation
          </ConsultationCtaLink>
        </Reveal>
        <Reveal delay={0.22} className="text-sm text-white/45">
          Or call {business.phoneDisplay} to speak with a counselor directly.
        </Reveal>
      </Container>
    </section>
  );
}
