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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatBRL } from "@/lib/utils/format";
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
  Loader2,
  Users,
  Laptop,
} from "lucide-react";
import Image from "next/image";
import { EventHeroCarousel } from "./event-hero-carousel";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useLoading } from "@/providers/loading-provider";

export function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setIsLoading: setGlobalLoading } = useLoading();
  const [isParticipating, setIsParticipating] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);

  const [mandatoryProductsData, setMandatoryProductsData] = useState<any[]>([]);
  const [associatedBrandsData, setAssociatedBrandsData] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [viewingProduct, setViewingProduct] = useState<any>(null);

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events?id=${id}`);
        const data = await res.json();
        setEvent(data);

        // Fetch product details for mandatory products
        if (data.mandatory_products) {
          const productIds =
            typeof data.mandatory_products === "string"
              ? JSON.parse(data.mandatory_products)
              : data.mandatory_products;

          if (productIds.length > 0) {
            const prodRes = await fetch("/api/products");
            const allProducts = await prodRes.json();
            const filtered = allProducts.filter((p: any) => productIds.includes(p.id));
            setMandatoryProductsData(filtered);
          }
        }

        // Fetch brand details for associated brands
        if (data.associated_brands) {
          const brandIds =
            typeof data.associated_brands === "string"
              ? JSON.parse(data.associated_brands)
              : data.associated_brands;

          if (brandIds.length > 0) {
            const brandsRes = await fetch("/api/brands");
            const allBrands = await brandsRes.json();
            const filtered = allBrands.filter((b: any) => brandIds.includes(b.id));
            setAssociatedBrandsData(filtered);
          }
        }

        if (isLoggedIn && user) {
          const partRes = await fetch(`/api/participate?eventId=${id}&userId=${user.id}`);
          const partData = await partRes.json();
          setIsParticipating(partData.isParticipating);
          if (partData.optionalProducts) {
            try {
              const parsed = typeof partData.optionalProducts === "string"
                ? JSON.parse(partData.optionalProducts)
                : partData.optionalProducts;
              setSelectedProducts(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
              console.error("Error parsing optional products:", e);
            }
          }
        }
      } catch (error) {
        toast.error("Erro ao carregar detalhes do evento");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, isLoggedIn, user]);

  useEffect(() => {
    setGlobalLoading(isLoading);
  }, [isLoading, setGlobalLoading]);

  const handleParticipate = async () => {
    if (!isLoggedIn) {
      toast.error("Faça login para participar");
      router.push("/login");
      return;
    }

    setIsActionLoading(true);
    try {
      const res = await fetch("/api/participate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: id, selectedProducts }),
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

  if (isLoading) return null;
  if (!event)
    return (
      <div className="flex justify-center py-20 min-h-screen bg-white">Evento não encontrado</div>
    );

  const eventDate = new Date(event.date).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <EventHeroCarousel images={event.images ? JSON.parse(event.images) : [event.image]} />

        <div className="mx-auto max-w-7xl px-4 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 -mt-24 md:-mt-48 relative z-10 mb-16 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
            {/* Card 1: Event Info */}
            <div className="p-12 flex flex-col justify-between h-full bg-gray-50/50">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-black mb-12 uppercase italic tracking-tighter leading-none">
                  {event.title}
                </h1>

                <div className="space-y-10">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-primary" strokeWidth={3} />
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Local</p>
                    </div>
                    <p className="text-black font-black italic text-lg uppercase tracking-tight">
                      {event.location}
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-primary" strokeWidth={3} />
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Data e Hora</p>
                    </div>
                    <p className="text-black font-black italic text-lg uppercase tracking-tight">
                      {eventDate} <span className="text-gray-300 font-normal mx-1">•</span>{" "}
                      {event.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Ingresso */}
            <div className="p-12 flex flex-col justify-center h-full border-y lg:border-y-0 lg:border-x border-gray-100">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-black text-black mb-2 uppercase italic tracking-tighter">Ingresso</h2>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Acesso exclusivo MeetOff</p>
              </div>

              <Button
                onClick={handleParticipate}
                disabled={isActionLoading}
                className={`w-full font-black uppercase italic text-lg py-10 rounded-full shadow-xl transition-all active:scale-[0.98] ${
                  isParticipating
                    ? "bg-primary text-white"
                    : "bg-accent text-white"
                }`}
              >
                {isActionLoading
                  ? "Aguarde..."
                  : isParticipating
                    ? "Salvar Opções"
                    : "Participar Agora"}
              </Button>
              <p className="mt-4 text-[10px] text-center text-gray-400 uppercase font-bold">Garantia de experiência autêntica</p>
            </div>

            {/* Card 3: Token */}
            <div className="p-12 flex flex-col justify-center h-full bg-gray-50/50">
              <div className="mb-6">
                <h2 className="text-[24px] font-bold text-gray-900 mb-6">Seu token exclusivo</h2>
                <div className="flex items-center border border-gray-100 rounded-xl p-1 bg-white shadow-sm ring-1 ring-gray-50">
                  <Input
                    type="text"
                    value={
                      typeof window !== "undefined"
                        ? `${window.location.origin}/events/${id}`
                        : `meetoff.com.br/events/${id}`
                    }
                    readOnly
                    className="border-none focus-visible:ring-0 shadow-none bg-transparent flex-1 text-[13px] font-medium text-gray-900 truncate px-4"
                  />
                  <Button
                    onClick={() => {
                      const url = `${window.location.origin}/events/${id}`;
                      navigator.clipboard.writeText(url);
                      setIsCopied(true);
                    }}
                    onMouseLeave={() => {
                      if (isCopied) {
                        setTimeout(() => setIsCopied(false), 1000);
                      }
                    }}
                    className="bg-[#F28D35] hover:bg-[#e17c2a] text-white rounded-lg px-3 text-[14px] font-bold transition-all"
                    style={{ padding: `15px` }}
                  >
                    {isCopied ? "Copiado!" : "Copiar"}
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
                  onClick={() => {
                    const url = `${window.location.origin}/events/${id}`;
                    if (navigator.share) {
                      navigator
                        .share({
                          title: event.title,
                          text: `Venha comigo ao evento ${event.title}!`,
                          url: url,
                        })
                        .catch(console.error);
                    } else {
                      navigator.clipboard.writeText(url);
                    }
                  }}
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
                <video
                  src={event.video_url}
                  className="absolute inset-0 w-full h-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 p-10 flex flex-col justify-start">
              <h2 className="text-3xl font-black text-black mb-8 uppercase italic tracking-tighter">Sobre o Evento</h2>
              <div className="space-y-6">
                <p className="text-gray-500 leading-relaxed text-base font-medium whitespace-pre-wrap">
                  {event.description}
                </p>

                <ul className="space-y-4 mt-6 pt-6 border-t border-gray-50">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                       <Check className="w-3.5 h-3.5 text-primary" strokeWidth={4} />
                    </div>
                    <span className="font-black text-black text-xs uppercase tracking-widest">
                      Público: {" "}
                      {!event.target_audience ||
                      event.target_audience.trim() === "" ||
                      event.target_audience === "all" ||
                      event.target_audience === "Todos os públicos"
                        ? "todos os públicos"
                        : /^\d+$/.test(event.target_audience)
                          ? `${event.target_audience}+`
                          : event.target_audience.toLowerCase()}
                    </span>
                  </li>
                  {event.conductor && (
                    <li className="flex items-center gap-2">
                      <Check className="w-[18px] h-[18px] text-gray-800" strokeWidth={3} />
                      <span className="font-bold text-[#355E53] text-[15px]">
                        Condutor: {event.conductor}
                      </span>
                    </li>
                  )}

                  <li className="flex items-center gap-2">
                    <Check className="w-[18px] h-[18px] text-gray-800" strokeWidth={3} />
                    <span className="font-bold text-[#355E53] text-[15px]">
                      Formato do evento: {event.type_event || "Presencial"}
                    </span>
                  </li>
                  {event.has_certificate && (
                    <li className="flex items-center gap-2">
                      <Check className="w-[18px] h-[18px] text-gray-800" strokeWidth={3} />
                      <span className="font-bold text-[#355E53] text-[15px]">
                        Evento certificado com selo MeetOff
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* New Sections: Products & Groups */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Products Section */}
            <div>
              <h2 className="text-[22px] font-bold text-gray-900 mb-6">Produtos opcionais</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {mandatoryProductsData.map((product) => {
                  const isSelected = selectedProducts.includes(product.id);
                  return (
                    <div 
                      key={product.id} 
                      className="space-y-3 cursor-pointer group"
                      onClick={() => setViewingProduct(product)}
                    >
                      <div className={`relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border p-2 transition-all ${
                        isSelected ? "border-[#F28D35] ring-2 ring-[#F28D35]/20" : "border-gray-100 group-hover:border-[#F28D35]/50"
                      }`}>
                        <div 
                          className="absolute top-3 left-3 z-10 bg-white rounded-full p-1 shadow-md border border-gray-100 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleProductSelection(product.id);
                          }}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                            isSelected ? "bg-[#F28D35]" : "bg-gray-100"
                          }`}>
                            <Check className={`w-3 h-3 ${isSelected ? "text-white" : "text-gray-300"}`} strokeWidth={4} />
                          </div>
                        </div>
                        <div className="relative w-full h-full rounded-xl overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-black text-center group-hover:text-[#F28D35] transition-colors">{product.name}</h3>
                      <p className="text-xs text-gray-500 text-center font-semibold">{formatBRL(product.price || 0)}</p>
                    </div>
                  );
                })}
                {mandatoryProductsData.length === 0 && (
                  <p className="text-gray-400 text-sm italic">
                    Nenhum produto opcional para este evento.
                  </p>
                )}
              </div>
            </div>

            {/* Groups Section */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
              <h2 className="text-[22px] font-bold text-gray-900 mb-2">
                Grupos disponíveis para participação
              </h2>
              <p className="text-sm text-gray-400 mb-8">
                Quer companhia? Escolha um grupo para ir ao evento junto com você!
              </p>

              <div className="space-y-6">
                {(typeof event.groups === "string"
                  ? JSON.parse(event.groups)
                  : event.groups || []
                ).map((group: any, i: number) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 border-t border-gray-50 first:border-t-0"
                  >
                    {/* Cover Image */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 mx-auto sm:mx-0 flex items-center justify-center">
                      {group.image ? (
                        <Image src={group.image} alt={group.name} fill className="object-cover" />
                      ) : (
                        <Users className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    {/* Group Info */}
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-[#1A4B40] text-[16px]">{group.name}</h3>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                        {group.category && (
                          <span className="bg-gray-50 text-gray-600 border border-gray-100 text-[10px] px-2 py-0.5 rounded-md font-medium">
                            {group.category}
                          </span>
                        )}
                        {group.age_range && (
                          <span className="bg-gray-50 text-gray-600 border border-gray-100 text-[10px] px-2 py-0.5 rounded-md font-medium">
                            Faixa: {group.age_range}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {group.capacity} Vagas Disponíveis
                        </span>
                      </div>
                    </div>

                    {/* Button for WhatsApp Link */}
                    <div className="flex items-center justify-center">
                      <Button
                        asChild={!!group.link}
                        className="bg-[#1A4B40] hover:bg-[#1A4B40]/90 text-white rounded-xl px-6 h-11 font-bold w-full sm:w-auto"
                      >
                        {group.link ? (
                          <a href={group.link} target="_blank" rel="noopener noreferrer">
                            Entrar no Grupo
                          </a>
                        ) : (
                          <span>Entrar</span>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
                {(typeof event.groups === "string" ? JSON.parse(event.groups) : event.groups || [])
                  .length === 0 && (
                  <p className="text-gray-400 text-sm italic py-4">Nenhum grupo disponível.</p>
                )}
              </div>
            </div>
          </div>

          {/* Brands Section */}
          {associatedBrandsData.length > 0 && (
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 mt-8">
              <h2 className="text-[22px] font-bold text-gray-900 mb-6">Marcas e Parceiros</h2>
              <div className="flex flex-wrap gap-6 items-start">
                {associatedBrandsData.map((brand, i) => (
                  <div key={i} className="flex flex-col items-center text-center space-y-3 w-28">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-white flex items-center justify-center p-2">
                      {brand.logo ? (
                        <div className="relative w-full h-full rounded-full overflow-hidden">
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="text-gray-400 font-medium text-[10px] text-center break-words leading-tight">
                          {brand.name}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-xs leading-tight line-clamp-2">{brand.name}</h3>
                      {brand.website_url && (
                        <a
                          href={brand.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-primary hover:underline mt-1 inline-block"
                        >
                          Visitar Site
                        </a>
                      )}
                      {!brand.website_url && brand.instagram_url && (
                        <a
                          href={`https://instagram.com/${brand.instagram_url.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-primary hover:underline mt-1 inline-block"
                        >
                          Instagram
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Product Details Modal */}
      <Dialog open={!!viewingProduct} onOpenChange={(open) => !open && setViewingProduct(null)}>
        <DialogContent className="sm:max-w-md border-0 p-0 overflow-hidden rounded-[2rem] gap-0">
          {viewingProduct && (
            <>
              <div className="relative w-full h-64 bg-gray-50">
                <Image
                  src={viewingProduct.image || "/placeholder.svg"}
                  alt={viewingProduct.name}
                  fill
                  className="object-contain p-6"
                />
              </div>
              <div className="p-8">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-primary uppercase">{viewingProduct.category || "Produto"}</span>
                </div>
                <DialogTitle className="text-2xl font-bold text-black mb-2">
                  {viewingProduct.name}
                </DialogTitle>
                <div className="text-xl font-bold text-black mb-6">
                  {formatBRL(viewingProduct.price || 0)}
                </div>
                {viewingProduct.description && (
                  <div className="mb-8">
                    <DialogDescription className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
                      {viewingProduct.description}
                    </DialogDescription>
                  </div>
                )}
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      toggleProductSelection(viewingProduct.id);
                      setViewingProduct(null);
                    }}
                    className={`flex-1 h-14 rounded-xl font-bold text-[15px] ${
                      selectedProducts.includes(viewingProduct.id)
                        ? "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                        : "bg-[#F28D35] text-white hover:bg-[#e17c2a]"
                    }`}
                  >
                    {selectedProducts.includes(viewingProduct.id)
                      ? "Remover Produto"
                      : "Adicionar Produto"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </div>
  );
}
