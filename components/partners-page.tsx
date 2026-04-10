"use client";

import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShieldCheck, Target, CalendarDays, Megaphone, Share2 } from "lucide-react";
import Image from "next/image";

const partnersMock = [
  {
    name: "Café da Praça",
    type: "Cafeteria",
    location: "São Paulo/SP",
    products: "Café + Networking",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Hotel Vista Azul",
    type: "Hotel & Eventos",
    location: "São Paulo/SP",
    products: "Hospedagem",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Hot Bar",
    type: "Bar",
    location: "São Paulo/SP",
    products: "Bebidas & Lanches",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800&auto=format&fit=crop",
  },
];

export function PartnersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="px-4 py-8 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">Empresas e Parcerias</h1>
            <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
              Cadastre sua empresa e conecte-se a eventos, pontos de encontro e vendas!
            </p>
          </div>
          {/* Form Section */}
          <div className="max-w-2xl mx-auto mb-16 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Empresa
                </label>
                <Input placeholder="Informe o nome da sua empresa" className="bg-white" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Negócio
                  </label>
                  <Select>
                    <SelectTrigger className="bg-white w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="servicos">Serviços</SelectItem>
                      <SelectItem value="produtos">Produtos</SelectItem>
                      <SelectItem value="tecnologia">Tecnologia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <Select>
                    <SelectTrigger className="bg-white w-full">
                      <SelectValue placeholder="Ex: Ponto de encontro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ponto_encontro">Ponto de encontro</SelectItem>
                      <SelectItem value="fornecedor">Fornecedor</SelectItem>
                      <SelectItem value="parceiro_estrategico">Parceiro Estratégico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                <Input
                  placeholder="Informe o endereço completo da sua empresa"
                  className="bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produtos/Serviços
                </label>
                <Select>
                  <SelectTrigger className="bg-white w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="terapia">Terapia</SelectItem>
                    <SelectItem value="viagem">Viagens</SelectItem>
                    <SelectItem value="alimentacao">Alimentação</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2 mt-3">
                  <Badge
                    variant="secondary"
                    className="bg-[#8B2F2A] hover:bg-[#8B2F2A]/90 text-white rounded-md px-3 font-normal"
                  >
                    Terapia
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-[#8B2F2A] hover:bg-[#8B2F2A]/90 text-white rounded-md px-3 font-normal"
                  >
                    Viagem
                  </Badge>
                </div>
              </div>
            </div>

            <Button className="w-full bg-[#E58043] hover:bg-[#E58043]/90 text-white py-6 text-base rounded-md font-semibold">
              Enviar Cadastro para Aprovação
            </Button>
          </div>
          {/* Separator */}
          <div className="w-24 h-px bg-gray-200 mx-auto mb-12"></div>
          {/* Featured Partners */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-black mb-8 text-center">Parceiros em destaque</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {partnersMock.map((partner, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={partner.image}
                      alt={partner.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-black text-lg mb-3">{partner.name}</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-500">
                        <span className="text-gray-400">Tipo:</span>{" "}
                        <span className="font-medium text-secondary">{partner.type}</span>
                      </p>
                      <p className="text-gray-500">
                        <span className="text-gray-400">Local:</span>{" "}
                        <span className="font-medium text-secondary underline underline-offset-2">
                          {partner.location}
                        </span>
                      </p>
                      <p className="text-gray-500">
                        <span className="text-gray-400">Produtos:</span>{" "}
                        <span className="font-semibold text-secondary">{partner.products}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button className="text-primary text-sm tracking-wide hover:underline underline-offset-4 cursor-pointer">
                Ver Mais
              </button>
            </div>
          </div>
          {/* Separator */}
          <div className="w-24 h-px bg-gray-200 mx-auto mb-12"></div>
          {/* Benefits */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-center text-black mb-10">
              Benefícios para Parceiros
            </h2>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 mb-10">
                <div>
                  <ShieldCheck className="w-6 h-6 text-gray-800 mb-3" />
                  <h3 className="font-bold text-sm text-black mb-2">Selo Oficial</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Ganhe o selo de aprovação, aumentando a confiança e credibilidade do seu
                    negócio.
                  </p>
                </div>
                <div>
                  <Target className="w-6 h-6 text-gray-800 mb-3" />
                  <h3 className="font-bold text-sm text-black mb-2">Público Qualificado</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Conecte-se diretamente com pessoas interessadas nos seus serviços e produtos.
                  </p>
                </div>
                <div>
                  <CalendarDays className="w-6 h-6 text-gray-800 mb-3" />
                  <h3 className="font-bold text-sm text-black mb-2">Participação em Eventos</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Presença garantida nos eventos e ações exclusivas da plataforma.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 lg:w-2/3 lg:mx-auto">
                <div>
                  <Megaphone className="w-6 h-6 text-gray-800 mb-3" />
                  <h3 className="font-bold text-sm text-black mb-2">Divulgação Premium</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Destaque em banners e áreas de maior visibilidade no sistema.
                  </p>
                </div>
                <div>
                  <Share2 className="w-6 h-6 text-gray-800 mb-3" />
                  <h3 className="font-bold text-sm text-black mb-2">Rede de Parcerias</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Faça networking com outros parceiros estratégicos para gerar mais oportunidades.
                  </p>
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
