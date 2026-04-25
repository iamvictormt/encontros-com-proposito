"use client";

import { useEffect, useState } from "react";
import { VenueApprovalCard } from "@/components/venue-approval-card";
import { Search, Filter, ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/admin-stats";
import { VenueModal } from "@/components/modals/venue-modal";
import { toast } from "sonner";

export default function AdminVenues() {
  const [venues, setVenues] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleEdit = (venue: any) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este local?")) return;
    try {
      const res = await fetch(`/api/venues?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Local excluído");
        fetchData();
      }
    } catch (error) {
      toast.error("Erro ao excluir");
    }
  };

  const filteredVenues = venues.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              <Button
                variant="outline"
                className="h-10 border-gray-200 bg-white text-gray-600 gap-2 flex-1 sm:w-auto"
              >
                <Filter className="h-4 w-4 text-black" />
                <span className="hidden sm:inline">Filtro</span>
              </Button>
              <Button 
                onClick={() => { setSelectedVenue(null); setIsModalOpen(true); }}
                className="h-10 bg-[#1f4c47] hover:bg-[#1f4c47]/90 text-white gap-2 flex-1"
              >
                <Plus className="h-4 w-4" />
                <span>Novo</span>
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVenues.map((venue, idx) => (
              <VenueApprovalCard 
                key={idx} 
                {...venue} 
                isPageLocalEmpresas={true} 
                onEdit={() => handleEdit(venue)}
                onDelete={() => handleDelete(venue.id)}
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
        <VenueModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchData}
          venue={selectedVenue}
        />
      )}
    </div>
  );
}
