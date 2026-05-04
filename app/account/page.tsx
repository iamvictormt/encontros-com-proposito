"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, CreditCard, ArrowRight, Calendar, LogOut } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { EditProfileModal } from "@/components/modals/edit-profile-modal";
import { ChangePasswordModal } from "@/components/modals/change-password-modal";

export default function AccountPage() {
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 sm:py-16 lg:px-20 relative overflow-x-clip">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/5 blur-[120px] rounded-full -ml-48 -mb-48" />

        <header className="mb-10 sm:mb-16 space-y-4 relative text-center sm:text-left">
           <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
            Dashboard Pessoal
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-brand-black uppercase tracking-tighter leading-none mt-4">
            Minha <span className="text-brand-orange">Conta</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-xl text-base sm:text-lg mx-auto sm:mx-0 text-pretty">
            Gerencie sua identidade digital e acesse seus benefícios exclusivos na MeetOff.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-12 relative">
          {/* Sidebar / Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] border-white/40 shadow-2xl flex flex-col items-center text-center space-y-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-brand-green/10 rounded-[2rem] flex items-center justify-center relative transition-transform duration-500 group-hover:scale-110">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-brand-green" />
                <div className="absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-brand-orange rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Shield size={14} />
                </div>
              </div>
              <div className="space-y-1 relative">
                <h2 className="font-black text-xl sm:text-2xl text-brand-black uppercase tracking-tight">{user.fullName || "Membro MeetOff"}</h2>
              </div>
              <div className="w-full pt-6 border-t border-brand-black/5 relative">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditProfileOpen(true)}
                  className="w-full h-12 sm:h-14 rounded-xl border-brand-black/10 font-black uppercase tracking-widest text-[10px] hover:bg-brand-black hover:text-white transition-all"
                >
                  Editar Perfil
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => logout()}
                  className="w-full h-12 sm:h-14 rounded-xl text-brand-red font-black uppercase tracking-widest text-[10px] hover:bg-brand-red/5 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  Sair da Conta
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            {/* <div className="glass p-8 rounded-[2.5rem] space-y-6">
              <h4 className="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em]">Seu Impacto</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-2xl font-black tracking-tighter">12</p>
                  <p className="text-[9px] font-bold text-black uppercase tracking-widest">Encontros</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-black tracking-tighter">04</p>
                  <p className="text-[9px] font-bold text-black uppercase tracking-widest">Produtos</p>
                </div>
              </div>
            </div> */}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8 sm:space-y-12">
            {/* Member Card Teaser */}
            <div className="glass p-6 sm:p-10 md:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] border-white/40 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
              
              <div className="flex flex-col md:flex-row gap-8 sm:gap-10 items-center relative">
                <div className="w-full max-w-[280px] md:w-1/3 aspect-[1.58] bg-brand-black rounded-2xl p-6 flex flex-col justify-between shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-700">
                  <div className="flex justify-between items-start">
                    <div className="w-8 h-6 bg-white/20 rounded-md" />
                    <CreditCard className="text-white/40" size={20} />
                  </div>
                  <div className="space-y-1">
                    <div className="h-1 w-8 bg-brand-orange rounded-full" />
                    <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Cartão MeetOff</p>
                  </div>
                </div>

                <div className="flex-1 space-y-6 text-center md:text-left">
                  <div className="space-y-2">
                    <h3 className="font-black text-2xl sm:text-3xl text-brand-black uppercase tracking-tighter">Seu Acesso Premium</h3>
                    <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed">
                      Sua credencial digital MeetOff garante acesso antecipado a eventos e benefícios exclusivos.
                    </p>
                  </div>
                  <Button asChild className="h-14 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[10px] px-8 shadow-xl shadow-brand-green/20 group w-full sm:w-auto">
                    <Link href="/member-card" className="flex items-center justify-center gap-3">
                      Acessar Cartão Digital
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Personal Data Grid */}
            <div className="glass p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] border-white/40 shadow-xl space-y-8 sm:space-y-10">
              <div className="flex items-center gap-4">
                <div className="h-1 w-10 sm:w-12 bg-brand-red rounded-full" />
                <h3 className="font-black text-lg sm:text-xl text-brand-black uppercase tracking-tight">Dados de Segurança</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-10">
                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-brand-black/5 flex items-center justify-center text-brand-black group-hover:bg-brand-black group-hover:text-white transition-all">
                    <Mail size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">E-mail Principal</p>
                    <p className="text-brand-black font-black uppercase tracking-tight">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-brand-black/5 flex items-center justify-center text-brand-black group-hover:bg-brand-black group-hover:text-white transition-all">
                    <Calendar size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Data de Nascimento</p>
                    <p className="text-brand-black font-black uppercase tracking-tight">
                      {user.birthDate ? new Date(user.birthDate).toLocaleDateString('pt-BR') : "Não informada"}
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="flex items-center gap-6 group cursor-pointer hover:translate-x-2 transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all">
                    <Shield size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Segurança</p>
                    <p className="text-brand-black font-black uppercase tracking-tight">Alterar Senha</p>
                  </div>
                  <ArrowRight size={16} className="ml-auto text-brand-black/20 group-hover:text-brand-orange group-hover:translate-x-2 transition-all" />
                </div>
              </div>

              <div className="pt-8 border-t border-brand-black/5">
                <p className="text-[10px] text-gray-400 font-medium italic">
                  * Suas informações são protegidas por criptografia de ponta a ponta e nunca serão compartilhadas sem seu consentimento explícito.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <EditProfileModal 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
      />

      <ChangePasswordModal 
        isOpen={isChangePasswordOpen} 
        onClose={() => setIsChangePasswordOpen(false)} 
      />

      <SiteFooter />
    </div>
  );
}
