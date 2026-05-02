import { ActivateCardClient } from "@/components/activate-card-client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Suspense } from "react";

export default function ActivatePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center py-12">
        <Suspense fallback={<div>Carregando...</div>}>
          <ActivateCardClient />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
