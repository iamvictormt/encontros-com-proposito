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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cargo: {member?.full_name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="role">Cargo</Label>
            <Input 
              id="role" 
              placeholder="Ex: Gerente, Vendedor, Fotógrafo" 
              value={formData.role} 
              onChange={(e) => setFormData({ ...formData, role: e.target.value })} 
              required 
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isAdmin" 
              checked={formData.isAdmin}
              onCheckedChange={(checked) => setFormData({ ...formData, isAdmin: checked === true })}
            />
            <Label 
              htmlFor="isAdmin"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Acesso de Administrador
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="text-black">
              Cancelar
            </Button>
            <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
