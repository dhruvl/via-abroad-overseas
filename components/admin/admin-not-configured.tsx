import { ServerCog } from "lucide-react";

export function AdminNotConfigured() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-200">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-gold-400">
          <ServerCog className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-lg font-semibold text-white">
          Admin System Not Yet Configured
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          The admin dashboard requires Supabase environment variables
          (<code className="text-slate-300">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code className="text-slate-300">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>,{" "}
          <code className="text-slate-300">SUPABASE_SECRET_KEY</code>) to be
          set before it can be used. See{" "}
          <code className="text-slate-300">docs/ADMIN_GUIDE.md</code> for setup
          steps.
        </p>
      </div>
    </div>
  );
}
