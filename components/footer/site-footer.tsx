import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { business, addressFull, callHref, emailHref, social } from "@/lib/config";
import { footerQuickLinks, legalLinks } from "@/data/navigation";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/ui/social-icons";

const socialIcons = [
  { key: "instagram", Icon: InstagramIcon, label: "Instagram", ...social.instagram },
  { key: "facebook", Icon: FacebookIcon, label: "Facebook", ...social.facebook },
  { key: "linkedin", Icon: LinkedinIcon, label: "LinkedIn", ...social.linkedin },
  { key: "youtube", Icon: YoutubeIcon, label: "YouTube", ...social.youtube },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();
  const activeSocials = socialIcons.filter((s) => s.isConfigured);

  return (
    <footer className="bg-navy-950 text-white/80">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="lg:col-span-1">
          <p className="font-display text-xl font-semibold text-white">
            VIA ABROAD <span className="text-gold-400">OVERSEAS</span>
          </p>
          <p className="mt-3 text-sm text-white/60">{business.descriptor}</p>
          {activeSocials.length > 0 && (
            <div className="mt-6 flex gap-3">
              {activeSocials.map(({ key, Icon, label, url }) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-gold-400 hover:text-gold-400"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-400">
            Quick Links
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {footerQuickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/70 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-400">
            Contact
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li>
              <a href={callHref} className="flex items-start gap-2 hover:text-white">
                <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {business.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={emailHref} className="flex items-start gap-2 hover:text-white">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {business.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{addressFull}</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-400">
            Start Your Journey
          </h2>
          <p className="mt-4 text-sm text-white/70">
            Book a free consultation and take the first step toward studying
            abroad.
          </p>
          <Link
            href="/book-consultation"
            className="mt-4 inline-flex items-center rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
          >
            Book Free Consultation
          </Link>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 md:flex-row">
          <p>
            &copy; {year} {business.name}. All rights reserved.
          </p>
          <div className="flex gap-5">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white/80">
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
