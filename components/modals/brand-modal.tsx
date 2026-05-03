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
      <DialogContent className="sm:max-w-[500px] w-[95vw] glass border-brand-green/5 rounded-[2rem] p-0 gap-0 shadow-2xl overflow-hidden">
        <DialogHeader className="p-6 lg:p-8 border-b border-brand-green/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-6 bg-brand-orange rounded-full" />
            <span className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.3em]">
              {isReadOnly ? "Visualização" : brand ? "Edição" : "Criação"}
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-brand-black lg:text-3xl">
            {isReadOnly ? "Detalhes da" : brand ? "Editar" : "Nova"}{" "}
            <span className="text-brand-red">Marca</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Logo da Marca</Label>
            <div className="max-w-[120px]">
              <ImageUpload 
                value={formData.logo} 
                onChange={(url) => setFormData({ ...formData, logo: url })}
                onRemove={() => setFormData({ ...formData, logo: "" })}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Nome da Marca</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-black placeholder:text-brand-black/20"
              required 
              disabled={isReadOnly}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website_url" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Site Corporativo</Label>
              <Input 
                id="website_url" 
                placeholder="https://..."
                value={formData.website_url} 
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })} 
                className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-black placeholder:text-brand-black/20"
                disabled={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram_url" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Instagram</Label>
              <Input 
                id="instagram_url" 
                placeholder="@..."
                value={formData.instagram_url} 
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })} 
                className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-black placeholder:text-brand-black/20"
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Descrição do Parceiro</Label>
            <textarea 
              id="description" 
              className="w-full min-h-[100px] p-4 bg-white/50 border border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange outline-none resize-none transition-all font-medium text-brand-black text-xs placeholder:text-brand-black/20"
              placeholder="Descreva brevemente o parceiro..."
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Status</Label>
            <Select 
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              disabled={isReadOnly}
            >
              <SelectTrigger id="status" className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-black">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="glass border-brand-green/10">
                <SelectItem value="Ativo" className="text-sm font-medium py-3">Ativo</SelectItem>
                <SelectItem value="Inativo" className="text-sm font-medium py-3">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t border-brand-green/5 flex flex-col sm:flex-row gap-3">
            {isReadOnly ? (
              <Button 
                type="button" 
                className="h-12 bg-brand-black hover:bg-brand-black/80 text-white font-bold text-xs px-10 rounded-xl shadow-xl shadow-brand-black/20 transition-all flex-1 sm:flex-none ml-auto" 
                onClick={onClose}
              >
                Fechar
              </Button>
            ) : (
              <>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="h-12 border-brand-green/10 bg-white/50 text-brand-black/60 hover:bg-brand-green/5 font-bold text-xs px-8 rounded-xl flex-1 sm:flex-none"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="h-12 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs px-10 rounded-xl shadow-xl shadow-brand-green/20 transition-all flex-1 sm:flex-none ml-auto" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Salvando...</span>
                    </div>
                  ) : "Salvar Marca"}
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
