"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  member?: any;
}

export function TeamModal({ isOpen, onClose, onSave, member }: TeamModalProps) {
  const [formData, setFormData] = useState({
    role: "",
    isAdmin: false,
  });

  useEffect(() => {
    if (member) {
      setFormData({
        role: member.role || "",
        isAdmin: member.is_admin || false,
      });
    }
  }, [member, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: member.id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] glass border-brand-green/5 rounded-[2rem] p-0 gap-0 shadow-2xl overflow-hidden">
        <DialogHeader className="p-6 lg:p-8 border-b border-brand-green/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-6 bg-brand-orange rounded-full" />
            <span className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.3em]">
              Gestão de Equipe
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-brand-black lg:text-3xl">
            Editar <span className="text-brand-red">Cargo</span>
            <div className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mt-1">
              Membro: {member?.full_name}
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="role" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Cargo / Função</Label>
            <Input 
              id="role" 
              placeholder="Ex: Gerente, Vendedor, Fotógrafo" 
              value={formData.role} 
              onChange={(e) => setFormData({ ...formData, role: e.target.value })} 
              className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-black placeholder:text-brand-black/20"
              required 
            />
          </div>

          <div className="flex items-center space-x-3 p-4 bg-white/30 border border-brand-green/5 rounded-2xl">
            <Checkbox 
              id="isAdmin" 
              checked={formData.isAdmin}
              onCheckedChange={(checked) => setFormData({ ...formData, isAdmin: checked === true })}
              className="w-6 h-6 rounded-lg border-brand-green/20 data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
            />
            <Label 
              htmlFor="isAdmin"
              className="text-[10px] font-black uppercase tracking-widest text-brand-black/60 cursor-pointer select-none"
            >
              Acesso de Administrador (Painel Completo)
            </Label>
          </div>

          <div className="pt-4 border-t border-brand-green/5 flex flex-col sm:flex-row gap-3">
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
            >
              Salvar Cargo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
