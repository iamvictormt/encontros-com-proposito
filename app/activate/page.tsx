import { ActivateCardClient } from "@/components/activate-card-client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Suspense } from "react";

export default function ActivatePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={
          <div className="flex h-32 w-32 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-orange border-r-transparent"></div>
          </div>
        }>
          <ActivateCardClient />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
