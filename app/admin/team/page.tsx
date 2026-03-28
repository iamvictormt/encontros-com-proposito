import { RoleAssignmentList } from '@/components/role-assignment-list';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminTeam() {
  const team = [
    {
      user: {
        name: 'Ana Maria',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60',
      },
      role: 'Gerente de Eventos',
      updatedAt: '25/06/2024 14:22',
    },
    {
      user: {
        name: 'João Silva',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60',
      },
      role: 'Suporte',
      updatedAt: '24/06/2024 14:22',
    },
    {
      user: {
        name: 'Ricardo Santos',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60',
      },
      role: 'Administrador',
      updatedAt: '20/06/2024 14:22',
    },
    {
      user: {
        name: 'Maria Oliveira',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60',
      },
      role: 'Editor de Conteúdo',
      updatedAt: '18/06/2024 14:22',
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold text-black">Equipes & Cargos</h2>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            <Input placeholder="Procurar" className="pl-10 h-10 bg-white border-gray-200 rounded-lg" />
          </div>

          <Button variant="outline" className="h-10 border-gray-200 bg-white text-gray-600 gap-2">
            <Filter className="h-4 w-4 text-black" />
            <span>
              Filtro: <span className="text-black font-medium">Mais recente</span>
            </span>
          </Button>
        </div>
      </div>

      <RoleAssignmentList team={team} />
    </section>
  );
}
