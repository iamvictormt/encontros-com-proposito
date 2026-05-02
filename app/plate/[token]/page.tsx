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
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <SiteHeader />
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {/* Background Decorative Blurs */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-brand-orange/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-brand-green/5 blur-[120px] rounded-full -z-10" />

        <div className="w-full max-w-xl glass rounded-[3.5rem] overflow-hidden shadow-2xl border-white/40">
          <div className="relative h-64 bg-brand-black flex flex-col items-center justify-center space-y-4 overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('/meetoff-pattern.png')] bg-repeat" />
            <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em] relative">
              Local Oficial MeetOff
            </span>
            <h1 className="text-white text-5xl font-black italic tracking-tighter relative">Meet<span className="text-brand-orange">Off</span></h1>
          </div>
          
          <div className="p-10 md:p-14 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-green/10 text-brand-green rounded-[2rem] mb-8 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-brand-black uppercase tracking-tighter mb-4">Check-in <span className="text-brand-green">Realizado</span>!</h2>
            <p className="text-gray-500 font-medium mb-12">
              Sua presença foi validada com sucesso no ecossistema MeetOff.
            </p>
            
            <div className="glass p-8 rounded-3xl text-left space-y-6 mb-12 border-white/40 shadow-xl">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all">
                  <MapPin size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Localização Premium</p>
                  <p className="font-black text-brand-black uppercase tracking-tight text-lg">{venue.name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Data do Encontro</p>
                    <p className="font-black text-brand-black uppercase tracking-tight">{new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="space-y-1 text-right w-full">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Horário de Registro</p>
                    <p className="font-black text-brand-black uppercase tracking-tight">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </div>
            </div>

            {!session && (
              <div className="space-y-8 bg-brand-black/5 p-8 rounded-3xl border border-brand-black/5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                  Deseja registrar este momento em seu <br/>histórico oficial de conexões?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button asChild variant="outline" className="h-14 rounded-2xl border-brand-black/10 bg-white font-black uppercase tracking-widest text-[10px] hover:bg-brand-black hover:text-white transition-all">
                    <a href={`/login?redirect=/plate/${token}`}>Já sou Membro</a>
                  </Button>
                  <Button asChild className="h-14 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-green/20">
                    <a href="/signup">Novo Cadastro</a>
                  </Button>
                </div>
              </div>
            )}

            <Button asChild variant="ghost" className="mt-10 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-brand-orange hover:bg-transparent">
              <a href="/events">Explorar mais Eventos</a>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
