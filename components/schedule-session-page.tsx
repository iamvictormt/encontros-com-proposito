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
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function ScheduleSessionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    token: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    type: "presencial",
    reason: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Sessão agendada com sucesso! Entraremos em contato.");
      // Reset form or redirect
    } catch (error) {
      toast.error("Erro ao agendar sessão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="token" className="text-sm font-medium">
                Seu Token
              </Label>
              <Input
                id="token"
                placeholder="ABCD-1234-EFGH-5678"
                className="bg-white border-gray-200"
                value={formData.token}
                onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                required
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
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
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  Data da sessão
                </Label>
                <div className="relative">
                  <Input 
                    id="date" 
                    type="date" 
                    className="bg-white border-gray-200 w-full" 
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium">
                  Horário Preferencial
                </Label>
                <Select 
                  value={formData.time} 
                  onValueChange={(value) => setFormData({ ...formData, time: value })}
                >
                  <SelectTrigger className="bg-white border-gray-200 w-full text-left">
                    <SelectValue placeholder="Escolha um horário" />
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
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
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
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-accent hover:bg-accent/90 text-white rounded-md px-10 py-6 button-base w-1/2 md:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Agendando...
                  </>
                ) : (
                  "Agendar Sessão"
                )}
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
