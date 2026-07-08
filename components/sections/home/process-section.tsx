import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/motion/reveal";

const steps = [
  {
    title: "Free Consultation",
    description: "Share your goals and background in an initial, no-cost session.",
  },
  {
    title: "Profile Evaluation",
    description: "A detailed review of your academics, budget, and preferences.",
  },
  {
    title: "Course & University Selection",
    description: "A shortlist built around your goals, not generic rankings.",
  },
  {
    title: "Application Submission",
    description: "Guided, reviewed applications submitted on schedule.",
  },
  {
    title: "Admission Support",
    description: "Support responding to offers and university communication.",
  },
  {
    title: "Visa Assistance",
    description: "Documentation guidance and interview preparation.",
  },
  {
    title: "Pre-Departure Guidance",
    description: "Practical guidance to prepare before you travel.",
  },
  {
    title: "Start Your Journey Abroad",
    description: "Begin your international education with confidence.",
  },
];

export function ProcessSection() {
  return (
    <section className="bg-surface-muted py-20 md:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">How It Works</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold text-navy-900">
            Our Process
          </h2>
        </Reveal>

        <ol className="relative mx-auto mt-16 max-w-3xl">
          <div
            className="absolute left-5 top-2 bottom-2 w-px bg-border-strong md:left-1/2"
            aria-hidden="true"
          />
          {steps.map((step, index) => {
            const isLeft = index % 2 === 0;
            return (
              <Reveal
                as="li"
                key={step.title}
                delay={index * 0.05}
                className={`relative mb-10 flex last:mb-0 md:mb-14 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div
                  className={`flex w-full items-start gap-5 md:w-1/2 ${
                    isLeft ? "md:pr-10 md:text-right md:flex-row-reverse" : "md:pl-10"
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-gold-500 bg-surface font-display text-sm font-bold text-navy-900 md:absolute md:left-1/2 md:-translate-x-1/2">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-navy-900">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                      {step.description}
                    </p>
                  </div>
                </div>
                <div className="hidden md:block md:w-1/2" aria-hidden="true" />
              </Reveal>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
