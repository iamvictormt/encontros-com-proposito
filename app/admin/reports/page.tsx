import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function AdminReports() {
  const stats = [
    { label: "Total de Vendas", value: "R$ 45.058", trend: "+12%", up: true },
    { label: "Eventos Criados", value: "28", trend: "+5%", up: true },
    { label: "Convites Aceitos", value: "342", trend: "-2%", up: false },
    { label: "Agendamentos", value: "120", trend: "+18%", up: true },
  ]

  const topProducts = [
    { name: "Camiseta \"Desligue o App\"", stock: "15 Disponíveis", profit: "289,00", units: "120 unidades", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=60" },
    { name: "Camiseta \"Desligue o App\"", stock: "15 Disponíveis", profit: "289,00", units: "120 unidades", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=60" },
    { name: "Camiseta \"Desligue o App\"", stock: "15 Disponíveis", profit: "289,00", units: "120 unidades", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=60" },
  ]

  return (
    <div className="space-y-6 pb-10">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-secondary">Lucro de vendas</h3>
                <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">i</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-8 h-0.5 bg-gray-400"></div>
                  Meses anteriores
                </div>
                <Button variant="outline" size="sm" className="bg-white border text-xs flex gap-2">
                  <span className="w-4 h-4 rounded-sm border border-secondary bg-transparent"></span>
                  Junho 2024
                </Button>
                <Button variant="ghost" size="sm" className="p-1">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            <div className="relative h-[250px] w-full flex items-end gap-1">
              {/* Simplified mock chart representation using divs */}
              {[...Array(20)].map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                   <div className="w-full bg-[#1f4c47]/10 rounded-t-sm h-[40%] group-hover:bg-[#1f4c47]/20 transition-colors"></div>
                   <div className="w-full bg-[#8a0204]/10 rounded-t-sm h-[60%] group-hover:bg-[#8a0204]/20 transition-colors -mt-4"></div>
                </div>
              ))}
              {/* Overlay for specific point in screenshot */}
              <div className="absolute left-[40%] top-[30%] bg-white p-2 rounded-lg shadow-lg border border-gray-100 z-10">
                <p className="text-[10px] text-muted-foreground">Esse mês</p>
                <p className="text-sm font-bold text-secondary">R$220</p>
                <p className="text-[10px] text-muted-foreground">Junho</p>
              </div>
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-muted-foreground px-2">
              <span>Jun 5</span>
              <span>Jun 6</span>
              <span>Jun 7</span>
              <span>Jun 8</span>
              <span>Jun 89</span>
              <span>Jun 9</span>
              <span>Jun 10</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white flex flex-col">
          <CardContent className="p-6 flex flex-col h-full">
            <h3 className="font-bold text-secondary">Satisfação de Clientes</h3>
            <p className="text-xs text-muted-foreground mb-10">porcentagem de satisfação</p>

            <div className="flex-1 flex flex-col items-center justify-center relative">
               <div className="relative w-48 h-24 overflow-hidden">
                  <div className="absolute top-0 left-0 w-48 h-48 border-[16px] border-[#f18d42]/20 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-48 h-48 border-[16px] border-[#f18d42] rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-xl">😊</span>
                  </div>
               </div>
               <div className="text-center mt-6">
                  <h4 className="text-3xl font-bold text-secondary">95%</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">Baseado em avaliações positivas</p>
               </div>
            </div>

            <div className="flex justify-between text-[10px] text-muted-foreground mt-auto pt-4 border-t border-gray-50">
              <span>0%</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-6">
          <h3 className="font-bold text-secondary mb-6">Produtos mais vendidos</h3>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center gap-6 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm flex-shrink-0">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-secondary truncate">{product.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">Estoque: {product.stock}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Lucro: {product.profit}</p>
                </div>
                <div className="w-48 hidden md:block">
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>{product.units}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1f4c47] rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-6">
          <h3 className="font-bold text-secondary mb-8">Convites por origem</h3>
          <div className="space-y-10">
            {[
              { label: "Anfitriões:", value: "80 Convites Aceitos" },
              { label: "Cupidos", value: "80 Convites Aceitos" },
              { label: "Outros", value: "80 Convites Aceitos" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-8">
                <span className="w-24 text-sm font-bold text-[#1f4c47]">{item.label}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden relative">
                   <div className="absolute top-0 left-0 h-full bg-[#1f4c47]" style={{ width: '40%' }}></div>
                   <div className="absolute -top-6 left-[30%] text-[10px] text-muted-foreground border-b border-gray-400 pb-0.5">150 Convites</div>
                </div>
                <span className="text-sm text-secondary">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
