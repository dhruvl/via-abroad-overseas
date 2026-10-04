import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { FindMyOptionsWizard } from "@/components/forms/find-my-options-wizard";

export function FindMyOptionsSection() {
  return (
    <section className="bg-surface-muted py-20 md:py-28">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <Eyebrow>Find My Options</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold text-navy-900">
            Not Sure Where to Start?
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
            Answer three quick questions and a counselor will follow up with
            options matched to your background, budget, and destination
            preference.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="relative">
          <FindMyOptionsWizard />
        </Reveal>
      </Container>
    </section>
  );
}
