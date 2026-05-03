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
import { cn } from "@/lib/utils";

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

  const dateObj = new Date(event.date);
  const eventDate = `${dateObj.getDate().toString().padStart(2, '0')} ${dateObj.toLocaleString("pt-BR", { month: "short" }).replace(".", "").toUpperCase()} ${dateObj.getFullYear()}`;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <div className="relative h-[400px] md:h-[550px] w-full">
           <EventHeroCarousel images={event.images ? JSON.parse(event.images) : [event.image]} />
           <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 -mt-32 md:-mt-48 relative z-10 mb-16 gap-6">
            {/* Card 1: Event Info */}
            <div className="glass p-10 rounded-[2.5rem] flex flex-col justify-between shadow-2xl border-white/40">
              <div>
                <div className="mb-4">
                  <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em]">
                    {event.type_event || "Presencial"}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-brand-black mb-10 uppercase tracking-tighter leading-none">
                  {event.title}
                </h1>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-brand-green" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Localização</p>
                      <p className="text-brand-black font-bold text-lg leading-tight hover:underline cursor-pointer">
                        {event.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-red/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-brand-red" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Data e Hora</p>
                      <p className="font-bold text-brand-black text-lg leading-tight">
                        {eventDate} <span className="text-brand-green/20 mx-1">•</span> {event.time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Checkout */}
            <div className="glass p-10 rounded-[2.5rem] flex flex-col justify-center shadow-2xl border-white/40 text-center">
              <div className="mb-8">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Investimento</p>
                <h2 className="text-5xl font-black text-brand-black tracking-tighter">
                  {formatBRL(event.price)}
                </h2>
                <p className="text-sm text-brand-red font-bold mt-2">Vagas limitadas disponíveis</p>
              </div>

              <Button
                onClick={handleParticipate}
                disabled={isActionLoading}
                className={cn(
                  "w-full h-16 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl",
                  isParticipating 
                    ? "bg-brand-red hover:bg-brand-red/90 text-white" 
                    : "bg-brand-red hover:bg-brand-red/90 text-white"
                )}
              >
                {isActionLoading ? <Loader2 className="animate-spin" /> : isParticipating ? "Confirmado!" : "Garantir Ingresso"}
              </Button>
              
              <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Ambiente seguro e certificado
              </p>
            </div>

            {/* Card 3: Social/Token */}
            <div className="glass p-10 rounded-[2.5rem] flex flex-col justify-between shadow-2xl border-white/40">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-brand-black uppercase tracking-tighter mb-4">Convidar amigos</h2>
                  <div className="flex items-center glass-dark rounded-2xl p-1.5 shadow-inner border-white/5">
                    <Input
                      type="text"
                      value={typeof window !== "undefined" ? `${window.location.origin}/events/${id}` : ""}
                      readOnly
                      className="border-none focus-visible:ring-0 shadow-none bg-transparent flex-1 text-xs font-bold text-white/70 truncate px-4"
                    />
                    <Button
                      onClick={() => {
                        const url = `${window.location.origin}/events/${id}`;
                        navigator.clipboard.writeText(url);
                        setIsCopied(true);
                        toast.success("Link copiado!");
                      }}
                      className="bg-brand-orange hover:bg-brand-orange/90 text-white rounded-xl h-11 px-6 text-[10px] font-black uppercase tracking-widest"
                    >
                      {isCopied ? "Copiado" : "Copiar"}
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-black/5">
                  <p className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">
                    Espalhe essa experiência
                  </p>
                  <Button
                    variant="outline"
                    className="w-full h-14 border-brand-black/10 bg-white text-brand-black hover:bg-brand-black hover:text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
                    onClick={() => {
                      const url = `${window.location.origin}/events/${id}`;
                      if (navigator.share) {
                        navigator.share({ title: event.title, text: `Olha esse evento!`, url }).catch(console.error);
                      } else {
                        navigator.clipboard.writeText(url);
                        toast.success("Link copiado!");
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-brand-orange rounded-full" />
                <h2 className="text-2xl font-black text-brand-black uppercase tracking-tighter">Apresentação</h2>
              </div>
              <div className="relative rounded-[2.5rem] overflow-hidden aspect-video bg-brand-black shadow-2xl group cursor-pointer border-4 border-white/50">
                <video
                  src={event.video_url}
                  className="absolute inset-0 w-full h-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>

            <div className="glass p-12 rounded-[2.5rem] border-white/40 shadow-xl">
              <h2 className="text-2xl font-black text-brand-black uppercase tracking-tighter mb-8">Sobre a Experiência</h2>
              <div className="space-y-8">
                <p className="text-gray-600 leading-relaxed text-base font-medium">
                  {event.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-brand-black/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-green/5 flex items-center justify-center">
                      <Users className="w-4 h-4 text-brand-green" />
                    </div>
                    <span className="font-bold text-brand-black text-sm uppercase tracking-wide">
                      {event.target_audience || "Público Geral"}
                    </span>
                  </div>
                  {event.conductor && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-red/5 flex items-center justify-center">
                        <Check className="w-4 h-4 text-brand-red" />
                      </div>
                      <span className="font-bold text-brand-black text-sm uppercase tracking-wide">
                        Condutor: {event.conductor}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-orange/5 flex items-center justify-center">
                      <Laptop className="w-4 h-4 text-brand-orange" />
                    </div>
                    <span className="font-bold text-brand-black text-sm uppercase tracking-wide">
                      {event.type_event || "Presencial"}
                    </span>
                  </div>
                  {event.has_certificate && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-green/5 flex items-center justify-center">
                        <Check className="w-4 h-4 text-brand-green" />
                      </div>
                      <span className="font-bold text-brand-green text-sm uppercase tracking-wide">
                        Certificado MeetOff
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Products Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-brand-red rounded-full" />
                <h2 className="text-2xl font-black text-brand-black uppercase tracking-tighter">Produtos Opcionais</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {mandatoryProductsData.map((product) => {
                  const isSelected = selectedProducts.includes(product.id);
                  return (
                    <div 
                      key={product.id} 
                      className="group flex flex-col items-center"
                    >
                      <div 
                        className={cn(
                          "relative aspect-square w-full rounded-[2rem] overflow-hidden bg-white shadow-lg border-2 p-4 transition-all duration-300 cursor-pointer mb-4",
                          isSelected ? "border-brand-orange scale-105" : "border-white hover:border-brand-orange/30"
                        )}
                        onClick={() => setViewingProduct(product)}
                      >
                         <div 
                          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-white shadow-md border"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleProductSelection(product.id);
                          }}
                        >
                          <Check className={cn("w-4 h-4", isSelected ? "text-brand-orange" : "text-gray-200")} strokeWidth={4} />
                        </div>
                        <div className="relative w-full h-full rounded-2xl overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      </div>
                      <h3 className="text-sm font-black text-brand-black text-center uppercase tracking-tight px-2">{product.name}</h3>
                      <p className="text-xs text-brand-orange font-bold mt-1 uppercase tracking-widest">{formatBRL(product.price || 0)}</p>
                    </div>
                  );
                })}
              </div>
              {mandatoryProductsData.length === 0 && (
                <div className="glass p-8 rounded-[2rem] text-center border-dashed">
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Nenhum produto opcional disponível</p>
                </div>
              )}
            </div>

            {/* Groups Section */}
            <div className="glass p-10 rounded-[2.5rem] border-white/40 shadow-xl">
              <div className="mb-10">
                <h2 className="text-2xl font-black text-brand-black uppercase tracking-tighter mb-2">Grupos de Networking</h2>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Encontre companhia para sua jornada</p>
              </div>

              <div className="space-y-6">
                {(typeof event.groups === "string" ? JSON.parse(event.groups) : event.groups || []).map((group: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-6 p-4 rounded-2xl bg-white/50 border border-white/20 hover:bg-white hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-brand-green/5 shrink-0 border-2 border-white shadow-md">
                      {group.image ? (
                        <Image src={group.image} alt={group.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="w-8 h-8 text-brand-green/20" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-black text-brand-black text-lg uppercase tracking-tight leading-none mb-2">{group.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="glass-dark px-2 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-widest">
                          {group.category || "Geral"}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {group.capacity} Vagas
                        </span>
                      </div>
                    </div>

                    <Button
                      asChild={!!group.link}
                      className="bg-brand-black hover:bg-brand-black/90 text-white rounded-xl h-12 px-6 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-brand-black/10"
                    >
                      {group.link ? (
                        <a href={group.link} target="_blank" rel="noopener noreferrer">Participar</a>
                      ) : (
                        <span>Participar</span>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Brands Section */}
          {associatedBrandsData.length > 0 && (
            <div className="mt-20">
              <div className="flex items-center gap-3 mb-10">
                <div className="h-1 w-12 bg-brand-green rounded-full" />
                <h2 className="text-2xl font-black text-brand-black uppercase tracking-tighter">Parceiros do Evento</h2>
              </div>
              <div className="flex flex-wrap gap-10 items-start">
                {associatedBrandsData.map((brand, i) => (
                  <div key={i} className="group flex flex-col items-center w-32 space-y-4">
                    <div className="relative w-24 h-24 rounded-full glass border-white border-4 shadow-xl flex items-center justify-center p-3 transition-transform duration-300 group-hover:scale-110">
                      {brand.logo ? (
                        <div className="relative w-full h-full rounded-full overflow-hidden">
                          <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-brand-green uppercase text-center">{brand.name}</span>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="font-black text-brand-black text-[10px] uppercase tracking-widest line-clamp-1">{brand.name}</h3>
                      {brand.website_url && (
                        <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="text-[8px] font-black text-brand-orange uppercase tracking-[0.2em] hover:underline mt-1 block">Visitar</a>
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
        <DialogContent className="sm:max-w-md border-0 p-0 overflow-hidden rounded-[3rem] gap-0 glass shadow-2xl">
          {viewingProduct && (
            <>
              <div className="relative w-full h-80 bg-white p-12">
                <Image
                  src={viewingProduct.image || "/placeholder.svg"}
                  alt={viewingProduct.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-12 text-center">
                <div className="mb-4">
                  <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em]">
                    {viewingProduct.category || "Premium"}
                  </span>
                </div>
                <DialogTitle className="text-3xl font-black text-brand-black mb-2 uppercase tracking-tighter">
                  {viewingProduct.name}
                </DialogTitle>
                <div className="text-2xl font-black text-brand-orange mb-8 tracking-tighter">
                  {formatBRL(viewingProduct.price || 0)}
                </div>
                
                <DialogDescription className="text-base text-gray-500 font-medium leading-relaxed mb-10">
                  {viewingProduct.description}
                </DialogDescription>

                <Button
                  onClick={() => {
                    toggleProductSelection(viewingProduct.id);
                    setViewingProduct(null);
                  }}
                  className={cn(
                    "w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all",
                    selectedProducts.includes(viewingProduct.id)
                      ? "bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white"
                      : "bg-brand-orange text-white hover:bg-brand-orange/90"
                  )}
                >
                  {selectedProducts.includes(viewingProduct.id) ? "Remover do Pedido" : "Adicionar ao Pedido"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </div>
  );
}
