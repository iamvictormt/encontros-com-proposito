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
    <div className="space-y-12 pb-20">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1 w-8 bg-brand-orange rounded-full" />
          <span className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.3em]">
            Administração
          </span>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-brand-black lg:text-5xl">
          Gestão de <span className="text-brand-red">Eventos</span>
        </h1>
      </header>

      <section className="glass rounded-[2rem] p-8 lg:p-10 border-brand-green/5">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-6 bg-brand-green rounded-full" />
          <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
            Estatísticas Rápidas
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </section>

      <section className="glass rounded-[2rem] p-8 lg:p-10 border-brand-green/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-1 w-6 bg-brand-red rounded-full" />
              <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
                Listagem
              </h2>
            </div>
            <p className="text-2xl font-black text-brand-black uppercase tracking-tight mt-2">
              Todos os Eventos
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green" />
              <Input
                placeholder="Procurar Eventos..."
                className="pl-12 h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
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

              <Button 
                onClick={() => { setSelectedEvent(null); setIsModalOpen(true); }}
                className="h-12 bg-brand-red hover:bg-brand-red/90 text-white font-bold text-xs px-8 rounded-xl shadow-lg shadow-brand-red/20 flex-1 sm:flex-none gap-3"
              >
                <Plus className="h-4 w-4" />
                <span className="whitespace-nowrap">Novo Evento</span>
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-red w-12 h-12" /></div>
        ) : (
          <div className="space-y-12">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-20 bg-brand-green/5 rounded-[2rem] border-dashed border-2 border-brand-green/10">
                <p className="text-brand-black/40 font-black uppercase tracking-widest text-sm">Nenhum evento encontrado</p>
              </div>
            ) : (
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
