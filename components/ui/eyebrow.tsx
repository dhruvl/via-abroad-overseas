import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
  light = false,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]",
        light ? "text-gold-300" : "text-gold-700",
        className
      )}
    >
      <span className="h-px w-6 bg-current" aria-hidden="true" />
      {children}
    </span>
  );
}
