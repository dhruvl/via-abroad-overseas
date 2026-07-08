export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <span className="sr-only">Loading&hellip;</span>
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-border-strong border-t-gold-500" />
    </div>
  );
}
