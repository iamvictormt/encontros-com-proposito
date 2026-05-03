import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatDate } from "@/lib/utils/format";
import { MapPin, Calendar, Clock, Edit3, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AdminEventCardProps {
  id: string;
  image: string;
  status: "Ativo" | "Offline";
  tags: string[];
  title: string;
  date: string;
  time?: string;
  location: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
}

export function AdminEventCard({
  id,
  image,
  status,
  tags,
  title,
  date,
  time,
  location,
  onEdit,
  onDelete,
  onViewDetails,
}: AdminEventCardProps) {
  return (
    <Card className="group premium-card flex flex-col bg-white rounded-[2rem] overflow-hidden border-none shadow-sm">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="absolute left-6 top-6 z-10">
          <span className={cn(
            "glass px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg",
            status === "Ativo" ? "text-brand-green" : "text-brand-red"
          )}>
            {status}
          </span>
        </div>

        <div className="absolute right-6 top-6 flex flex-col gap-3 z-10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <button 
            onClick={onViewDetails}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-xl hover:bg-brand-orange hover:text-white transition-colors cursor-pointer text-brand-black"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button 
            onClick={onEdit}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-xl hover:bg-brand-green hover:text-white transition-colors cursor-pointer text-brand-black"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button 
            onClick={onDelete}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-xl hover:bg-brand-red hover:text-white transition-colors cursor-pointer text-brand-black"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <CardContent className="p-8 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-black/40 bg-brand-black/5 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-black text-brand-black leading-tight line-clamp-2 uppercase tracking-tight group-hover:text-brand-orange transition-colors mb-6">
          {title}
        </h3>

        <div className="space-y-3 mt-auto">
          <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <Calendar className="h-3.5 w-3.5 text-brand-red" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <MapPin className="h-3.5 w-3.5 text-brand-red" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-brand-green/5">
          <Button
            onClick={onEdit}
            className="w-full bg-brand-black hover:bg-brand-black/80 text-white font-black uppercase tracking-widest text-[10px] px-8 h-14 rounded-2xl shadow-lg shadow-brand-black/20"
          >
            Configurar Evento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
