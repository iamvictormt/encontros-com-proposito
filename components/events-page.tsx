'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Share2, Instagram, Facebook, ArrowLeft, ArrowRight, Link2, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from './logo';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

const heroSlides = [
  {
    image: '/placeholder.svg?height=400&width=1200',
    theme: 'Tema: Espiritual',
    location: 'São Paulo/SP',
    title: 'ENCONTRO ESPIRITUAL EM SÃO PAULO',
  },
  {
    image: '/placeholder.svg?height=400&width=1200',
    theme: 'Tema: Networking',
    location: 'Rio de Janeiro/RJ',
    title: 'GRANDES EXPERIÊNCIAS COMEÇAM AQUI',
  },
  {
    image: '/placeholder.svg?height=400&width=1200',
    theme: 'Tema: Negócios',
    location: 'Belo Horizonte/MG',
    title: 'CONEXÕES QUE TRANSFORMAM',
  },
];

const events = [
  {
    id: 1,
    image: '/placeholder.svg?height=300&width=400',
    price: 125.5,
    date: { month: 'AGO', day: 21 },
    title: 'Cinema ao ar Livre',
    location: 'Avenida Paulista',
    time: '19:30',
  },
  {
    id: 2,
    image: '/placeholder.svg?height=300&width=400',
    price: 125.5,
    date: { month: 'AGO', day: 20 },
    title: 'Encontro fé e vida',
    location: 'Avenida Paulista',
    time: '19:30',
  },
  {
    id: 3,
    image: '/placeholder.svg?height=300&width=400',
    price: 125.5,
    date: { month: 'AGO', day: 19 },
    title: 'EncontroBiz',
    location: 'Avenida Paulista',
    time: '19:30',
  },
  {
    id: 4,
    image: '/placeholder.svg?height=300&width=400',
    price: 125.5,
    date: { month: 'AGO', day: 18 },
    title: 'Pitch e Parcerias',
    location: 'Avenida Paulista',
    time: '19:30',
  },
  {
    id: 5,
    image: '/placeholder.svg?height=300&width=400',
    price: 125.5,
    date: { month: 'AGO', day: 17 },
    title: 'Happy Hour',
    location: 'Avenida Paulista',
    time: '19:30',
  },
  {
    id: 6,
    image: '/placeholder.svg?height=300&width=400',
    price: 125.5,
    date: { month: 'AGO', day: 16 },
    title: 'Encontro FindB',
    location: 'Avenida Paulista',
    time: '19:30',
  },
];

export function EventsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [year, setYear] = useState('');
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    setYear(currentYear);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white px-4 py-4 lg:px-20 mb-4">
        <div className="mx-auto flex items-center justify-between">
          <Logo href='/events' />

          <nav className="hidden items-center gap-6 lg:flex">
            <Link href="/" className="font-medium text-black hover:text-black/80">
              Home
            </Link>
            <Link href="/products" className="font-medium text-black hover:text-black/80">
              Produtos Autorais
            </Link>
            <Link href="/portfolio" className="font-medium text-black hover:text-black/80">
              Portfólio
            </Link>
            <Link href="/partners" className="font-medium text-black hover:text-black/80">
              Empresas e Parcerias
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="hidden sm:inline-flex bg-transparent text-black hover:bg-gray-50 hover:text-black"
                >
                  <Link href="/account">Minha Conta</Link>
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="bg-transparent hover:bg-gray-50 text-black hover:bg-gray-50 hover:text-black/80"
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="hidden sm:inline-flex bg-transparent text-black hover:bg-gray-50 hover:text-black"
                >
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild className="bg-secondary hover:bg-secondary/90">
                  <Link href="/signup">Cadastrar</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner with Carousel */}
      <section className="relative h-[600px] w-full overflow-hidden px-4 py-0 lg:px-20">
        <div className="mx-auto">
          <div className="relative h-[600px] overflow-hidden rounded-xl">
            <div
              className="flex h-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {heroSlides.map((slide, index) => (
                <div key={index} className="relative min-w-full">
                  <Image
                    src={slide.image || '/placeholder.svg'}
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

                      <h1 className="mb-6 text-4xl font-bold leading-tight text-white lg:text-5xl">{slide.title}</h1>

                      <div className="flex flex-wrap gap-4">
                        <Button size="lg" className="bg-accent hover:bg-accent/90">
                          Participar
                        </Button>

                        <Button size="lg" variant="ghost" className="bg-transparent text-white hover:bg-white/10">
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
                      ? 'w-10 bg-white h-[5px]'
                      : 'w-2 h-[5px] bg-white/50 hover:bg-white/70 cursor-pointer'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="absolute bottom-6 right-6 flex gap-3">
              <button
                onClick={prevSlide}
                className="p-4 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/20 transition-colors cursor-pointer text-white"
                aria-label="Previous slide"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-4 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/20 transition-colors cursor-pointer text-white"
                aria-label="Next slide"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="px-4 py-8 lg:px-20">
        <div className="mx-auto">
          {/* Section Header */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-2xl font-bold text-black lg:text-3xl">Eventos Populares</h2>

            <div className="flex w-full gap-3 sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <Input placeholder="Buscar Eventos" className="pl-9" />
              </div>
              <Button
                variant="outline"
                className="bg-transparent hover:bg-gray-50 text-black hover:bg-gray-50 hover:text-black/80"
              >
                <Filter className="mr-2 h-4 w-4 text-primary" />
                Filtros
              </Button>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={event.image || '/placeholder.svg'}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />

                  <div className="absolute right-3 top-3 flex gap-2">
                    <button className="rounded-full bg-white p-2.5 shadow-md transition-colors hover:bg-gray-100 cursor-pointer">
                      <MapPin className="h-4 w-4 text-black hover:text-black/80" />
                    </button>
                    <button className="rounded-full bg-white p-2.5 shadow-md transition-colors hover:bg-gray-100 cursor-pointer">
                      <Share2 className="h-4 w-4 text-black hover:text-black/80" />
                    </button>
                  </div>

                  <div className="absolute left-3 top-3 rounded-lg bg-white px-3 py-2.5 font-semibold text-black shadow-md">
                    R$ {event.price.toFixed(2).replace('.', ',')}
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-4 flex items-start gap-6">
                    <div className="flex flex-col items-center gap-1 min-w-[50px]">
                      <span className="text-xs font-semibold text-black uppercase tracking-wide">
                        {event.date.month}
                      </span>
                      <span className="text-3xl font-bold text-secondary leading-none">{event.date.day}</span>
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
                    <Button className="w-full bg-accent hover:bg-accent/90">Participar</Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent text-black hover:bg-gray-50 hover:text-black/80"
                    >
                      Convidar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-8">
            <Button size="icon" className="bg-transparent text-black hover:bg-gray-50 hover:text-black/80">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-foreground">Página 1 de 10</span>
            <Button size="icon" className="bg-transparent text-black hover:bg-gray-50 hover:text-black/80">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary px-4 py-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p className="text-sm text-secondary-foreground">
            <span className="text-accent">CheckLove</span> | Copyright © {year}
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-secondary-foreground hover:text-accent">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-secondary-foreground hover:text-accent">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
