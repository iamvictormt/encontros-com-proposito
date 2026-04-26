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
    <div className="space-y-8 pb-12">
      {/* Quick Stats Section */}
      <section>
        <h2 className="text-xl font-bold text-black mb-6">Estatísticas Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox label="Total de Vendas" value="45.058" prefix="R$" />
          <StatBox label="Eventos Criados" value="28" />
          <StatBox label="Convites Aceitos" value="342" />
          <StatBox label="Agendamentos" value="120" />
        </div>
      </section>

      {/* Main Reports Section */}
      <section>
        <h2 className="text-xl font-bold text-black mb-6">Relatórios</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Sales Profit Chart */}
          <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold text-black flex items-center gap-1">
                  Lucro de vendas <span className="text-gray-300 text-xs font-normal">ⓘ</span>
                </CardTitle>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs">
                   <div className="flex items-center gap-1">
                      <div className="w-8 h-0.5 bg-[#8B2F2A]" />
                      <span className="text-gray-400">Meses anteriores</span>
                   </div>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-2 rounded-lg border-gray-200">
                  <Calendar className="w-3.5 h-3.5 text-[#1A4B40]" />
                  Junho 2024
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockLineData}>
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    tickFormatter={(v) => `${v/1000}k`}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100">
                            <p className="text-[10px] text-gray-400 mb-1">Esse mês</p>
                            <p className="text-sm font-bold text-black">R${payload[0].value}</p>
                            <p className="text-[10px] text-gray-400">Junho</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previous" 
                    stroke="#8B2F2A" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#1A4B40" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Satisfaction Gauge */}
          <Card className="border-none shadow-sm rounded-2xl flex flex-col">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-black">Satisfação de Clientes</CardTitle>
              <p className="text-[10px] text-gray-400">porcentagem de satisfação</p>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center pt-0">
              <SatisfactionGauge percentage={95} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Lists Section */}
      <div className="grid grid-cols-1 gap-8">
        {/* Top Products */}
        <section>
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-black">Produtos mais vendidos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {mockProducts.map((product, i) => (
                  <ProductListItem 
                    key={i} 
                    {...product} 
                    maxUnits={150} 
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Invite Sources */}
        <section>
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-black">Convites por origem</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {mockInvites.map((invite, i) => (
                  <InviteSourceItem 
                    key={i} 
                    {...invite} 
                    maxInvites={200} 
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
