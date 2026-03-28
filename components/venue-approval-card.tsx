import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface VenueApprovalCardProps {
  name: string;
  location: string;
  type: string;
  image: string;
  isPageLocalEmpresas?: boolean;
}

export function VenueApprovalCard({ name, location, type, image, isPageLocalEmpresas }: VenueApprovalCardProps) {
  return (
    <Card className="relative flex flex-row items-center gap-4 p-4 border-none shadow-sm bg-white w-full">
      {/* BOTÃO TOP RIGHT */}
      {isPageLocalEmpresas && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-3 right-3 text-xs hover:bg-white text-gray-600 hover:text-black"
        >
          Ver detalhes
        </Button>
      )}

      {/* IMAGEM */}
      <div className="relative w-42 h-32 min-w-[96px]">
        <Image src={image} alt={name} fill className="object-cover rounded-lg" />
      </div>

      {/* TEXTO */}
      <div className="flex flex-col justify-center flex-1 pr-20">
        <h4 className="font-bold text-secondary">{name}</h4>

        <p className="text-sm text-muted-foreground">
          Local: <span className="text-black">{location}</span>
        </p>

        <p className="text-sm text-muted-foreground">
          Tipo: <span className="text-black">{type}</span>
        </p>

        <div className="flex gap-2 mt-2">
          <Button size="sm" className="bg-[#1f4c47] hover:bg-[#1a3d39] text-white">
            Aprovar
          </Button>
          <Button size="sm" variant="destructive" className="bg-[#8a0204] hover:bg-[#7a0204] text-white">
            Recusar
          </Button>
        </div>
      </div>
    </Card>
  );
}
