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
    <div className="max-w-3xl mx-auto space-y-12 pb-20">
      <header className="mb-12 text-center lg:text-left">
        <div className="flex items-center gap-3 mb-2 justify-center lg:justify-start">
          <div className="h-1 w-8 bg-brand-orange rounded-full" />
          <span className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.3em]">
            Administração
          </span>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-brand-black lg:text-5xl">
          Configurações <span className="text-brand-red">de Perfil</span>
        </h1>
      </header>

      <section className="glass rounded-[2.5rem] p-8 lg:p-12 border-brand-green/5">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-1 w-6 bg-brand-green rounded-full" />
          <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
            Dados Pessoais
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="fullName" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Nome Completo</Label>
              <Input 
                id="fullName" 
                value={formData.fullName} 
                onChange={e => setFormData({...formData, fullName: e.target.value})} 
                className="h-14 bg-white/50 border-brand-green/10 rounded-2xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-brand-black"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="email" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">E-mail Corporativo</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                className="h-14 bg-white/50 border-brand-green/10 rounded-2xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-brand-black"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="cpf" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">CPF</Label>
              <Input 
                id="cpf" 
                value={formData.cpf} 
                onChange={e => setFormData({...formData, cpf: e.target.value})} 
                className="h-14 bg-white/50 border-brand-green/10 rounded-2xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-brand-black"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Alterar Senha</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Deixe em branco para não alterar"
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                className="h-14 bg-white/50 border-brand-green/10 rounded-2xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-brand-black placeholder:text-brand-black/20"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-14 bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-brand-green/20 transition-all active:scale-[0.98]" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Salvando...</span>
                </div>
              ) : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
