"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Plus, Loader2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
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
    <div className="space-y-12 pb-20">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1 w-8 bg-brand-orange rounded-full" />
          <span className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.3em]">
            Administração
          </span>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-brand-black lg:text-5xl">
          Gestão de <span className="text-brand-red">Produtos</span>
        </h1>
      </header>

      <section className="glass rounded-[2rem] p-8 lg:p-10 border-brand-green/5">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-6 bg-brand-green rounded-full" />
          <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
            Estatísticas Rápidas
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                Inventário
              </h2>
            </div>
            <p className="text-2xl font-black text-brand-black uppercase tracking-tight mt-2">
              Loja & Produtos
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green" />
              <Input
                placeholder="Procurar produtos..."
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
                onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
                className="h-12 bg-brand-red hover:bg-brand-red/90 text-white font-bold text-xs px-8 rounded-xl shadow-lg shadow-brand-red/20 flex-1 sm:flex-none gap-3"
              >
                <Plus className="h-4 w-4" />
                <span className="whitespace-nowrap">Novo Produto</span>
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-red w-12 h-12" /></div>
        ) : (
          <div className="space-y-12">
            {/* Cards for Mobile */}
            <div className="grid grid-cols-1 gap-6 lg:hidden">
              {paginatedProducts.map((product, i) => (
                <div key={i} className="bg-white/40 backdrop-blur-sm rounded-[2rem] border border-brand-green/5 p-6 space-y-6 premium-card">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-brand-green/5 flex-shrink-0 border border-brand-green/5">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-black text-brand-black uppercase tracking-tight">{product.name}</p>
                      <p className="text-sm text-brand-green font-black uppercase tracking-widest mt-1">{formatBRL(product.price)}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleEdit(product)} 
                      className="bg-brand-black hover:bg-brand-black/80 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl flex-1 shadow-lg shadow-brand-black/20"
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleDelete(product.id)} 
                      className="border-brand-red/20 text-brand-red hover:bg-brand-red hover:text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl flex-1"
                    >
                      Deletar
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Table for Desktop */}
            <div className="hidden lg:block bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-brand-green/5 overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead className="bg-brand-green/5 text-[10px] font-black text-brand-black/40 uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-6 font-black h-16">Produto</th>
                    <th className="px-6 py-6 font-black h-16">Tipo</th>
                    <th className="px-6 py-6 font-black h-16">Categoria</th>
                    <th className="px-6 py-6 font-black h-16">Tema</th>
                    <th className="px-6 py-6 font-black h-16">Preço</th>
                    <th className="px-8 py-6 font-black h-16 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-green/5">
                  {paginatedProducts.map((product, i) => (
                    <tr key={i} className="group hover:bg-brand-green/5 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-brand-green/5 flex-shrink-0 border border-brand-green/5">
                            <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                          </div>
                          <div>
                            <p className="font-black text-brand-black uppercase tracking-tight">{product.name}</p>
                            <p className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest">Estoque: {product.stock}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-[10px] font-black text-brand-black/60 uppercase tracking-widest px-3 py-1 rounded-full glass">{product.type}</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-[10px] font-black text-brand-black/60 uppercase tracking-widest">{product.category}</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-[10px] font-black text-brand-black/60 uppercase tracking-widest">{product.theme || "-"}</span>
                      </td>
                      <td className="px-6 py-6 text-sm font-black text-brand-green uppercase tracking-tight">{formatBRL(product.price)}</td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-3">
                          <Button 
                            onClick={() => handleEdit(product)} 
                            className="bg-brand-black hover:bg-brand-black/80 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-lg shadow-brand-black/20"
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleDelete(product.id)} 
                            className="border-brand-red/20 text-brand-red hover:bg-brand-red hover:text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl"
                          >
                            Deletar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
