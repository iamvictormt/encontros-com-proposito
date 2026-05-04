"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ShieldAlert } from "lucide-react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("As novas senhas não conferem");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erro ao alterar senha");

      toast.success("Senha alterada com sucesso!");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] glass border-white/20 p-8 sm:p-10">
        <DialogHeader className="space-y-4 text-center mb-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange mb-2">
              <ShieldAlert size={24} />
            </div>
            <DialogTitle className="text-3xl font-black text-brand-black tracking-tighter uppercase leading-none">
              Alterar <span className="text-brand-orange">Senha</span>
            </DialogTitle>
          </div>
          <DialogDescription className="font-medium text-gray-500">
            Para sua segurança, informe sua senha atual para definir uma nova.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-1">
                Senha Atual
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="h-14 rounded-2xl border-brand-black/5 bg-brand-black/5 focus:bg-white focus:ring-brand-orange/20 focus:border-brand-orange transition-all px-6 font-bold"
                placeholder="••••••••"
              />
            </div>

            <hr className="border-brand-black/5 mx-2" />

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-1">
                Nova Senha
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="h-14 rounded-2xl border-brand-black/5 bg-brand-black/5 focus:bg-white focus:ring-brand-orange/20 focus:border-brand-orange transition-all px-6 font-bold"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-1">
                Confirmar Nova Senha
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="h-14 rounded-2xl border-brand-black/5 bg-brand-black/5 focus:bg-white focus:ring-brand-orange/20 focus:border-brand-orange transition-all px-6 font-bold"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 bg-brand-black hover:bg-brand-black/80 text-white font-black uppercase tracking-widest text-[12px] rounded-2xl shadow-xl shadow-brand-black/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Alterando...</span>
                </div>
              ) : (
                "Confirmar Alteração"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
