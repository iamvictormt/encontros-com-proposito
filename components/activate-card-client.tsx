"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function ActivateCardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialToken = searchParams.get("token") || "";

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(initialToken ? 2 : 1);
  const [token, setToken] = useState(initialToken);
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
  });

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/cards/verify?code=${token}`);
      const data = await res.json();

      if (res.ok) {
        setStep(2);
      } else {
        toast.error(data.error || "Código inválido");
      }
    } catch (error) {
      toast.error("Erro ao verificar código");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/cards/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: token,
          ...formData,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Cartão ativado com sucesso!");
        router.push("/member-card");
      } else {
        toast.error(data.error || "Erro na ativação");
      }
    } catch (error) {
      toast.error("Erro ao ativar cartão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-4 relative">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-orange/10 blur-[100px] -z-10 rounded-full" />
      
      <div className="glass p-8 md:p-12 rounded-[3rem] border-white/40 shadow-2xl space-y-10">
        <div className="text-center space-y-4">
          <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
            Passaporte MeetOff
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-brand-black uppercase tracking-tighter leading-none">
            {step === 1 ? "Ativar" : "Finalizar"} <span className="text-brand-orange">Cartão</span>
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            {step === 1 
              ? "Insira o código exclusivo do seu cartão físico para iniciar a ativação digital." 
              : "Quase lá! Precisamos de alguns dados para personalizar sua credencial."}
          </p>
        </div>

        <div className="space-y-8">
          {step === 1 ? (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="code" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Código de Ativação</Label>
                <Input
                  id="code"
                  placeholder="XXX - XXX - XXX"
                  value={token}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                    const chunks = cleaned.match(/.{1,3}/g);
                    setToken(chunks ? chunks.slice(0, 3).join('-') : '');
                  }}
                  className="h-16 text-center text-2xl font-black font-mono tracking-[0.5em] rounded-2xl bg-white/50 border-brand-green/10 focus:border-brand-orange transition-all"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-16 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-green/20" 
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Verificar Código"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleActivate} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Como aparecerá no cartão"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-14 rounded-2xl bg-white/50 border-brand-green/10 focus:border-brand-orange transition-all font-medium px-6"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="birthDate" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="h-14 rounded-2xl bg-white/50 border-brand-green/10 focus:border-brand-orange transition-all font-medium px-6"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-16 rounded-2xl bg-brand-orange hover:bg-brand-orange/90 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-orange/20" 
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Ativar Credencial"}
              </Button>
            </form>
          )}
        </div>

        <div className="pt-6 border-t border-brand-black/5 text-center">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
            Ao ativar, você concorda com nossos <br/>
            <Link href="#" className="text-brand-orange hover:underline">Termos de Uso</Link> e <Link href="#" className="text-brand-orange hover:underline">Privacidade</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
