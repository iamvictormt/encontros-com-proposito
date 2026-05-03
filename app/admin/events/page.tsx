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
import { cn } from "@/lib/utils";

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
    <div className="space-y-16">
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-8 bg-brand-orange rounded-full" />
          <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
            Status dos Eventos
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </section>

      <section className="space-y-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="space-y-2">
            <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Gerenciamento
            </span>
            <h2 className="text-4xl font-black text-brand-black tracking-tighter uppercase mt-4">
              Todos os <span className="text-brand-red">Eventos</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-green" />
              <Input
                placeholder="Buscar por título ou local..."
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

              <Button 
                onClick={() => { setSelectedEvent(null); setIsModalOpen(true); }}
                className="h-14 px-8 bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-brand-green/20 flex-1 sm:flex-none gap-3"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Evento</span>
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24 grayscale opacity-30"><Loader2 className="animate-spin text-brand-black w-12 h-12" /></div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

            {paginatedEvents.length === 0 && (
              <div className="text-center py-24 glass rounded-[2.5rem] border-dashed border-brand-green/20">
                <div className="text-6xl mb-6 grayscale opacity-50">📅</div>
                <h3 className="text-2xl font-black text-brand-black mb-2 uppercase tracking-tight">
                  Nenhum evento encontrado
                </h3>
                <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed px-4 font-medium">
                  Não encontramos eventos com esses critérios de busca.
                </p>
              </div>
            )}

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
