import { VenueApprovalCard } from "@/components/venue-approval-card";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/admin-stats";

export default function AdminVenues() {
  const stats = [
    { label: "Locais/empresas ativas", value: "12" },
    { label: "Pendentes de aprovação", value: "5" },
    { label: "Total cadastrados", value: "37" },
  ];

  const venues = [
    {
      name: "Espaço Ar Livre",
      location: "São Paulo, SP",
      type: "Externo",
      image:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=60",
    },
    {
      name: "Centro de Convenções",
      location: "Curitiba, PR",
      type: "Interno",
      image:
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=60",
    },
    {
      name: "Hotel fazenda",
      location: "Indaiatuba, SP",
      type: "Misto",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60",
    },
    {
      name: "Auditório Principal",
      location: "Florianópolis, SC",
      type: "Interno",
      image:
        "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&auto=format&fit=crop&q=60",
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-black mb-6">Estatísticas Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <h2 className="text-xl font-bold text-black">Local & Empresas</h2>
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
              <Input
                className="pl-10 h-10 bg-white border-gray-200 rounded-lg w-full"
                placeholder="Procurar locais e empresas"
              />
            </div>
            <Button
              variant="outline"
              className="h-10 border-gray-200 bg-white text-gray-600 gap-2 w-full sm:w-auto"
            >
              <Filter className="h-4 w-4 text-black" />
              <span className="hidden sm:inline">
                Filtro: <span className="text-black font-medium">Mais recente</span>
              </span>
              <span className="sm:hidden font-medium text-black">Filtro</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {venues.map((venue, idx) => (
            <VenueApprovalCard key={idx} {...venue} isPageLocalEmpresas={true} />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 py-8 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-gray-400 hover:bg-gray-100 h-10 w-10 p-0">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium text-black">Página 1 de 10</span>
            <Button variant="ghost" className="text-destructive hover:bg-red-50 h-10 w-10 p-0">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
