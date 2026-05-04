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
import { Loader2, MailCheck, ShieldCheck, KeyRound } from "lucide-react";
import { authService } from "@/lib/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import { APIError } from "@/lib/services/api-client";
import { cn } from "@/lib/utils";
import { validateEmail, detectInputType, formatPhone, unformatPhone } from "@/lib/utils/validators";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "IDENTIFIER" | "CODE" | "PASSWORD";

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>("IDENTIFIER");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { refreshAuth } = useAuth();

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [identifierError, setIdentifierError] = useState("");

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const inputType = detectInputType(value);

    if (inputType === "phone") {
      const formatted = formatPhone(value);
      setIdentifier(formatted);
      setIdentifierError("");
    } else {
      setIdentifier(value);
      setIdentifierError("");
    }
  };

  const handleSendCode = async () => {
    if (!identifier) {
      toast({ variant: "error", title: "Campo obrigatório", description: "Informe seu email ou telefone." });
      return;
    }

    const inputType = detectInputType(identifier);
    const loginIdentifier = inputType === "phone" ? unformatPhone(identifier) : identifier;

    setIsLoading(true);
    try {
      await authService.forgotPassword(loginIdentifier);
      toast({ title: "Código enviado", description: "Verifique sua caixa de entrada.", variant: "success" });
      setStep("CODE");
    } catch (err) {
      toast({ variant: "error", title: "Erro", description: err instanceof APIError ? err.message : "Erro ao enviar código." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length < 4) {
      toast({ variant: "error", title: "Código incompleto", description: "O código deve ter 4 caracteres." });
      return;
    }

    const inputType = detectInputType(identifier);
    const loginIdentifier = inputType === "phone" ? unformatPhone(identifier) : identifier;

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        body: JSON.stringify({ identifier: loginIdentifier, code }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      setStep("PASSWORD");
    } catch (err: any) {
      toast({ variant: "error", title: "Erro", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (password.length < 6) {
      toast({ variant: "error", title: "Senha curta", description: "Mínimo 6 caracteres." });
      return;
    }
    if (password !== confirmPassword) {
      toast({ variant: "error", title: "Senhas diferentes", description: "As senhas não conferem." });
      return;
    }

    const inputType = detectInputType(identifier);
    const loginIdentifier = inputType === "phone" ? unformatPhone(identifier) : identifier;

    setIsLoading(true);
    try {
      const response = await authService.resetPassword({ identifier: loginIdentifier, code, password });
      toast({ title: "Senha redefinida!", description: "Você será redirecionado.", variant: "success" });
      
      await refreshAuth();
      onClose();
      
      if (response.user.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/events");
      }
    } catch (err) {
      toast({ variant: "error", title: "Erro", description: err instanceof APIError ? err.message : "Erro ao redefinir senha." });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "IDENTIFIER":
        return (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email ou Telefone</label>
              <Input
                placeholder="ex@email.com ou (11) 99999-9999"
                value={identifier}
                onChange={handleIdentifierChange}
                className="w-full h-14 rounded-2xl bg-white/50 border-brand-green/10 focus:border-brand-orange transition-all font-medium px-6"
              />
            </div>
            <Button
              onClick={handleSendCode}
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-green/20"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Enviar Código"}
            </Button>
          </div>
        );
      case "CODE":
        return (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2 mb-4">
              <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto text-brand-orange mb-2">
                <ShieldCheck size={32} />
              </div>
              <p className="text-sm text-gray-500 font-medium">Enviamos um código de 4 dígitos para seu email.</p>
            </div>
            <div className="space-y-2 text-center">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Código de 4 Dígitos</label>
              <Input
                placeholder="Ex: A1B2"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={4}
                className="w-full h-16 text-center text-3xl font-mono font-bold rounded-2xl bg-white/50 border-brand-green/10 focus:border-brand-orange transition-all tracking-[10px] uppercase"
              />
            </div>
            <Button
              onClick={handleVerifyCode}
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-green/20"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Validar Código"}
            </Button>
            <button 
              onClick={() => setStep("IDENTIFIER")}
              className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-brand-orange transition-colors"
            >
              Alterar email/telefone
            </button>
          </div>
        );
      case "PASSWORD":
        return (
          <div className="space-y-6 py-4">
            <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto text-brand-green mb-2">
              <KeyRound size={32} />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nova Senha</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 rounded-2xl bg-white/50 border-brand-green/10 focus:border-brand-orange transition-all font-medium px-6"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Confirmar Senha</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-14 rounded-2xl bg-white/50 border-brand-green/10 focus:border-brand-orange transition-all font-medium px-6"
                />
              </div>
            </div>
            <Button
              onClick={handleResetPassword}
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-green/20"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Redefinir e Entrar"}
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] glass border-white/20 p-8">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-3xl font-black text-brand-black tracking-tighter uppercase leading-none">
            {step === "IDENTIFIER" && "Esqueceu a "}
            {step === "CODE" && "Validar "}
            {step === "PASSWORD" && "Nova "}
            <span className="text-brand-orange">
              {step === "IDENTIFIER" && "Senha?"}
              {step === "CODE" && "Código"}
              {step === "PASSWORD" && "Senha"}
            </span>
          </DialogTitle>
          <DialogDescription className="font-medium text-gray-500">
            {step === "IDENTIFIER" && "Recupere seu acesso de forma rápida e segura."}
            {step === "CODE" && "Insira o código enviado para continuar."}
            {step === "PASSWORD" && "Crie uma nova senha segura para sua conta."}
          </DialogDescription>
        </DialogHeader>
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}
