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
    <Card className="group overflow-hidden border-none shadow-lg bg-white rounded-[2rem] py-0 gap-0 transition-all hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge
          className={`absolute top-4 left-4 bg-white/90 backdrop-blur-sm ${status === "Ativo" ? "text-primary" : "text-destructive"} hover:bg-white font-black uppercase italic border-none px-4 py-2 text-[11px] shadow-sm`}
          variant="outline"
        >
          {status}
        </Badge>
      </div>
      <CardContent className="p-8 relative -mt-8 bg-white rounded-t-[2rem]">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <Badge
              key={i}
              className="bg-accent hover:bg-accent text-white rounded-full px-4 py-1 text-[10px] font-black uppercase italic border-none tracking-wider"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="text-2xl font-black uppercase italic mb-3 text-black leading-tight">
          {title}
        </h3>
        <div className="space-y-1 mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
            Data: <span className="text-black">{formatDate(date)}</span>
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
            Local: <span className="text-primary underline cursor-pointer">{location}</span>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              onClick={onEdit}
              variant="default"
              className="flex-1 font-black uppercase italic py-7 rounded-2xl text-sm"
            >
              Editar Evento
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
