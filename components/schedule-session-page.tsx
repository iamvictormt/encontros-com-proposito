"use client";

import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
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
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function ScheduleSessionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    token: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    type: "presencial",
    reason: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Sessão agendada com sucesso! Entraremos em contato.");
      // Reset form or redirect
    } catch (error) {
      toast.error("Erro ao agendar sessão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 px-4 py-16 lg:px-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/5 blur-[120px] rounded-full -ml-48 -mb-48" />

        <div className="mx-auto max-w-3xl relative">
          <div className="text-center mb-16 space-y-4">
             <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Reservas & Consultoria
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-brand-black uppercase tracking-tighter leading-none mt-4">
              Agende sua <span className="text-brand-orange">Sessão</span>
            </h1>
            <p className="text-gray-500 font-medium max-w-xl mx-auto text-lg">
              Inicie sua jornada de transformação com um atendimento personalizado e exclusivo.
            </p>
          </div>

          <div className="glass p-8 md:p-12 rounded-[3rem] border-white/40 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="token" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  Token de Acesso MeetOff
                </Label>
                <Input
                  id="token"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  className="h-14 rounded-2xl bg-white/50 border-brand-green/10 focus:border-brand-orange transition-all font-black text-brand-black uppercase tracking-widest px-6"
                  value={formData.token}
                  onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    E-mail de Contato
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    className="h-14 rounded-2xl bg-white/50 border-brand-green/10 focus:border-brand-orange transition-all font-medium px-6"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    WhatsApp Business
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    className="h-14 rounded-2xl bg-white/50 border-brand-green/10 focus:border-brand-orange transition-all font-medium px-6"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Data da Sessão
                  </Label>
                  <Input 
                    id="date" 
                    type="date" 
                    className="h-14 rounded-2xl bg-white/50 border-brand-green/10 focus:border-brand-orange transition-all font-medium px-6"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Horário Preferencial
                  </Label>
                  <Select 
                    value={formData.time} 
                    onValueChange={(value) => setFormData({ ...formData, time: value })}
                  >
                    <SelectTrigger className="h-14 rounded-2xl bg-white/50 border-brand-green/10 focus:ring-brand-orange px-6">
                      <SelectValue placeholder="Escolha um horário" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-brand-green/10">
                      <SelectItem value="08:00 AM">08:00 AM</SelectItem>
                      <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                      <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                      <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                      <SelectItem value="06:00 PM">06:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  Modalidade de Atendimento
                </Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="h-14 rounded-2xl bg-white/50 border-brand-green/10 focus:ring-brand-orange px-6">
                    <SelectValue placeholder="Presencial" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-brand-green/10">
                    <SelectItem value="presencial">Presencial (Em nossa sede)</SelectItem>
                    <SelectItem value="online">Online (Vídeo Chamada)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  Breve Contexto / Motivo
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Como podemos te ajudar hoje?"
                  className="min-h-[160px] rounded-3xl bg-white/50 border-brand-green/10 focus:border-brand-orange transition-all font-medium p-6 resize-none"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-16 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-green/20 transition-all active:scale-95"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    "Confirmar Agendamento"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="h-16 px-10 rounded-2xl border-brand-black/10 bg-white hover:bg-brand-black hover:text-white transition-all font-black uppercase tracking-widest text-sm"
                >
                  <Link href="/portfolio">Voltar</Link>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
