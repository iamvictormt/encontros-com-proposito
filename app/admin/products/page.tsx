import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, Edit2, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function AdminProducts() {
  const stats = [
    { label: "Produtos ativos", value: "12" },
    { label: "Produtos Digitais", value: "5" },
    { label: "Protudos Físicos", value: "37" },
    { label: "Itens sem estoque", value: "7" },
  ]

  const products = [
    {
      name: "Camiseta \"Desligue o App\"",
      stock: "15 Disponíveis",
      type: "Físico",
      category: "Vestuário",
      price: "R$ 125,50",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=60"
    },
    {
      name: "Kit \"Mimo Meu e Seu\"",
      stock: "15 Disponíveis",
      type: "Físico",
      category: "Presentes",
      price: "R$ 125,50",
      image: "https://images.unsplash.com/photo-1549465220-1d8c9d9c47db?w=800&auto=format&fit=crop&q=60"
    },
    {
      name: "Lenço Simbólico Categoria Fé",
      stock: "15 Disponíveis",
      type: "Físico",
      category: "Acessórios",
      price: "R$ 125,50",
      image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&auto=format&fit=crop&q=60"
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-secondary uppercase tracking-tight">Estatísticas Rápidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-gray-50/50">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <h3 className="text-4xl font-bold text-secondary">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4">
        <h2 className="text-xl font-bold text-secondary uppercase tracking-tight">Loja & Produtos</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10 w-64 bg-white border-none shadow-sm" placeholder="Procurar" />
          </div>
          <Button variant="outline" className="bg-white border-none shadow-sm flex gap-2">
            <Filter className="w-4 h-4" />
            Filtro: Mais recente
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border-none">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-sm font-bold text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-4">Produto</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Preço</th>
              <th className="px-6 py-4">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product, i) => (
              <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-secondary">{product.name}</p>
                      <p className="text-xs text-muted-foreground font-bold">Estoque: {product.stock}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-secondary font-bold">{product.type}</td>
                <td className="px-6 py-4 text-sm text-secondary font-bold">{product.category}</td>
                <td className="px-6 py-4 text-sm text-secondary font-bold">{product.price}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-[#f18d42] hover:bg-[#e07d32] text-white">Editar</Button>
                    <Button size="sm" className="bg-[#8a0204] hover:bg-[#7a0204] text-white">Deletar</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
