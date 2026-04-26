"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Loader2
} from "lucide-react";
import Image from "next/image";
import { EventHeroCarousel } from "./event-hero-carousel";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isParticipating, setIsParticipating] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events?id=${id}`);
        const data = await res.json();
        setEvent(data);
        
        if (isLoggedIn && user) {
          const partRes = await fetch(`/api/participate?eventId=${id}&userId=${user.id}`);
          const partData = await partRes.json();
          setIsParticipating(partData.isParticipating);
        }
      } catch (error) {
        toast.error("Erro ao carregar detalhes do evento");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, isLoggedIn, user]);

  const handleParticipate = async () => {
    if (!isLoggedIn) {
      toast.error("Faça login para participar");
      router.push("/login");
      return;
    }

    if (isParticipating) {
      toast.info("Você já está inscrito neste evento");
      return;
    }

    setIsActionLoading(true);
    try {
      const res = await fetch("/api/participate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: id }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setIsParticipating(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Erro ao confirmar participação");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20 min-h-screen bg-white"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;
  if (!event) return <div className="flex justify-center py-20 min-h-screen bg-white">Evento não encontrado</div>;

  const eventDate = new Date(event.date).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <EventHeroCarousel images={event.images ? JSON.parse(event.images) : [event.image]} />

        <div className="mx-auto max-w-7xl px-4 md:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 -mt-24 md:-mt-48 relative z-10 mb-12 bg-white rounded-[2rem] shadow-xl overflow-hidden">
            {/* Card 1: Event Info */}
            <div className="p-10 flex flex-col justify-between h-full">
              <div>
                <h1 className="text-3xl md:text-[36px] leading-tight font-bold text-black mb-12">
                  {event.title}
                </h1>
                
                <div className="space-y-10">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-[#1A4B40]" strokeWidth={2.5} />
                      <p className="text-[15px] text-gray-400">Local</p>
                    </div>
                    <p className="text-[#F28D35] font-semibold text-[16px] underline decoration-1 underline-offset-4 cursor-pointer">
                      {event.location}
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-[#1A4B40]" strokeWidth={2.5} />
                      <p className="text-[15px] text-gray-400">Data e Hora</p>
                    </div>
                    <p className="font-bold text-gray-900 text-[16px]">
                      {eventDate} <span className="text-gray-300 font-normal mx-1">•</span> {event.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Ingresso */}
            <div 
              className="p-10 flex flex-col justify-start h-full border-gray-200"
              style={{
                backgroundImage: `linear-gradient(to bottom, #E5E7EB 60%, transparent 60%)`,
                backgroundSize: '1px 15px',
                backgroundRepeat: 'repeat-y',
                backgroundPosition: 'left'
              }}
            >
              <div className="mb-6 text-center lg:text-left">
                <h2 className="text-[24px] font-bold text-gray-900 mb-1">Ingresso</h2>
                <p className="text-[15px] text-gray-400">
                  Comprar pelo nosso sistema
                </p>
              </div>

              <Button 
                onClick={handleParticipate}
                disabled={isParticipating || isActionLoading}
                className={`w-full font-bold text-[16px] py-7 rounded-xl ${
                  isParticipating ? 'bg-green-600 hover:bg-green-700' : 'bg-[#F28D35] hover:bg-[#e17c2a]'
                } text-white shadow-md transition-all active:scale-[0.98]`}
              >
                {isActionLoading ? "Processando..." : isParticipating ? "Inscrição Confirmada" : "Pagar e participar"}
              </Button>

              <div className="relative flex items-center py-8">
                <div className="grow border-t border-gray-100"></div>
                <span className="shrink-0 px-4 text-[13px] text-gray-400 bg-white">ou</span>
                <div className="grow border-t border-gray-100"></div>
              </div>

              <div className="mt-auto">
                <p className="text-[13px] text-gray-400 mb-2">Integrar com:</p>
                <Select defaultValue="mounter">
                  <SelectTrigger className="w-full bg-white text-gray-900 font-semibold h-14 rounded-xl border-gray-200 focus:ring-1 focus:ring-[#F28D35]">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mounter">Mounter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Card 3: Token */}
            <div 
              className="p-10 flex flex-col justify-start h-full border-gray-200"
              style={{
                backgroundImage: `linear-gradient(to bottom, #E5E7EB 60%, transparent 60%)`,
                backgroundSize: '1px 15px',
                backgroundRepeat: 'repeat-y',
                backgroundPosition: 'left'
              }}
            >
              <div className="mb-6">
                <h2 className="text-[24px] font-bold text-gray-900 mb-6">Seu token exclusivo</h2>
                <div className="flex items-center border border-gray-100 rounded-xl p-1 bg-white shadow-sm ring-1 ring-gray-50">
                  <Input
                    type="text"
                    value={`checklove.com/invite/${id?.toString().substring(0, 4)}...`}
                    readOnly
                    className="border-none focus-visible:ring-0 shadow-none bg-transparent flex-1 text-[13px] font-medium text-gray-900 truncate px-4"
                  />
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(`checklove.com/invite/${id}`);
                      toast.success("Link copiado!");
                    }}
                    className="bg-[#F28D35] hover:bg-[#e17c2a] text-white rounded-lg px-3 text-[14px] font-bold transition-all"
                    style={{padding: `15px`}}
                  >
                    Copiar
                  </Button>
                </div>
              </div>

              <div className="relative flex items-center pt-2 mb-6">
                 <div className="grow border-t border-gray-100"></div>
              </div>

              <div className="mt-auto">
                <p className="text-[15px] font-medium text-gray-800 mb-4 text-center lg:text-left">
                  Convide amigos para vivenciarem com você!
                </p>
                <Button
                  variant="outline"
                  className="w-full h-14 border-[#1A4B40] text-[#1A4B40] hover:text-[#1A4B40]/75 bg-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div className="space-y-4">
              <h2 className="text-[22px] font-bold text-gray-900">Apresentação</h2>
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-200 group cursor-pointer shadow-sm">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col justify-start">
              <h2 className="text-[22px] font-bold text-gray-900 mb-4">Sobre o Evento</h2>
              <div className="space-y-4">
                <p className="text-gray-500 leading-relaxed text-[15px] whitespace-pre-wrap">
                  {event.description}
                </p>

                <ul className="space-y-2 mt-4 pt-4">
                  {event.tags.map((tag: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-[18px] h-[18px] text-gray-800" strokeWidth={3} />
                      <span className="font-bold text-[#355E53] text-[15px]">
                        {tag}
                      </span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2">
                    <Check className="w-[18px] h-[18px] text-gray-800" strokeWidth={3} />
                    <span className="font-bold text-[#355E53] text-[15px]">
                      Vagas totais: {event.capacity}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
