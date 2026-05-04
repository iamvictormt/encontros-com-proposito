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
    website_url: brand?.website_url || "",
    instagram_url: brand?.instagram_url || "",
    description: brand?.description || "",
    status: brand?.status || "Ativo",
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
      <DialogContent className="bg-white rounded-[2.5rem] border-none shadow-2xl p-6 sm:p-10 max-w-xl w-[95vw] max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader className="space-y-3 mb-8">
          <DialogTitle className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-brand-black">
            {isReadOnly ? "Detalhes da Marca" : brand ? "Editar Marca" : "Nova Marca"}
          </DialogTitle>
          <p className="text-gray-500 font-medium text-sm">
            Gerencie as informações da marca parceira MeetOff.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32">
              <ImageUpload 
                value={formData.logo} 
                onChange={(url) => setFormData({ ...formData, logo: url })}
                onRemove={() => setFormData({ ...formData, logo: "" })}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Nome da Marca
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="website_url" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Site (Opcional)
              </Label>
              <Input 
                id="website_url" 
                placeholder="https://..."
                className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
                value={formData.website_url} 
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })} 
                disabled={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram_url" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Instagram (Opcional)
              </Label>
              <Input 
                id="instagram_url" 
                placeholder="@..."
                className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
                value={formData.instagram_url} 
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })} 
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Descrição Curta
            </Label>
            <textarea 
              id="description" 
              className="w-full min-h-[100px] p-4 bg-gray-50 border-brand-black/5 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-orange/20 outline-none resize-none transition-all font-medium"
              placeholder="Descreva brevemente o parceiro..."
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Status Operacional
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
                <SelectItem value="Ativo" className="text-brand-green font-bold">● Ativo</SelectItem>
                <SelectItem value="Inativo" className="text-brand-red font-bold">● Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-8 gap-4">
            {isReadOnly ? (
              <Button type="button" className="w-full h-14 rounded-2xl bg-brand-black hover:bg-brand-black/90 text-white font-black uppercase tracking-widest text-[10px] shadow-xl" onClick={onClose}>
                Fechar
              </Button>
            ) : (
              <>
                <Button type="button" variant="ghost" className="h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-brand-black" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 h-14 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-green/20" disabled={isLoading}>
                  {isLoading ? "Processando..." : brand ? "Salvar Alterações" : "Criar Marca"}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
