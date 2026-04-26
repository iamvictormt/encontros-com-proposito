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
    <div className="space-y-8 bg-white p-4 rounded-md">
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
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
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
