import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Edit2, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { StatCard } from "@/components/admin-stats";

export default function AdminProducts() {
  const stats = [
    { label: "Produtos ativos", value: "12" },
    { label: "Produtos Digitais", value: "5" },
    { label: "Protudos Físicos", value: "37" },
    { label: "Itens sem estoque", value: "7" },
  ];

  const products = [
    {
      name: 'Camiseta "Desligue o App"',
      stock: "15 Disponíveis",
      type: "Físico",
      category: "Vestuário",
      price: "R$ 125,50",
      image:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=60",
    },
    {
      name: 'Kit "Mimo Meu e Seu"',
      stock: "15 Disponíveis",
      type: "Físico",
      category: "Presentes",
      price: "R$ 125,50",
      image:
        "https://images.unsplash.com/photo-1549465220-1d8c9d9c47db?w=800&auto=format&fit=crop&q=60",
    },
    {
      name: "Lenço Simbólico Categoria Fé",
      stock: "15 Disponíveis",
      type: "Físico",
      category: "Acessórios",
      price: "R$ 125,50",
      image:
        "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&auto=format&fit=crop&q=60",
    },
  ];

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
              />
            </div>

            <Button variant="outline" className="h-10 border-gray-200 bg-white text-gray-600 gap-2">
              <Filter className="h-4 w-4 text-black" />
              <span>
                Filtro: <span className="text-black font-medium">Mais recente</span>
              </span>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border-none">
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
              {products.map((product, i) => (
                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-black">{product.name}</p>
                        <p className="text-sm text-muted-foreground">Estoque: {product.stock}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-black">{product.type}</td>
                  <td className="px-6 py-4 text-sm text-black">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-black">{product.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-[#f18d42] hover:bg-[#e07d32] text-white">
                        Editar
                      </Button>
                      <Button size="sm" className="bg-[#8a0204] hover:bg-[#7a0204] text-white">
                        Deletar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
