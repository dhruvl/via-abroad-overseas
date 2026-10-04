import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/home/hero-section";
import { TrustStripSection } from "@/components/sections/home/trust-strip-section";
import { TrustIntroSection } from "@/components/sections/home/trust-intro-section";
import { WhyChooseSection } from "@/components/sections/home/why-choose-section";
import { DestinationsSection } from "@/components/sections/home/destinations-section";
import { FindMyOptionsSection } from "@/components/sections/home/find-my-options-section";
import { ServicesSection } from "@/components/sections/home/services-section";
import { ProcessSection } from "@/components/sections/home/process-section";
import { UniversitiesTeaserSection } from "@/components/sections/home/universities-teaser-section";
import { ParentsSection } from "@/components/sections/home/parents-section";
import { FaqSection } from "@/components/sections/home/faq-section";
import { FinalCtaSection } from "@/components/sections/home/final-cta-section";

export const metadata: Metadata = {
  title: "Study Abroad & Overseas Education Consultancy",
  description:
    "VIA ABROAD OVERSEAS helps students achieve their study abroad goals with expert counseling, university admissions support, visa assistance, and career guidance.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStripSection />
      <TrustIntroSection />
      <WhyChooseSection />
      <DestinationsSection />
      <FindMyOptionsSection />
      <ServicesSection />
      <ProcessSection />
      <UniversitiesTeaserSection />
      {/* Success Stories and Video Testimonials: OWNER CONTENT REQUIRED —
          no verified testimonials or genuine videos exist yet (see
          data/testimonials.ts), so both are omitted from the homepage
          rather than shown with placeholder/"coming soon" content. The
          dedicated /success-stories page remains live and truthful. */}
      <ParentsSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
