import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
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
    <div className="group relative flex flex-col sm:flex-row items-stretch sm:items-center gap-6 p-6 bg-white/40 backdrop-blur-sm rounded-[2rem] border border-brand-green/5 premium-card w-full overflow-hidden">
      {/* BOTÃO TOP RIGHT */}
      {isPageLocalEmpresas && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onViewDetails}
          className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest text-brand-black/40 hover:text-brand-black hover:bg-brand-green/5 h-8 rounded-xl"
        >
          Ver detalhes
        </Button>
      )}

      {/* IMAGEM */}
      <div className="relative w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-2xl">
        <Image 
          src={image} 
          alt={name} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
        />
      </div>

      {/* TEXTO */}
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <h4 className="text-lg font-black text-brand-black uppercase tracking-tight mb-2 group-hover:text-brand-orange transition-colors">{name}</h4>

        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-brand-black/40 uppercase tracking-widest">
            <span className="text-brand-red">●</span>
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-brand-black/40 uppercase tracking-widest">
            <span className="text-brand-orange">●</span>
            <span>{type}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {(!status || status === "Pendente") && (
            <>
              <Button
                size="sm"
                onClick={onApprove}
                className="bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-lg shadow-brand-green/20"
              >
                Aprovar
              </Button>
              <Button
                size="sm"
                onClick={onReject}
                className="bg-brand-red hover:bg-brand-red/90 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-lg shadow-brand-red/20"
              >
                Recusar
              </Button>
            </>
          )}

          {status && status !== "Pendente" && (
            <div className="py-2">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl glass",
                status === "Aprovado" ? "text-brand-green" : "text-brand-red"
              )}>
                {status}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
