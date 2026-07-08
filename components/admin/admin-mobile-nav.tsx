"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Inbox, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
];

export function AdminMobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3 text-slate-200 md:hidden">
      <p className="font-display text-sm font-semibold text-white">
        VIA ABROAD <span className="text-gold-400">OVERSEAS</span>
      </p>
      <nav className="flex items-center gap-1">
        {links.map((link) => {
          const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-label={link.label}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                active ? "bg-slate-800 text-white" : "text-slate-400"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </Link>
          );
        })}
        <button
          type="button"
          onClick={signOut}
          aria-label="Sign out"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}
