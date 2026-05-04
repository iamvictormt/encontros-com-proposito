"use client";

import { useEffect, useState } from "react";
import { VenueApprovalCard } from "@/components/venue-approval-card";
import { Search, Filter, ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/admin-stats";
import { VenueModal } from "@/components/modals/venue-modal";
import { toast } from "sonner";
import { AdminPagination } from "@/components/admin-pagination";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function AdminVenues() {
  const [venues, setVenues] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("recent"); // "recent" | "old"
  const itemsPerPage = 8;

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
      const [venuesRes, reportsRes] = await Promise.all([
        fetch("/api/venues"),
        fetch("/api/admin/reports")
      ]);
      const venuesData = await venuesRes.json();
      const reportsData = await reportsRes.json();
      
      setVenues(venuesData);
      // We can customize stats for venues here if needed
      setStats([
        { label: "Locais/empresas ativas", value: venuesData.filter((v:any) => v.status === 'Ativo').length.toString() },
        { label: "Pendentes de aprovação", value: venuesData.filter((v:any) => v.status === 'Pendente').length.toString() },
        { label: "Total cadastrados", value: venuesData.length.toString() },
      ]);
    } catch (error) {
      toast.error("Erro ao carregar locais");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleView = (venue: any) => {
    setSelectedVenue(venue);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/venues", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Status atualizado para ${newStatus}`);
        fetchData();
      } else {
        toast.error("Erro ao atualizar status");
      }
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  const openConfirm = (title: string, description: string, onConfirm: () => void, variant: "default" | "destructive" | "secondary" = "default") => {
    setConfirmModal({
      isOpen: true,
      title,
      description,
      onConfirm,
      variant,
    });
  };

  const handleApprove = (id: string) => {
    openConfirm(
      "Aprovar Local",
      "Tem certeza que deseja aprovar este local? Ele ficará visível para os usuários.",
      () => handleStatusUpdate(id, "Aprovado"),
      "secondary"
    );
  };

  const handleReject = (id: string) => {
    openConfirm(
      "Recusar Local",
      "Tem certeza que deseja recusar este local? Ele não será exibido na plataforma.",
      () => handleStatusUpdate(id, "Recusado"),
      "destructive"
    );
  };

  const handleSetPending = (id: string) => {
    openConfirm(
      "Mudar para Pendente",
      "Tem certeza que deseja voltar este local para o estado pendente?",
      () => handleStatusUpdate(id, "Pendente"),
      "default"
    );
  };

  const handleEdit = (venue: any) => {
    setSelectedVenue(venue);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    openConfirm(
      "Excluir Local",
      "Tem certeza que deseja excluir permanentemente este local? Esta ação não pode ser desfeita.",
      async () => {
        try {
          const res = await fetch(`/api/venues?id=${id}`, { method: "DELETE" });
          if (res.ok) {
            toast.success("Local excluído");
            fetchData();
          }
        } catch (error) {
          toast.error("Erro ao excluir");
        }
      },
      "destructive"
    );
  };

  const filteredVenues = venues
    .filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      // Prioritize status: Pendente > Aprovado > Recusado
      const statusOrder: { [key: string]: number } = {
        "Pendente": 0,
        "Aprovado": 1,
        "Recusado": 2
      };
      
      const orderA = statusOrder[a.status || "Pendente"] ?? 99;
      const orderB = statusOrder[b.status || "Pendente"] ?? 99;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // If status is the same, use date/id filter
      const dateA = a.created_at ? new Date(a.created_at).getTime() : Number(a.id) || 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : Number(b.id) || 0;
      return filterType === "recent" ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.max(1, Math.ceil(filteredVenues.length / itemsPerPage));
  const paginatedVenues = filteredVenues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-16">
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-8 bg-brand-orange rounded-full" />
          <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
            Status dos Locais
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </section>

      <section className="space-y-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="space-y-2">
            <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Moderação
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-brand-black tracking-tighter uppercase mt-4">
              Locais & <span className="text-brand-green">Empresas</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-green" />
              <Input
                placeholder="Buscar por nome ou local..."
                className="pl-12 h-14 bg-white border-brand-green/10 rounded-2xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-14 px-6 border-brand-black/10 bg-white rounded-2xl text-brand-black font-black uppercase tracking-widest text-[10px] hover:bg-brand-black hover:text-white transition-all flex-1 sm:flex-none gap-3"
                >
                  <Filter className="h-4 w-4 text-brand-orange" />
                  <span>
                    {filterType === "recent" ? "Mais Recentes" : "Mais Antigos"}
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

        {isLoading ? (
          <div className="flex justify-center py-24 grayscale opacity-30"><Loader2 className="animate-spin text-brand-black w-12 h-12" /></div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {paginatedVenues.map((venue, idx) => (
                <VenueApprovalCard 
                  key={idx} 
                  {...venue} 
                  isPageLocalEmpresas={true} 
                  onViewDetails={() => handleView(venue)}
                  onEdit={() => handleEdit(venue)}
                  onDelete={() => handleDelete(venue.id)}
                  onApprove={() => handleApprove(venue.id)}
                  onReject={() => handleReject(venue.id)}
                  onSetPending={() => handleSetPending(venue.id)}
                />
              ))}
            </div>

            {paginatedVenues.length === 0 && (
              <div className="text-center py-24 glass rounded-[2.5rem] border-dashed border-brand-green/20">
                <div className="text-6xl mb-6 grayscale opacity-50">🏢</div>
                <h3 className="text-xl sm:text-2xl font-black text-brand-black mb-2 uppercase tracking-tight">
                  Nenhum local encontrado
                </h3>
                <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed px-4 font-medium">
                  Não encontramos registros com esses critérios de busca.
                </p>
              </div>
            )}

            <AdminPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredVenues.length}
              itemsPerPage={itemsPerPage}
              itemName="locais"
            />
          </div>
        )}
      </section>

      {isModalOpen && (
        <VenueModal 
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setIsViewMode(false); }}
          onSuccess={fetchData}
          venue={selectedVenue}
          isReadOnly={isViewMode}
        />
      )}

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
