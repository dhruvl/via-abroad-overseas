import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { AdminNotConfigured } from "@/components/admin/admin-not-configured";
import { isSupabaseConfigured } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin | VIA ABROAD OVERSEAS",
  },
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured) {
    return <AdminNotConfigured />;
  }

  const { profile } = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="hidden md:block">
        <AdminSidebar displayName={profile.display_name} />
      </div>
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminMobileNav />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
