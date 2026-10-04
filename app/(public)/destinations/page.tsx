import type { Metadata } from "next";
import Image from "next/image";
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
                className="group relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden rounded-2xl border border-navy-900/10 bg-gradient-to-br from-navy-800 to-navy-900 p-7 text-white transition-colors duration-300 hover:border-gold-400/50"
              >
                {destination.imageSrc ? (
                  <>
                    <Image
                      src={destination.imageSrc}
                      alt={destination.imageAlt ?? destination.name}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                      style={{ objectPosition: destination.imageObjectPosition ?? "center" }}
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/55 to-navy-950/15"
                      aria-hidden="true"
                    />
                  </>
                ) : (
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-500/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-60"
                    aria-hidden="true"
                  />
                )}
                <div className="relative z-10">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-lg"
                    aria-hidden="true"
                  >
                    {destination.flag}
                  </span>
                  <h2 className="mt-4 font-display text-xl font-semibold">
                    {destination.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {destination.tagline}
                  </p>
                </div>
                <span className="relative z-10 mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300">
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
