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
  logo: string;
  name: string;
  website_url?: string;
  instagram_url?: string;
  description?: string;
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
                <div className="flex flex-col gap-1 mt-1">
                  {brand.website_url && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground uppercase">Site:</span>
                      <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline truncate max-w-[150px]">
                        {brand.website_url.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  {brand.instagram_url && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground uppercase">Insta:</span>
                      <a href={`https://instagram.com/${brand.instagram_url.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline truncate max-w-[150px]">
                        {brand.instagram_url}
                      </a>
                    </div>
                  )}
                  {!brand.website_url && !brand.instagram_url && (
                    <span className="text-xs text-muted-foreground italic">Sem contatos</span>
                  )}
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
                Contatos
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
                  <div className="flex flex-col gap-1">
                    {brand.website_url && (
                      <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate max-w-[200px] block">
                        🌐 {brand.website_url.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                    {brand.instagram_url && (
                      <a href={`https://instagram.com/${brand.instagram_url.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate max-w-[200px] block">
                        📸 {brand.instagram_url}
                      </a>
                    )}
                    {!brand.website_url && !brand.instagram_url && (
                      <span className="text-xs text-muted-foreground italic">Nenhum</span>
                    )}
                  </div>
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
