'use client';

import { Button } from '@/components/ui/button';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { MapPin, Users, Calendar, Clock, Share2, ChevronRight, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const event = {
  id: 1,
  title: 'ENCONTRO ESPIRITUAL EM SÃO PAULO',
  category: 'Religioso',
  date: '21 de Agosto de 2025',
  time: '19:30',
  location: 'Avenida Paulista, São Paulo/SP',
  price: 125.50,
  capacity: '150 Vagas',
  ageRating: '18+',
  description: 'Um encontro único para fortalecer sua fé e se conectar com pessoas que compartilham dos mesmos valores. Teremos momentos de reflexão, música e networking em um ambiente acolhedor no coração de São Paulo.',
  image: '/placeholder.svg?height=600&width=1200',
};

export function EventDetailPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 py-8 lg:px-20">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/events" className="hover:text-black transition-colors">Eventos</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-black font-medium">Detalhes do Evento</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Event Header */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary text-white text-xs rounded-full font-semibold uppercase">
                    {event.category}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-black">{event.title}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Event Image */}
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Data Tiles */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center text-center space-y-2 border border-gray-100">
                  <Users className="h-6 w-6 text-primary" />
                  <span className="text-xs text-gray-500 uppercase font-semibold">Capacidade</span>
                  <span className="text-lg font-bold text-black">{event.capacity}</span>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center text-center space-y-2 border border-gray-100">
                  <Heart className="h-6 w-6 text-primary" />
                  <span className="text-xs text-gray-500 uppercase font-semibold">Classificação</span>
                  <span className="text-lg font-bold text-black">{event.ageRating}</span>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center text-center space-y-2 border border-gray-100">
                  <div className="text-xl font-bold text-primary">R$</div>
                  <span className="text-xs text-gray-500 uppercase font-semibold">Investimento</span>
                  <span className="text-lg font-bold text-black">{event.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center text-center space-y-2 border border-gray-100">
                  <div className="text-xl font-bold text-primary">🏷️</div>
                  <span className="text-xs text-gray-500 uppercase font-semibold">Categoria</span>
                  <span className="text-lg font-bold text-black">{event.category}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black border-l-4 border-primary pl-4">Sobre o Evento</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {event.description}
                </p>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Prepare-se para uma experiência transformadora que vai além de um simples encontro. Nosso objetivo é criar um espaço onde a espiritualidade e a conexão humana se encontram de forma autêntica.
                </p>
              </div>

              {/* Map Placeholder */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black border-l-4 border-primary pl-4">Localização</h2>
                <div className="h-[300px] bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
                  <div className="text-center space-y-2">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-gray-500 font-medium">Mapa em breve</p>
                    <p className="text-sm text-gray-400">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-8">
                <div className="mb-6">
                  <span className="text-sm text-gray-500">Valor do ingresso</span>
                  <div className="text-3xl font-bold text-black">
                    {event.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-white h-12 text-lg font-bold rounded-xl shadow-md shadow-accent/20">
                    Participar Agora
                  </Button>
                  <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50 h-12 text-black font-semibold rounded-xl">
                    <Share2 className="mr-2 h-5 w-5 text-primary" />
                    Convidar Amigos
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Adicionar ao Calendário</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>Ver no Google Maps</span>
                  </div>
                </div>
              </div>

              {/* Organizer Card */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
                <h3 className="font-bold text-black">Organizado por</h3>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                    M
                  </div>
                  <div>
                    <p className="font-bold text-black">MeetOff Official</p>
                    <p className="text-sm text-gray-500">Organizador Verificado</p>
                  </div>
                </div>
                <Button variant="ghost" className="w-full text-primary hover:text-primary/80 hover:bg-primary/5 p-0 h-auto font-bold justify-start">
                  Ver Perfil Completo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
