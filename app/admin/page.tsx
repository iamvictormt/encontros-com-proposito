import { Button } from "@/components/ui/button"
import { AdminStats } from "@/components/admin-stats"
import { AdminEventCard } from "@/components/admin-event-card"
import { VenueApprovalCard } from "@/components/venue-approval-card"
import { BrandContentTable } from "@/components/brand-content-table"
import { RoleAssignmentList } from "@/components/role-assignment-list"

const mockEvents = [
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
];

const mockVenues = [
  { name: "Café Central", location: "São Paulo/SP", type: "Cafeteria", image: "/placeholder.svg?height=100&width=100" },
  { name: "Café Central", location: "São Paulo/SP", type: "Cafeteria", image: "/placeholder.svg?height=100&width=100" },
  { name: "Café Central", location: "São Paulo/SP", type: "Cafeteria", image: "/placeholder.svg?height=100&width=100" },
  { name: "Café Central", location: "São Paulo/SP", type: "Cafeteria", image: "/placeholder.svg?height=100&width=100" },
];

const mockBrands = [
  { logo: "/placeholder.svg?height=40&width=40", brand: "MeetOff", page: "Home", updatedAt: "08/08/2025 14:22", status: "Publicado" },
  { logo: "/placeholder.svg?height=40&width=40", brand: "FindB", page: "Home", updatedAt: "08/08/2025 14:22", status: "Publicado" },
  { logo: "/placeholder.svg?height=40&width=40", brand: "Mesa para Sete", page: "Home", updatedAt: "08/08/2025 14:22", status: "Publicado" },
  { logo: "/placeholder.svg?height=40&width=40", brand: "Check In Love", page: "Home", updatedAt: "08/08/2025 14:22", status: "Publicado" },
];

const mockTeam = [
  { user: { name: "Maria do Carmo", avatar: "/placeholder.svg?height=32&width=32" }, role: "Anfitriã", updatedAt: "08/08/2025 14:22" },
  { user: { name: "José Ancantra", avatar: "/placeholder.svg?height=32&width=32" }, role: "Cupido", updatedAt: "08/08/2025 14:22" },
  { user: { name: "Marco Antonio", avatar: "/placeholder.svg?height=32&width=32" }, role: "Terapeuta", updatedAt: "08/08/2025 14:22" },
];

export default function AdminOverview() {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-xl font-bold text-secondary mb-6">Relatórios</h2>
        <AdminStats />
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-secondary">Criação e Moderação de eventos</h2>
          <div className="flex gap-4">
            <Button className="bg-accent hover:bg-accent/90 text-white font-bold">Criar Novo Evento</Button>
            <Button variant="outline" className="bg-white text-black hover:bg-gray-50 border-gray-200">Ver todos os eventos</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <AdminEventCard key={event.id} {...event} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-secondary">Aprovação de Locais & Empresas</h2>
          <div className="flex gap-4 items-center">
             <span className="text-sm text-muted-foreground">Mais recentes</span>
             <Button variant="outline" className="bg-white text-black hover:bg-gray-50 border-gray-200">Ver todos os locais</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockVenues.map((venue, i) => (
            <VenueApprovalCard key={i} {...venue} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-secondary">Edição de Conteúdo de Marcas</h2>
          <Button variant="outline" className="bg-white text-black hover:bg-gray-50 border-gray-200">Ver todos</Button>
        </div>
        <BrandContentTable brands={mockBrands} />
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-secondary">Atribuição de Cargos</h2>
          <div className="flex gap-4 items-center">
             <span className="text-sm text-muted-foreground">Mais recentes</span>
             <Button variant="outline" className="bg-white text-black hover:bg-gray-50 border-gray-200">Ver todos</Button>
          </div>
        </div>
        <RoleAssignmentList team={mockTeam} />
      </section>
    </div>
  )
}
