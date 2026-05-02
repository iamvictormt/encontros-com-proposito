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
    <div className="container max-w-md mx-auto py-12 px-4">
      <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Ativação MeetOff</CardTitle>
          <CardDescription>
            {step === 1 
              ? "Insira o código do seu cartão rosa para começar" 
              : "Complete seu cadastro para ativar o cartão"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código de Ativação</Label>
                <Input
                  id="code"
                  placeholder="Ex: ABC-123-XYZ"
                  value={token}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                    const chunks = cleaned.match(/.{1,3}/g);
                    setToken(chunks ? chunks.slice(0, 3).join('-') : '');
                  }}
                  className="h-12 text-center text-lg font-mono tracking-widest"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verificar"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleActivate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Como aparecerá no cartão"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="h-12"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 bg-secondary hover:bg-secondary/90" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Ativar Cartão"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-xs text-gray-500 text-center">
            Ao ativar, você concorda com nossos termos de uso e privacidade.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
