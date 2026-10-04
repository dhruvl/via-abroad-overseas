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
      <Container className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
        <Reveal>
          <Eyebrow>More Than a Consultancy</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold text-navy-900">
            More than a consultancy.
            <br />
            Your partner abroad.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted">
            At VIA ABROAD OVERSEAS, we guide students through every step of
            their overseas education journey, from choosing the right
            university to navigating the admissions process, visa
            preparation, and pre-departure planning.
          </p>

          <ul className="mt-8 flex flex-col gap-5">
            {pillars.map((pillar) => (
              <li key={pillar.title} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-navy-900">{pillar.title}</p>
                  <p className="text-sm leading-relaxed text-ink-muted">{pillar.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="relative hidden lg:block">
          <div className="relative flex h-full min-h-[380px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-border-subtle bg-gradient-to-br from-navy-900 to-navy-950 p-10 text-center text-white">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_20%,rgba(200,169,107,0.14),transparent)]"
              aria-hidden="true"
            />
            <p className="relative font-display text-2xl italic leading-snug text-white/90">
              &ldquo;Every journey abroad starts with a plan built around one
              student, not a generic shortlist.&rdquo;
            </p>
            <div className="relative mt-8 h-px w-16 bg-gold-400/50" aria-hidden="true" />
            <p className="relative mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
              Make The Move
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
