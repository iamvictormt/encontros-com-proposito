"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/image-upload";
import { toast } from "sonner";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any;
}

export function ProductModal({ isOpen, onClose, onSuccess, product }: ProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    stock: product?.stock || 0,
    type: product?.type || "Físico",
    category: product?.category || "",
    price: product?.price || 0,
    image: product?.image || "",
    status: product?.status || "Ativo",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: product?.id }),
      });

      if (!res.ok) throw new Error("Failed to save product");

      toast.success(product ? "Produto atualizado!" : "Produto criado!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar produto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Editar Produto" : "Novo Produto"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload 
            value={formData.image} 
            onChange={(url) => setFormData({ ...formData, image: url })}
            onRemove={() => setFormData({ ...formData, image: "" })}
          />

          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <select 
                className="w-full h-10 px-3 py-2 bg-white border rounded-md text-sm"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Físico">Físico</option>
                <option value="Digital">Digital</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input 
                id="category" 
                value={formData.category} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input 
                id="price" 
                type="number" 
                step="0.01" 
                value={formData.price} 
                onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Estoque</Label>
              <Input 
                id="stock" 
                type="number" 
                value={formData.stock} 
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })} 
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-[#1f4c47]" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
