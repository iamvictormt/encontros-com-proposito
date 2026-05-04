"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Share2,
  ArrowLeft,
  ArrowRight,
  Link2,
  Filter,
  Loader2,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { formatBRL } from "@/lib/utils/format";
import { useLoading } from "@/providers/loading-provider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function EventsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { setIsLoading: setGlobalLoading } = useLoading();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [ageFilters, setAgeFilters] = useState<string[]>([]);
  const [priceFilters, setPriceFilters] = useState<string[]>([]);
  const [audienceFilters, setAudienceFilters] = useState<string[]>([]);
  const itemsPerPage = 6;

  useEffect(() => {
    setGlobalLoading(isLoading);
  }, [isLoading, setGlobalLoading]);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const heroSlides = events
    .filter((e) => e.status === "Ativo")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map((e) => ({
      id: e.id,
      image: e.image,
      theme: `Tema: ${e.tags?.[0] || "Geral"}`,
      location: e.location,
      title: e.title.toUpperCase(),
      type_event: e.type_event || "Presencial",
    }));

  const nextSlide = () => {
    if (heroSlides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }
  };

  const prevSlide = () => {
    if (heroSlides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
  };

  const filteredEvents = events
    .filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        typeFilters.length === 0 || typeFilters.includes(e.type_event || "Presencial");
      const matchesAge = ageFilters.length === 0 || ageFilters.includes(e.age_range);
      const matchesPrice =
        priceFilters.length === 0 ||
        (priceFilters.includes("free") && parseFloat(e.price) === 0) ||
        (priceFilters.includes("paid") && parseFloat(e.price) > 0);
      const matchesAudience =
        audienceFilters.length === 0 || audienceFilters.includes(e.target_audience);

      return matchesSearch && matchesType && matchesAge && matchesPrice && matchesAudience;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / itemsPerPage));
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilters, ageFilters, priceFilters, audienceFilters]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Banner with Carousel */}
      {heroSlides.length > 0 && (
        <section className="relative h-[450px] sm:h-[650px] w-full overflow-hidden px-4 sm:px-8 py-4 sm:py-6 lg:px-20">
          <div className="mx-auto max-w-7xl h-full">
            <div className="relative h-full overflow-hidden rounded-3xl">
              <div
                className="flex h-full transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {heroSlides.map((slide, index) => (
                  <div key={index} className="relative min-w-full h-full group">
                    <Image
                      src={slide.image || "/placeholder.svg"}
                      alt={slide.title}
                      fill
                      className="object-cover transition-transform duration-10000 group-hover:scale-110"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-16">
                      <div className="max-w-3xl space-y-6">
                        <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <span className="flex items-center gap-1.5 rounded-full glass px-4 py-1.5 text-xs font-bold text-brand-black uppercase tracking-wider">
                            <span className="text-brand-red">●</span> {slide.theme}
                          </span>
                          <span className="flex items-center gap-1.5 rounded-full glass px-4 py-1.5 text-xs font-bold text-brand-black uppercase tracking-wider">
                            <MapPin className="w-3 h-3 text-brand-red" /> {slide.location}
                          </span>
                        </div>

                        <h1 className="text-3xl sm:text-6xl font-black leading-tight text-white lg:text-7xl tracking-tighter uppercase animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                          {slide.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
                          <Button
                            className="bg-brand-red hover:bg-brand-red/90 text-white font-black uppercase tracking-widest text-[10px] px-8 h-14 rounded-2xl shadow-lg shadow-brand-red/20"
                            asChild
                          >
                            <Link href={`/events/${slide.id}`}>Explorar Evento</Link>
                          </Button>

                          <Button
                            variant="ghost"
                            className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-md px-4 sm:px-6 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                            onClick={() => {
                              const url = `${window.location.origin}/events/${slide.id}`;
                              navigator.clipboard.writeText(url);
                              setCopiedId(slide.id);
                              toast.success("Link de convite copiado!");
                            }}
                          >
                            {copiedId === slide.id ? (
                              <>
                                <Check className="h-5 w-5 mr-2 text-brand-orange" /> Copiado
                              </>
                            ) : (
                              <>
                                <Share2 className="h-5 w-5 mr-2" /> Convidar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Indicators */}
              <div className="md:flex hidden absolute bottom-10 left-1/2 -translate-x-1/2 gap-3 z-20">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 transition-all duration-500 rounded-full ${
                      index === currentSlide
                        ? "w-12 bg-brand-orange"
                        : "w-4 bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              {/* Arrow Controls */}
              <div className="absolute bottom-10 right-10 hidden sm:flex gap-4 z-20">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-brand-orange hover:border-brand-orange transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-brand-orange hover:border-brand-orange transition-all duration-300"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Events Section */}
      <section className="px-4 sm:px-8 py-10 sm:py-16 lg:px-20 relative">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div className="space-y-2 text-center lg:text-left w-full">
              <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
                Descubra
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-brand-black lg:text-5xl tracking-tighter uppercase mt-4">
                Próximos <span className="text-brand-red">Eventos</span>
              </h2>
            </div>

            <div className="flex w-full flex-col sm:flex-row gap-4 lg:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-green" />
                <Input
                  placeholder="Buscar por título ou local..."
                  className="pl-12 h-14 bg-white border-brand-green/10 rounded-2xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-14 px-8 border-white shadow-xl glass bg-white/60 rounded-2xl text-brand-black font-black uppercase tracking-widest text-[10px] group transition-all active:scale-95"
                  >
                    <Filter className="mr-3 h-4 w-4 text-brand-orange group-hover:rotate-90 transition-transform duration-500" />
                    Refinar Busca
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[85vw] sm:w-[400px] glass border-brand-green/10 px-8 pt-16 overflow-y-auto"
                >
                  <SheetHeader className="mb-12 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-1 w-8 bg-brand-orange rounded-full" />
                      <span className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.3em]">
                        Filtros Avançados
                      </span>
                    </div>
                    <SheetTitle className="text-4xl font-black uppercase tracking-tighter text-brand-black leading-none">
                      Eventos
                    </SheetTitle>
                  </SheetHeader>

                  <div className="space-y-12 pb-20">
                    {/* Formato */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="h-1 w-6 bg-brand-green rounded-full" />
                        <h3 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
                          Formato
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {["Presencial", "Online"].map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setTypeFilters((prev) =>
                                prev.includes(type)
                                  ? prev.filter((t) => t !== type)
                                  : [...prev, type],
                              );
                            }}
                            className={cn(
                              "flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 border text-left",
                              typeFilters.includes(type)
                                ? "bg-brand-black border-brand-black text-white shadow-xl shadow-brand-black/20"
                                : "border-brand-black/5 text-gray-500 hover:bg-brand-black/5 hover:text-brand-black",
                            )}
                          >
                            <span className="text-[11px] font-black uppercase tracking-widest">
                              {type}
                            </span>
                            {typeFilters.includes(type) && (
                              <Check size={14} className="text-brand-orange" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preço */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="h-1 w-6 bg-brand-red rounded-full" />
                        <h3 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
                          Preço
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: "free", label: "Gratuito" },
                          { id: "paid", label: "Pago" },
                        ].map((price) => (
                          <button
                            key={price.id}
                            onClick={() => {
                              setPriceFilters((prev) =>
                                prev.includes(price.id)
                                  ? prev.filter((t) => t !== price.id)
                                  : [...prev, price.id],
                              );
                            }}
                            className={cn(
                              "px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 text-center",
                              priceFilters.includes(price.id)
                                ? "bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/20"
                                : "border-brand-black/5 text-gray-500 hover:border-brand-black hover:text-brand-black",
                            )}
                          >
                            {price.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Faixa Etária */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="h-1 w-6 bg-brand-orange rounded-full" />
                        <h3 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
                          Faixa Etária
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {["18-25 anos", "26-35 anos", "36-45 anos", "46-55 anos", "55+ anos"].map(
                          (age) => (
                            <button
                              key={age}
                              onClick={() => {
                                setAgeFilters((prev) =>
                                  prev.includes(age)
                                    ? prev.filter((t) => t !== age)
                                    : [...prev, age],
                                );
                              }}
                              className={cn(
                                "flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 border text-left",
                                ageFilters.includes(age)
                                  ? "bg-brand-black border-brand-black text-white shadow-xl shadow-brand-black/20"
                                  : "border-brand-black/5 text-gray-500 hover:bg-brand-black/5 hover:text-brand-black",
                              )}
                            >
                              <span className="text-[11px] font-black uppercase tracking-widest">
                                {age}
                              </span>
                              {ageFilters.includes(age) && (
                                <Check size={14} className="text-brand-orange" />
                              )}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <Button
                      className="w-full h-14 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-green/20 mt-12"
                      onClick={() => {
                        const sheetClose = document.querySelector(
                          "[data-radix-collection-item]",
                        ) as HTMLElement;
                        sheetClose?.click();
                      }}
                    >
                      Aplicar Filtros
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {isLoading ? null : paginatedEvents.length === 0 ? (
            <div className="text-center py-24 glass rounded-[2.5rem] border-dashed border-brand-green/20 mt-8">
              <div className="text-6xl mb-6 grayscale opacity-50">📅</div>
              <h3 className="text-2xl font-black text-brand-black mb-2 uppercase tracking-tight">
                Nenhum evento encontrado
              </h3>
              <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed px-4">
                {events.length === 0
                  ? "Opa! No momento não temos eventos agendados. Fique atento às nossas redes sociais!"
                  : "Não encontramos eventos com esses critérios. Tente ajustar seus filtros!"}
              </p>
              {events.length > 0 && (
                <Button
                  variant="outline"
                  className="mt-8 px-8 h-14 rounded-2xl border-brand-orange text-brand-orange font-black uppercase tracking-widest text-[10px] hover:bg-brand-orange hover:text-white transition-all"
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilters([]);
                    setAgeFilters([]);
                    setPriceFilters([]);
                    setAudienceFilters([]);
                  }}
                >
                  Limpar todos os filtros
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedEvents.map((event) => {
                const date = new Date(event.date);
                const month = date
                  .toLocaleString("pt-BR", { month: "short" })
                  .replace(".", "")
                  .toUpperCase();
                const day = date.getDate();

                return (
                  <div
                    key={event.id}
                    className="group premium-card flex flex-col bg-white rounded-[2rem] overflow-hidden"
                  >
                    <div className="relative h-72 overflow-hidden">
                      <Link href={`/events/${event.id}`} className="absolute inset-0 z-0">
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>

                      <div className="absolute left-6 top-6 z-10">
                        <div className="flex flex-col items-center justify-center h-16 w-16 glass rounded-2xl shadow-lg border-white/40">
                          <span className="text-[10px] font-black text-brand-red uppercase tracking-widest">
                            {month}
                          </span>
                          <span className="text-2xl font-black text-brand-black leading-none">
                            {day}
                          </span>
                        </div>
                      </div>

                      <div className="absolute right-6 top-6 flex flex-col gap-3 z-10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-xl hover:bg-brand-orange hover:text-white transition-colors cursor-pointer text-brand-black">
                          <MapPin className="h-4 w-4" />
                        </button>
                        <button
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-xl hover:bg-brand-red hover:text-white transition-colors cursor-pointer text-brand-black"
                          onClick={(e) => {
                            e.preventDefault();
                            const url = `${window.location.origin}/events/${event.id}`;
                            navigator.clipboard.writeText(url);
                            toast.success("Link copiado!");
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-center">
                        <span className="glass px-4 py-2 rounded-xl text-sm font-black text-brand-black shadow-lg">
                          {formatBRL(event.price)}
                        </span>
                        <span className="glass-dark px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg">
                          {event.type_event || "Presencial"}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 flex flex-col flex-1">
                      <div className="mb-6 space-y-2">
                        <h3 className="text-xl font-black text-brand-black leading-tight line-clamp-2 uppercase tracking-tight group-hover:text-brand-orange transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                          <MapPin className="h-3 w-3 text-brand-red" />
                          <span className="line-clamp-1">{event.location}</span>
                          <span className="text-brand-green/30">•</span>
                          <span>{event.time}</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-brand-green/5 flex gap-3">
                        <Button
                          className="flex-1 bg-brand-black hover:bg-brand-black/80 text-white font-black uppercase tracking-widest text-[10px] px-8 h-14 rounded-2xl shadow-lg shadow-brand-black/20"
                          asChild
                        >
                          <Link href={`/events/${event.id}`}>Ver Detalhes</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-6">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-2xl border-brand-green/10 bg-white text-brand-black hover:bg-brand-green hover:text-white transition-all shadow-sm"
                onClick={() => {
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage === 1}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-brand-green/60">
                <span className="text-brand-black text-base">{currentPage}</span>
                <span className="h-px w-8 bg-brand-green/20" />
                <span>{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-2xl border-brand-green/10 bg-white text-brand-black hover:bg-brand-green hover:text-white transition-all shadow-sm"
                onClick={() => {
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage === totalPages}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
