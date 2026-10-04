import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Destination } from "@/data/destinations";
import { cn } from "@/lib/utils";

/**
 * Cinematic destination card (brief §06): full-bleed photograph, dark
 * gradient rising from the bottom, and all copy anchored low so it never
 * sits over the busy middle of the image or the student's face.
 *
 * Only for destinations with real photography — the /destinations page
 * lists the rest in a separate typographic index instead of mixing in
 * empty navy cards.
 */
export function DestinationCard({
  destination,
  headingLevel: Heading = "h3",
  sizes,
  className,
}: {
  destination: Destination & { imageSrc: string };
  headingLevel?: "h2" | "h3";
  sizes: string;
  className?: string;
}) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className={cn(
        "group relative flex h-full min-h-[340px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-navy-900 p-6 text-white transition-colors duration-300 hover:border-gold-400/50 lg:min-h-[380px]",
        className
      )}
    >
      <Image
        src={destination.imageSrc}
        alt={destination.imageAlt ?? destination.name}
        fill
        sizes={sizes}
        style={{ objectPosition: destination.imageObjectPosition ?? "center" }}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-navy-950 from-15% via-navy-950/70 via-45% to-navy-950/0 to-75%"
        aria-hidden="true"
      />
      <div className="relative z-10">
        <Heading className="font-display text-2xl font-semibold">{destination.name}</Heading>
        <p className="mt-2 text-sm leading-relaxed text-white/80">{destination.tagline}</p>
      </div>
      <span className="relative z-10 mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300">
        Explore {destination.name}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function hasPhoto(destination: Destination): destination is Destination & { imageSrc: string } {
  return Boolean(destination.imageSrc);
}
