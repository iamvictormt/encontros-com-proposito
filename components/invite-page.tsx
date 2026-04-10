"use client";

import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Users, ShieldCheck, Share2, CheckCircle2, Share } from "lucide-react";

export function InvitePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 md:py-16">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Convite com Token Único
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Gere seu token exclusivo para convidar amigos e ganhar recompensas
          </p>
        </div>

        {/* Token Section */}
        <div className="mb-10">
          <label className="block text-sm font-medium text-gray-700 mb-2">Seu Token</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value="ABCD-1234-EFGH-5678"
              readOnly
              className="flex-1 font-mono text-center sm:text-left bg-gray-50"
            />
            <div className="flex gap-2">
              <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white">
                Copiar Token
              </Button>
              <Button variant="outline" className="w-full sm:w-auto text-black">
                Copiar Link
              </Button>
            </div>
          </div>
        </div>

        {/* Rewards Section */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Suas Recompensas Atuais</h2>
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2">
              ✅
              <span className="text-gray-500 text-sm font-medium">
                Desconto 50% no próximo evento
              </span>
            </div>
            <div className="flex items-center space-x-2">
              🎁
              <span className="text-gray-500 text-sm font-medium">Camiseta exclusiva</span>
            </div>
          </div>
          <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-lg">
            Resgatar Recompensas
          </Button>
        </div>

        {/* Stats Section */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Estatísticas de Convites</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="shadow-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="w-10 h-10 rounded-full bg-[#183935]/10 flex items-center justify-center mb-3">
                    <Mail className="w-12 h-12 text-secondary" />
                  </div>
                  <span className="text-gray-500 text-sm font-medium mb-1">Convites</span>
                  <span className="text-2xl font-bold text-gray-900">280</span>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="w-10 h-10 rounded-full bg-[#183935]/10 flex items-center justify-center mb-3">
                    <Users className="w-12 h-12 text-secondary" />
                  </div>
                  <span className="text-gray-500 text-sm font-medium mb-1">
                    Pessoas que Aceitaram
                  </span>
                  <span className="text-2xl font-bold text-gray-900">120</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ranking Section */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ranking de Convites</h2>
          <div className="space-y-4">
            {[
              { rank: 1, name: "Você", invites: "120 Convites Aceitos", bold: true },
              { rank: 2, name: "Maria", invites: "109 Convites Aceitos", bold: false },
              { rank: 3, name: "Pedro", invites: "90 Convites Aceitos", bold: false },
            ].map((item) => (
              <div key={item.rank} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-semibold w-4 text-center text-black">{item.rank}.</span>
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${item.name}`}
                    />
                    <AvatarFallback>{item.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1 text-sm text-black">
                    <span className={item.bold ? "font-bold" : "font-medium"}>{item.name}</span>
                    <span className="text-gray-500">- {item.invites}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                  🎁
                  <span>Desconto 50%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 pb-8">
          <Button className="flex-1 bg-accent hover:bg-accent/90 text-white py-6 text-lg rounded-xl">
            Gerar Novo Link
          </Button>
          <Button
            variant="outline"
            className="flex-1 py-6 text-lg rounded-xl border-secondary text-secondary hover:text-secondary"
          >
            <Share className="w-5 h-5 mr-2" />
            Compartilhar
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
