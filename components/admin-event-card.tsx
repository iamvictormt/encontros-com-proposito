import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface AdminEventCardProps {
  id: number;
  image: string;
  status: "Ativo" | "Offline";
  tags: string[];
  title: string;
  date: string;
  location: string;
}

export function AdminEventCard({
  image,
  status,
  tags,
  title,
  date,
  location,
}: AdminEventCardProps) {
  return (
    <Card className="overflow-hidden border border-gray-100 shadow-sm bg-white rounded-2xl py-0 gap-4">
      <div className="relative h-48">
        <Image src={image} alt={title} fill className="object-cover" />
        <Badge
          className={`absolute top-3 left-3 bg-white ${status === "Ativo" ? "text-secondary" : "text-destructive "} hover:bg-white font-bold border-none p-3 text-[13px]`}
          variant="outline"
        >
          {status}
        </Badge>
      </div>
      <CardContent className="pb-5">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <Badge
              key={i}
              className="bg-primary hover:bg-primary text-white rounded-full px-3 py-1 text-[12px] border-none"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="text-xl font-bold mb-2 text-black">{title}</h3>
        <p className="text-sm text-muted-foreground mb-1">
          <span>Data:</span> <span className="font-bold text-black">{date}</span>
        </p>
        <p className="text-sm text-muted-foreground mb-5">
          <span>Local:</span>{" "}
          <span className="underline font-bold text-secondary cursor-pointer">{location}</span>
        </p>
        <Button className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-6 rounded-xl text-base">
          Editar
        </Button>
      </CardContent>
    </Card>
  );
}
