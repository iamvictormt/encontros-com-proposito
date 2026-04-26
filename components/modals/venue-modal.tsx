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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isReadOnly ? "Detalhes do Local" : venue ? "Editar Local" : "Novo Local"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload 
            value={formData.image} 
            onChange={(url) => setFormData({ ...formData, image: url })}
            onRemove={() => setFormData({ ...formData, image: "" })}
            disabled={isReadOnly}
          />

          <div className="space-y-2">
            <Label htmlFor="name">Nome do Local/Empresa</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              required 
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Cidade/UF</Label>
            <Input 
              id="location" 
              value={formData.location} 
              onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
              required 
              disabled={isReadOnly}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Input 
                id="type" 
                placeholder="Ex: Externo, Interno" 
                value={formData.type} 
                onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                disabled={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                disabled={isReadOnly}
              >
                <SelectTrigger id="status" className="bg-white">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Recusado">Recusado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            {isReadOnly ? (
              <Button type="button" className="bg-secondary hover:bg-secondary/90 text-white" onClick={onClose}>Fechar</Button>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar Local"}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
