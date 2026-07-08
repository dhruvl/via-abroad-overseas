import {
  UserRound,
  ShieldCheck,
  MessagesSquare,
  FileCheck2,
  Target,
  Infinity as InfinityIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/motion/reveal";

const benefits = [
  { title: "Personalized Student Guidance", icon: UserRound, angle: 270 },
  { title: "Transparent Process", icon: ShieldCheck, angle: 330 },
  { title: "Expert Counseling", icon: MessagesSquare, angle: 30 },
  { title: "Complete Visa Assistance", icon: FileCheck2, angle: 90 },
  { title: "Career-Focused Approach", icon: Target, angle: 150 },
  { title: "End-to-End Support", icon: InfinityIcon, angle: 210 },
];

function polarPosition(angleDeg: number, radiusPct: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    left: `${50 + radiusPct * Math.cos(rad)}%`,
    top: `${50 + radiusPct * Math.sin(rad)}%`,
  };
}

export function WhyChooseSection() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">Why Choose Us</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold text-navy-900">
            A Counseling Approach Built Around You
          </h2>
        </Reveal>

        {/* Desktop: orbital composition */}
        <div className="relative mx-auto mt-16 hidden aspect-square max-w-2xl lg:block">
          <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
            {benefits.map((benefit) => {
              const pos = polarPosition(benefit.angle, 38);
              return (
                <line
                  key={benefit.title}
                  x1="50%"
                  y1="50%"
                  x2={pos.left}
                  y2={pos.top}
                  stroke="#c9cfd9"
                  strokeWidth="1"
                  strokeDasharray="4 5"
                />
              );
            })}
          </svg>

          <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-navy-900 text-center text-white shadow-[0_20px_50px_-12px_rgba(11,31,58,0.4)]">
            <span className="font-display text-sm font-semibold leading-tight">
              VIA ABROAD
              <br />
              OVERSEAS
            </span>
          </div>

          {benefits.map((benefit, index) => {
            const pos = polarPosition(benefit.angle, 38);
            const Icon = benefit.icon;
            return (
              <Reveal
                key={benefit.title}
                delay={index * 0.07}
                className="absolute w-44 -translate-x-1/2 -translate-y-1/2 text-center"
                as="div"
              >
                <div
                  style={{ position: "absolute", left: pos.left, top: pos.top, transform: "translate(-50%, -50%)" }}
                  className="flex w-44 flex-col items-center gap-2 rounded-2xl border border-border-subtle bg-surface-muted p-4"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-200 text-gold-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-navy-900">
                    {benefit.title}
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Mobile / tablet: stacked list */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:hidden">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Reveal
                key={benefit.title}
                delay={index * 0.06}
                className="flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-muted p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-200 text-gold-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-navy-900">{benefit.title}</span>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
