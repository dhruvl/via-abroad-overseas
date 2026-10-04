import Link from "next/link";
import { ArrowUpRight, Compass, GraduationCap, FileCheck2, Briefcase, FileText, Award } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { services, type Service } from "@/data/services";

const iconMap: Record<Service["icon"], typeof Compass> = {
  Compass,
  GraduationCap,
  FileCheck2,
  Briefcase,
  FileText,
  Award,
};

export function ServicesSection() {
  return (
    <section className="bg-surface-muted py-20 md:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <Eyebrow>What We Do</Eyebrow>
            <h2 className="mt-4 max-w-xl text-balance font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold text-navy-900">
              End-to-End Study Abroad Services
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700 hover:text-gold-600"
            >
              View all services
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            const featured = index === 0;
            return (
              <Reveal
                key={service.slug}
                delay={(index % 3) * 0.08}
                className={featured ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-[0_20px_40px_-16px_rgba(13,34,56,0.18)] focus-visible:-translate-y-1 ${
                    featured ? "bg-navy-900 text-white border-navy-800" : ""
                  }`}
                >
                  <div>
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        featured ? "bg-white/10 text-gold-300" : "bg-navy-900/5 text-navy-900"
                      }`}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3
                      className={`mt-5 font-display text-xl font-semibold ${
                        featured ? "text-white" : "text-navy-900"
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`mt-2.5 text-sm leading-relaxed ${
                        featured ? "text-white/70" : "text-ink-muted"
                      }`}
                    >
                      {service.shortDescription}
                    </p>
                  </div>
                  <span
                    className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${
                      featured ? "text-gold-300" : "text-gold-700"
                    }`}
                  >
                    Learn more
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
