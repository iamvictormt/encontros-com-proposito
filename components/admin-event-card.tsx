import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface AdminEventCardProps {
  id: number;
  image: string;
  status: 'Ativo' | 'Offline';
  tags: string[];
  title: string;
  date: string;
  location: string;
}

export function AdminEventCard({ image, status, tags, title, date, location }: AdminEventCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-sm bg-white">
      <div className="relative h-48">
        <Image src={image} alt={title} fill className="object-cover" />
        <Badge
          className="absolute top-3 left-3 bg-white text-black hover:bg-white"
          variant="secondary"
        >
          {status}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex gap-2 mb-3">
          {tags.map((tag, i) => (
            <Badge key={i} variant="destructive" className="rounded-full px-3 py-1 text-[10px] font-bold uppercase">
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="text-lg font-bold mb-1 text-black">{title}</h3>
        <p className="text-xs text-muted-foreground mb-1">
          <span className="font-bold">Data:</span> {date}
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          <span className="font-bold">Local:</span> <span className="underline">{location}</span>
        </p>
        <Button className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-2">
          Editar
        </Button>
      </CardContent>
    </Card>
  )
}
