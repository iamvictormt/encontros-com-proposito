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
    <div className="space-y-6 bg-white p-4 rounded-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h2 className="text-xl font-bold text-black">Conteúdo das marcas</h2>
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            <Input
              className="pl-10 h-10 bg-white border-gray-200 rounded-lg w-full"
              placeholder="Procurar"
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
            {/* <Button 
              onClick={() => { setSelectedBrand(null); setIsModalOpen(true); }}
              className="h-10 bg-secondary hover:bg-secondary/90 text-white gap-2 flex-1"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Marca</span>
            </Button> */}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
      ) : (
        <div className="space-y-4">
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
