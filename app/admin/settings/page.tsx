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
    <div className="space-y-12 pb-24">
      <header className="mb-12">
        <h1 className="text-4xl sm:text-6xl font-black text-black uppercase italic tracking-tighter mb-2">
          Admin <span className="text-primary">Settings</span>
        </h1>
        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Configurações de segurança e perfil</p>
      </header>

      <div className="max-w-3xl bg-gray-50 p-8 sm:p-16 rounded-[4rem] border border-gray-100 shadow-sm">
        <h2 className="text-3xl font-black italic uppercase text-black mb-10 tracking-tight">Dados Pessoais</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Nome Completo</Label>
              <Input 
                id="fullName" 
                value={formData.fullName} 
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                className="h-14 bg-white border-gray-100 rounded-2xl px-6 font-bold"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">E-mail Corporativo</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="h-14 bg-white border-gray-100 rounded-2xl px-6 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">CPF / Identificação</Label>
              <Input 
                id="cpf" 
                value={formData.cpf} 
                onChange={e => setFormData({...formData, cpf: e.target.value})}
                className="h-14 bg-white border-gray-100 rounded-2xl px-6 font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Nova Senha</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="h-14 bg-white border-gray-100 rounded-2xl px-6 font-bold"
              />
            </div>
          </div>

          <div className="pt-8">
            <Button type="submit" className="h-16 w-full sm:w-auto px-12 bg-primary hover:bg-primary/90 text-white rounded-full font-black uppercase italic text-lg shadow-xl" disabled={isLoading}>
              {isLoading ? "Processando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
