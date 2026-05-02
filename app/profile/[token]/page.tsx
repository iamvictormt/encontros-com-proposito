import { neon } from '@neondatabase/serverless';
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CheckCircle2, MapPin, Calendar, Award, Users } from "lucide-react";

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
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Perfil não encontrado</h1>
            <p className="text-gray-500 mt-2">O link acessado parece ser inválido ou expirou.</p>
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
    <div className="min-h-screen flex flex-col bg-background font-sans overflow-x-hidden">
      <SiteHeader />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-16 lg:px-20 relative">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/5 blur-[120px] rounded-full -ml-48 -mb-48" />

        {/* Profile Card Header */}
        <div className="glass rounded-[3.5rem] border-white/40 shadow-2xl overflow-hidden mb-12 relative group">
          <div className={`h-64 relative transition-all duration-700 ${isPink ? 'bg-brand-red' : 'bg-brand-green'}`}>
            <div className="absolute inset-0 opacity-10 bg-[url('/meetoff-pattern.png')] bg-repeat" />
            <div className="absolute inset-0 flex items-center justify-center p-12">
               <h1 className="text-white text-5xl md:text-7xl font-black italic tracking-tighter opacity-20">MeetOff</h1>
            </div>
          </div>

          <div className="px-8 pb-12 flex flex-col items-center -mt-20 relative text-center space-y-6">
            {/* Avatar */}
            <div className="w-40 h-40 rounded-[2.5rem] border-8 border-white bg-gray-100 shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-500 hover:scale-105">
              {card.avatar ? (
                <img src={card.avatar} alt={card.name || card.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-black text-brand-black/20 uppercase">
                  {(card.name || card.full_name || "M")[0]}
                </span>
              )}
            </div>

            {/* Name & Badge */}
            <div className="space-y-3">
              <h2 className="text-3xl md:text-5xl font-black text-brand-black uppercase tracking-tighter">
                {card.name || card.full_name || "Membro MeetOff"}
              </h2>
              
              <div className="flex items-center justify-center gap-3">
                <span className={cn(
                  "px-6 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-sm border",
                  isPink 
                    ? 'bg-brand-red/10 text-brand-red border-brand-red/20' 
                    : 'bg-brand-green/10 text-brand-green border-brand-green/20'
                )}>
                  {isPink ? "Convidado Special" : "Membro Black Edition"}
                </span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Award className="w-3 h-3 text-brand-orange" /> ID: {token.slice(0, 8).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Stats & Info Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
              {[
                { label: "Presenças Oficiais", value: interactions.length, icon: MapPin, color: "text-brand-orange", bg: "bg-brand-orange/10" },
                { label: "Membro desde", value: card.user_joined 
                  ? (() => {
                      const str = new Date(card.user_joined).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
                      return str.charAt(0).toUpperCase() + str.slice(1);
                    })()
                  : "Recentemente", icon: Users, color: "text-brand-green", bg: "bg-brand-green/10" }
              ].map((stat, i) => (
                <div key={i} className="glass p-8 rounded-[2.5rem] border-white/40 shadow-xl space-y-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">{stat.label}</span>
                    <p className="text-3xl font-black text-brand-black tracking-tighter">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline / History */}
          <div className="lg:col-span-8">
            <div className="glass p-10 rounded-[3.5rem] border-white/40 shadow-2xl h-full">
              <div className="flex items-center gap-4 mb-12">
                <div className="h-1 w-12 bg-brand-red rounded-full" />
                <h3 className="font-black text-2xl text-brand-black uppercase tracking-tighter">Histórico de <span className="text-brand-red">Conexões</span></h3>
              </div>

              {interactions.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <div className="w-20 h-20 bg-brand-black/5 rounded-full flex items-center justify-center mx-auto">
                    <Calendar className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Nenhum encontro registrado</p>
                </div>
              ) : (
                <div className="space-y-10 relative before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-[2px] before:bg-brand-black/5">
                  {interactions.map((interaction) => (
                    <div key={interaction.id} className="flex items-start gap-8 relative group">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-brand-black/5 text-brand-green flex items-center justify-center z-10 flex-shrink-0 shadow-xl transition-transform group-hover:scale-110 duration-500">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="space-y-2 pt-1">
                        <div className="space-y-0.5">
                          <p className="font-black text-brand-black uppercase tracking-tight text-lg">{interaction.venue_name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <MapPin size={10} className="text-brand-orange" /> {interaction.venue_location}
                          </p>
                        </div>
                        <span className="inline-block text-[9px] font-black text-white bg-brand-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                          {new Date(interaction.created_at).toLocaleDateString('pt-BR')} às {new Date(interaction.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
