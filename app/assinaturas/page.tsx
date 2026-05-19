import { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SubscriptionPlans } from "@/components/subscription-plans";

export const metadata: Metadata = {
  title: "Assinaturas | Meet Off",
  description: "Escolha o melhor plano para você e participe da nossa comunidade.",
};

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-1 w-12 bg-brand-red rounded-full" />
            <h2 className="text-[10px] font-black text-brand-red uppercase tracking-[0.4em]">Assinaturas</h2>
            <div className="h-1 w-12 bg-brand-red rounded-full" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-brand-black uppercase tracking-tighter mb-6 leading-[0.9]">
            Escolha seu Propósito na <span className="text-brand-red italic">Comunidade</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
            Tenha acesso exclusivo a eventos, grupos de networking, benefícios exclusivos e muito mais.
            Seja como usuário ou parceiro, sua jornada começa aqui.
          </p>
        </div>

        <SubscriptionPlans />
      </main>
      <SiteFooter />
    </div>
  );
}
