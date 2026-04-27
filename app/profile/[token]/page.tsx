import { neon } from '@neondatabase/serverless';
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CheckCircle2, MapPin, Calendar, Award, Users } from "lucide-react";

export default async function PublicProfilePage({ params }: { params: { token: string } }) {
  const { token } = params;
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
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Card Header */}
        <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden mb-8 transition-all duration-500">
          <div className={`h-40 ${isPink ? 'bg-gradient-to-r from-[#8A0204] to-[#c9184a]' : 'bg-gradient-to-r from-[#1B4B42] to-[#2D6A4F]'} relative`}>
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 flex items-center justify-center">
              <span className="text-[8rem] font-black tracking-tighter text-white select-none">MeetOff</span>
            </div>
          </div>

          <div className="px-6 pb-6 flex flex-col items-center -mt-16 relative text-center">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 shadow-md flex items-center justify-center overflow-hidden">
              {card.avatar ? (
                <img src={card.avatar} alt={card.name || card.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-gray-400 uppercase">
                  {(card.name || card.full_name || "M")[0]}
                </span>
              )}
            </div>

            {/* Name & Badge */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4">
              {card.name || card.full_name || "Membro MeetOff"}
            </h2>
            
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm ${
                isPink 
                  ? 'bg-[#8A0204]/10 text-[#8A0204] border border-[#8A0204]/20' 
                  : 'bg-[#1B4B42]/10 text-[#1B4B42] border border-[#1B4B42]/20'
              }`}>
                {isPink ? "Convidado" : "Membro Oficial"}
              </span>
            </div>

            <p className="text-gray-400 text-xs mt-3 flex items-center gap-1 font-mono">
              <Award className="w-3 h-3 text-yellow-500" /> ID: {token.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <span className="text-gray-400 text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1.5">
              <MapPin className="w-4 h-4 text-secondary" /> Presenças
            </span>
            <span className="text-3xl font-black text-gray-900 mt-2 block">
              {interactions.length}
            </span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <span className="text-gray-400 text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1.5">
              <Users className="w-4 h-4 text-secondary" /> Na Rede desde
            </span>
            <span className="text-lg font-bold text-gray-900 mt-3 block">
              {card.user_joined 
                ? new Date(card.user_joined).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
                : "Recentemente"}
            </span>
          </div>
        </div>

        {/* History / Timeline */}
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
          <h3 className="font-bold text-xl text-gray-900 border-b pb-4 flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-secondary" /> Histórico de Encontros
          </h3>

          {interactions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>Nenhum encontro registrado ainda.</p>
              <p className="text-xs mt-1">Escaneie placas MeetOff em locais parceiros para pontuar!</p>
            </div>
          ) : (
            <div className="space-y-6 relative before:absolute before:left-[21px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
              {interactions.map((interaction) => (
                <div key={interaction.id} className="flex items-start gap-4 relative">
                  <div className="w-11 h-11 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center z-10 flex-shrink-0 shadow-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{interaction.venue_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{interaction.venue_location}</p>
                    <span className="inline-block text-[10px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full mt-2">
                      {new Date(interaction.created_at).toLocaleDateString('pt-BR')} às {new Date(interaction.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
