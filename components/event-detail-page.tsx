"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import {
  MapPin,
  Calendar,
  Share2,
  ChevronLeft,
  ChevronRight,
  Play,
  Check,
  Share,
} from "lucide-react";
import Image from "next/image";
import { EventHeroCarousel } from "./event-hero-carousel";

// Mock event data
const event = {
  id: 1,
  title: "Ritual do Amor Interior",
  date: "20 de Setembro de 2025",
  time: "19h",
  location: "Avenida Paulista",
  city: "São Paulo/SP",
  description:
    'O "Ritual do Amor Interior" é uma jornada espiritual e afetiva voltada à reconexão pessoal e relacional.\n\nNeste encontro, você irá vivenciar dinâmicas coletivas e práticas de autocuidado com outros buscadores.',
  images: [
    "https://images.unsplash.com/photo-1513279922550-250c2129b13a?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1600&auto=format&fit=crop",
  ],
};

const groups = [
  { id: 1, name: "Grupo 1", spots: 10 },
  { id: 2, name: "Grupo 2", spots: 5 },
  { id: 3, name: "Grupo 3", spots: 2 },
];

export function EventDetailPage() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <EventHeroCarousel images={event.images} />

        <div className="mx-auto max-w-7xl px-4 md:px-0">
          {/* 3 Top Cards (Overlapping Hero significantly) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-14 -mt-24 md:-mt-48 relative z-10 mb-12">
            {/* Card 1: Event Info */}
            <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-10 flex flex-col justify-start h-full">
              <h1 className="text-2xl md:text-[28px] leading-tight font-bold text-gray-900 mb-12">
                {event.title}
              </h1>
              <div className="space-y-10">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <MapPin className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Local</p>
                    <p className="text-accent font-medium text-sm md:text-[15px] border-b border-accent inline-block pb-0.5">
                      {event.location} <span className="text-gray-300">•</span> {event.city}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <Calendar className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Data e Hora</p>
                    <p className="font-semibold text-gray-900 text-sm md:text-[15px]">
                      {event.date} <span className="text-gray-300 font-normal">•</span> {event.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Ingresso */}
            <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-10 flex flex-col justify-start h-full space-y-6 border-l border-dashed border-gray-100">
              <div>
                <h2 className="text-[22px] font-bold text-gray-900 mb-1">Ingresso</h2>
                <p className="text-[15px] text-gray-400">Comprar pelo nosso sistema</p>
              </div>

              <Button className="w-full bg-[#F28D35] hover:bg-[#de7c2c] text-white font-semibold text-[15px] py-6 rounded-lg mt-2">
                Pagar e participar
              </Button>

              <div className="relative flex items-center py-2">
                <div className="grow border-t border-gray-100"></div>
                <span className="shrink-0 px-4 text-xs text-gray-400 bg-white">ou</span>
                <div className="grow border-t border-gray-100"></div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2">Integrar com:</p>
                <Select defaultValue="mounter">
                  <SelectTrigger className="w-full bg-white text-gray-900 font-medium h-12 rounded-lg border-gray-200">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mounter">Mounter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Card 3: Token */}
            <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-10 flex flex-col justify-start h-full space-y-6 border-l border-dashed border-gray-100">
              <div>
                <h2 className="text-[22px] font-bold text-gray-900 mb-4">Seu token exclusivo</h2>
                <div className="flex border border-gray-200 rounded-lg p-1 bg-white">
                  <Input
                    type="text"
                    value="checklove.com/invite/AH23..."
                    readOnly
                    className="border-none focus-visible:ring-0 shadow-none bg-transparent flex-1 text-sm font-medium text-gray-900 truncate px-3"
                  />
                  <Button className="bg-[#F28D35] hover:bg-[#de7c2c] text-white rounded-md px-5 text-sm font-semibold h-[38px]">
                    Copiar
                  </Button>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[15px] text-gray-900 mb-3">
                  Convide amigos para vivenciarem com você!
                </p>
                <Button
                  variant="outline"
                  className="w-full h-12 border-secondary text-secondary hover:text-secondary/80 bg-white hover:bg-gray-50 font-medium rounded-lg"
                >
                  <Share className="w-[18px] h-[18px] mr-2 text-secondary" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Apresentação */}
            <div className="space-y-4">
              <h2 className="text-[22px] font-bold text-gray-900">Apresentação</h2>
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-200 group cursor-pointer shadow-sm">
                <Image
                  src={event.images[0]}
                  alt="Apresentação do evento"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center pl-1 shadow-[0_0_15px_rgba(0,0,0,0.1)]">
                      <Play className="w-[22px] h-[22px] text-gray-800" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sobre o Evento */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col justify-start">
              <h2 className="text-[22px] font-bold text-gray-900 mb-4">Sobre o Evento</h2>
              <div className="space-y-2">
                <p className="text-gray-500 leading-relaxed text-[15px]">
                  O "Ritual do Amor Interior" é uma jornada espiritual e afetiva voltada à reconexão
                  pessoal e relacional.
                </p>
                <p className="text-gray-500 leading-relaxed text-[15px]">
                  Neste encontro, você irá vivenciar dinâmicas coletivas e práticas de autocuidado
                  com outros buscadores.
                </p>

                <ul className="space-y-2 mt-4 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-[18px] h-[18px] text-gray-800" strokeWidth={3} />
                    <span className="font-bold text-[#355E53] text-[15px]">
                      Aberto para todos os públicos
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-[18px] h-[18px] text-gray-800" strokeWidth={3} />
                    <span className="font-bold text-[#355E53] text-[15px]">
                      Condutor: João Silva (Fundador Checklove)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-[18px] h-[18px] text-gray-800" strokeWidth={3} />
                    <span className="font-bold text-[#355E53] text-[15px]">
                      Evento certificado com selo MeetOff
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Produtos obrigatórios */}
            <div className="space-y-4">
              <h2 className="text-[22px] font-bold text-gray-900">Produtos obrigatórios</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Produto 1 */}
                <div className="space-y-3">
                  <div className="bg-white rounded-xl aspect-square relative p-2 shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-2 left-2 z-10 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-[14px] h-[14px] bg-[#F28D35] rounded-full flex items-center justify-center">
                        <Check className="w-[10px] h-[10px] text-white" strokeWidth={4} />
                      </div>
                    </div>
                    <Image
                      src="https://images.unsplash.com/photo-1566534335938-05f1f2949435?q=80&w=687&auto=format&fit=crop"
                      alt="Lenço de Pescoço"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <p className="font-bold text-[13px] text-gray-900 leading-tight">
                    Lenço de Pescoço
                  </p>
                </div>
                {/* Produto 2 */}
                <div className="space-y-3">
                  <div className="bg-white rounded-xl aspect-square relative p-2 shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-2 left-2 z-10 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-[14px] h-[14px] bg-[#F28D35] rounded-full flex items-center justify-center">
                        <Check className="w-[10px] h-[10px] text-white" strokeWidth={4} />
                      </div>
                    </div>
                    <Image
                      src="https://images.unsplash.com/photo-1669311266055-d13419bdc535?q=80&w=687&auto=format&fit=crop"
                      alt="Camiseteta Autoral"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <p className="font-bold text-[13px] text-gray-900 leading-tight">
                    Camiseteta Autoral
                  </p>
                </div>
                {/* Produto 3 */}
                <div className="space-y-3">
                  <div className="bg-white rounded-xl aspect-square relative p-2 shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-2 left-2 z-10 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-[14px] h-[14px] rounded-full border-2 border-[#F28D35]"></div>
                    </div>
                    <Image
                      src="https://images.unsplash.com/photo-1614330258898-86823c7e3de2?q=80&w=1470&auto=format&fit=crop"
                      alt="Pulseira de identificação"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <p className="font-bold text-[13px] text-gray-900 leading-tight">
                    Pulseira de identificação
                  </p>
                </div>
              </div>
            </div>

            {/* Grupos disponíveis */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col justify-start">
              <h2 className="text-[22px] font-bold text-gray-900 mb-1">
                Grupos disponíveis para participação
              </h2>
              <p className="text-[15px] text-gray-400 mb-2">
                Quer companhia? Escolha um grupo para ir ao evento junto com você!
              </p>

              <div className="space-y-0">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="flex flex-wrap items-center justify-between py-[18px] border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-2 mb-2 sm:mb-0">
                      <span className="font-bold text-[#355E53] text-[15px]">{group.name}</span>
                      <span className="text-gray-400 font-medium text-[15px]">
                        - {group.spots} Vagas Disponíveis
                      </span>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Avatars */}
                      <div className="flex -space-x-2">
                        <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${group.id}1`} />
                          <AvatarFallback>A1</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${group.id}2`} />
                          <AvatarFallback>A2</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${group.id}3`} />
                          <AvatarFallback>A3</AvatarFallback>
                        </Avatar>
                      </div>
                      <Button className="bg-[#2B4B42] hover:bg-[#1f3731] text-white px-5 h-9 rounded-md font-medium text-sm">
                        Entrar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
