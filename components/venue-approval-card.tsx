import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface VenueApprovalCardProps {
  id?: string;
  name: string;
  location: string;
  type: string;
  image: string;
  isPageLocalEmpresas?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function VenueApprovalCard({
  name,
  location,
  type,
  image,
  isPageLocalEmpresas,
  onEdit,
  onDelete,
}: VenueApprovalCardProps) {
  return (
    <Card className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 border-none shadow-sm bg-white w-full overflow-hidden">
      {/* BOTÃO TOP RIGHT */}
      {isPageLocalEmpresas && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 text-[10px] sm:text-xs hover:bg-gray-50 text-gray-500 hover:text-black h-8 px-2"
        >
          Ver detalhes
        </Button>
      )}

      {/* IMAGEM */}
      <div className="relative w-full sm:w-40 h-40 sm:h-32 flex-shrink-0">
        <Image src={image} alt={name} fill className="object-cover rounded-lg" />
      </div>

      {/* TEXTO */}
      <div className="flex flex-col justify-center flex-1 min-w-0 pr-0 sm:pr-24">
        <h4 className="font-bold text-secondary text-base sm:text-lg mb-1">{name}</h4>

        <div className="space-y-0.5 mb-3">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Local: <span className="text-black font-medium">{location}</span>
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Tipo: <span className="text-black font-medium">{type}</span>
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            size="sm"
            onClick={onEdit}
            className="bg-[#1f4c47] hover:bg-[#1a3d39] text-white flex-1 sm:flex-none"
          >
            {isPageLocalEmpresas ? "Editar" : "Aprovar"}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            className="bg-[#8a0204] hover:bg-[#7a0204] text-white flex-1 sm:flex-none"
          >
            {isPageLocalEmpresas ? "Excluir" : "Recusar"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
