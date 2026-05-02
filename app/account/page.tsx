"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const { user, isLoggedIn, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      redirect("/login");
    }
  }, [isLoading, isLoggedIn]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-secondary border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 text-center sm:text-left">
          <h1 className="text-4xl sm:text-6xl font-black text-black uppercase italic tracking-tighter mb-2">
            Minha <span className="text-primary">Conta</span>
          </h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">
            Gerencie suas informações e benefícios
          </p>
        </header>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Sidebar / Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 rounded-[3rem] flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center mb-6">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-black italic uppercase text-black">{user.fullName || "Usuário"}</h2>
              <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-black">
                {user.isAdmin ? "Administrador" : "Membro Oficial"}
              </p>

              <div className="w-full mt-8 pt-8 border-t border-gray-200 flex flex-col gap-3">
                 <Button asChild variant="outline" className="rounded-full font-black uppercase italic">
                    <Link href="/member-card">Ver Cartão</Link>
                 </Button>
                 <Button onClick={() => logout()} variant="ghost" className="rounded-full font-black uppercase italic text-secondary">
                    Sair da Conta
                 </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-primary p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <CreditCard className="w-32 h-32" />
               </div>
               <div className="relative z-10">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Credencial MeetOff</h3>
                <p className="text-white/70 text-base mb-8 max-w-md font-medium leading-relaxed">
                  Seu acesso exclusivo para eventos, parcerias e histórico de encontros.
                  Sempre disponível digitalmente aqui.
                </p>
                <Button asChild className="bg-white text-primary hover:bg-white/90 rounded-full px-8 py-6 font-black uppercase italic">
                  <Link href="/member-card">
                    Acessar Agora
                  </Link>
                </Button>
               </div>
            </div>

            {/* User Details */}
            <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100">
              <h3 className="text-2xl font-black italic uppercase text-black mb-10">Dados Pessoais</h3>
              
              <div className="grid gap-10">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Email Cadastrado</p>
                    <p className="text-lg text-black font-black italic">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Status da Conta</p>
                    <div className="flex items-center gap-2 text-primary font-black italic text-lg">
                      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse"></div>
                      ATIVA & VERIFICADA
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
