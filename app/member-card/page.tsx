import { MemberCardPage } from "@/components/member-card-page";
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
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Você ainda não tem um cartão ativo</h2>
          <p className="text-gray-600 mb-6">
            Solicite seu cartão verde ou ative seu cartão rosa para acessar esta área.
          </p>
          <div className="flex flex-col gap-3">
            <RequestCardModal />
            <Button asChild className="bg-primary hover:bg-primary/90 w-full py-6 rounded-xl font-bold">
              <Link href="/activate">Ativar Cartão Rosa</Link>
            </Button>
          </div>  
        </div>
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
