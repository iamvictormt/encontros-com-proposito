import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface VenueApprovalCardProps {
  name: string;
  location: string;
  type: string;
  image: string;
}

export function VenueApprovalCard({ name, location, type, image }: VenueApprovalCardProps) {
  return (
    <Card className="flex items-center gap-4 p-4 border-none shadow-sm bg-white">
      <div className="relative w-24 h-24 flex-shrink-0">
        <Image src={image} alt={name} fill className="object-cover rounded-lg" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-secondary">{name}</h4>
        <p className="text-sm text-muted-foreground"><span className="font-bold">Local:</span> {location}</p>
        <p className="text-sm text-muted-foreground"><span className="font-bold">Tipo:</span> {type}</p>
        <div className="flex gap-2 mt-2">
          <Button size="sm" className="bg-[#1f4c47] hover:bg-[#1a3d39] text-white">Aprovar</Button>
          <Button size="sm" variant="destructive" className="bg-[#8a0204] hover:bg-[#7a0204] text-white">Recusar</Button>
        </div>
      </div>
    </Card>
  )
}
