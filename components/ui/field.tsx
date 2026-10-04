import * as React from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  htmlFor,
  error,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const errorId = `${htmlFor}-error`;
  const child = React.isValidElement(children)
    ? React.cloneElement(
        children as React.ReactElement<Record<string, unknown>>,
        {
          "aria-invalid": error ? "true" : undefined,
          "aria-describedby": error ? errorId : undefined,
        }
      )
    : children;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-navy-900">
        {label}
        {required && (
          <span className="text-error" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {child}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClassName =
  "h-12 w-full rounded-xl border border-border-strong bg-surface px-4 text-sm text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:border-gold-500 disabled:opacity-50 aria-[invalid=true]:border-error";

export const textareaClassName =
  "w-full rounded-xl border border-border-strong bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:border-gold-500 disabled:opacity-50 aria-[invalid=true]:border-error";

export const selectClassName =
  "h-12 w-full rounded-xl border border-border-strong bg-surface px-4 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:border-gold-500 disabled:opacity-50 aria-[invalid=true]:border-error";
