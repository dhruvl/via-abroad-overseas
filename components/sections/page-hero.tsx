import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-16 pt-32 text-white md:pb-20 md:pt-40">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_85%_15%,rgba(200,169,107,0.14),transparent),radial-gradient(45%_45%_at_10%_85%,rgba(53,97,159,0.28),transparent)]"
        aria-hidden="true"
      />
      <Container className="relative">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-white/50">
            <Link href="/" className="hover:text-white/80">
              Home
            </Link>
            {breadcrumb.map((crumb) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" aria-hidden="true" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white/80">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white/80">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
        <Eyebrow light>{eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-balance font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1]">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-balance text-lg text-white/70">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
