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

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  brand?: any;
  isReadOnly?: boolean;
}

export function BrandModal({ isOpen, onClose, onSuccess, brand, isReadOnly }: BrandModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: brand?.name || "",
    logo: brand?.logo || "",
    page: brand?.page || "Home",
    status: brand?.status || "Publicado",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/brands", {
        method: brand ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: brand?.id }),
      });

      if (!res.ok) throw new Error("Failed to save brand");

      toast.success(brand ? "Marca atualizada!" : "Marca criada!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar marca");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isReadOnly ? "Detalhes da Marca" : brand ? "Editar Marca" : "Nova Marca"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload 
            value={formData.logo} 
            onChange={(url) => setFormData({ ...formData, logo: url })}
            onRemove={() => setFormData({ ...formData, logo: "" })}
            disabled={isReadOnly}
          />

          <div className="space-y-2">
            <Label htmlFor="name">Nome da Marca</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              required 
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="page">Página</Label>
            <Input 
              id="page" 
              value={formData.page} 
              onChange={(e) => setFormData({ ...formData, page: e.target.value })} 
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
                <SelectItem value="Publicado">Publicado</SelectItem>
                <SelectItem value="Rascunho">Rascunho</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            {isReadOnly ? (
              <Button type="button" className="bg-secondary hover:bg-secondary/90 text-white" onClick={onClose}>Fechar</Button>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar Marca"}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
