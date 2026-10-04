import Image from "next/image";
import { Compass } from "lucide-react";

/**
 * OWNER CONTENT REQUIRED: no approved hero photograph exists yet.
 * Once a licensed, premium photo is available, drop the file in
 * `public/hero/` and set HERO_IMAGE_SRC below (e.g. "/hero/hero-student.jpg").
 * The component will then render it via next/image with the same overlay
 * treatment; until then it renders an honest, on-brand fallback instead of
 * a fabricated or stock photo.
 */
const HERO_IMAGE_SRC: string | null = null;

export function HeroVisual() {
  if (HERO_IMAGE_SRC) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
        <Image
          src={HERO_IMAGE_SRC}
          alt="A student preparing for their study abroad journey"
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent"
          aria-hidden="true"
        />
      </div>
    );
  }

  return <HeroVisualFallback />;
}

function HeroVisualFallback() {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2rem] border border-gold-400/15 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-950"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_75%_30%,rgba(200,169,107,0.14),transparent)]"
      />
      <svg
        viewBox="0 0 400 400"
        className="absolute h-[85%] w-[85%] opacity-40"
        fill="none"
      >
        <circle cx="200" cy="200" r="170" stroke="#c8a96b" strokeOpacity="0.25" />
        <circle cx="200" cy="200" r="120" stroke="#c8a96b" strokeOpacity="0.2" />
        <circle cx="200" cy="200" r="70" stroke="#c8a96b" strokeOpacity="0.18" />
        <path
          d="M30 200 Q200 60 370 200"
          stroke="#c8a96b"
          strokeOpacity="0.3"
          strokeDasharray="3 7"
        />
        <path
          d="M30 220 Q200 340 370 220"
          stroke="#c8a96b"
          strokeOpacity="0.3"
          strokeDasharray="3 7"
        />
      </svg>
      <div className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full border border-gold-400/40 bg-navy-950/60 text-gold-300 shadow-[0_0_60px_-10px_rgba(200,169,107,0.5)]">
        <Compass className="h-10 w-10" aria-hidden="true" />
      </div>
    </div>
  );
}
