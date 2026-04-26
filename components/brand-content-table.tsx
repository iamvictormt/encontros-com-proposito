import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { formatBRL, formatDate, formatDateHour } from "@/lib/utils/format";

interface BrandContentProps {
  id?: string;
  logo: string;
  name: string;
  page: string;
  updated_at: string;
  status: string;
}

export function BrandContentTable({ 
  brands = [], 
  onView,
  onEdit, 
  onDelete 
}: { 
  brands?: BrandContentProps[],
  onView?: (brand: any) => void,
  onEdit?: (brand: any) => void,
  onDelete?: (id: string) => void
}) {
  return (
    <div className="space-y-4">
      {/* View de Cards para Mobile */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {brands.map((brand, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-black">{brand.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">Página:</span>
                  <span className="text-xs font-medium text-black">{brand.page}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-50">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  Status
                </p>
                <p className="text-xs font-bold text-secondary">{brand.status}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  Última Atualização
                </p>
                <p className="text-xs font-medium text-black">{formatDate(brand.updated_at)}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => onEdit?.(brand)} size="sm" className="bg-accent hover:bg-accent/90 text-white flex-1">
                Editar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => brand.id && onDelete?.(brand.id)}
                className="bg-[#8a0204] hover:bg-[#7a0204] text-white flex-1"
              >
                Deletar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* View de Tabela para Desktop */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="text-muted-foreground whitespace-nowrap">Marca</TableHead>
              <TableHead className="text-muted-foreground whitespace-nowrap">
                Página/Seção
              </TableHead>
              <TableHead className="text-muted-foreground whitespace-nowrap">Atualização</TableHead>
              <TableHead className="text-muted-foreground whitespace-nowrap">Status</TableHead>
              <TableHead className="text-center text-muted-foreground whitespace-nowrap">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-sm text-black">
                  {brand.page || "N/A"}
                </TableCell>
                <TableCell className="text-sm text-black">
                  {formatDateHour(brand.updated_at)}
                </TableCell>
                <TableCell className="text-sm text-secondary font-medium">{brand.status}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-center gap-2">
                    <Button onClick={() => onEdit?.(brand)} size="sm" className="bg-accent hover:bg-accent/90 text-white">
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => brand.id && onDelete?.(brand.id)}
                      className="bg-[#8a0204] hover:bg-[#7a0204] text-white"
                    >
                      Deletar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
