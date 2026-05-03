"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/image-upload";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  venue?: any;
  isReadOnly?: boolean;
}

export function VenueModal({ isOpen, onClose, onSuccess, venue, isReadOnly }: VenueModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: venue?.name || "",
    location: venue?.location || "",
    type: venue?.type || "",
    image: venue?.image || "",
    status: venue?.status || "Ativo",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/venues", {
        method: venue ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: venue?.id }),
      });

      if (!res.ok) throw new Error("Failed to save venue");

      toast.success(venue ? "Local atualizado!" : "Local criado!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar local");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-[2.5rem] border-none shadow-2xl p-8 sm:p-12 max-w-2xl">
        <DialogHeader className="space-y-3 mb-8">
          <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-brand-black">
            {isReadOnly ? "Detalhes do Local" : venue ? "Editar Local" : "Novo Local"}
          </DialogTitle>
          <p className="text-gray-500 font-medium text-sm">
            Gerencie os estabelecimentos parceiros e locais de eventos.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-8">
            <div className="w-48 h-48 sm:w-64 sm:h-40">
              <ImageUpload 
                value={formData.image} 
                onChange={(url) => setFormData({ ...formData, image: url })}
                onRemove={() => setFormData({ ...formData, image: "" })}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Nome do Local/Empresa
            </Label>
            <Input 
              id="name" 
              className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              required 
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Cidade / UF
            </Label>
            <Input 
              id="location" 
              className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
              value={formData.location} 
              onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
              required 
              disabled={isReadOnly}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Tipo / Categoria
              </Label>
              <Input 
                id="type" 
                placeholder="Ex: Externo, Coworking" 
                className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
                value={formData.type} 
                onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                disabled={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Status de Moderação
              </Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                disabled={isReadOnly}
              >
                <SelectTrigger id="status" className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white font-bold">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-white/20 glass">
                  <SelectItem value="Aprovado" className="text-brand-green font-bold">● Aprovado</SelectItem>
                  <SelectItem value="Pendente" className="text-brand-orange font-bold">● Pendente</SelectItem>
                  <SelectItem value="Recusado" className="text-brand-red font-bold">● Recusado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-8 gap-4">
            {isReadOnly ? (
              <Button type="button" className="w-full h-14 rounded-2xl bg-brand-black hover:bg-brand-black/90 text-white font-black uppercase tracking-widest text-[10px] shadow-xl" onClick={onClose}>
                Fechar Detalhes
              </Button>
            ) : (
              <>
                <Button type="button" variant="ghost" className="h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-brand-black" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 h-14 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-green/20" disabled={isLoading}>
                  {isLoading ? "Processando..." : venue ? "Salvar Alterações" : "Criar Local"}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
