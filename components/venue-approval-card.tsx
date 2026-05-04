import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MapPin, Building2, Check, X, Eye, Edit3, Trash2 } from "lucide-react";
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
    <Card className="group premium-card flex flex-col sm:flex-row items-stretch sm:items-center gap-8 p-6 bg-white rounded-[2rem] border-none shadow-sm overflow-hidden">
      {/* IMAGEM */}
      <div className="relative w-full sm:w-48 h-48 sm:h-40 flex-shrink-0 overflow-hidden rounded-2xl shadow-lg">
        <Image 
          src={image} 
          alt={name} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* TEXTO E CONTEÚDO */}
      <div className="flex flex-col justify-center flex-1 min-w-0 py-2">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h4 className="font-black text-brand-black text-xl sm:text-2xl uppercase tracking-tighter leading-none mb-2 group-hover:text-brand-orange transition-colors">
              {name}
            </h4>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 bg-brand-black/5 px-3 py-1 rounded-full">
                {type}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={onViewDetails}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-black/5 hover:bg-brand-orange hover:text-white transition-all text-brand-black/40"
            >
              <Eye className="h-4 w-4" />
            </button>
            {isPageLocalEmpresas && (
              <>
                <button 
                  onClick={onEdit}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-black/5 hover:bg-brand-green hover:text-white transition-all text-brand-black/40"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button 
                  onClick={onDelete}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-black/5 hover:bg-brand-red hover:text-white transition-all text-brand-black/40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
          <MapPin className="h-3.5 w-3.5 text-brand-red" />
          <span className="line-clamp-1">{location}</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {(!status || status === "Pendente") && (
            <>
              <Button
                onClick={onApprove}
                className="h-12 bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[10px] px-8 rounded-2xl shadow-lg shadow-brand-green/20 flex-1 sm:flex-none"
              >
                <Check className="w-4 h-4 mr-2" />
                Aprovar
              </Button>
              <Button
                variant="outline"
                onClick={onReject}
                className="h-12 border-brand-red/20 text-brand-red hover:bg-brand-red hover:text-white font-black uppercase tracking-widest text-[10px] px-8 rounded-2xl flex-1 sm:flex-none"
              >
                <X className="w-4 h-4 mr-2" />
                Recusar
              </Button>
            </>
          )}

          {status && status !== "Pendente" && (
            <div className="h-12 flex items-center px-6 rounded-2xl bg-brand-black/5">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                status === "Aprovado" ? "text-brand-green" : "text-brand-red"
              )}>
                {status === "Aprovado" ? "Estabelecimento Ativo" : "Registro Recusado"}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
