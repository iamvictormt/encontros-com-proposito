import { Button } from "@/components/ui/button";
import { AdminStats } from "@/components/admin-stats";
import { AdminEventCard } from "@/components/admin-event-card";
import { VenueApprovalCard } from "@/components/venue-approval-card";
import { BrandContentTable } from "@/components/brand-content-table";
import { RoleAssignmentList } from "@/components/role-assignment-list";

const mockEvents = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1629709960734-e52c75717c21?q=80&w=686&auto=format&fit=crop",
    status: "Ativo" as const,
    tags: ["Casais", "Sem Crianças"],
    title: "Retiro de Casais",
    date: "20/09/2025",
    location: "São Paulo/SP",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop",
    status: "Offline" as const,
    tags: ["Terapeutas", "Apenas Profissionais"],
    title: "Networking Terapeutas",
    date: "20/09/2025",
    location: "São Paulo/SP",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1574096079513-d8259312b785?q=80&w=800&auto=format&fit=crop",
    status: "Ativo" as const,
    tags: ["LGBTQIA+", "Sem crianças"],
    title: "Happy Hour",
    date: "20/09/2025",
    location: "São Paulo/SP",
  },
];

const mockVenues = [
  {
    name: "Café Central",
    location: "São Paulo/SP",
    type: "Cafeteria",
    image:
      "https://images.unsplash.com/photo-1629709960734-e52c75717c21?q=80&w=686&auto=format&fit=crop",
  },
  {
    name: "Café Central",
    location: "São Paulo/SP",
    type: "Cafeteria",
    image:
      "https://images.unsplash.com/photo-1629709960734-e52c75717c21?q=80&w=686&auto=format&fit=crop",
  },
  {
    name: "Café Central",
    location: "São Paulo/SP",
    type: "Cafeteria",
    image:
      "https://images.unsplash.com/photo-1629709960734-e52c75717c21?q=80&w=686&auto=format&fit=crop",
  },
  {
    name: "Café Central",
    location: "São Paulo/SP",
    type: "Cafeteria",
    image:
      "https://images.unsplash.com/photo-1629709960734-e52c75717c21?q=80&w=686&auto=format&fit=crop",
  },
];

const mockBrands = [
  {
    logo: "https://images.unsplash.com/photo-1608541737042-87a12275d313?q=80&w=1461&auto=format&fit=crop",
    brand: "MeetOff",
    page: "Home",
    updatedAt: "08/08/2025 14:22",
    status: "Publicado",
  },
  {
    logo: "https://images.unsplash.com/photo-1608541737042-87a12275d313?q=80&w=1461&auto=format&fit=crop",
    brand: "FindB",
    page: "Home",
    updatedAt: "08/08/2025 14:22",
    status: "Publicado",
  },
  {
    logo: "https://images.unsplash.com/photo-1608541737042-87a12275d313?q=80&w=1461&auto=format&fit=crop",
    brand: "Mesa para Sete",
    page: "Home",
    updatedAt: "08/08/2025 14:22",
    status: "Publicado",
  },
  {
    logo: "https://images.unsplash.com/photo-1608541737042-87a12275d313?q=80&w=1461&auto=format&fit=crop",
    brand: "Check In Love",
    page: "Home",
    updatedAt: "08/08/2025 14:22",
    status: "Publicado",
  },
];

const mockTeam = [
  {
    user: {
      name: "Ana Maria",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60",
    },
    role: "Gerente de Eventos",
    updatedAt: "25/06/2024 14:22",
  },
  {
    user: {
      name: "João Silva",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60",
    },
    role: "Suporte",
    updatedAt: "24/06/2024 14:22",
  },
  {
    user: {
      name: "Ricardo Santos",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
    },
    role: "Administrador",
    updatedAt: "20/06/2024 14:22",
  },
  {
    user: {
      name: "Maria Oliveira",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
    },
    role: "Editor de Conteúdo",
    updatedAt: "18/06/2024 14:22",
  },
];

export default function AdminOverview() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-black mb-6">Relatórios</h2>
        <AdminStats />
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Criação e Moderação de eventos</h2>
          <div className="flex gap-4">
            <Button className="bg-accent hover:bg-accent/90 text-white">Criar Novo Evento</Button>
            <Button variant="outline" className="bg-white text-black border-gray-200">
              Ver todos os eventos
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <AdminEventCard key={event.id} {...event} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Aprovação de Locais & Empresas</h2>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-muted-foreground">Mais recentes</span>
            <Button variant="outline" className="bg-white text-black border-gray-200">
              Ver todos os locais
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockVenues.map((venue, i) => (
            <VenueApprovalCard key={i} {...venue} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Edição de Conteúdo de Marcas</h2>
          <Button variant="outline" className="bg-white text-black border-gray-200">
            Ver todos
          </Button>
        </div>
        <BrandContentTable brands={mockBrands} />
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Atribuição de Cargos</h2>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-muted-foreground">Mais recentes</span>
            <Button variant="outline" className="bg-white text-black border-gray-200">
              Ver todos
            </Button>
          </div>
        </div>
        <RoleAssignmentList team={mockTeam} />
      </section>
    </div>
  );
}
