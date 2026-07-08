import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/login-form";
import { AdminNotConfigured } from "@/components/admin/admin-not-configured";
import { isSupabaseConfigured } from "@/lib/config";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  if (!isSupabaseConfigured) {
    return <AdminNotConfigured />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
        <p className="font-display text-lg font-semibold text-navy-900">
          VIA ABROAD <span className="text-gold-600">OVERSEAS</span>
        </p>
        <h1 className="mt-4 text-xl font-semibold text-navy-900">Admin Sign In</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Authorized staff access only.
        </p>
        <div className="mt-6">
          <Suspense>
            <AdminLoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
