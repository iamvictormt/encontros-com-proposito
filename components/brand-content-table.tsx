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
import { cn } from "@/lib/utils";
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
    <div className="space-y-6">
      {/* View de Cards para Mobile */}
      <div className="grid grid-cols-1 gap-6 lg:hidden">
        {brands.map((brand, i) => (
          <div
            key={i}
            className="bg-white/40 backdrop-blur-sm rounded-[2rem] border border-brand-green/5 p-6 space-y-6 premium-card"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden rounded-2xl">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-black text-brand-black uppercase tracking-tight">{brand.name}</p>
                <div className="flex flex-col gap-1 mt-1">
                  {brand.website_url && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-black text-brand-black/30 uppercase tracking-widest">Site:</span>
                      <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-brand-green hover:text-brand-orange truncate max-w-[150px] uppercase tracking-wider">
                        {brand.website_url.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  {brand.instagram_url && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-black text-brand-black/30 uppercase tracking-widest">Insta:</span>
                      <a href={`https://instagram.com/${brand.instagram_url.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-brand-green hover:text-brand-orange truncate max-w-[150px] uppercase tracking-wider">
                        {brand.instagram_url}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-brand-green/5">
              <div>
                <p className="text-[10px] font-black text-brand-black/30 uppercase tracking-widest mb-1">
                  Status
                </p>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full glass",
                  brand.status === "Ativo" ? "text-brand-green" : "text-brand-red"
                )}>
                  {brand.status}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-black text-brand-black/30 uppercase tracking-widest mb-1">
                  Atualização
                </p>
                <p className="text-[11px] font-black text-brand-black/60 uppercase tracking-wider">{formatDate(brand.updated_at)}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => onEdit?.(brand)} 
                className="bg-brand-black hover:bg-brand-black/80 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl flex-1 shadow-lg shadow-brand-black/20"
              >
                Editar
              </Button>
              <Button
                variant="outline"
                onClick={() => brand.id && onDelete?.(brand.id)}
                className="border-brand-red/20 text-brand-red hover:bg-brand-red hover:text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl flex-1"
              >
                Deletar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* View de Tabela para Desktop */}
      <div className="hidden lg:block bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-brand-green/5 overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-brand-green/5">
            <TableRow className="hover:bg-transparent border-brand-green/5">
              <TableHead className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.2em] h-16 px-8">Marca</TableHead>
              <TableHead className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.2em] h-16">Contatos</TableHead>
              <TableHead className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.2em] h-16">Atualização</TableHead>
              <TableHead className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.2em] h-16">Status</TableHead>
              <TableHead className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.2em] h-16 text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand, i) => (
              <TableRow key={i} className="hover:bg-brand-green/5 border-brand-green/5 transition-colors group">
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 overflow-hidden rounded-xl border border-brand-green/5">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <span className="text-sm font-black text-brand-black uppercase tracking-tight">{brand.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {brand.website_url && (
                      <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-brand-green hover:text-brand-orange uppercase tracking-wider transition-colors">
                        🌐 {brand.website_url.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                    {brand.instagram_url && (
                      <a href={`https://instagram.com/${brand.instagram_url.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-brand-green hover:text-brand-orange uppercase tracking-wider transition-colors">
                        📸 {brand.instagram_url}
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[10px] font-black text-brand-black/60 uppercase tracking-widest">
                    {formatDateHour(brand.updated_at)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl glass",
                    brand.status === "Ativo" ? "text-brand-green" : "text-brand-red"
                  )}>
                    {brand.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-3">
                    <Button 
                      onClick={() => onEdit?.(brand)} 
                      className="bg-brand-black hover:bg-brand-black/80 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-lg shadow-brand-black/20"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => brand.id && onDelete?.(brand.id)}
                      className="border-brand-red/20 text-brand-red hover:bg-brand-red hover:text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl"
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
