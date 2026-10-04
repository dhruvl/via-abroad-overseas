"use client";

export function SkipToContent() {
  function focusMainContent(event: React.MouseEvent<HTMLAnchorElement>) {
    const main = document.getElementById("main-content");
    if (!main) return;

    event.preventDefault();
    main.scrollIntoView();
    window.requestAnimationFrame(() => main.focus({ preventScroll: true }));
  }

  return (
    <a
      href="#main-content"
      onClick={focusMainContent}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
    >
      Skip to main content
    </a>
  );
}
