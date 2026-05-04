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
      <DialogContent className="bg-white rounded-[2.5rem] border-none shadow-2xl p-6 sm:p-10 max-w-md w-[95vw] max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader className="space-y-3 mb-8">
          <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-brand-black leading-tight">
            Gerenciar <span className="text-brand-green">Acesso</span>
          </DialogTitle>
          <p className="text-gray-500 font-medium text-sm">
            Defina o cargo e as permissões administrativas para {member?.full_name?.split(' ')[0]}.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <Label htmlFor="role" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Cargo / Função
            </Label>
            <Input 
              id="role" 
              placeholder="Ex: Gerente Comercial" 
              className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
              value={formData.role} 
              onChange={(e) => setFormData({ ...formData, role: e.target.value })} 
              required 
            />
          </div>

          <div className="p-4 rounded-2xl bg-brand-black/5 border border-brand-black/5">
            <div className="flex items-center gap-3">
              <Checkbox 
                id="isAdmin" 
                checked={formData.isAdmin}
                onCheckedChange={(checked) => setFormData({ ...formData, isAdmin: checked === true })}
                className="w-5 h-5 rounded-lg border-brand-black/20 data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
              />
              <div className="space-y-0.5">
                <Label 
                  htmlFor="isAdmin"
                  className="text-xs font-black uppercase tracking-widest text-brand-black cursor-pointer"
                >
                  Permissão de Administrador
                </Label>
                <p className="text-[10px] text-gray-500 font-medium leading-none">Acesso total ao painel de controle.</p>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-brand-black">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 h-14 rounded-2xl bg-brand-black hover:bg-brand-black/90 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-black/20">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
