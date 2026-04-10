"use client";

import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export function ScheduleSessionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F6]">
      <SiteHeader />

      <main className="flex-1 bg-white max-w-4xl mx-auto w-full mb-12 shadow-sm rounded-lg">
        <div className="px-6 py-12 md:px-24">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3 text-black">Agende Sua Sessão</h1>
            <p className="text-gray-500 text-sm">
              Preencha os dados abaixo e entraremos em contato para confirmar seu horário.
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="token" className="text-sm font-medium">
                Seu Token
              </Label>
              <Input
                id="token"
                placeholder="ABCD-1234-EFGH-5678"
                className="bg-white border-gray-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Informe seu Email"
                  className="bg-white border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Telefone / WhatsApp
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Informe Telefone / WhatsApp"
                  className="bg-white border-gray-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  Data da sessão
                </Label>
                <div className="relative">
                  <Input id="date" type="date" className="bg-white border-gray-200 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium">
                  Horário Preferencial
                </Label>
                <Select>
                  <SelectTrigger className="bg-white border-gray-200 w-full text-left">
                    <SelectValue placeholder="00:00 PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00 AM">08:00 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                    <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                    <SelectItem value="06:00 PM">06:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Forma de Atendimento
              </Label>
              <Select defaultValue="presencial">
                <SelectTrigger className="bg-white border-gray-200 w-full text-left">
                  <SelectValue placeholder="Presencial" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-medium">
                Motivo do Atendimento
              </Label>
              <Textarea
                id="reason"
                placeholder="Descreva brevemente o motivo da consulta"
                className="min-h-[120px] bg-white border-gray-200 resize-y"
              />
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                type="button"
                className="bg-accent hover:bg-accent/90 text-white rounded-md px-10 py-6 button-base w-1/2 md:w-auto"
              >
                Agendar Sessão
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                className="rounded-md px-10 py-6 button-base w-1/2 md:w-auto border-gray-200 text-black hover:bg-gray-50"
              >
                <Link href="/portfolio">Voltar</Link>
              </Button>
            </div>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
