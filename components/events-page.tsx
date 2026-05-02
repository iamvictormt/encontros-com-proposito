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
      type_event: e.type_event || 'Presencial',
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
    .filter(
      (e) => {
        const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = typeFilters.length === 0 || typeFilters.includes(e.type_event || 'Presencial');
        const matchesAge = ageFilters.length === 0 || ageFilters.includes(e.age_range);
        const matchesPrice = priceFilters.length === 0 || 
          (priceFilters.includes("free") && parseFloat(e.price) === 0) || 
          (priceFilters.includes("paid") && parseFloat(e.price) > 0);
        const matchesAudience = audienceFilters.length === 0 || audienceFilters.includes(e.target_audience);

        return matchesSearch && matchesType && matchesAge && matchesPrice && matchesAudience;
      }
    )
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
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero Banner with Carousel */}
      {heroSlides.length > 0 && (
        <section className="relative h-[450px] sm:h-[600px] w-full overflow-hidden px-4 py-0 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="relative h-[450px] sm:h-[600px] overflow-hidden rounded-xl">
              <div
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {heroSlides.map((slide, index) => (
                  <div key={index} className="relative min-w-full">
                    <Image
                      src={slide.image || "/placeholder.svg"}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    <div className="absolute inset-0 flex items-center px-6 lg:px-12">
                      <div className="max-w-2xl absolute bottom-16">
                        <div className="mb-4 flex flex-wrap gap-3">
                          <span className="flex items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                            <span>🏷️</span>
                            {slide.theme}
                          </span>
                          <span className="flex items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                            <span>📍</span>
                            {slide.location}
                          </span>
                          <span className="flex items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                            <span>{slide.type_event === "Online" ? "💻" : "🤝"}</span>
                            {slide.type_event}
                          </span>
                        </div>

                        <h1 className="mb-6 text-3xl sm:text-4xl font-black uppercase italic leading-tight text-white lg:text-6xl drop-shadow-lg">
                          {slide.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4">
                          <Button
                            size="lg"
                            className="bg-accent hover:bg-accent/90 font-black uppercase italic px-10 py-8"
                            asChild
                          >
                            <Link href={`/events/${slide.id}`}>Ver detalhes</Link>
                          </Button>

                          <div className="hidden sm:block w-px h-4 bg-white/40 mx-2" />

                          <Button
                            size="lg"
                            variant="ghost"
                            className="bg-transparent text-white hover:bg-white/10 px-0"
                            onClick={() => {
                              const url = `${window.location.origin}/events/${slide.id}`;
                              navigator.clipboard.writeText(url);
                              setCopiedId(slide.id);
                            }}
                            onMouseLeave={() => {
                              if (copiedId === slide.id) {
                                setTimeout(() => setCopiedId(null), 1000);
                              }
                            }}
                          >
                            {copiedId === slide.id ? (
                              <>
                                <Check className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                                <span className="hidden sm:inline">Token de convite copiado!</span>
                                <span className="inline sm:hidden text-sm">Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Link2 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 rotate-[140deg]" />
                                <span className="hidden sm:inline">Copiar Token de convite</span>
                                <span className="inline sm:hidden text-sm">Convidar</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-6 left-6 sm:left-12 flex gap-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? "w-10 bg-white h-[5px]"
                        : "w-2 h-[5px] bg-white/50 hover:bg-white/70 cursor-pointer"
                    }`}
                  />
                ))}
              </div>

              <div className="absolute bottom-6 right-6 hidden sm:flex gap-3">
                <button
                  onClick={prevSlide}
                  className="p-4 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/20 transition-colors cursor-pointer text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-4 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/20 transition-colors cursor-pointer text-white"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Events Section */}
      <section className="px-4 py-8 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-3xl font-black uppercase italic text-black lg:text-4xl">
              Eventos Populares
            </h2>

            <div className="flex w-full gap-3 sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <Input
                  placeholder="Buscar Eventos"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-transparent hover:bg-gray-50 text-black min-w-[120px] justify-between"
                  >
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4 text-primary" />
                      Filtros
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[240px] max-h-[400px] overflow-y-auto bg-white border-gray-100">
                  <DropdownMenuLabel className="text-primary font-bold">Formato</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={typeFilters.includes("Presencial")}
                    onCheckedChange={(checked) => {
                      setTypeFilters((prev) =>
                        checked ? [...prev, "Presencial"] : prev.filter((t) => t !== "Presencial")
                      );
                    }}
                  >
                    Presencial
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={typeFilters.includes("Online")}
                    onCheckedChange={(checked) => {
                      setTypeFilters((prev) =>
                        checked ? [...prev, "Online"] : prev.filter((t) => t !== "Online")
                      );
                    }}
                  >
                    Online
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-primary font-bold">Preço</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={priceFilters.includes("free")}
                    onCheckedChange={(checked) => {
                      setPriceFilters((prev) =>
                        checked ? [...prev, "free"] : prev.filter((t) => t !== "free")
                      );
                    }}
                  >
                    Gratuito
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={priceFilters.includes("paid")}
                    onCheckedChange={(checked) => {
                      setPriceFilters((prev) =>
                        checked ? [...prev, "paid"] : prev.filter((t) => t !== "paid")
                      );
                    }}
                  >
                    Pago
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-primary font-bold">Faixa Etária</DropdownMenuLabel>
                  {[
                    "18-25 anos",
                    "26-35 anos",
                    "36-45 anos",
                    "46-55 anos",
                    "55+ anos",
                  ].map((age) => (
                    <DropdownMenuCheckboxItem
                      key={age}
                      checked={ageFilters.includes(age)}
                      onCheckedChange={(checked) => {
                        setAgeFilters((prev) =>
                          checked ? [...prev, age] : prev.filter((t) => t !== age)
                        );
                      }}
                    >
                      {age}
                    </DropdownMenuCheckboxItem>
                  ))}

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-primary font-bold">Público-alvo</DropdownMenuLabel>
                  {[
                    "Apenas casais",
                    "Solteiros",
                    "Apenas homens",
                    "Apenas mulheres",
                    "LGBTQIA+",
                    "Famílias",
                    "Melhor Idade",
                    "Jovens",
                    "18+",
                  ].map((aud) => (
                    <DropdownMenuCheckboxItem
                      key={aud}
                      checked={audienceFilters.includes(aud)}
                      onCheckedChange={(checked) => {
                        setAudienceFilters((prev) =>
                          checked ? [...prev, aud] : prev.filter((t) => t !== aud)
                        );
                      }}
                    >
                      {aud}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {isLoading ? null : paginatedEvents.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200 mt-8">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum evento encontrado</h3>
              <p className="text-gray-500 max-w-md mx-auto text-sm px-4">
                {events.length === 0
                  ? "Ainda não há eventos cadastrados na plataforma. Volte mais tarde!"
                  : "Não encontramos eventos que correspondam aos filtros aplicados ou ao termo buscado."}
              </p>
              {events.length > 0 && (
                <Button
                  variant="outline"
                  className="mt-6 bg-white text-black hover:bg-gray-100 border-gray-200"
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilters([]);
                    setAgeFilters([]);
                    setPriceFilters([]);
                    setAudienceFilters([]);
                  }}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedEvents.map((event) => {
                const date = new Date(event.date);
                const month = date.toLocaleString("pt-BR", { month: "short" }).toUpperCase();
                const day = date.getDate();

                return (
                  <div
                    key={event.id}
                    className="group overflow-hidden rounded-[2rem] border-none bg-card shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="relative h-80 overflow-hidden">
                      <Link href={`/events/${event.id}`} className="absolute inset-0 z-0">
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </Link>

                      <div className="absolute right-4 top-4 flex gap-2 z-10">
                        <button className="w-11 h-11 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white cursor-pointer transition-all hover:scale-110">
                          <MapPin className="h-4 w-4 text-primary" />
                        </button>
                        <button className="w-11 h-11 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white cursor-pointer transition-all hover:scale-110">
                          <Share2 className="h-4 w-4 text-primary" />
                        </button>
                      </div>

                      <div className="absolute left-4 top-4 h-11 rounded-full bg-white/90 backdrop-blur-sm px-4 font-black uppercase italic text-xs text-primary shadow-md flex items-center gap-2 z-10">
                        <span>{formatBRL(event.price)}</span>
                        <span className="w-px h-4 bg-primary/20" />
                        <span className="flex items-center gap-1">
                          <span>{event.type_event || "Presencial"}</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="mb-6 flex items-start gap-6">
                        <div className="flex flex-col items-center gap-1 min-w-[50px] bg-primary/5 p-3 rounded-2xl">
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                            {month.substring(0, 3)}
                          </span>
                          <span className="text-3xl font-black text-primary leading-none italic">
                            {day}
                          </span>
                        </div>
                        <div className="flex-1 relative">
                          <h3 className="mb-2 text-xl font-black uppercase italic text-black line-clamp-1 leading-tight">
                            {event.title}
                          </h3>
                          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                            {event.location}{" "}
                            <span className="text-primary font-black mx-1">•</span> {event.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <Button
                          className="w-full bg-primary hover:bg-primary/90 font-black uppercase italic py-7 rounded-2xl"
                          asChild
                        >
                          <Link href={`/events/${event.id}`}>Ver detalhes</Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent text-black hover:bg-gray-50 font-black uppercase italic py-7 rounded-2xl border-2"
                          onClick={() => {
                            const url = `${window.location.origin}/events/${event.id}`;
                            navigator.clipboard.writeText(url);
                            setCopiedId(event.id);
                          }}
                          onMouseLeave={() => {
                            if (copiedId === event.id) {
                              setTimeout(() => setCopiedId(null), 1000);
                            }
                          }}
                        >
                          {copiedId === event.id ? (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Copiado!
                            </>
                          ) : (
                            "Convidar"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-8">
              <Button
                size="icon"
                className="bg-transparent text-black hover:bg-gray-50"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                size="icon"
                className="bg-transparent text-black hover:bg-gray-50"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
