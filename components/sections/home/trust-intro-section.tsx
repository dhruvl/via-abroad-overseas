import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/motion/reveal";

const pillars = [
  {
    title: "University Selection",
    description: "Matched to your academic profile, budget, and goals.",
  },
  {
    title: "Admissions Process",
    description: "Guided applications, documentation, and submissions.",
  },
  {
    title: "Visa Preparation",
    description: "Structured documentation and interview readiness.",
  },
];

export function TrustIntroSection() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <Container className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <Eyebrow>Why Students Choose Us</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold text-navy-900">
            Your Trusted Study Abroad Partner
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted">
            At VIA ABROAD OVERSEAS, we guide students through every step of
            their overseas education journey, from choosing the right
            university to navigating the admissions process, visa
            preparation, and pre-departure planning.
          </p>
        </Reveal>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[radial-gradient(60%_60%_at_30%_20%,rgba(212,175,55,0.12),transparent)]" aria-hidden="true" />
          <div className="grid gap-5 sm:grid-cols-2">
            {pillars.map((pillar, index) => (
              <Reveal
                key={pillar.title}
                delay={index * 0.08}
                className={
                  index === 0
                    ? "sm:col-span-2 rounded-2xl border border-border-subtle bg-surface-muted p-7"
                    : "rounded-2xl border border-border-subtle bg-surface-muted p-7"
                }
              >
                <CheckCircle2 className="h-6 w-6 text-gold-600" aria-hidden="true" />
                <h3 className="mt-4 font-display text-xl font-semibold text-navy-900">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {pillar.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
