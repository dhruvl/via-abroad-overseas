import type { Metadata } from "next";
import { Compass, GraduationCap, MessageSquareText } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { ConsultationCtaBanner } from "@/components/sections/consultation-cta-banner";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Find Your University",
  description:
    "VIA ABROAD OVERSEAS helps you shortlist universities and institutions based on your academic profile, goals, budget, and preferred destination.",
  alternates: { canonical: "/universities" },
};

const points = [
  {
    icon: Compass,
    title: "Matched to Your Profile",
    description:
      "We shortlist universities and institutions based on your academic profile, budget, and destination preference.",
  },
  {
    icon: GraduationCap,
    title: "Across Every Destination We Support",
    description:
      "From the UK to Germany, we help you compare options across the countries and courses you are considering.",
  },
  {
    icon: MessageSquareText,
    title: "Honest Guidance, Always",
    description:
      "We will tell you what realistically fits your profile — including where a shortlist needs to change.",
  },
];

export default function UniversitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Universities"
        title="Find Your Place in the World"
        description="We help shortlist universities and institutions based on your academic profile, goals, budget, and preferred destination."
        breadcrumb={[{ label: "Universities" }]}
      />

      <section className="bg-surface py-20 md:py-28">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            {points.map((point, index) => {
              const Icon = point.icon;
              return (
                <Reveal
                  key={point.title}
                  delay={index * 0.08}
                  className="rounded-2xl border border-border-subtle bg-surface-muted p-7"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-900/5 text-navy-900">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 font-display text-lg font-semibold text-navy-900">
                    {point.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {point.description}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <ConsultationCtaBanner
        title="Find My University"
        description="Tell us your profile and goals — we'll help you shortlist universities that genuinely fit."
        source="universities_page"
      />
    </>
  );
}
