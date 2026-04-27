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
  const { user, isLoggedIn, isLoading } = useAuth();

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
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 py-8 sm:px-6 lg:px-8 bg-white">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minha Conta</h1>
          <p className="text-gray-500 mt-2">Gerencie suas informações e acesse seus benefícios.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Sidebar / Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-secondary" />
              </div>
              <h2 className="font-bold text-xl text-gray-900">{user.fullName || "Usuário"}</h2>
              <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                {user.isAdmin ? "Administrador" : "Membro Oficial"}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white overflow-hidden rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md group">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-bold text-xl text-gray-900">Seu Cartão de Membro</h3>
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                      Sua credencial exclusiva para eventos, parcerias e histórico de encontros. 
                      Sempre disponível digitalmente aqui.
                    </p>
                    <div className="mt-6">
                      <Button asChild className="w-full md:w-auto h-12 bg-secondary hover:bg-secondary/90 px-8 rounded-xl flex items-center justify-center gap-2 group">
                        <Link href="/member-card">
                          Ver Cartão MeetOff
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <h3 className="font-bold text-lg text-gray-900 border-b pb-4">Dados Pessoais</h3>
              
              <div className="grid gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Email</p>
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Status da Conta</p>
                    <div className="flex items-center gap-1.5 text-green-600 font-bold">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                      Ativa
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
