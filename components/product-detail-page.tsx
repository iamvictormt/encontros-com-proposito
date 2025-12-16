'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Play, Share2, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Quote, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const product = {
  id: 1,
  category: 'Camisetas',
  title: 'Camiseta Autoral',
  availability: '150 Unidades Disponíveis',
  description:
    'Essa camisa uma mensagem que toca corações. Essa peça foi criada para lembrar que hoje não é o fim, mas um novo começo. Traga conforto para todos que cruzam o seu caminho. Feita com amor, fé e propósito, ela carrega mais que palavras; carrega verdade, identidade e propósito. Para presentear e reinventar seu look com estilo, autenticidade e conforto. Com o que realmente importa.',
  price: 125.5,
  originalPrice: 180.0,
  images: [
    '/placeholder.svg?height=600&width=500&text=Image+1',
    '/placeholder.svg?height=600&width=500&text=Image+2',
    '/placeholder.svg?height=600&width=500&text=Image+3',
  ],
  tags: ['FindB', 'Outros Eventos'],
  sizes: ['PP', 'P', 'M', 'G', 'GG'],
  video: '/placeholder.svg?height=300&width=400&text=Video',
};

const relatedProducts = Array(4).fill({
  id: 1,
  image: '/placeholder.svg?height=300&width=300',
  category: 'Camisetas',
  title: 'Camiseta Preta',
  price: 125.5,
  originalPrice: 250.0,
});

const reviews = [
  {
    id: 1,
    text: 'Lorem ipsum dolor sit amet consectetur. Convallis mi molestie nibh urna urna habitant semper id. Ac non a id tellus auctor non. Diam in cras eget in. Elementum feugiat auis posuere erat lectus nisi.',
    author: 'Luciana Cardoso',
  },
  {
    id: 2,
    text: 'Produto de excelente qualidade! A entrega foi rápida e o atendimento impecável. Super recomendo para todos que procuram produtos autênticos.',
    author: 'João Silva',
  },
  {
    id: 3,
    text: 'Adorei a camiseta! O tecido é muito confortável e a estampa ficou perfeita. Já comprei várias vezes e sempre volto.',
    author: 'Maria Santos',
  },
];

export function ProductDetailPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [fabricationOpen, setFabricationOpen] = useState(false);
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const handlePreviousReview = () => {
    setCurrentReviewIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNextReview = () => {
    setCurrentReviewIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 py-8 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="mb-4 relative h-[600px] rounded-xl overflow-hidden">
                <Image
                  src={product.images[selectedImageIndex] || '/placeholder.svg'}
                  alt={product.title}
                  fill
                  className="object-contain"
                />

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  <button
                    onClick={handlePreviousImage}
                    className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5 text-white" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-20 w-20 sm:h-24 sm:w-24 rounded-lg overflow-hidden transition-all cursor-pointer ${
                      selectedImageIndex === index ? 'ring-2 ring-accent' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image || '/placeholder.svg'}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4">
                <p className="text-sm text-primary font-semibold mb-2">{product.category}</p>
              </div>

              <h1 className="text-3xl font-bold text-black mb-2">{product.title}</h1>
              <p className="text-sm text-gray-500 mb-6 flex items-center gap-1">
                <ShoppingCart className="mr-1 h-4 w-4" />
                {product.availability}
              </p>

              <div className="mb-6">
                <h2 className="text-lg font-bold text-black mb-3">Descrição do produto</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-black">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                  <span className="text-lg text-gray-400 line-through">
                    R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="flex gap-3 mb-6">
                  <Button className="flex-1 bg-accent hover:bg-accent/90 text-white rounded-lg">Comprar</Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-white text-black border-gray-300 hover:bg-gray-50 rounded-lg hover:text-black"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartilhar
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm text-gray-500 mb-2 block">Usar esse produto no Evento:</label>
                <Select>
                  <SelectTrigger className="w-full rounded-lg">
                    <SelectValue placeholder="Escolher evento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event1">Evento 1</SelectItem>
                    <SelectItem value="event2">Evento 2</SelectItem>
                    <SelectItem value="event3">Evento 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 mb-6">
                {product.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-primary text-white text-xs rounded-full font-semibold">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mb-6">
                <h3 className="text-base font-bold text-black mb-3">Tamanho</h3>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-2 border rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                        selectedSize === size
                          ? 'border-accent bg-accent text-white'
                          : 'border-gray-300 text-black hover:border-accent'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Collapsible open={fabricationOpen} onOpenChange={setFabricationOpen}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border-t border-gray-200 py-4 text-left">
                    <span className="text-base font-bold text-black">Detalhes de fabricação</span>
                    <ChevronDown
                      className={`h-5 w-5 text-black transition-transform ${fabricationOpen ? 'rotate-180' : ''}`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pb-4 text-sm text-gray-600">
                    Informações sobre o processo de fabricação, qualidade dos materiais e cuidados especiais.
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={materialsOpen} onOpenChange={setMaterialsOpen}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border-t border-gray-200 py-4 text-left">
                    <span className="text-base font-bold text-black">Materiais</span>
                    <ChevronDown
                      className={`h-5 w-5 text-black transition-transform ${materialsOpen ? 'rotate-180' : ''}`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pb-4 text-sm text-gray-600">
                    100% algodão de alta qualidade, tingimento sustentável, estampa em silk screen durável.
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:gap-0 lg:grid-cols-[60%_40%] mt-12">
            {/* APRESENTAÇÃO */}
            <div className="lg:mr-4">
              <h2 className="text-2xl font-bold text-black mb-4">Apresentação</h2>

              <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden group cursor-pointer">
                <Image
                  src={product.video || '/placeholder.svg'}
                  alt="Video presentation"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="h-6 w-6 text-black ml-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* OPINIÕES */}
            <div className="md:ml-4">
              <h2 className="text-2xl font-bold text-black mb-4">Opiniões de compradores</h2>

              <div className="relative h-90">
                <div className="relative w-full">
                  {reviews.map((review, index) => {
                    const position = (index - currentReviewIndex + reviews.length) % reviews.length;

                    return (
                      <div
                        key={review.id}
                        className={cn(
                          'relative absolute top-0 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 ease-in-out p-8 h-80',
                          // ↑ importante: "relative" antes de "absolute"

                          position === 0 && 'z-30 left-0 w-[85%] opacity-100 scale-100 overflow-y-auto',
                          position === 1 && 'z-20 left-[5%] w-[90%] opacity-60 scale-95 overflow-hidden',
                          position === 2 && 'z-10 left-[10%] w-[95%] opacity-40 scale-90 overflow-hidden',
                          position > 2 && 'opacity-0 pointer-events-none'
                        )}
                      >
                        {/* QUOTE */}
                        <Image src="/images/quote.svg" alt="Quote" className="mb-4 h-10 w-10" width={24} height={24} />

                        {/* TEXTO */}
                        <p className="text-base text-gray-500 leading-relaxed mb-12 pr-4">{review.text}</p>

                        {/* NOME NO CANTO INFERIOR ESQUERDO */}
                        <p className="text-sm font-bold text-black absolute bottom-4 left-8">{review.author}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BOTÕES */}
              <div className="flex justify-end gap-4 mt-1">
                <button
                  onClick={handlePreviousReview}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  aria-label="Previous review"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextReview}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  aria-label="Next review"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Produtos que podem te interessar</h2>
              <Link href="/products" className="text-sm text-primary hover:underline">
                Ver mais
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct, index) => (
                <div
                  key={index}
                  className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <Image
                      src={relatedProduct.image || '/placeholder.svg'}
                      alt={relatedProduct.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>

                  <div className="p-4">
                    <p className="mb-1 text-xs font-semibold text-primary uppercase">{relatedProduct.category}</p>
                    <h3 className="mb-3 text-base font-bold text-black">{relatedProduct.title}</h3>

                    <div className="mb-4 flex items-baseline gap-2">
                      <span className="text-xl font-bold text-black">
                        R$ {relatedProduct.price.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        R$ {relatedProduct.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    <Button className="w-full bg-accent hover:bg-accent/90 rounded-lg">Comprar</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
