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

  return (
    <div className="space-y-12 pb-20">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1 w-8 bg-brand-orange rounded-full" />
          <span className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.3em]">
            Administração
          </span>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-brand-black lg:text-5xl">
          Análise & <span className="text-brand-red">Relatórios</span>
        </h1>
      </header>

      {/* Quick Stats Section */}
      <section className="glass rounded-[2rem] p-8 lg:p-10 border-brand-green/5">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-6 bg-brand-green rounded-full" />
          <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
            Visão Geral
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox label="Total de Vendas" value="45.058" prefix="R$" />
          <StatBox label="Eventos Criados" value="28" />
          <StatBox label="Convites Aceitos" value="342" />
          <StatBox label="Agendamentos" value="120" />
        </div>
      </section>

      {/* Main Reports Section */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Sales Profit Chart */}
          <div className="lg:col-span-2 glass rounded-[2rem] p-8 border-brand-green/5 overflow-hidden flex flex-col">
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-6 bg-brand-red rounded-full" />
                  <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
                    Desempenho
                  </h2>
                </div>
                <p className="text-2xl font-black text-brand-black uppercase tracking-tight mt-2 flex items-center gap-2">
                  Lucro de vendas <span className="text-brand-black/20 text-xs font-black">ⓘ</span>
                </p>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="hidden sm:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest mr-4">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-1 bg-brand-red rounded-full" />
                      <span className="text-brand-black/40">Anterior</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-1 bg-brand-green rounded-full" />
                      <span className="text-brand-black/40">Atual</span>
                   </div>
                </div>
                <Button variant="outline" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest gap-2 rounded-xl border-brand-green/10 bg-white/50 text-brand-green flex-1 sm:flex-none">
                  <Calendar className="w-3.5 h-3.5" />
                  Junho 2024
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-brand-black/40 hover:bg-brand-green/5 rounded-xl">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </header>
            
            <div className="h-[300px] flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockLineData}>
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(31, 76, 71, 0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(0, 0, 0, 0.3)', fontSize: 10, fontWeight: 900 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(0, 0, 0, 0.3)', fontSize: 10, fontWeight: 900 }}
                    tickFormatter={(v) => `${v/1000}k`}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass p-4 rounded-2xl shadow-xl border-brand-green/5">
                            <p className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-1">Resultado</p>
                            <p className="text-lg font-black text-brand-black">R${payload[0].value.toLocaleString()}</p>
                            <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest">Junho 2024</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previous" 
                    stroke="#8A0204" 
                    strokeWidth={4} 
                    dot={false}
                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#1F4C47" 
                    strokeWidth={4} 
                    dot={false}
                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Satisfaction Gauge */}
          <div className="glass rounded-[2rem] p-8 border-brand-green/5 flex flex-col items-center justify-center text-center">
            <header className="mb-8 w-full">
              <div className="flex items-center gap-3 justify-center mb-1">
                <div className="h-1 w-6 bg-brand-orange rounded-full" />
                <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
                  NPS
                </h2>
              </div>
              <p className="text-xl font-black text-brand-black uppercase tracking-tight">Satisfação de Clientes</p>
            </header>
            <div className="flex-1 flex items-center justify-center w-full">
              <SatisfactionGauge percentage={95} />
            </div>
          </div>
        </div>
      </section>

      {/* Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <section className="glass rounded-[2rem] border-brand-green/5 overflow-hidden">
          <header className="p-8 border-b border-brand-green/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-1 w-6 bg-brand-red rounded-full" />
              <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">Ranking</h2>
            </div>
            <p className="text-xl font-black text-brand-black uppercase tracking-tight">Produtos mais vendidos</p>
          </header>
          <div className="p-4 sm:p-8 space-y-2">
            {mockProducts.map((product, i) => (
              <ProductListItem 
                key={i} 
                {...product} 
                maxUnits={150} 
              />
            ))}
          </div>
        </section>

        {/* Invite Sources */}
        <section className="glass rounded-[2rem] border-brand-green/5 overflow-hidden">
          <header className="p-8 border-b border-brand-green/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-1 w-6 bg-brand-orange rounded-full" />
              <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">Origem</h2>
            </div>
            <p className="text-xl font-black text-brand-black uppercase tracking-tight">Convites por origem</p>
          </header>
          <div className="p-4 sm:p-8 space-y-2">
            {mockInvites.map((invite, i) => (
              <InviteSourceItem 
                key={i} 
                {...invite} 
                maxInvites={200} 
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
