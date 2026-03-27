import { BrandContentTable } from "@/components/brand-content-table"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminBrands() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-secondary uppercase tracking-tight">Conteúdo das Marcas</h2>
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

      <BrandContentTable />
    </div>
  )
}
