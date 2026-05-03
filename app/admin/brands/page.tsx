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
    <div className="space-y-12 pb-20">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1 w-8 bg-brand-orange rounded-full" />
          <span className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.3em]">
            Administração
          </span>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-brand-black lg:text-5xl">
          Gestão de <span className="text-brand-red">Marcas</span>
        </h1>
      </header>

      <section className="glass rounded-[2rem] p-8 lg:p-10 border-brand-green/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-1 w-6 bg-brand-green rounded-full" />
              <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
                Parceiros
              </h2>
            </div>
            <p className="text-2xl font-black text-brand-black uppercase tracking-tight mt-2">
              Marcas Parceiras
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green" />
              <Input
                placeholder="Procurar marcas..."
                className="pl-12 h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
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
                onClick={() => { setSelectedBrand(null); setIsModalOpen(true); }}
                className="h-12 bg-brand-red hover:bg-brand-red/90 text-white font-bold text-xs px-8 rounded-xl shadow-lg shadow-brand-red/20 flex-1 sm:flex-none gap-3"
              >
                <Plus className="h-4 w-4" />
                <span className="whitespace-nowrap">Nova Marca</span>
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-red w-12 h-12" /></div>
        ) : (
          <div className="space-y-12">
            <BrandContentTable 
              brands={paginatedBrands} 
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

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
      </section>

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
