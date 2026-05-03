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
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-2">
          <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
            Gestão Interna
          </span>
          <h2 className="text-4xl font-black text-brand-black tracking-tighter uppercase mt-4">
            Equipe & <span className="text-brand-green">Cargos</span>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-green" />
            <Input
              placeholder="Buscar por nome ou e-mail..."
              className="pl-12 h-14 bg-white border-brand-green/10 rounded-2xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-14 px-6 border-brand-black/10 bg-white rounded-2xl text-brand-black font-black uppercase tracking-widest text-[10px] hover:bg-brand-black hover:text-white transition-all flex-1 sm:flex-none gap-3"
                >
                  <Filter className="h-4 w-4 text-brand-orange" />
                  <span>
                    {filterType === "recent" ? "Recentes" : "Antigos"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass border-white/20 p-2 rounded-2xl">
                <DropdownMenuItem 
                  onClick={() => setFilterType("recent")}
                  className={cn(
                    "rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all",
                    filterType === "recent" ? "bg-brand-black text-white" : "text-brand-black/60 hover:bg-brand-black/5"
                  )}
                >
                  Mais Recentes
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setFilterType("old")}
                  className={cn(
                    "rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all",
                    filterType === "old" ? "bg-brand-black text-white" : "text-brand-black/60 hover:bg-brand-black/5"
                  )}
                >
                  Mais Antigos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24 grayscale opacity-30"><Loader2 className="animate-spin text-brand-black w-12 h-12" /></div>
      ) : (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm">
          <RoleAssignmentList 
            team={filteredTeam} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

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
