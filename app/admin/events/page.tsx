"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AdminEventCard } from "@/components/admin-event-card";
import { StatCard } from "@/components/admin-stats";
import { EventModal } from "@/components/modals/event-modal";
import { toast } from "sonner";
import { Event, Stat } from "@/types";

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;

    try {
      const res = await fetch(`/api/events?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Evento excluído");
      fetchData();
    } catch (error) {
      toast.error("Erro ao excluir evento");
    }
  };

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
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
              <Button
                variant="outline"
                className="h-10 border-gray-200 bg-white text-gray-600 gap-2 flex-1 sm:flex-none"
              >
                <Filter className="h-4 w-4 text-black" />
                <span className="hidden sm:inline">
                  Filtro: <span className="text-black font-medium">Mais recente</span>
                </span>
                <span className="sm:hidden font-medium text-black">Filtro</span>
              </Button>

              <Button
                onClick={() => { setSelectedEvent(null); setIsModalOpen(true); }}
                className="h-10 bg-[#1f4c47] hover:bg-[#1f4c47]/90 text-white gap-2 px-4 rounded-lg flex-1 sm:flex-none"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {filteredEvents.map((event) => (
              <AdminEventCard
                key={event.id}
                {...event}
                onEdit={() => handleEdit(event)}
                onDelete={() => handleDelete(event.id)}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 py-8 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-gray-400 hover:bg-gray-100 h-10 w-10 p-0">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium text-black">Página 1 de 1</span>
            <Button variant="ghost" className="text-destructive hover:bg-red-50 h-10 w-10 p-0">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchData}
          event={selectedEvent}
        />
      )}
    </div>
  );
}
