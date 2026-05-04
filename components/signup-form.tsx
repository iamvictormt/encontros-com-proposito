"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APIError } from "@/lib/services/api-client";
import {
  formatPhone,
  unformatPhone,
  validatePhone,
  validateEmail,
  detectInputType,
  validateMinAge,
} from "@/lib/utils/validators";
import { Logo } from "./logo";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/services/auth.service";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [year, setYear] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [emailPhoneError, setEmailPhoneError] = useState("");
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    setYear(currentYear);

    // Only redirect if they are actually logged in
    // No automatic redirection on this page unless they successfully registered
  }, []);

  const handleEmailPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const inputType = detectInputType(value);

    if (inputType === "phone") {
      const formatted = formatPhone(value);
      setEmail(formatted);
      setEmailPhoneError("");
    } else if (inputType === "email") {
      setEmail(value);
      setEmailPhoneError("");
    } else {
      setEmail(value);
    }
  };

  const handleEmailPhoneBlur = () => {
    if (!email) return;

    const inputType = detectInputType(email);

    if (inputType === "phone") {
      const phoneNumbers = unformatPhone(email);
      if (phoneNumbers.length >= 10 && !validatePhone(email)) {
        setEmailPhoneError("Telefone inválido");
      } else if (phoneNumbers.length > 0 && phoneNumbers.length < 10) {
        setEmailPhoneError("Telefone incompleto");
      } else {
        setEmailPhoneError("");
      }
    } else if (inputType === "email") {
      if (!validateEmail(email)) {
        setEmailPhoneError("Email inválido");
      } else {
        setEmailPhoneError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailPhoneError) {
      toast({
        variant: "error",
        title: "Erro de validação",
        description: emailPhoneError,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "error",
        title: "Erro de validação",
        description: "As senhas não coincidem",
      });
      return;
    }

    if (!birthDate || !validateMinAge(birthDate)) {
      toast({
        variant: "error",
        title: "Idade mínima",
        description: "Você deve ter pelo menos 18 anos para se cadastrar.",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        variant: "error",
        title: "Termos e Políticas",
        description: "Você precisa aceitar os termos e políticas para continuar.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const isEmail = email.includes("@");

      await authService.register({
        fullName,
        email: isEmail ? email.trim().toLowerCase() : "",
        phone: isEmail ? "" : unformatPhone(email),
        password,
        birthDate,
      });

      toast({
        title: "Conta criada com sucesso!",
        description: "Você será redirecionado.",
      });

      router.push("/events");
    } catch (err) {
      if (err instanceof APIError) {
        toast({
          variant: "error",
          title: "Erro ao criar conta",
          description: err.message,
        });
      } else {
        toast({
          variant: "error",
          title: "Erro ao conectar",
          description: "Erro ao conectar com o servidor",
        });
      }
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 lg:p-20 relative">
        <div className="mb-12">
          <Logo className="justify-center flex md:block" />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-black text-brand-black tracking-tighter uppercase leading-none">
                Criar sua <span className="text-brand-red">Conta</span>
              </h2>
              <p className="text-gray-500 font-medium">
                Junte-se a uma comunidade exclusiva e comece sua jornada de conexões reais.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  Nome Completo
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-14 rounded-2xl bg-white border-brand-green/10 focus:border-brand-orange transition-all font-medium px-4 sm:px-6"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  Email ou Telefone
                </label>
                <Input
                  id="email"
                  type="text"
                  placeholder="ex@email.com"
                  value={email}
                  onChange={handleEmailPhoneChange}
                  onBlur={handleEmailPhoneBlur}
                  className={cn(
                    "w-full h-14 rounded-2xl bg-white border-brand-green/10 focus:border-brand-orange transition-all font-medium px-6",
                    emailPhoneError && "border-brand-red focus:border-brand-red"
                  )}
                  required
                />
                {emailPhoneError && <p className="text-[10px] text-brand-red font-bold uppercase tracking-wide px-1">{emailPhoneError}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="birthDate" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  Data de Nascimento
                </label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full h-14 rounded-2xl bg-white border-brand-green/10 focus:border-brand-orange transition-all font-medium px-4 sm:px-6"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="password" title="Senha" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Senha
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 rounded-2xl bg-white border-brand-green/10 focus:border-brand-orange transition-all font-medium px-4 sm:px-6"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" title="Confirmar" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Confirmar
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-14 rounded-2xl bg-white border-brand-green/10 focus:border-brand-orange transition-all font-medium px-6"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 px-1 py-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(!!checked)}
                  className="mt-1 border-brand-green/20 data-[state=checked]:bg-brand-orange data-[state=checked]:border-brand-orange"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-[11px] font-medium text-gray-500 leading-relaxed cursor-pointer select-none"
                >
                  Eu li e concordo integralmente com as{" "}
                  <Link href="/privacy" className="text-brand-orange font-bold hover:underline">
                    Políticas e Termos de Uso
                  </Link>
                  ,{" "}
                  <Link href="/consent" className="text-brand-orange font-bold hover:underline">
                    Consentimento de Grupos
                  </Link>{" "}
                  e{" "}
                  <Link href="/cookies" className="text-brand-orange font-bold hover:underline">
                    Política de Cookies
                  </Link>{" "}
                  da Meetoff Brasil.
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 rounded-2xl bg-brand-orange hover:bg-brand-orange/90 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-orange/20 disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Criar Conta Agora"}
              </Button>
            </form>

            <div className="text-center pt-4">
              <p className="text-sm font-medium text-gray-500">
                Já possui uma conta?{" "}
                <Link href="/login" className="text-brand-green font-black uppercase tracking-widest text-xs hover:underline ml-2">
                  Fazer login
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>© MeetOff {year}</span>
          <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
            <Link href="/privacy" className="hover:text-brand-black transition-colors">Políticas e Termos</Link>
            <Link href="/consent" className="hover:text-brand-black transition-colors">Consentimento</Link>
            <Link href="/security" className="hover:text-brand-black transition-colors">Segurança</Link>
            <Link href="/cookies" className="hover:text-brand-black transition-colors">Cookies</Link>
          </div>
        </div>
      </div>

      {/* Right Column - Hero Section */}
      <div className="hidden lg:block lg:w-1/2 relative p-8">
        <div className="relative w-full h-full rounded-[3.5rem] overflow-hidden shadow-2xl group">
          <Image
            src="https://images.unsplash.com/photo-1631287941887-7b5185ff4791?q=80&w=1920"
            alt="Hero"
            fill
            className="object-cover transition-transform duration-[3000ms] group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-12">
            <div className="glass-dark p-12 rounded-[2.5rem] border-white/20 shadow-2xl">
              <div className="space-y-6">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none text-pretty">
                  Acesso único, <br/><span className="text-brand-orange">experiências reais.</span>
                </h2>
                <p className="text-lg font-medium text-white/80 leading-relaxed text-pretty">
                  Cada convite é um portal. Use seu token e viva algo que só você pode experienciar em nossa comunidade premium.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
