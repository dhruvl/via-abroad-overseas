import Link from "next/link";
import { Inbox, PhoneCall, BadgeCheck, CalendarCheck, ArrowUpRight } from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import { getDashboardMetrics } from "@/lib/database/admin-queries";

const statusStyles: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  qualified: "bg-emerald-100 text-emerald-700",
  closed: "bg-slate-200 text-slate-600",
  spam: "bg-red-100 text-red-700",
};

export default async function AdminOverviewPage() {
  const { supabase } = await requireAdmin();
  const metrics = await getDashboardMetrics(supabase);

  const cards = [
    { label: "New Enquiries", value: metrics.newCount, icon: Inbox, accent: "text-blue-600 bg-blue-50" },
    { label: "Contacted", value: metrics.contactedCount, icon: PhoneCall, accent: "text-amber-600 bg-amber-50" },
    { label: "Qualified", value: metrics.qualifiedCount, icon: BadgeCheck, accent: "text-emerald-600 bg-emerald-50" },
    { label: "Consultation Requests", value: metrics.consultationCount, icon: CalendarCheck, accent: "text-gold-700 bg-gold-200/60" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Live figures based on current enquiry records.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.accent}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-4 text-2xl font-semibold text-slate-900">{card.value}</p>
              <p className="text-sm text-slate-500">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Recent Submissions</h2>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-1 text-sm font-medium text-gold-700 hover:text-gold-600"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        {metrics.recent.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            No enquiries have been submitted yet.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {metrics.recent.map((row) => (
              <li key={row.id}>
                <Link
                  href={`/admin/enquiries/${row.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{row.full_name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {row.email} · {row.interested_country || "No country specified"}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[row.status]}`}>
                    {row.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
