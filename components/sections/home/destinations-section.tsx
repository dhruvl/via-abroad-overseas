import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { getFeaturedDestinations } from "@/data/destinations";

/**
 * OWNER CONTENT REQUIRED: no licensed destination photography exists yet
 * (see Phase 0 audit — public/ is empty). Cards render a premium
 * gradient-and-typography treatment instead of a stock photo or the flag
 * emoji as the primary visual. Once real imagery is available per
 * country, swap the gradient div below for next/image.
 */
export function DestinationsSection() {
  const destinations = getFeaturedDestinations();

  return (
    <section className="bg-navy-950 py-20 text-white md:py-28">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow light>Where You Could Study</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold">
            Study Around the World
          </h2>
          <p className="mt-4 text-white/65">
            Explore popular study destinations. Requirements and policies vary
            and can change — your counselor will confirm current details for
            your specific plans.
          </p>
        </Reveal>

        <div className="mt-12 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:snap-none md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-4">
          {destinations.map((destination, index) => (
            <Reveal
              key={destination.slug}
              delay={(index % 4) * 0.06}
              className="min-w-[78%] snap-start sm:min-w-[45%] md:min-w-0"
            >
              <Link
                href={`/destinations/${destination.slug}`}
                className="group relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-6 transition-all duration-300 hover:border-gold-400/50 hover:from-navy-700"
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold-500/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-60"
                  aria-hidden="true"
                />
                <div>
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm"
                    aria-hidden="true"
                  >
                    {destination.flag}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold">
                    {destination.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {destination.tagline}
                  </p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300">
                  Explore {destination.name}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-gold-400 hover:text-gold-300"
          >
            View all destinations
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
