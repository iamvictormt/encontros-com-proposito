import { BrandContentTable } from "@/components/brand-content-table";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminBrands() {
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
            />
          </div>
          <Button
            variant="outline"
            className="h-10 border-gray-200 bg-white text-gray-600 gap-2 w-full sm:w-auto"
          >
            <Filter className="h-4 w-4 text-black" />
            <span className="hidden sm:inline">
              Filtro: <span className="text-black font-medium">Mais recente</span>
            </span>
            <span className="sm:hidden font-medium text-black">Filtro</span>
          </Button>
        </div>
      </div>

      <BrandContentTable />
    </section>
  );
}
