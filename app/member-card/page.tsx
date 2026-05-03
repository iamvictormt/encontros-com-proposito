import { MemberCardPage } from "@/components/member-card-page";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getUserSession } from "@/lib/auth-utils";
import { neon } from '@neondatabase/serverless';
import { redirect } from "next/navigation";
import { RequestCardModal } from "@/components/request-card-modal";
import Link from "next/link";
 import { Button } from "@/components/ui/button";

export default async function MemberCard() {
  const session = await getUserSession();
  
  if (!session) {
    redirect("/login");
  }

  const sql = neon(process.env.DATABASE_URL!);
  const cards = await sql`
    SELECT * FROM cards 
    WHERE owner_id = ${session.userId} 
    AND status = 'ATIVO'
    ORDER BY created_at DESC 
    LIMIT 1
  `;

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background font-sans overflow-x-hidden">
        <SiteHeader />
        
        <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-green/10 blur-[120px] rounded-full -z-10" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-orange/10 blur-[120px] rounded-full -z-10" />

          <div className="w-full max-w-md text-center space-y-8 relative">
            <div className="space-y-4">
              <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
                Status do Cartão
              </span>
              <h2 className="text-4xl font-black text-brand-black uppercase tracking-tighter leading-none mt-4">
                Cartão <span className="text-brand-orange">Inativo</span>
              </h2>
              <p className="text-gray-500 font-medium text-sm">
                Você ainda não possui um cartão ativo em nosso ecossistema. Solicite ou ative um agora mesmo.
              </p>
            </div>

            <div className="glass p-8 rounded-[2.5rem] border border-brand-black/5 space-y-4">
              <RequestCardModal />
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-brand-black/5"></div>
                </div>
                <div className="relative flex justify-center text-[8px] uppercase tracking-[0.3em] font-black">
                  <span className="bg-white/50 backdrop-blur-sm px-2 text-gray-400">ou se já possui</span>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-brand-black/10 bg-white hover:bg-brand-black hover:text-white transition-all font-black uppercase tracking-widest text-[10px]">
                <Link href="/activate">Ativar Cartão Rosa</Link>
              </Button>
            </div>
          </div>
        </main>

      </div>
    );
  }

  const card = cards[0];
  let qrCodeToken = card.qr_code_token;

  if (!qrCodeToken) {
    qrCodeToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    await sql`UPDATE cards SET qr_code_token = ${qrCodeToken} WHERE id = ${card.id}`;
  }

  return (
    <MemberCardPage 
      cardType={card.type as "GREEN" | "PINK"}
      name={card.name}
      birthDate={card.birth_date ? new Date(card.birth_date).toLocaleDateString('pt-BR') : undefined}
      qrCodeToken={qrCodeToken}
      cvv={card.cvv}
    />
  );
}
