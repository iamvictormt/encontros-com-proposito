"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { StatCard } from "@/components/admin-stats";
import { ProductModal } from "@/components/modals/product-modal";
import { toast } from "sonner";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir produto?")) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Produto excluído");
        fetchData();
      }
    } catch (error) {
      toast.error("Erro ao excluir");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-black mb-6">Estatísticas Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-bold text-black">Loja & Produtos</h2>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
              <Input
                placeholder="Procurar"
                className="pl-10 h-10 bg-white border-gray-200 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button
              variant="outline"
              className="h-10 border-gray-200 bg-white text-gray-600 gap-2"
            >
              <Filter className="h-4 w-4 text-black" />
              <span>Filtro</span>
            </Button>

            <Button 
              onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
              className="h-10 bg-[#1f4c47] hover:bg-[#1f4c47]/90 text-white gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Produto</span>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
        ) : (
          <div className="space-y-4">
            {/* Cards for Mobile */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
              {filteredProducts.map((product, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-black">{product.name}</p>
                      <p className="text-sm text-secondary font-bold">R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(product)} size="sm" className="bg-[#f18d42] hover:bg-[#e07d32] text-white flex-1">Editar</Button>
                    <Button onClick={() => handleDelete(product.id)} size="sm" className="bg-[#8a0204] hover:bg-[#7a0204] text-white flex-1">Deletar</Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Table for Desktop */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-sm text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">Produto</th>
                    <th className="px-6 py-4 font-medium">Tipo</th>
                    <th className="px-6 py-4 font-medium">Categoria</th>
                    <th className="px-6 py-4 font-medium">Preço</th>
                    <th className="px-6 py-4 font-medium">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product, i) => (
                    <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-black">{product.name}</p>
                            <p className="text-sm text-muted-foreground">Estoque: {product.stock}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-black">{product.type}</td>
                      <td className="px-6 py-4 text-sm text-black">{product.category}</td>
                      <td className="px-6 py-4 text-sm text-black font-bold">R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button onClick={() => handleEdit(product)} size="sm" className="bg-[#f18d42] hover:bg-[#e07d32] text-white">Editar</Button>
                          <Button onClick={() => handleDelete(product.id)} size="sm" className="bg-[#8a0204] hover:bg-[#7a0204] text-white">Deletar</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {isModalOpen && (
        <ProductModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchData}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
