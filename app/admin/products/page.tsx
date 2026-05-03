"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Plus, Loader2, ChevronLeft, ChevronRight, Eye, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { StatCard } from "@/components/admin-stats";
import { ProductModal } from "@/components/modals/product-modal";
import { toast } from "sonner";
import { formatBRL } from "@/lib/utils/format";
import { AdminPagination } from "@/components/admin-pagination";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
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
      const [productsRes, reportsRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/admin/reports")
      ]);
      const productsData = await productsRes.json();
      const reportsData = await reportsRes.json();
      
      setProducts(productsData);
      setStats([
        { label: "Produtos ativos", value: productsData.length.toString() },
        { label: "Produtos Digitais", value: productsData.filter((p:any) => p.type === 'Digital').length.toString() },
        { label: "Produtos Físicos", value: productsData.filter((p:any) => p.type === 'Físico').length.toString() },
        { label: "Itens sem estoque", value: productsData.filter((p:any) => p.stock === 0).length.toString() },
      ]);
    } catch (error) {
      toast.error("Erro ao carregar produtos");
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

  const handleView = (product: any) => {
    setSelectedProduct(product);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Excluir Produto",
      description: "Tem certeza que deseja excluir permanentemente este produto? Esta ação não pode ser desfeita.",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
          if (res.ok) {
            toast.success("Produto excluído");
            fetchData();
          }
        } catch (error) {
          toast.error("Erro ao excluir");
        }
      }
    });
  };

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      // Fallback: use id if created_at is missing
      const dateA = a.created_at ? new Date(a.created_at).getTime() : Number(a.id) || 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : Number(b.id) || 0;
      return filterType === "recent" ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-16">
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-8 bg-brand-orange rounded-full" />
          <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
            Status da Loja
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </section>

      <section className="space-y-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="space-y-2">
            <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Gestão Comercial
            </span>
            <h2 className="text-4xl font-black text-brand-black tracking-tighter uppercase mt-4">
              Loja & <span className="text-brand-red">Produtos</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-green" />
              <Input
                placeholder="Buscar produtos..."
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
                      {filterType === "recent" ? "Recentes" : "Antigos"}
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
                onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
                className="h-14 px-8 bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-brand-green/20 flex-1 sm:flex-none gap-3"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Produto</span>
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24 grayscale opacity-30"><Loader2 className="animate-spin text-brand-black w-12 h-12" /></div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {paginatedProducts.map((product, i) => (
                <div key={i} className="group premium-card bg-white rounded-[2rem] border-none shadow-sm overflow-hidden flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <Image 
                      src={product.image || "/placeholder.svg"} 
                      alt={product.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute left-6 top-6 z-10">
                      <span className="glass px-4 py-2 rounded-xl text-[10px] font-black text-brand-black uppercase tracking-widest shadow-lg">
                        {product.type}
                      </span>
                    </div>

                    <div className="absolute right-6 top-6 flex flex-col gap-3 z-10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      <button 
                        onClick={() => handleView(product)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-xl hover:bg-brand-orange hover:text-white transition-colors cursor-pointer text-brand-black"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="absolute bottom-6 left-6 z-10">
                      <span className="glass-dark px-4 py-2 rounded-xl text-sm font-black text-white shadow-lg">
                        {formatBRL(product.price)}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="mb-6 space-y-2">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-black/40">{product.category}</p>
                      <h3 className="text-xl font-black text-brand-black leading-tight line-clamp-2 uppercase tracking-tight group-hover:text-brand-orange transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Estoque: <span className={cn(product.stock > 0 ? "text-brand-green" : "text-brand-red")}>{product.stock} unidades</span>
                      </p>
                    </div>

                    <div className="mt-auto pt-6 border-t border-brand-green/5 flex gap-2">
                      <Button
                        onClick={() => handleEdit(product)}
                        className="flex-1 bg-brand-black hover:bg-brand-black/80 text-white font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-xl transition-all"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDelete(product.id)}
                        className="w-12 h-12 border-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white rounded-xl transition-all flex items-center justify-center p-0"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {paginatedProducts.length === 0 && (
              <div className="text-center py-24 glass rounded-[2.5rem] border-dashed border-brand-green/20">
                <div className="text-6xl mb-6 grayscale opacity-50">🛍️</div>
                <h3 className="text-2xl font-black text-brand-black mb-2 uppercase tracking-tight">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed px-4 font-medium">
                  Não encontramos itens com esses critérios de busca.
                </p>
              </div>
            )}

            <AdminPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredProducts.length}
              itemsPerPage={itemsPerPage}
              itemName="produtos"
            />
          </div>
        )}
      </section>

      {isModalOpen && (
        <ProductModal 
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setIsViewMode(false); }}
          onSuccess={fetchData}
          product={selectedProduct}
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
