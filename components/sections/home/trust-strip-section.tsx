import { Compass, HeartHandshake, GraduationCap, FileCheck2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";

/**
 * Deliberately non-numeric. No student counts, visa-success rates, or
 * similar statistics exist with verified backing data (see the Phase 0
 * audit) — so this trust band speaks to what the business actually does,
 * not invented figures.
 */
const trustPoints = [
  { icon: Compass, label: "Personalised Guidance" },
  { icon: HeartHandshake, label: "End-to-End Support" },
  { icon: GraduationCap, label: "Country & University Counselling" },
  { icon: FileCheck2, label: "Application & Visa Guidance" },
];

export function TrustStripSection() {
  return (
    <section className="border-b border-border-subtle bg-surface py-10">
      <Container>
        <Reveal className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {trustPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div key={point.label} className="flex flex-col items-center gap-2.5 text-center sm:flex-row sm:text-left">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-900/5 text-navy-900">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-navy-900">{point.label}</span>
              </div>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
