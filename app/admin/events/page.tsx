"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AdminEventCard } from "@/components/admin-event-card";
import { StatCard } from "@/components/admin-stats";
import { EventModal } from "@/components/modals/event-modal";
import { toast } from "sonner";
import { AdminPagination } from "@/components/admin-pagination";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("recent"); // "recent" | "old"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
      const [eventsRes, reportsRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/admin/reports")
      ]);
      
      const eventsData = eventsRes.ok ? await eventsRes.json() : [];
      const reportsData = reportsRes.ok ? await reportsRes.json() : { stats: [] };
      
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setStats(reportsData.stats?.slice(0, 3) || []);
    } catch (error) {
      toast.error("Erro ao carregar dados");
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

  const handleView = (event: any) => {
    setSelectedEvent(event);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Excluir Evento",
      description: "Tem certeza que deseja excluir permanentemente este evento? Esta ação não pode ser desfeita.",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/events?id=${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error();
          toast.success("Evento excluído");
          fetchData();
        } catch (error) {
          toast.error("Erro ao excluir evento");
        }
      }
    });
  };

  const filteredEvents = events
    .filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      // Fallback: use id if created_at is missing
      const dateA = a.created_at ? new Date(a.created_at).getTime() : Number(a.id) || 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : Number(b.id) || 0;
      return filterType === "recent" ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / itemsPerPage));
  const paginatedEvents = filteredEvents.slice(
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
          <h2 className="text-xl font-bold text-black">Eventos</h2>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
              <Input
                placeholder="Procurar Eventos"
                className="pl-10 h-10 bg-white border-gray-200 rounded-lg w-full"
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

              <Button 
                onClick={() => { setSelectedEvent(null); setIsModalOpen(true); }}
                className="h-10 bg-secondary hover:bg-secondary/90 text-white gap-2 px-4 rounded-lg flex-1 sm:flex-none"
              >
                <Plus className="h-4 w-4" />
                <span className="whitespace-nowrap">Novo Evento</span>
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {paginatedEvents.map((event) => (
                <AdminEventCard 
                  key={event.id} 
                  {...event} 
                  onViewDetails={() => handleView(event)}
                  onEdit={() => handleEdit(event)}
                  onDelete={() => handleDelete(event.id)}
                />
              ))}
            </div>

            <AdminPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredEvents.length}
              itemsPerPage={itemsPerPage}
              itemName="eventos"
            />
          </div>
        )}
      </section>

      {isModalOpen && (
        <EventModal 
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setIsViewMode(false); }}
          onSuccess={fetchData}
          event={selectedEvent}
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
