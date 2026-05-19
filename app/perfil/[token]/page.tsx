import { neon } from '@neondatabase/serverless';
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CheckCircle2, MapPin, Calendar, Award, Users, QrCode, ShieldCheck, Sparkles, Navigation } from "lucide-react";
import { cn } from '@/lib/utils';

export default async function PublicProfilePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const sql = neon(process.env.DATABASE_URL!);

  // Fetch the card and its owner details
  const cards = await sql`
    SELECT c.*, u.full_name, u.avatar, u.role, u.created_at as user_joined
    FROM cards c
    LEFT JOIN users u ON c.owner_id = u.id
    WHERE c.qr_code_token = ${token}
    LIMIT 1
  `;

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-red/5 via-transparent to-transparent" />
          <div className="glass p-12 rounded-[3rem] border-white/20 shadow-2xl text-center max-w-md w-full relative z-10 backdrop-blur-3xl">
            <div className="w-24 h-24 bg-gradient-to-tr from-brand-red/20 to-brand-orange/20 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 transition-transform hover:rotate-0 duration-500">
              <QrCode className="w-12 h-12 text-brand-red" />
            </div>
            <h1 className="text-4xl font-black text-brand-black uppercase tracking-tighter mb-4 leading-none">Perfil <br/><span className="text-brand-red">Inexistente</span></h1>
            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">
              Este token de acesso não foi encontrado ou já foi revogado por segurança.
            </p>
            <div className="h-1 w-20 bg-brand-red/10 mx-auto rounded-full" />
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const card = cards[0];

  // Fetch recent interactions (presences)
  const interactions = await sql`
    SELECT i.*, v.name as venue_name, v.location as venue_location
    FROM interactions i
    JOIN venues v ON i.venue_id = v.id
    WHERE i.user_id = ${card.owner_id}
    ORDER BY i.created_at DESC
    LIMIT 10
  `;

  const isPink = card.type === "PINK";

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-brand-orange/30 overflow-x-hidden">
      <SiteHeader />

      <main className="flex-1 flex flex-col items-center p-4 sm:p-8 lg:p-12 relative">
        {/* Cinematic Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-brand-green/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[20%] right-[5%] w-[35vw] h-[35vw] bg-brand-orange/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
          <div className="absolute top-[40%] right-[10%] w-[20vw] h-[20vw] bg-brand-red/5 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-6xl w-full space-y-12 z-10">
          {/* Main Hero Profile Section */}
          <div className="relative group">
            {/* Background Glow */}
            <div className={cn(
              "absolute inset-0 blur-[100px] opacity-20 -z-10 transition-colors duration-1000",
              isPink ? 'bg-brand-red' : 'bg-brand-green'
            )} />

            <div className="glass rounded-[4rem] border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden backdrop-blur-3xl">
              {/* Header Banner */}
              <div className={cn(
                "h-64 sm:h-96 relative overflow-hidden flex items-center justify-center",
                isPink ? 'bg-brand-red' : 'bg-brand-green'
              )}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
                
                <div className="relative z-10 text-center space-y-4">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Identidade Digital MeetOff</span>
                  </div>
                </div>
                {/* Floating Decoration */}
               </div>

              {/* Content Overlay */}
              <div className="px-6 sm:px-16 pb-16 relative">
                <div className="flex flex-col items-center -mt-24 sm:-mt-32 space-y-8">
                  {/* Premium Avatar Container */}
                  <div className="relative group/avatar">
                    <div className={cn(
                      "absolute inset-0 blur-3xl opacity-40 rounded-full scale-90 transition-transform group-hover/avatar:scale-110 duration-700",
                      isPink ? 'bg-brand-red' : 'bg-brand-green'
                    )} />
                    <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-[3.5rem] border-[12px] border-white bg-white shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-700 group-hover/avatar:-rotate-3 relative z-10">
                      {card.avatar ? (
                        <img src={card.avatar} alt={card.name || card.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
                          <span className="text-6xl sm:text-8xl font-black text-brand-black/10 uppercase select-none">
                            {(card.name || card.full_name || "M")[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Verified Badge */}
                    <div className="absolute bottom-4 right-4 w-12 h-12 bg-brand-orange rounded-2xl flex items-center justify-center shadow-xl border-4 border-white z-20 transition-transform hover:scale-110">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Identity Details */}
                  <div className="text-center space-y-6 max-w-3xl">
                    <div className="space-y-2">
                      <h2 className="text-4xl sm:text-7xl font-black text-brand-black uppercase tracking-tighter leading-none text-balance">
                        {card.name || card.full_name || "Membro MeetOff"}
                      </h2>
                      <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs">
                        {card.role || "Membro Exclusivo"}
                      </p>
                    </div>
 
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Info Cards Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              {[
                { 
                  label: "Presenças Oficiais", 
                  value: interactions.length, 
                  icon: MapPin, 
                  color: "text-brand-orange", 
                  bg: "bg-brand-orange/10",
                  text: "Eventos validados MeetOff"
                },
                { 
                  label: "Tempo de Casa", 
                  value: card.user_joined 
                    ? (() => {
                        const str = new Date(card.user_joined).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
                        return str.charAt(0).toUpperCase() + str.slice(1);
                      })()
                    : "Recente", 
                  icon: Users, 
                  color: "text-brand-green", 
                  bg: "bg-brand-green/10",
                  text: "Membro da comunidade"
                }
              ].map((stat, i) => (
                <div key={i} className="glass p-10 rounded-[3rem] border-white/50 shadow-xl group transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-black/5 rounded-full blur-2xl group-hover:bg-brand-black/10 transition-colors" />
                  <div className="relative space-y-6">
                    <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center shadow-inner transition-all duration-700 group-hover:rotate-[360deg]", stat.bg)}>
                      <stat.icon className={cn("w-8 h-8", stat.color)} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{stat.label}</span>
                      <p className="text-5xl font-black text-brand-black tracking-tighter mb-2">{stat.value}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-60">{stat.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* History Timeline */}
            <div className="lg:col-span-8">
              <div className="glass p-8 sm:p-14 rounded-[3.5rem] sm:rounded-[4.5rem] border-white/50 shadow-2xl relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Navigation className="w-32 h-32 text-brand-black" />
                </div>

                <div className="relative space-y-16">
                  <div className="flex items-center gap-6">
                    <div className="w-3 h-12 bg-brand-red rounded-full shadow-lg shadow-brand-red/20" />
                    <div className="space-y-1">
                      <h3 className="font-black text-3xl sm:text-4xl text-brand-black uppercase tracking-tighter leading-none">
                        Histórico de <span className="text-brand-red">Conexões</span>
                      </h3>
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Sua jornada na comunidade</p>
                    </div>
                  </div>

                  {interactions.length === 0 ? (
                    <div className="text-center py-20 space-y-8">
                      <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center mx-auto shadow-inner relative group">
                        <Calendar className="w-12 h-12 text-gray-300 transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-[3rem] animate-spin-slow" />
                      </div>
                      <div className="space-y-3">
                        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Nenhum encontro registrado ainda</p>
                        <p className="text-gray-300 text-[11px] font-medium max-w-[240px] mx-auto italic">Grandes histórias começam com o primeiro scan.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-12 relative">
                      {/* Timeline Line */}
                      <div className="absolute left-[31px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-brand-black/10 via-brand-black/5 to-transparent" />
                      
                      {interactions.map((interaction, idx) => (
                        <div key={interaction.id} className="flex items-start gap-8 sm:gap-12 relative group">
                          {/* Timeline Dot */}
                          <div className={cn(
                            "w-16 h-16 rounded-[1.5rem] bg-white border-2 border-brand-black/5 flex items-center justify-center z-10 flex-shrink-0 shadow-xl transition-all duration-700 group-hover:bg-brand-black group-hover:text-white group-hover:-translate-y-1",
                            idx === 0 && "ring-4 ring-brand-red/10"
                          )}>
                            <CheckCircle2 className="w-8 h-8" />
                          </div>

                          <div className="space-y-4 pt-1 flex-1">
                            <div className="space-y-1">
                              <p className="font-black text-brand-black uppercase tracking-tight text-2xl sm:text-3xl transition-colors group-hover:text-brand-red">
                                {interaction.venue_name}
                              </p>
                              <div className="flex items-center gap-3 bg-brand-black/[0.02] px-4 py-1.5 rounded-full w-fit">
                                <MapPin size={12} className="text-brand-orange" />
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                  {interaction.venue_location}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <span className="inline-block text-[10px] font-black text-white bg-brand-black px-6 py-2.5 rounded-2xl uppercase tracking-[0.2em] shadow-lg shadow-brand-black/20 group-hover:bg-brand-red transition-colors">
                                {new Date(interaction.created_at).toLocaleDateString('pt-BR')}
                              </span>
                              <div className="h-px w-8 bg-brand-black/10" />
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                {new Date(interaction.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
