"use client";

import { useEffect, useState } from "react";
import { RoleAssignmentList } from "@/components/role-assignment-list";
import { Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TeamModal } from "@/components/modals/team-modal";
import { ConfirmModal } from "@/components/modals/confirm-modal";

export default function AdminTeam() {
  const [team, setTeam] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("recent"); // "recent" | "old"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: "default" | "destructive" | "secondary";
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
    variant: "default",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      setTeam(data);
    } catch (error) {
      toast.error("Erro ao carregar equipe");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (data: any) => {
    try {
      const res = await fetch("/api/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success("Cargo atualizado");
        setIsModalOpen(false);
        fetchData();
      }
    } catch (error) {
      toast.error("Erro ao atualizar cargo");
    }
  };

  const handleDelete = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Remover Cargo",
      description: "Tem certeza que deseja remover o cargo deste usuário? Ele voltará a ser um usuário comum.",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const res = await fetch("/api/team", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, role: "Usuário", isAdmin: false })
          });
          if (res.ok) {
            toast.success("Cargo removido");
            fetchData();
          }
        } catch (error) {
          toast.error("Erro ao remover cargo");
        }
      }
    });
  };

  const handleEdit = (member: any) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const filteredTeam = team
    .filter(m => (m.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const timeA = a.updated_at || 0;
      const timeB = b.updated_at || 0;
      const dateA = new Date(timeA).getTime();
      const dateB = new Date(timeB).getTime();
      return filterType === "recent" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="space-y-12 pb-20">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1 w-8 bg-brand-orange rounded-full" />
          <span className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.3em]">
            Administração
          </span>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-brand-black lg:text-5xl">
          Gestão de <span className="text-brand-red">Equipe</span>
        </h1>
      </header>

      <section className="glass rounded-[2rem] p-8 lg:p-10 border-brand-green/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-1 w-6 bg-brand-green rounded-full" />
              <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
                Permissões
              </h2>
            </div>
            <p className="text-2xl font-black text-brand-black uppercase tracking-tight mt-2">
              Atribuição de Cargos
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green" />
              <Input
                placeholder="Procurar usuário..."
                className="pl-12 h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 border-brand-green/10 bg-white/50 text-brand-black/60 hover:bg-brand-green hover:text-white font-bold text-xs gap-3 px-6 rounded-xl flex-1 sm:flex-none"
                  >
                    <Filter className="h-4 w-4" />
                    <span>
                      Filtro: <span className="text-brand-orange">{filterType === "recent" ? "Recentes" : "Antigos"}</span>
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 glass border-brand-green/10">
                  <DropdownMenuItem 
                    onClick={() => setFilterType("recent")}
                    className={cn("text-xs font-bold py-3", filterType === "recent" && "bg-brand-green/10 text-brand-green")}
                  >
                    Mais recente
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterType("old")}
                    className={cn("text-xs font-bold py-3", filterType === "old" && "bg-brand-green/10 text-brand-green")}
                  >
                    Mais antigo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-red w-12 h-12" /></div>
        ) : (
          <RoleAssignmentList 
            team={filteredTeam} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </section>

      <TeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        member={selectedMember}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        onConfirm={() => {
          confirmModal.onConfirm();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        variant={confirmModal.variant}
      />
    </div>
  );
}
