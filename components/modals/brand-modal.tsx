"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/image-upload";
import { toast } from "sonner";

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  brand?: any;
}

export function BrandModal({ isOpen, onClose, onSuccess, brand }: BrandModalProps) {
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
          <DialogTitle>{brand ? "Editar Marca" : "Nova Marca"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload
            value={formData.logo}
            onChange={(url) => setFormData({ ...formData, logo: url })}
            onRemove={() => setFormData({ ...formData, logo: "" })}
          />

          <div className="space-y-2">
            <Label htmlFor="name">Nome da Marca</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="page">Página</Label>
            <Input
              id="page"
              value={formData.page}
              onChange={(e) => setFormData({ ...formData, page: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              className="w-full h-10 px-3 py-2 bg-white border rounded-md text-sm"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Publicado">Publicado</option>
              <option value="Rascunho">Rascunho</option>
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-[#1f4c47]" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Marca"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
