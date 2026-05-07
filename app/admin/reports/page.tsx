"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Loader2, MoreHorizontal, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  StatBox,
  SatisfactionGauge,
  ProductListItem,
  InviteSourceItem,
} from "@/components/admin-report-components";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const mockLineData = [
  { name: "Jun 5", current: 25000, previous: 8000 },
  { name: "Jun 6", current: 22000, previous: 15000 },
  { name: "Jun 7", current: 18000, previous: 12000 },
  { name: "Jun 8", current: 35000, previous: 28000 },
  { name: "Jun 89", current: 30000, previous: 45000 },
  { name: "Jun 9", current: 22000, previous: 48000 },
  { name: "Jun 10", current: 18000, previous: 30000 },
];

const mockProducts = [
  {
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60",
    name: 'Camiseta "Desligue o App"',
    stock: 15,
    profit: 289.0,
    units: 120,
  },
  {
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60",
    name: 'Camiseta "Desligue o App"',
    stock: 15,
    profit: 289.0,
    units: 120,
  },
  {
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60",
    name: 'Camiseta "Desligue o App"',
    stock: 15,
    profit: 289.0,
    units: 120,
  },
];

const mockInvites = [
  { label: "Anfitriões", invites: 150, accepted: 80 },
  { label: "Cupidos", invites: 150, accepted: 80 },
  { label: "Outros", invites: 150, accepted: 80 },
];

export default function AdminReports() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );

  const expiryDate = user?.subscriptionExpiry ? new Date(user.subscriptionExpiry) : new Date(0);
  const hasValidSubscription = user?.subscriptionStatus === 'active' || (user?.subscriptionStatus === 'canceled' && expiryDate > new Date());
  
  // If user is a free company or partner, restrict access
  const isRestricted = (user?.userCategory === "EMPRESA" || user?.userCategory === "PARCEIRO") && !hasValidSubscription;

  return (
    <div className="space-y-16 pb-12 relative">
      {isRestricted && (
        <div className="absolute inset-0 z-50 flex items-start justify-center pt-32 backdrop-blur-[8px] bg-white/40 rounded-[3rem]">
          <div className="glass-dark p-12 rounded-[2.5rem] text-center border border-white/10 shadow-2xl max-w-xl mx-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 blur-3xl rounded-full mix-blend-screen" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter mb-4">
                Desbloqueie <span className="text-brand-orange">Analytics</span>
              </h3>
              <p className="text-sm font-medium text-white/60 mb-8 max-w-md mx-auto">
                {user?.userCategory === "EMPRESA" 
                  ? "Seu estabelecimento está recebendo alta procura. Desbloqueie leads qualificados e veja as métricas completas de acesso."
                  : "Parceiros Premium recebem relatórios detalhados de conversão e leads."}
              </p>
              <Button 
                onClick={() => window.location.href = "/subscriptions"}
                className="bg-gradient-to-r from-brand-orange to-brand-red text-white h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:scale-105 transition-transform"
              >
                Seja Premium
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className={cn("space-y-16", isRestricted && "opacity-30 pointer-events-none select-none")}>
        <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-8 bg-brand-orange rounded-full" />
          <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
            Estatísticas de Desempenho
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          <StatBox label="Total de Vendas" value="45.058" prefix="R$" />
          <StatBox label="Eventos Criados" value="28" />
          <StatBox label="Convites Aceitos" value="342" />
          <StatBox label="Agendamentos" value="120" />
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Relatórios Detalhados
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-brand-black tracking-tighter uppercase mt-4">
              Análise de <span className="text-brand-orange">Crescimento</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Sales Profit Chart */}
          <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden p-4 sm:p-8">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 px-0 pt-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 bg-brand-green rounded-full" />
                <CardTitle className="text-lg sm:text-xl font-black uppercase tracking-tighter text-brand-black">
                  Lucro de Vendas
                </CardTitle>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-4 bg-brand-black/5 px-4 py-2 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand-green" />
                    <span className="text-[9px] font-black uppercase text-brand-black/40">Este Mês</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand-red" />
                    <span className="text-[9px] font-black uppercase text-brand-black/40">Anterior</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest gap-2 rounded-xl border-brand-black/10">
                  <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                  Junho 2024
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[350px] p-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockLineData}>
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#000', fontSize: 10, fontWeight: 900 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#000', fontSize: 10, fontWeight: 900 }}
                    tickFormatter={(v) => `R$ ${v/1000}k`}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-brand-black p-4 rounded-2xl shadow-2xl border-none">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Performance</p>
                            <p className="text-lg font-black text-white">R$ {payload[0].value?.toLocaleString()}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-brand-orange">Meta Batida</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previous" 
                    stroke="#FF1D55" 
                    strokeWidth={4} 
                    dot={false}
                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#0A4742" 
                    strokeWidth={4} 
                    dot={false}
                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Satisfaction Gauge */}
          <Card className="border-none shadow-sm rounded-[2.5rem] bg-white flex flex-col p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg sm:text-xl font-black uppercase tracking-tighter text-brand-black">Satisfação</CardTitle>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 mt-1">Feedback dos Clientes</p>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center p-0">
              <SatisfactionGauge percentage={95} />
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-16">
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 bg-brand-red rounded-full" />
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-brand-black">Produtos em Destaque</h2>
          </div>
          <div className="bg-white rounded-[2.5rem] overflow-hidden p-4 sm:p-8 shadow-sm">
            <div className="space-y-4">
              {mockProducts.map((product, i) => (
                <ProductListItem 
                  key={i} 
                  {...product} 
                  maxUnits={150} 
                />
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 bg-brand-orange rounded-full" />
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-brand-black">Canais de Conversão</h2>
          </div>
          <div className="bg-white rounded-[2.5rem] overflow-hidden p-4 sm:p-8 shadow-sm">
            <div className="space-y-4">
              {mockInvites.map((invite, i) => (
                <InviteSourceItem 
                  key={i} 
                  {...invite} 
                  maxInvites={200} 
                />
              ))}
            </div>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}
