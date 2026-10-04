import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/footer/site-footer";
import { FloatingActions } from "@/components/navigation/floating-actions";
import { MobileActionBar } from "@/components/navigation/mobile-action-bar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      {/* Reserve room so the mobile action bar never covers the footer. */}
      <div className="h-[calc(3.5rem+env(safe-area-inset-bottom))] bg-navy-950 md:hidden" aria-hidden="true" />
      <FloatingActions />
      <MobileActionBar />
    </div>
  );
}
