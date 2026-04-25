"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Share2, ArrowLeft, ArrowRight, Link2, Filter, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function EventsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const heroSlides = events.filter(e => e.status === 'Ativo').slice(0, 3).map(e => ({
    id: e.id,
    image: e.image,
    theme: `Tema: ${e.tags[0] || 'Geral'}`,
    location: e.location,
    title: e.title.toUpperCase(),
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

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero Banner with Carousel */}
      {heroSlides.length > 0 && (
        <section className="relative h-[600px] w-full overflow-hidden px-4 py-0 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="relative h-[600px] overflow-hidden rounded-xl">
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
                        <div className="mb-4 flex gap-3">
                          <span className="flex items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                            <span>🏷️</span>
                            {slide.theme}
                          </span>
                          <span className="flex items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                            <span>📍</span>
                            {slide.location}
                          </span>
                        </div>

                        <h1 className="mb-6 text-4xl font-bold leading-tight text-white lg:text-5xl">
                          {slide.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4">
                          <Button size="lg" className="bg-accent hover:bg-accent/90" asChild>
                            <Link href={`/events/${slide.id}`}>Participar</Link>
                          </Button>

                          <div className="hidden sm:block w-px h-4 bg-white/40 mx-2" />

                          <Button
                            size="lg"
                            variant="ghost"
                            className="bg-transparent text-white hover:bg-white/10 px-0"
                          >
                            <Link2 className="h-6 w-6 rotate-[140deg]" />
                            Copiar Token de convite
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-6 left-13 flex gap-2">
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

              <div className="absolute bottom-6 right-6 flex gap-3">
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
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-2xl font-bold text-black lg:text-3xl">Eventos Populares</h2>

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
              <Button
                variant="outline"
                className="bg-transparent hover:bg-gray-50 text-black"
              >
                <Filter className="mr-2 h-4 w-4 text-primary" />
                Filtros
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => {
                const date = new Date(event.date);
                const month = date.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();
                const day = date.getDate();

                return (
                  <div
                    key={event.id}
                    className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="relative h-80 overflow-hidden">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />

                      <div className="absolute right-3 top-3 flex gap-2">
                        <button className="rounded-full bg-white p-2.5 shadow-md hover:bg-gray-100 cursor-pointer">
                          <MapPin className="h-4 w-4 text-black" />
                        </button>
                        <button className="rounded-full bg-white p-2.5 shadow-md hover:bg-gray-100 cursor-pointer">
                          <Share2 className="h-4 w-4 text-black" />
                        </button>
                      </div>

                      <div className="absolute left-3 top-3 rounded-lg bg-white px-3 py-2.5 font-semibold text-black shadow-md">
                        R$ {parseFloat(event.price).toFixed(2).replace(".", ",")}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-4 flex items-start gap-6">
                        <div className="flex flex-col items-center gap-1 min-w-[50px]">
                          <span className="text-xs font-semibold text-black uppercase tracking-wide">
                            {month}
                          </span>
                          <span className="text-3xl font-bold text-secondary leading-none">
                            {day}
                          </span>
                        </div>
                        <div className="flex-1 pl-4 relative">
                          <div className="absolute left-0 top-1/4 h-1/2 border-l border-1"></div>
                          <div className="ml-4">
                            <h3 className="mb-1 text-lg font-bold text-black">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {event.location} · {event.time}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button className="w-full bg-accent hover:bg-accent/90" asChild>
                          <Link href={`/events/${event.id}`}>Participar</Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent text-black hover:bg-gray-50"
                        >
                          Convidar
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-8">
            <Button size="icon" className="bg-transparent text-black hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-foreground">Página 1 de 1</span>
            <Button size="icon" className="bg-transparent text-black hover:bg-gray-50">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
