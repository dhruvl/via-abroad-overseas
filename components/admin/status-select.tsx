"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateEnquiryStatusAction } from "@/lib/actions/admin-actions";

const statuses = ["new", "contacted", "qualified", "closed", "spam"] as const;

export function StatusSelect({
  enquiryId,
  currentStatus,
}: {
  enquiryId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setPending(true);
    const result = await updateEnquiryStatusAction({
      enquiryId,
      status: e.target.value,
    });
    setPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Status updated.");
    router.refresh();
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={onChange}
      disabled={pending}
      aria-label="Enquiry status"
      className="h-10 rounded-lg border border-slate-300 px-3 text-sm font-medium capitalize disabled:opacity-60"
    >
      {statuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
