"use client";

import { useEffect, useState } from "react";
import { BrandContentTable } from "@/components/brand-content-table";
import { Search, Filter, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BrandModal } from "@/components/modals/brand-modal";
import { toast } from "sonner";

export default function AdminBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleEdit = (brand: any) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir marca?")) return;
    try {
      const res = await fetch(`/api/brands?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Marca excluída");
        fetchData();
      }
    } catch (error) {
      toast.error("Erro ao excluir");
    }
  };

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="space-y-6">
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
            <Button
              variant="outline"
              className="h-10 border-gray-200 bg-white text-gray-600 gap-2 flex-1 sm:w-auto"
            >
              <Filter className="h-4 w-4 text-black" />
              <span>Filtro</span>
            </Button>
            <Button 
              onClick={() => { setSelectedBrand(null); setIsModalOpen(true); }}
              className="h-10 bg-[#1f4c47] hover:bg-[#1f4c47]/90 text-white gap-2 flex-1"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Marca</span>
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
      ) : (
        <BrandContentTable 
          brands={filteredBrands} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {isModalOpen && (
        <BrandModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchData}
          brand={selectedBrand}
        />
      )}
    </section>
  );
}
