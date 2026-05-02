import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface VenueApprovalCardProps {
  id?: string;
  name: string;
  location: string;
  type: string;
  image: string;
  status?: string;
  isPageLocalEmpresas?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onSetPending?: () => void;
}

export function VenueApprovalCard({
  name,
  location,
  type,
  image,
  status,
  isPageLocalEmpresas,
  onEdit,
  onDelete,
  onViewDetails,
  onApprove,
  onReject,
  onSetPending,
}: VenueApprovalCardProps) {
  return (
    <Card className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-6 p-6 border border-gray-100 shadow-xl bg-white w-full overflow-hidden rounded-[2.5rem] group">
      {/* BOTÃO TOP RIGHT */}
      {isPageLocalEmpresas && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onViewDetails}
          className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest hover:bg-gray-50 text-gray-400 hover:text-black h-8 px-4 rounded-full"
        >
          Detalhes
        </Button>
      )}

      {/* IMAGEM */}
      <div className="relative w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-2xl">
        <Image src={image} alt={name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>

      {/* TEXTO */}
      <div className="flex flex-col justify-center flex-1 min-w-0 pr-0 sm:pr-12">
        <h4 className="font-black text-black text-xl uppercase italic tracking-tighter mb-2 leading-none">{name}</h4>

        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Onde</span>
            <span className="text-xs font-bold text-black uppercase">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Segmento</span>
            <span className="text-xs font-bold text-primary italic uppercase">{type}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {(!status || status === "Pendente") && (
            <>
              <Button
                size="sm"
                onClick={onApprove}
                className="bg-primary hover:bg-primary/90 text-white flex-1 sm:flex-none font-black uppercase italic text-[10px] tracking-widest px-6 rounded-full shadow-lg"
              >
                Aprovar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={onReject}
                className="bg-secondary hover:bg-secondary/90 text-white flex-1 sm:flex-none font-black uppercase italic text-[10px] tracking-widest px-6 rounded-full shadow-lg"
              >
                Recusar
              </Button>
            </>
          )}

          {status && status !== "Pendente" && (
            <div className="py-2">
              <span className={`text-[10px] font-black uppercase tracking-widest ${status === "Aprovado" ? "text-primary" : "text-secondary"}`}>
                STATUS: {status.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
