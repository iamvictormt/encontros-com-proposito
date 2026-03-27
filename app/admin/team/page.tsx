import { RoleAssignmentList } from "@/components/role-assignment-list"
import { Search, Filter, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminTeam() {
  const team = [
    {
      user: { name: "Ana Maria", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60" },
      role: "Gerente de Eventos",
      updatedAt: "25/06/2024"
    },
    {
      user: { name: "João Silva", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60" },
      role: "Suporte",
      updatedAt: "24/06/2024"
    },
    {
      user: { name: "Ricardo Santos", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60" },
      role: "Administrador",
      updatedAt: "20/06/2024"
    },
    {
      user: { name: "Maria Oliveira", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60" },
      role: "Editor de Conteúdo",
      updatedAt: "18/06/2024"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-secondary uppercase tracking-tight">Equipe & Cargos</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10 w-64 bg-white border-none shadow-sm" placeholder="Procurar" />
          </div>
          <Button variant="outline" className="bg-white border-none shadow-sm flex gap-2">
            <Filter className="w-4 h-4" />
            Filtro: Mais recente
          </Button>
          <Button className="bg-[#1f4c47] hover:bg-[#1a3d39] text-white flex gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Membro
          </Button>
        </div>
      </div>

      <RoleAssignmentList team={team} />
    </div>
  )
}
