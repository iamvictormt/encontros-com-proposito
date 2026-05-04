"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { Smile } from "lucide-react";

interface StatBoxProps {
  label: string;
  value: string | number;
  prefix?: string;
  className?: string;
}

export function StatBox({ label, value, prefix, className = "" }: StatBoxProps) {
  return (
    <div className={`premium-card bg-white p-5 sm:p-8 rounded-[2rem] flex flex-col border-none ${className}`}>
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-[0.2em] text-brand-black/40 mb-3 line-clamp-2" title={label}>{label}</span>
      <div className="flex items-baseline gap-1">
        {prefix && <span className="text-lg font-black text-brand-orange">{prefix}</span>}
        <span className="text-3xl sm:text-5xl font-black text-brand-black tracking-tighter">{value}</span>
      </div>
      <div className="h-1 w-12 bg-brand-orange rounded-full mt-4 sm:mt-6 shadow-[0_0_8px_#FF1D55]" />
    </div>
  );
}

export function SatisfactionGauge({ percentage }: { percentage: number }) {
  const data = [
    { name: "Value", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill="url(#gaugeGradient)" />
              <Cell fill="#F3F4F6" />
            </Pie>
            <defs>
              <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F97316" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#F97316" />
              </linearGradient>
            </defs>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Emoji Center */}
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="bg-[#F97316] p-2 rounded-full shadow-lg">
          <Smile className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Percentage Label */}
      <div className="mt-[-20px] text-center">
        <div className="flex items-center justify-between w-full px-4 text-[10px] text-gray-400 mb-2">
          <span>0%</span>
          <span>100%</span>
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-black">{percentage}%</div>
        <p className="text-[10px] text-gray-400 mt-1">Baseado em avaliações positivas</p>
      </div>
    </div>
  );
}

interface ProductListItemProps {
  image: string;
  name: string;
  stock: number;
  profit: number;
  units: number;
  maxUnits: number;
}

export function ProductListItem({ image, name, stock, profit, units, maxUnits }: ProductListItemProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-6 bg-white hover:bg-brand-black/5 transition-all duration-300 rounded-3xl group">
      <div className="flex items-center gap-6 mb-4 sm:mb-0">
        <div className="relative h-20 w-20 rounded-2xl overflow-hidden shadow-md border border-brand-green/5 flex-shrink-0">
          <Image src={image} alt={name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>
        <div>
          <h4 className="font-black text-brand-black text-lg uppercase tracking-tighter group-hover:text-brand-orange transition-colors">{name}</h4>
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 mt-1">
            Estoque: <span className={stock > 10 ? "text-brand-green" : "text-brand-red"}>{stock} DISPONÍVEIS</span>
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-8 sm:gap-16">
        <div className="text-left sm:text-right">
          <span className="text-[9px] font-black uppercase tracking-widest text-brand-black/30 block mb-1">Lucro Gerado:</span>
          <span className="text-xl font-black text-brand-black">R$ {profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        
        <div className="flex-1 sm:w-48 min-w-[200px]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/40">
               Volume de Vendas
            </span>
            <span className="text-[10px] font-black text-brand-orange">{units} un.</span>
          </div>
          <Progress value={(units / maxUnits) * 100} className="h-2 bg-brand-black/5 rounded-full overflow-hidden" indicatorClassName="bg-brand-orange shadow-[0_0_8px_#FF1D55]" />
        </div>
      </div>
    </div>
  );
}

interface InviteSourceItemProps {
  label: string;
  invites: number;
  accepted: number;
  maxInvites: number;
}

export function InviteSourceItem({ label, invites, accepted, maxInvites }: InviteSourceItemProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-6 bg-white hover:bg-brand-black/5 transition-all duration-300 rounded-3xl group">
      <div className="w-full sm:w-1/4 mb-4 sm:mb-0">
        <h4 className="font-black text-brand-black text-lg uppercase tracking-tighter group-hover:text-brand-orange transition-colors">{label}</h4>
        <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 mt-1">Canal de Origem</p>
      </div>
      
      <div className="flex-1 px-0 sm:px-12 mb-4 sm:mb-0">
        <div className="flex justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/40">
            Total de Convites
          </span>
          <span className="text-[10px] font-black text-brand-green">{invites}</span>
        </div>
        <Progress value={(invites / maxInvites) * 100} className="h-2 bg-brand-black/5 rounded-full overflow-hidden" indicatorClassName="bg-brand-green shadow-[0_0_8px_#1F4C47]" />
      </div>

      <div className="w-full sm:w-1/4 text-left sm:text-right">
        <span className="text-[9px] font-black uppercase tracking-widest text-brand-black/30 block mb-1">Aceitos:</span>
        <span className="text-xl font-black text-brand-black">{accepted} Convites</span>
      </div>
    </div>
  );
}
