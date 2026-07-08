import type { Metadata } from "next";
import { Target, Eye, HeartHandshake, ShieldCheck, Users, Compass } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { ConsultationCtaBanner } from "@/components/sections/consultation-cta-banner";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { team } from "@/data/team";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about VIA ABROAD OVERSEAS, our mission, vision, and values as a study abroad and overseas education consultancy.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Student-First Guidance",
    description: "Every recommendation is built around your goals, not a one-size-fits-all script.",
    icon: HeartHandshake,
  },
  {
    title: "Transparency",
    description: "Clear communication about process, timelines, and realistic expectations.",
    icon: ShieldCheck,
  },
  {
    title: "Personal Attention",
    description: "A counselor who understands your specific profile and circumstances.",
    icon: Users,
  },
  {
    title: "Global Perspective",
    description: "Guidance informed by an understanding of multiple education systems.",
    icon: Compass,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="About VIA ABROAD OVERSEAS"
        description="Dedicated to helping students achieve their international education goals through professional, transparent guidance."
        breadcrumb={[{ label: "About" }]}
      />

      <section className="bg-surface py-20 md:py-28">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-lg leading-relaxed text-ink-muted">
              VIA ABROAD OVERSEAS is dedicated to helping students achieve
              their international education goals. We provide professional
              guidance for university selection, admissions, visa processes,
              and career planning.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              Our mission is to make overseas education simple, transparent,
              and accessible for every student.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-surface-muted py-20 md:py-28">
        <Container className="grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-2xl border border-border-subtle bg-surface p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900/5 text-navy-900">
              <Target className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-semibold text-navy-900">
              Our Mission
            </h2>
            <p className="mt-3 leading-relaxed text-ink-muted">
              To empower students with the right information and guidance to
              build successful global careers.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="rounded-2xl border border-border-subtle bg-surface p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900/5 text-navy-900">
              <Eye className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-semibold text-navy-900">
              Our Vision
            </h2>
            <p className="mt-3 leading-relaxed text-ink-muted">
              To become a trusted global education partner for students
              seeking international opportunities.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-surface py-20 md:py-28">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow className="justify-center">Our Values</Eyebrow>
            <h2 className="mt-4 text-balance font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold text-navy-900">
              What Guides Our Counseling
            </h2>
          </Reveal>
          <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <StaggerItem
                  key={value.title}
                  className="rounded-2xl border border-border-subtle bg-surface-muted p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-200 text-gold-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-navy-900">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {value.description}
                  </p>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </Container>
      </section>

      {team.length > 0 && (
        <section className="bg-surface-muted py-20 md:py-28">
          <Container>
            <Eyebrow className="justify-center">Our Team</Eyebrow>
          </Container>
        </section>
      )}

      <ConsultationCtaBanner />
    </>
  );
}
