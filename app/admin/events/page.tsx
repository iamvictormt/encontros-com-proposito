import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { AdminEventCard } from "@/components/admin-event-card"

const stats = [
  { label: "Total Eventos Ativos", value: "12" },
  { label: "Eventos concluídos", value: "5" },
  { label: "Participantes totais", value: "37" },
]

const events = [
  {
    id: 1,
    image: "/placeholder.svg?height=400&width=600",
    status: "Ativo" as const,
    tags: ["Casais", "Sem Crianças"],
    title: "Retiro de Casais",
    date: "20/09/2025",
    location: "São Paulo/SP",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=400&width=600",
    status: "Offline" as const,
    tags: ["Terapeutas", "Apenas Profissionais"],
    title: "Networking Terapeutas",
    date: "20/09/2025",
    location: "São Paulo/SP",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=400&width=600",
    status: "Ativo" as const,
    tags: ["LGBTQIA+", "Sem crianças"],
    title: "Happy Hour",
    date: "20/09/2025",
    location: "São Paulo/SP",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=400&width=600",
    status: "Ativo" as const,
    tags: ["Casais", "Sem Crianças"],
    title: "Retiro de Casais",
    date: "20/09/2025",
    location: "São Paulo/SP",
  },
  {
    id: 5,
    image: "/placeholder.svg?height=400&width=600",
    status: "Offline" as const,
    tags: ["Terapeutas", "Apenas Profissionais"],
    title: "Networking Terapeutas",
    date: "20/09/2025",
    location: "São Paulo/SP",
  },
  {
    id: 6,
    image: "/placeholder.svg?height=400&width=600",
    status: "Ativo" as const,
    tags: ["LGBTQIA+", "Sem crianças"],
    title: "Happy Hour",
    date: "20/09/2025",
    location: "São Paulo/SP",
  },
  {
    id: 7,
    image: "/placeholder.svg?height=400&width=600",
    status: "Ativo" as const,
    tags: ["Casais", "Sem Crianças"],
    title: "Retiro de Casais",
    date: "20/09/2025",
    location: "São Paulo/SP",
  },
  {
    id: 8,
    image: "/placeholder.svg?height=400&width=600",
    status: "Offline" as const,
    tags: ["Terapeutas", "Apenas Profissionais"],
    title: "Networking Terapeutas",
    date: "20/09/2025",
    location: "São Paulo/SP",
  },
  {
    id: 9,
    image: "/placeholder.svg?height=400&width=600",
    status: "Ativo" as const,
    tags: ["LGBTQIA+", "Sem crianças"],
    title: "Happy Hour",
    date: "20/09/2025",
    location: "São Paulo/SP",
  },
]

export default function AdminEvents() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-secondary mb-6">Estatísticas Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{stat.label}</p>
              <p className="text-4xl font-bold text-secondary">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-bold text-secondary">Eventos</h2>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Procurar Eventos"
                className="pl-10 h-10 bg-white border-gray-200 rounded-lg"
              />
            </div>

            <Button variant="outline" className="h-10 border-gray-200 bg-white text-gray-600 gap-2">
              <Filter className="h-4 w-4" />
              <span>Filtro: <span className="text-black font-medium">Mais recente</span></span>
            </Button>

            <Button className="h-10 bg-[#1f4c47] hover:bg-[#1f4c47]/90 text-white gap-2 font-bold px-4 rounded-lg">
              <Plus className="h-4 w-4" />
              Criar Novo Evento
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {events.map((event) => (
            <AdminEventCard key={event.id} {...event} />
          ))}
        </div>

        <div className="flex justify-center items-center gap-8 py-8 border-t border-gray-100">
          <Button variant="ghost" className="text-gray-400">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium text-gray-600">
            Página 1 de 10
          </span>
          <Button variant="ghost" className="text-accent">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
