"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { primaryNav, primaryCta } from "@/data/navigation";
import { business, callHref } from "@/lib/config";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  React.useEffect(() => {
    // Close the mobile sheet whenever the route changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isTransparent = isHome && !scrolled && !mobileOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isTransparent
          ? "bg-transparent"
          : "bg-white/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(16,24,40,0.06)]"
      )}
    >
      <div className="container-outer flex h-18 items-center justify-between py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
        >
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold",
              isTransparent
                ? "border-gold-300 text-gold-300"
                : "border-gold-500 text-gold-600"
            )}
            aria-hidden="true"
          >
            V
          </span>
          <span className={isTransparent ? "text-white" : "text-navy-900"}>
            VIA ABROAD <span className="text-gold-500">OVERSEAS</span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 lg:flex"
        >
          {primaryNav.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isTransparent
                    ? "text-white/90 hover:text-white"
                    : "text-navy-900/80 hover:text-navy-900",
                  active &&
                    (isTransparent ? "text-white" : "text-navy-900 font-semibold")
                )}
              >
                {link.label}
                {active && (
                  <span
                    className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gold-500"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={callHref}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors",
              isTransparent ? "text-white/90 hover:text-white" : "text-navy-900/80 hover:text-navy-900"
            )}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {business.phoneDisplay}
          </a>
          <Button asChild size="default">
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
        </div>

        <button
          type="button"
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full lg:hidden",
            isTransparent ? "text-white" : "text-navy-900"
          )}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-sheet"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-sheet"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-border-subtle bg-white shadow-xl lg:hidden"
          >
            <nav aria-label="Mobile" className="container-outer flex flex-col gap-1 py-4">
              {primaryNav.map((link) => {
                const active =
                  link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 items-center rounded-xl px-4 text-base font-medium text-navy-900",
                      active && "bg-navy-900/5 font-semibold"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-2 flex flex-col gap-3 border-t border-border-subtle pt-4">
                <a
                  href={callHref}
                  className="flex min-h-12 items-center gap-2 rounded-xl px-4 text-base font-medium text-navy-900"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  Call {business.phoneDisplay}
                </a>
                <Button asChild size="lg" className="w-full">
                  <Link href={primaryCta.href}>{primaryCta.label}</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
