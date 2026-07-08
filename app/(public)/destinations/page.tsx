import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { ConsultationCtaBanner } from "@/components/sections/consultation-cta-banner";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { destinations } from "@/data/destinations";

export const metadata: Metadata = {
  title: "Study Destinations",
  description:
    "Explore study abroad destinations including the USA, Canada, UK, Australia, Germany, and more with VIA ABROAD OVERSEAS.",
  alternates: { canonical: "/destinations" },
};

export default function DestinationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Study Destinations"
        title="Study Around the World"
        description="Explore popular study destinations. Requirements and policies vary by country and can change — your counselor will confirm current details for your specific plans."
        breadcrumb={[{ label: "Destinations" }]}
      />

      <section className="bg-surface py-20 md:py-28">
        <Container className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination, index) => (
            <Reveal key={destination.slug} delay={(index % 3) * 0.07}>
              <Link
                href={`/destinations/${destination.slug}`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-border-subtle bg-surface-muted p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-[0_20px_40px_-16px_rgba(11,31,58,0.15)]"
              >
                <div>
                  <span className="text-4xl" aria-hidden="true">
                    {destination.flag}
                  </span>
                  <h2 className="mt-4 font-display text-xl font-semibold text-navy-900">
                    {destination.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {destination.tagline}
                  </p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700">
                  Explore {destination.name}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </Container>
      </section>

      <ConsultationCtaBanner />
    </>
  );
}
