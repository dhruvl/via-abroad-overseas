import type { Metadata } from "next";
import { Manrope, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { OrganizationJsonLd } from "@/components/seo/organization-jsonld";
import { Toaster } from "@/components/ui/toaster";
import { SkipToContent } from "@/components/navigation/skip-to-content";
import { siteUrl, business } from "@/lib/config";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${business.name} — Study Abroad & Overseas Education Consultancy`,
    template: `%s | ${business.name}`,
  },
  description:
    "VIA ABROAD OVERSEAS helps students achieve their study abroad goals with expert counseling, university admissions support, visa assistance, and career guidance.",
  keywords: [
    "study abroad consultancy",
    "overseas education",
    "study abroad Hyderabad",
    "student visa assistance",
    "university admissions",
    "career counseling",
  ],
  openGraph: {
    type: "website",
    siteName: business.name,
    title: `${business.name} — Study Abroad & Overseas Education Consultancy`,
    description:
      "Personalized guidance from course selection to pre-departure support for students planning to study abroad.",
    url: siteUrl,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name} — Study Abroad & Overseas Education Consultancy`,
    description:
      "Personalized guidance from course selection to pre-departure support for students planning to study abroad.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${dmSerifDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-muted text-ink">
        <OrganizationJsonLd />
        <SkipToContent />
        {children}
        <AnalyticsProvider />
        <Toaster />
      </body>
    </html>
  );
}
