import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatDate } from "@/lib/utils/format";

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
    <Card className="overflow-hidden border border-gray-100 shadow-2xl bg-white rounded-[2.5rem] py-0 gap-0 group">
      <div className="relative h-56 overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute top-4 left-4">
          <Badge
            className={`bg-white/90 backdrop-blur-md ${status === "Ativo" ? "text-primary" : "text-secondary"} font-black uppercase italic border-none px-4 py-2 text-[10px] tracking-widest shadow-lg`}
            variant="outline"
          >
            {status}
          </Badge>
        </div>
      </div>
      <CardContent className="p-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="bg-gray-100 text-gray-500 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-2xl font-black mb-4 text-black uppercase italic tracking-tighter leading-none line-clamp-2">{title}</h3>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Quando</span>
            <span className="text-xs font-bold text-black">{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Onde</span>
            <span className="text-xs font-bold text-primary italic uppercase">{location}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <Button
              onClick={onEdit}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-black uppercase italic py-6 rounded-full text-xs tracking-widest shadow-lg"
            >
              Editar
            </Button>
            {/* <Button
              onClick={onDelete}
              variant="destructive"
              className="bg-[#8a0204] hover:bg-[#7a0204] text-white font-bold py-6 rounded-xl text-base"
            >
              Excluir
            </Button> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
