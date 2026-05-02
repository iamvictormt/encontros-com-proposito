"use client";

import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Users, ShieldCheck, Share2, CheckCircle2, Share } from "lucide-react";
import { toast } from "sonner";

export function InvitePage() {
  const handleCopyToken = () => {
    navigator.clipboard.writeText("ABCD-1234-EFGH-5678");
    toast.success("Token copiado!");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("meetoff.com/invite/123");
    toast.success("Link copiado!");
  };

  const handleRedeem = () => {
    toast.success("Recompensas resgatadas com sucesso!");
  };

  const handleGenerateLink = () => {
    toast.success("Novo link gerado com sucesso!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans overflow-x-hidden">
      <SiteHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-16 lg:px-20 relative">
        {/* Decorative elements */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-brand-orange/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-brand-green/5 blur-[120px] rounded-full -z-10" />

        <div className="text-center mb-16 space-y-4">
           <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
            Clube de Vantagens
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-brand-black uppercase tracking-tighter leading-none">
            Convite com <span className="text-brand-orange">Token</span> Único
          </h1>
          <p className="text-gray-500 font-medium max-w-xl mx-auto text-lg">
            Gere seu token exclusivo, convide pessoas especiais e desbloqueie recompensas extraordinárias.
          </p>
        </div>

        {/* Token Section */}
        <div className="glass p-8 md:p-10 rounded-[3rem] border-white/40 shadow-2xl mb-12 space-y-6">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Seu Token de Influenciador</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              value="ABCD-1234-EFGH-5678"
              readOnly
              className="h-16 flex-1 font-mono text-center sm:text-left bg-white/50 border-brand-green/10 text-xl font-black tracking-widest rounded-2xl"
            />
            <div className="flex gap-4">
              <Button 
                onClick={handleCopyToken}
                className="h-16 flex-1 sm:flex-none px-8 bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-brand-green/20"
              >
                Copiar Token
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCopyLink}
                className="h-16 flex-1 sm:flex-none px-8 border-brand-black/10 bg-white hover:bg-brand-black hover:text-white transition-all font-black uppercase tracking-widest text-[10px] rounded-2xl"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Rewards Section */}
          <div className="premium-card bg-brand-black p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/20 blur-3xl rounded-full -mr-16 -mt-16" />
            <div className="flex items-center gap-4">
              <div className="h-1 w-10 bg-brand-orange rounded-full" />
              <h2 className="text-xl font-black uppercase tracking-tighter">Recompensas Atuais</h2>
            </div>
            <div className="space-y-6">
              {[
                { label: "Desconto 50% no próximo evento", icon: CheckCircle2, color: "text-brand-orange" },
                { label: "Camiseta exclusiva Black Edition", icon: CheckCircle2, color: "text-brand-green" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group/item">
                  <item.icon className={cn("w-5 h-5", item.color)} />
                  <span className="text-sm font-bold text-white/70 group-hover/item:text-white transition-colors">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <Button 
              onClick={handleRedeem}
              className="w-full h-14 bg-white text-brand-black hover:bg-brand-orange hover:text-white transition-all font-black uppercase tracking-widest text-[10px] rounded-2xl"
            >
              Resgatar Recompensas
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Convites", value: "280", icon: Mail, color: "text-brand-green", bg: "bg-brand-green/10" },
              { label: "Aceitos", value: "120", icon: Users, color: "text-brand-orange", bg: "bg-brand-orange/10" }
            ].map((stat, i) => (
              <div key={i} className="glass p-8 rounded-[3rem] border-white/40 shadow-xl flex flex-col justify-between group hover:bg-brand-black transition-all duration-500">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-colors", stat.bg, "group-hover:bg-white/10")}>
                  <stat.icon className={cn("w-6 h-6", stat.color, "group-hover:text-white")} />
                </div>
                <div className="mt-6 space-y-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white/40">{stat.label}</span>
                  <p className="text-4xl font-black text-brand-black tracking-tighter group-hover:text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ranking Section */}
        <div className="glass p-10 rounded-[3.5rem] border-white/40 shadow-2xl space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-1 w-12 bg-brand-red rounded-full" />
            <h2 className="text-2xl font-black text-brand-black uppercase tracking-tighter">Ranking de <span className="text-brand-red">Influência</span></h2>
          </div>
          
          <div className="space-y-6">
            {[
              { rank: 1, name: "Você", invites: "120 Convites Aceitos", prize: "Gift Card Premium", isSelf: true },
              { rank: 2, name: "Maria Oliveira", invites: "109 Convites Aceitos", prize: "Dinner for Two", isSelf: false },
              { rank: 3, name: "Pedro Santos", invites: "90 Convites Aceitos", prize: "50% Discount", isSelf: false },
            ].map((item) => (
              <div key={item.rank} className={cn(
                "flex flex-col sm:flex-row items-center justify-between p-6 rounded-[2rem] border transition-all duration-500 gap-4",
                item.isSelf ? "bg-brand-green/5 border-brand-green/20" : "bg-white/50 border-brand-black/5 hover:border-brand-black/20"
              )}>
                <div className="flex items-center gap-6">
                  <span className="font-black text-lg text-brand-black/20 w-6">0{item.rank}</span>
                  <Avatar className="w-14 h-14 rounded-2xl border-2 border-white shadow-lg">
                    <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${item.name}`} />
                    <AvatarFallback className="rounded-2xl">{item.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("font-black text-sm uppercase tracking-tight", item.isSelf ? "text-brand-green" : "text-brand-black")}>
                        {item.name}
                      </span>
                      {item.isSelf && <span className="text-[8px] bg-brand-green text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">You</span>}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.invites}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/80 px-6 py-3 rounded-2xl border border-brand-black/5 shadow-sm">
                  <span className="text-xl">🎁</span>
                  <span className="text-[10px] font-black text-brand-black uppercase tracking-widest">{item.prize}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-6 mt-16">
          <Button 
            onClick={handleGenerateLink}
            className="flex-1 h-20 rounded-[2rem] bg-brand-orange hover:bg-brand-orange/90 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-orange/20 transition-all active:scale-95"
          >
            Gerar Novo Link Premium
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              navigator.share?.({
                title: "Convite MeetOff",
                text: "Venha participar do MeetOff!",
                url: window.location.href,
              }).catch(() => {
                handleCopyLink();
              });
            }}
            className="flex-1 h-20 rounded-[2rem] border-brand-black/10 bg-white hover:bg-brand-black hover:text-white transition-all font-black uppercase tracking-widest text-sm"
          >
            <Share className="w-5 h-5 mr-3" />
            Compartilhar Convite
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
