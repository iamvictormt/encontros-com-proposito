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
    <div className="space-y-12 pb-24">
      <header className="mb-12">
        <h1 className="text-4xl sm:text-6xl font-black text-black uppercase italic tracking-tighter mb-2">
          Equipe & <span className="text-primary">Cargos</span>
        </h1>
        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Gestão de permissões e acessos</p>
      </header>

      <section className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <h2 className="text-3xl font-black italic uppercase text-black tracking-tight">Membros</h2>
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            <Input
              className="pl-10 h-10 bg-white border-gray-200 rounded-lg w-full"
              placeholder="Procurar usuário"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 border-gray-200 bg-white text-gray-400 gap-2 flex-1 sm:flex-none"
                >
                  <Filter className="h-4 w-4 text-black" />
                  <span className="text-sm">
                    Filtro: <span className="text-black font-medium">{filterType === "recent" ? "Mais recente" : "Mais antigo"}</span>
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white">
                <DropdownMenuItem 
                  onClick={() => setFilterType("recent")}
                  className={filterType === "recent" ? "bg-gray-100 font-bold" : ""}
                >
                  Mais recente
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setFilterType("old")}
                  className={filterType === "old" ? "bg-gray-100 font-bold" : ""}
                >
                  Mais antigo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
      ) : (
        <RoleAssignmentList 
          team={filteredTeam} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
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
    </section>
  );
}
