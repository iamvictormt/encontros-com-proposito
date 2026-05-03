import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
interface AdminEventCardProps {
  id: string;
  image: string;
  status: "Ativo" | "Offline";
  tags: string[];
  title: string;
  date: string;
  location: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
}

export function AdminEventCard({
  image,
  status,
  tags,
  title,
  date,
  location,
  onEdit,
  onDelete,
  onViewDetails,
}: AdminEventCardProps) {
  return (
    <div className="group premium-card flex flex-col bg-white/40 backdrop-blur-sm rounded-[2rem] overflow-hidden border border-brand-green/5">
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="absolute top-4 left-4 z-10">
          <span className={cn(
            "glass px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg",
            status === "Ativo" ? "text-brand-green" : "text-brand-red"
          )}>
            {status}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="bg-brand-green/10 text-brand-green px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-lg font-black text-brand-black mb-4 uppercase tracking-tight line-clamp-1 group-hover:text-brand-orange transition-colors">
          {title}
        </h3>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-black/40 uppercase tracking-wider">
            <span className="text-brand-red">●</span>
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-black/40 uppercase tracking-wider">
            <span className="text-brand-orange">●</span>
            <span className="line-clamp-1 underline decoration-brand-orange/30">{location}</span>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <Button
            onClick={onEdit}
            className="flex-1 bg-brand-black hover:bg-brand-black/80 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl shadow-lg shadow-brand-black/20"
          >
            Editar Evento
          </Button>
        </div>
      </div>
    </div>
  );
}
