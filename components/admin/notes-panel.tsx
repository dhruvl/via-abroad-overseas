"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { addAdminNoteAction } from "@/lib/actions/admin-actions";

type Note = {
  id: string;
  note: string;
  created_at: string;
  admin_profiles?: { display_name: string } | { display_name: string }[] | null;
};

function noteAuthor(note: Note) {
  const profile = Array.isArray(note.admin_profiles) ? note.admin_profiles[0] : note.admin_profiles;
  return profile?.display_name || "Admin";
}

export function NotesPanel({ enquiryId, notes }: { enquiryId: string; notes: Note[] }) {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const [pending, setPending] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setPending(true);
    const result = await addAdminNoteAction({ enquiryId, note: value.trim() });
    setPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setValue("");
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">Internal Notes</h2>
      <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          placeholder="Add a note visible only to admin staff..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
        />
        <button
          type="submit"
          disabled={pending || !value.trim()}
          className="inline-flex items-center justify-center gap-2 self-end rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Add Note
        </button>
      </form>

      <ul className="mt-5 space-y-4 border-t border-slate-100 pt-4">
        {notes.length === 0 && (
          <li className="text-sm text-slate-500">No notes yet.</li>
        )}
        {notes.map((note) => (
          <li key={note.id} className="text-sm">
            <p className="text-slate-800">{note.note}</p>
            <p className="mt-1 text-xs text-slate-400">
              {noteAuthor(note)} ·{" "}
              {new Date(note.created_at).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
