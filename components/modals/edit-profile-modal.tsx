"use client";

import { useState, useEffect } from "react";
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
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/lib/services/auth.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { formatPhone, unformatPhone, detectInputType, validateMinAge } from "@/lib/utils/validators";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, refreshAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
  });

  useEffect(() => {
    if (user && isOpen) {
      // Format birthDate to YYYY-MM-DD for the input[type="date"]
      let formattedDate = "";
      if (user.birthDate) {
        const date = new Date(user.birthDate);
        formattedDate = date.toISOString().split("T")[0];
      }

      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone ? formatPhone(user.phone) : "",
        birthDate: formattedDate,
      });
    }
  }, [user, isOpen]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.birthDate && !validateMinAge(formData.birthDate)) {
      toast.error("Você deve ter pelo menos 18 anos.");
      return;
    }

    setIsLoading(true);
    try {
      const dataToSave = {
        ...formData,
        phone: unformatPhone(formData.phone),
      };

      await authService.updateProfile(dataToSave);
      await refreshAuth();
      toast.success("Perfil atualizado com sucesso!");
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] glass border-white/20 p-8 sm:p-10">
        <DialogHeader className="space-y-4 text-center mb-4">
          <div className="flex flex-col items-center gap-2">
            <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Sua Conta
            </span>
            <DialogTitle className="text-3xl font-black text-brand-black tracking-tighter uppercase leading-none">
              Editar <span className="text-brand-orange">Perfil</span>
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-1">
                Nome Completo
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="h-14 rounded-2xl border-brand-black/5 bg-brand-black/5 focus:bg-white focus:ring-brand-orange/20 focus:border-brand-orange transition-all px-6 font-bold"
                placeholder="Seu nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-1">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-14 rounded-2xl border-brand-black/5 bg-brand-black/5 focus:bg-white focus:ring-brand-orange/20 focus:border-brand-orange transition-all px-6 font-bold"
                placeholder="seu@email.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-1">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="h-14 rounded-2xl border-brand-black/5 bg-brand-black/5 focus:bg-white focus:ring-brand-orange/20 focus:border-brand-orange transition-all px-6 font-bold"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-1">
                  Nascimento
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="h-14 rounded-2xl border-brand-black/5 bg-brand-black/5 focus:bg-white focus:ring-brand-orange/20 focus:border-brand-orange transition-all px-6 font-bold"
                />
              </div>
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
                  <span>Salvando...</span>
                </div>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
