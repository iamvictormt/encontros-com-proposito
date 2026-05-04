"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { validateMinAge } from "@/lib/utils/validators";

export function RequestCardModal() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    birthDate: "",
  });

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ 
        ...prev, 
        email: user.email,
        birthDate: user.birthDate ? user.birthDate.split('T')[0] : prev.birthDate
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const birthDateToSend = user?.birthDate || formData.birthDate;

      if (!validateMinAge(birthDateToSend)) {
        toast.error("Idade mínima: 18 anos.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/cards/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          email: user?.email,
          birthDate: birthDateToSend
        }),
      });

      if (res.ok) {
        toast.success("Identidade confirmada e cartão ativado!");
        setIsOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao solicitar cartão");
      }
    } catch (error) {
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-14 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white transition-all font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-green/20">
          Solicitar Cartão Verde
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white rounded-[2.5rem] border-none shadow-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-brand-black">
            Confirmar Identidade
          </DialogTitle>
          <DialogDescription className="text-gray-500 font-medium text-sm">
            Confirme sua senha para gerar sua identidade digital MeetOff.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-[10px] font-black uppercase tracking-widest text-gray-400"
            >
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="h-12 rounded-xl border-brand-black/5 bg-gray-100/50 text-gray-400 cursor-not-allowed font-bold"
              value={formData.email}
              readOnly
              disabled
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-[10px] font-black uppercase tracking-widest text-gray-400"
            >
              Confirme sua Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {!user?.birthDate && (
            <div className="space-y-2">
              <Label
                htmlFor="birthDate"
                className="text-[10px] font-black uppercase tracking-widest text-brand-red"
              >
                Data de Nascimento (Obrigatório)
              </Label>
              <Input
                id="birthDate"
                type="date"
                className="h-12 rounded-xl border-brand-red/20 bg-brand-red/5 focus:bg-white transition-all"
                max={
                  new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                    .toISOString()
                    .split("T")[0]
                }
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
                required
              />
              <p className="text-[9px] text-brand-red font-bold uppercase tracking-tight italic">
                * Você deve ter pelo menos 18 anos para solicitar o cartão.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-brand-black hover:bg-brand-black/90 text-white transition-all font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-black/20"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Confirmar e Gerar Cartão"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
