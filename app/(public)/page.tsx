import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/home/hero-section";
import { TrustIntroSection } from "@/components/sections/home/trust-intro-section";
import { ServicesSection } from "@/components/sections/home/services-section";
import { DestinationsSection } from "@/components/sections/home/destinations-section";
import { WhyChooseSection } from "@/components/sections/home/why-choose-section";
import { ProcessSection } from "@/components/sections/home/process-section";
import { SuccessTeaserSection } from "@/components/sections/home/success-teaser-section";
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
      <TrustIntroSection />
      <ServicesSection />
      <DestinationsSection />
      <WhyChooseSection />
      <ProcessSection />
      <SuccessTeaserSection />
      <FinalCtaSection />
    </>
  );
}
