import { neon } from '@neondatabase/serverless';
import { getUserSession } from "@/lib/auth-utils";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, Calendar, Clock } from "lucide-react";
import { redirect } from "next/navigation";

export default async function PlatePage({ params }: { params: { token: string } }) {
  const { token } = params;
  const session = await getUserSession();
  
  const sql = neon(process.env.DATABASE_URL!);
  const venues = await sql`SELECT * FROM venues WHERE qr_code_token = ${token}`;

  if (venues.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Local não encontrado</h1>
      </div>
    );
  }

  const venue = venues[0];

  if (venue.plate_status !== 'ACTIVE') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Placa em ativação</h2>
          <p className="text-gray-600">Este local ainda não concluiu o processo de ativação da placa oficial.</p>
        </div>
      </div>
    );
  }

  // If user is logged in, record the interaction automatically
  let interactionRecorded = false;
  if (session) {
    await sql`
      INSERT INTO interactions (user_id, venue_id, interaction_type)
      VALUES (${session.userId}, ${venue.id}, 'CHECK_IN')
    `;
    interactionRecorded = true;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <SiteHeader />
      <main className="flex-1 flex flex-col items-center justify-center p-4 py-12">
        <div className="w-full max-w-lg bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100">
          <div className="relative h-64 bg-primary flex flex-col items-center justify-center text-center p-8">
            <div className="absolute inset-0 opacity-10">
               {/* Pattern could go here */}
            </div>
            <h1 className="text-white text-5xl font-black italic tracking-tighter uppercase leading-none mb-2">Check-in</h1>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Local Oficial MeetOff</p>
          </div>
          
          <div className="p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/5 text-primary rounded-full mb-8 shadow-inner">
              <CheckCircle2 className="w-10 h-10" strokeWidth={3} />
            </div>
            
            <h2 className="text-3xl font-black text-black mb-3 uppercase italic tracking-tighter">Confirmado!</h2>
            <p className="text-gray-400 text-sm font-medium mb-10">
              Sua presença foi registrada com sucesso nesta experiência MeetOff.
            </p>
            
            <div className="bg-gray-50 rounded-[2.5rem] p-8 text-left space-y-6 mb-10 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Localização</p>
                  <p className="font-black text-black italic uppercase text-lg leading-none">{venue.name}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-primary" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Data</p>
                  <p className="font-black text-black italic uppercase text-lg leading-none">{new Date().toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Hora</p>
                  <p className="font-black text-black italic uppercase text-lg leading-none">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>

            {!session && (
              <div className="space-y-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Identifique-se para salvar no histórico
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button asChild variant="outline" className="h-16 rounded-full font-black uppercase italic">
                    <a href={`/login?redirect=/plate/${token}`}>Entrar</a>
                  </Button>
                  <Button asChild className="h-16 rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase italic shadow-lg">
                    <a href="/signup">Cadastrar</a>
                  </Button>
                </div>
              </div>
            )}

            <Button asChild variant="ghost" className="mt-8 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-primary transition-colors">
              <a href="/">Voltar ao Início</a>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
