import { VenueApprovalCard } from "@/components/venue-approval-card"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminVenues() {
  const venues = [
    { name: "Espaço Ar Livre", location: "São Paulo, SP", type: "Externo", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=60" },
    { name: "Centro de Convenções", location: "Curitiba, PR", type: "Interno", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=60" },
    { name: "Hotel fazenda", location: "Indaiatuba, SP", type: "Misto", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60" },
    { name: "Auditório Principal", location: "Florianópolis, SC", type: "Interno", image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&auto=format&fit=crop&q=60" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-secondary uppercase tracking-tight">Locais & Empresas</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10 w-64 bg-white border-none shadow-sm" placeholder="Procurar" />
          </div>
          <Button variant="outline" className="bg-white border-none shadow-sm flex gap-2">
            <Filter className="w-4 h-4" />
            Filtro: Mais recente
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {venues.map((venue, idx) => (
          <VenueApprovalCard key={idx} {...venue} />
        ))}
      </div>
    </div>
  )
}
