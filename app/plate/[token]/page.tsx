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
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-xl">
          <div className="relative h-48 bg-secondary flex items-center justify-center">
            <div className="absolute inset-0 opacity-20">
               {/* Pattern */}
            </div>
            <h1 className="text-white text-3xl font-black italic tracking-tighter">MeetOff</h1>
          </div>
          
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check-in Realizado!</h2>
            <p className="text-gray-500 mb-8">
              Você acabou de se conectar ao local oficial MeetOff.
            </p>
            
            <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-secondary mt-1" />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Local</p>
                  <p className="font-bold text-gray-900">{venue.name}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-secondary mt-1" />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Data</p>
                  <p className="font-bold text-gray-900">{new Date().toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-secondary mt-1" />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Hora</p>
                  <p className="font-bold text-gray-900">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>

            {!session && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Para registrar este encontro em seu histórico, faça login ou cadastre-se.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Button asChild variant="outline" className="h-12 rounded-xl">
                    <a href={`/login?redirect=/plate/${token}`}>Entrar</a>
                  </Button>
                  <Button asChild className="h-12 rounded-xl bg-secondary hover:bg-secondary/90">
                    <a href="/signup">Cadastrar</a>
                  </Button>
                </div>
              </div>
            )}

            <Button asChild variant="ghost" className="mt-6 text-gray-400">
              <a href="/">Voltar para a Home</a>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
