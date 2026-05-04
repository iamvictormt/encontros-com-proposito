"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Logo } from "./logo";
import { useAuth } from "@/hooks/use-auth";

export function Login() {
  const [inviteCode, setInviteCode] = useState("");
  const router = useRouter();
  const [year, setYear] = useState("");
  const { isLoggedIn, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    setYear(currentYear);

    if (!authLoading && isLoggedIn) {
      router.push("/events");
    }
  }, [authLoading, isLoggedIn, router]);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleCreateAccount = () => {
    router.push("/signup");
  };

  const handleGuestLogin = () => {
    router.push("/events");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background font-sans selection:bg-brand-orange/20">
      {/* Left Column - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 lg:p-20 relative">
        <div className="mb-12">
          <Logo className="justify-center flex md:block" />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="w-full max-w-md space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-black text-brand-black tracking-tighter uppercase leading-none text-pretty">
                Conecte-se com <br/><span className="text-brand-orange">propósito.</span>
              </h2>
              <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-sm">
                Acesse a plataforma exclusiva para membros e gerencie seus eventos, cartões e conexões.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleLogin}
                className="w-full h-16 bg-brand-red hover:bg-brand-red/90 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-brand-red/20 transition-all hover:scale-[1.02] active:scale-[0.98] gap-3"
              >
                Entrar na Conta
              </Button>

              <Button
                onClick={handleCreateAccount}
                className="w-full h-16 bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-brand-green/20 transition-all hover:scale-[1.02] active:scale-[0.98] gap-3"
              >
                Criar Nova Conta
              </Button>

              <Button
                onClick={handleGuestLogin}
                variant="outline"
                className="w-full h-16 border-2 border-brand-red/20 text-brand-red hover:bg-brand-red hover:text-white font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] bg-white"
              >
                Entrar como Convidado
              </Button>
            </div>

            <div className="pt-8 space-y-4 border-t border-brand-black/5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest px-1">
                  Já tem um código de convite?
                </label>
                <div className="relative group">
                  <Input
                    type="text"
                    placeholder="DIGITE SEU CÓDIGO AQUI"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="w-full h-14 bg-white border-brand-green/10 rounded-2xl text-[12px] font-bold tracking-widest px-6 focus:ring-brand-orange/20 focus:border-brand-orange transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>© MeetOff {year}</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-black transition-colors">Termos</a>
            <a href="#" className="hover:text-brand-black transition-colors">Privacidade</a>
          </div>
        </div>
      </div>

      {/* Right Column - Hero Image */}
      <div className="hidden lg:block lg:w-1/2 relative p-8">
        <div className="relative w-full h-full rounded-[3.5rem] overflow-hidden shadow-2xl group">
          <Image
            src="/images/homem-e-mulher.jpg"
            alt="Casal feliz representando conexões com propósito"
            fill
            className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-12">
            <div className="glass-dark p-12 rounded-[2.5rem] border-white/20 shadow-2xl">
              <div className="space-y-6">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none text-pretty">
                  João Carlos <br /> 
                  <span className="text-brand-orange">& Labernarde</span>
                </h2>
                
                <p className="text-lg font-medium text-white/80 leading-relaxed text-pretty">
                  Terapeuta, mentor e criador de experiências com propósito. Vivo para ajudar pessoas a se reconectarem de forma real, segura e afetiva por meio de encontros presenciais, retiros e projetos que unem tecnologia e emoção.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
