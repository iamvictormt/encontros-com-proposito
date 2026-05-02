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
    <div
      className={`bg-white p-8 rounded-[2rem] shadow-xl border border-white flex flex-col gap-3 relative overflow-hidden group transition-all hover:scale-[1.02] ${className}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-all group-hover:scale-150" />
      <span className="text-muted-foreground text-[10px] font-black uppercase italic tracking-widest relative z-10">
        {label}
      </span>
      <div className="flex items-baseline gap-1 relative z-10">
        {prefix && <span className="text-primary text-xl font-black italic uppercase">{prefix}</span>}
        <span className="text-primary text-5xl font-black italic uppercase tracking-tight">
          {value}
        </span>
      </div>
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
        <div className="text-3xl font-bold text-black">{percentage}%</div>
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
    <div className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors rounded-xl">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
        <div>
          <h4 className="font-bold text-black text-sm">{name}</h4>
          <p className="text-gray-400 text-xs">Estoque: {stock} Disponíveis</p>
        </div>
      </div>
      
      <div className="flex items-center gap-12">
        <div className="text-right">
          <span className="text-gray-400 text-xs block">Lucro:</span>
          <span className="font-bold text-black">{profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        
        <div className="w-32">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 font-medium underline decoration-gray-300 underline-offset-4">
               {units} unidades
            </span>
          </div>
          <Progress value={(units / maxUnits) * 100} className="h-1.5 bg-gray-100" indicatorClassName="bg-[#1A4B40]" />
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
    <div className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors rounded-xl">
      <div className="w-1/4">
        <h4 className="font-bold text-[#1A4B40] text-sm">{label}:</h4>
      </div>
      
      <div className="w-1/3 px-4">
        <div className="flex justify-start mb-1">
          <span className="text-[10px] text-gray-400 font-medium underline decoration-gray-300 underline-offset-4">
            {invites} Convites
          </span>
        </div>
        <Progress value={(invites / maxInvites) * 100} className="h-1.5 bg-gray-100" indicatorClassName="bg-[#1A4B40]" />
      </div>

      <div className="w-1/3 text-right">
        <span className="font-bold text-black text-sm">{accepted} Convites Aceitos</span>
      </div>
    </div>
  );
}
