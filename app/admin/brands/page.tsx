"use client";

import { useEffect, useState } from "react";
import { BrandContentTable } from "@/components/brand-content-table";
import { Search, Filter, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BrandModal } from "@/components/modals/brand-modal";
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

export default function AdminBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("recent"); // "recent" | "old"
  const [currentPage, setCurrentPage] = useState(1);
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
      const res = await fetch("/api/brands");
      const data = await res.json();
      setBrands(data);
    } catch (error) {
      toast.error("Erro ao carregar marcas");
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

  const handleView = (brand: any) => {
    setSelectedBrand(brand);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleEdit = (brand: any) => {
    setSelectedBrand(brand);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Excluir Marca",
      description: "Tem certeza que deseja excluir permanentemente esta marca? Esta ação não pode ser desfeita.",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/brands?id=${id}`, { method: "DELETE" });
          if (res.ok) {
            toast.success("Marca excluída");
            fetchData();
          }
        } catch (error) {
          toast.error("Erro ao excluir");
        }
      }
    });
  };

  const filteredBrands = brands
    .filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      // Use updated_at (primary for brands) or created_at
      const timeA = a.updated_at || a.created_at;
      const timeB = b.updated_at || b.created_at;
      const dateA = timeA ? new Date(timeA).getTime() : Number(a.id) || 0;
      const dateB = timeB ? new Date(timeB).getTime() : Number(b.id) || 0;
      return filterType === "recent" ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.max(1, Math.ceil(filteredBrands.length / itemsPerPage));
  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-2">
          <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
            Gestão de Marcas
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-brand-black tracking-tighter uppercase mt-4">
            Marcas <span className="text-brand-orange">Parceiras</span>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-green" />
            <Input
              placeholder="Buscar marcas..."
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
                    {filterType === "recent" ? "Recentes" : "Antigas"}
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
                  Mais Antigas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              onClick={() => { setSelectedBrand(null); setIsModalOpen(true); }}
              className="h-14 px-8 bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-brand-green/20 flex-1 sm:flex-none gap-3"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Marca</span>
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24 grayscale opacity-30"><Loader2 className="animate-spin text-brand-black w-12 h-12" /></div>
      ) : (
        <div className="space-y-12">
          <BrandContentTable 
            brands={paginatedBrands} 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {paginatedBrands.length === 0 && (
            <div className="text-center py-24 glass rounded-[2.5rem] border-dashed border-brand-green/20">
              <div className="text-6xl mb-6 grayscale opacity-50">🏷️</div>
              <h3 className="text-xl sm:text-2xl font-black text-brand-black mb-2 uppercase tracking-tight">
                Nenhuma marca encontrada
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
            totalItems={filteredBrands.length}
            itemsPerPage={itemsPerPage}
            itemName="marcas"
          />
        </div>
      )}

      {isModalOpen && (
        <BrandModal 
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setIsViewMode(false); }}
          onSuccess={fetchData}
          brand={selectedBrand}
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
