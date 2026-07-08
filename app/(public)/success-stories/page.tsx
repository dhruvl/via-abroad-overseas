import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { ConsultationCtaLink } from "@/components/analytics/consultation-cta-link";
import { testimonials } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Student Success Stories",
  description:
    "Read student success stories from VIA ABROAD OVERSEAS. Your success story could be next.",
  alternates: { canonical: "/success-stories" },
};

export default function SuccessStoriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Success Stories"
        title="Student Success Stories"
        breadcrumb={[{ label: "Success Stories" }]}
      />

      <section className="bg-surface py-20 md:py-28">
        <Container>
          {testimonials.length === 0 ? (
            <Reveal className="mx-auto max-w-2xl rounded-[2rem] border border-gold-200 bg-gradient-to-br from-navy-900 to-navy-800 px-8 py-16 text-center text-white sm:px-16">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-300">
                <Sparkles className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-6 text-balance font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold">
                Your Success Story Could Be Next
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/70">
                We are committed to helping students achieve their dreams of
                studying abroad. As students complete their journey with us,
                their approved stories will be featured here.
              </p>
              <div className="mt-8 flex justify-center">
                <ConsultationCtaLink source="success_stories_page" size="lg">
                  Start Your Journey
                </ConsultationCtaLink>
              </div>
            </Reveal>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Reveal
                  key={testimonial.studentName}
                  className="rounded-2xl border border-border-subtle bg-surface-muted p-7"
                >
                  <p className="text-ink-muted">&ldquo;{testimonial.quote}&rdquo;</p>
                  <p className="mt-4 font-semibold text-navy-900">
                    {testimonial.studentName}
                  </p>
                  <p className="text-sm text-ink-faint">
                    {testimonial.university ? `${testimonial.university}, ` : ""}
                    {testimonial.destination}
                  </p>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
