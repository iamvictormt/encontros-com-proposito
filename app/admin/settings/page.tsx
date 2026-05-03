"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export default function AdminSettings() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    cpf: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        cpf: user.cpf || "",
        password: "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <div className="space-y-2 text-center">
        <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
          Configurações
        </span>
        <h2 className="text-4xl font-black text-brand-black tracking-tighter uppercase mt-4">
          Meu <span className="text-brand-orange">Perfil</span>
        </h2>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm border border-brand-green/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-green via-brand-red to-brand-orange" />
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label 
                htmlFor="fullName"
                className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-1"
              >
                Nome Completo
              </Label>
              <Input 
                id="fullName" 
                placeholder="Seu nome completo"
                className="h-14 rounded-2xl border-brand-black/5 bg-brand-black/5 focus:bg-white focus:ring-brand-orange/20 focus:border-brand-orange transition-all px-6 font-bold"
                value={formData.fullName} 
                onChange={e => setFormData({...formData, fullName: e.target.value})} 
              />
            </div>
            
            <div className="space-y-3">
              <Label 
                htmlFor="email"
                className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-1"
              >
                E-mail Administrativo
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com"
                className="h-14 rounded-2xl border-brand-black/5 bg-brand-black/5 focus:bg-white focus:ring-brand-orange/20 focus:border-brand-orange transition-all px-6 font-bold"
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>

            <div className="space-y-3">
              <Label 
                htmlFor="cpf"
                className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-1"
              >
                CPF
              </Label>
              <Input 
                id="cpf" 
                placeholder="000.000.000-00"
                className="h-14 rounded-2xl border-brand-black/5 bg-brand-black/5 focus:bg-white focus:ring-brand-orange/20 focus:border-brand-orange transition-all px-6 font-bold"
                value={formData.cpf} 
                onChange={e => setFormData({...formData, cpf: e.target.value})} 
              />
            </div>

            <div className="space-y-3">
              <Label 
                htmlFor="password"
                className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-1"
              >
                Nova Senha
              </Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                className="h-14 rounded-2xl border-brand-black/5 bg-brand-black/5 focus:bg-white focus:ring-brand-orange/20 focus:border-brand-orange transition-all px-6 font-bold"
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
              />
              <p className="text-[9px] font-medium text-brand-black/30 ml-1 italic">Deixe em branco para manter a senha atual.</p>
            </div>
          </div>

          <div className="pt-8 border-t border-brand-green/5">
            <Button 
              type="submit" 
              className="w-full h-16 bg-brand-black hover:bg-brand-black/80 text-white font-black uppercase tracking-widest text-[12px] rounded-2xl shadow-xl shadow-brand-black/20 transition-all hover:scale-[1.02] active:scale-95" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
                  <span>Salvando Alterações...</span>
                </div>
              ) : "Atualizar Meu Perfil"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
