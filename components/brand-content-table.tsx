import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatDate } from "@/lib/utils/format";
import { Globe, Instagram, Edit3, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandContentProps {
  id?: string;
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      {brands.map((brand, i) => (
        <div
          key={i}
          className="group premium-card bg-white rounded-[2rem] border-none shadow-sm p-6 flex flex-col"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-2xl shadow-md border border-brand-green/5">
              <Image
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-black text-brand-black text-lg uppercase tracking-tighter leading-none mb-1 group-hover:text-brand-orange transition-colors">
                {brand.name}
              </h4>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest",
                brand.status === "Ativo" ? "text-brand-green" : "text-brand-red"
              )}>
                {brand.status}
              </span>
            </div>
          </div>

          <div className="space-y-3 mb-8 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-black/5 flex items-center justify-center text-brand-black/40">
                <Globe size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-black uppercase tracking-widest text-brand-black/30 leading-none mb-0.5">Website</p>
                {brand.website_url ? (
                  <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-brand-black hover:text-brand-orange truncate block">
                    {brand.website_url.replace(/^https?:\/\//, '')}
                  </a>
                ) : (
                  <p className="text-[10px] font-bold text-brand-black/20 italic">Não informado</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-black/5 flex items-center justify-center text-brand-black/40">
                <Instagram size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-black uppercase tracking-widest text-brand-black/30 leading-none mb-0.5">Instagram</p>
                {brand.instagram_url ? (
                  <a href={`https://instagram.com/${brand.instagram_url.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-brand-black hover:text-brand-orange truncate block">
                    {brand.instagram_url}
                  </a>
                ) : (
                  <p className="text-[10px] font-bold text-brand-black/20 italic">Não informado</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-brand-green/5 flex gap-2">
            <Button 
              onClick={() => onEdit?.(brand)} 
              className="flex-1 h-12 bg-brand-black hover:bg-brand-black/80 text-white font-black uppercase tracking-widest text-[9px] rounded-xl transition-all"
            >
              <Edit3 size={12} className="mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={() => brand.id && onDelete?.(brand.id)}
              className="w-12 h-12 border-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white rounded-xl transition-all flex items-center justify-center p-0"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
