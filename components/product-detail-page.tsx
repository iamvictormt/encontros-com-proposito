"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Play,
  Share2,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Quote,
  ShoppingCart,
  Share,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TestimonialCarousel } from "./testimonial-carousel";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { formatBRL } from "@/lib/utils/format";
import { toast } from "sonner";

const reviews = [
  {
    id: 1,
    text: "Lorem ipsum dolor sit amet consectetur. Convallis mi molestie nibh urna urna habitant semper id. Ac non a id tellus auctor non. Diam in cras eget in. Elementum feugiat auis posuere erat lectus nisi.",
    author: "Luciana Cardoso",
  },
  {
    id: 2,
    text: "Produto de excelente qualidade! A entrega foi rápida e o atendimento impecável. Super recomendo para todos que procuram produtos autênticos.",
    author: "João Silva",
  },
  {
    id: 3,
    text: "Adorei a camiseta! O tecido é muito confortável e a estampa ficou perfeita. Já comprei várias vezes e sempre volto.",
    author: "Maria Santos",
  },
];

export function ProductDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [fabricationOpen, setFabricationOpen] = useState(false);
  const [materialsOpen, setMaterialsOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [prodRes, allProdRes] = await Promise.all([
          fetch(`/api/products?id=${id}`),
          fetch(`/api/products`),
        ]);

        if (!prodRes.ok) throw new Error("Product not found");

        const prodData = await prodRes.json();
        const allProdData = await allProdRes.json();

        setProduct(prodData);
        // Filter out current product and pick 4
        setRelatedProducts(allProdData.filter((p: any) => p.id !== id).slice(0, 4));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Produto não encontrado</h1>
          <Button asChild>
            <Link href="/products">Voltar para a loja</Link>
          </Button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // Handle images - database stores images as JSON string array
  let productImages = [];
  try {
    productImages = product.images ? JSON.parse(product.images) : [product.image];
  } catch (e) {
    productImages = [product.image];
  }
  const images = productImages.filter(Boolean);
  if (images.length === 0) images.push("/placeholder.svg");

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Parse sizes if they are stored as comma-separated or similar,
  // but for now we'll just show the raw string if it's not empty.
  const sizes = product.size ? product.size.split(",").map((s: string) => s.trim()) : [];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 py-8 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="mb-4 relative h-[600px] rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                <Image
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                />

                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-0">
                    <button
                      onClick={handlePreviousImage}
                      className="w-8 h-8 rounded-l-md bg-black/80 hover:bg-black/90 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5 text-white" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="w-8 h-8 rounded-r-md bg-black/80 hover:bg-black/90 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5 text-white" />
                    </button>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 justify-center">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-20 w-20 sm:h-24 sm:w-24 rounded-lg overflow-hidden transition-all cursor-pointer ${
                        selectedImageIndex === index
                          ? "ring-2 ring-accent"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-4">
                <p className="text-sm text-primary font-semibold mb-2">{product.category}</p>
              </div>

              <h1 className="text-3xl font-bold text-black mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <ShoppingCart className="mr-1 h-4 w-4" />
                  {product.stock > 0 ? `${product.stock} Unidades Disponíveis` : "Produto Esgotado"}
                </p>
                {product.type && (
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600 font-medium">
                    {product.type}
                  </span>
                )}
              </div>

              {product.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-black mb-3">Descrição do produto</h2>
                  <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-black">{formatBRL(product.price)}</span>
                  {product.price && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatBRL(product.price * 1.15)}
                    </span>
                  )}
                </div>

                <div className="flex gap-3 mb-6">
                  <Button 
                    className="flex-1 bg-accent hover:bg-accent/90 text-white rounded-lg"
                    onClick={() => {
                      toast.info("A funcionalidade de compra será implementada em breve!");
                    }}
                  >
                    Comprar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-white text-secondary border-secondary hover:bg-gray-50 rounded-lg hover:text-secondary/80"
                    onClick={() => {
                      navigator
                        .share?.({
                          title: product.name,
                          text: product.description,
                          url: window.location.href,
                        })
                        .catch(() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success("Link copiado!");
                        });
                    }}
                  >
                    <Share className="mr-2 h-4 w-4 text-secondary" />
                    Compartilhar
                  </Button>
                </div>
              </div>

               <div className="mb-6">
                <label className="text-sm text-gray-500 mb-2 block">
                  Usar esse produto no Evento:
                </label>
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

              {product.theme && (
                <div className="mb-6">
                  <p className="text-sm font-bold text-black mb-2">Tema:</p>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-semibold">
                    {product.theme}
                  </span>
                </div>
              )}

              {product.tags && (
                <div className="flex gap-2 mb-6">
                  {product.tags.split(",").map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary text-white text-xs rounded-full font-semibold"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-base font-bold text-black mb-3">Tamanho</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-2 border rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                          selectedSize === size
                            ? "border-accent bg-accent text-white"
                            : "border-gray-300 text-black hover:border-accent"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {product.manufacturing_details && (
                  <Collapsible open={fabricationOpen} onOpenChange={setFabricationOpen}>
                    <CollapsibleTrigger className="flex w-full items-center justify-between border-t border-gray-200 py-4 text-left">
                      <span className="text-base font-bold text-black">Detalhes de fabricação</span>
                      <ChevronDown
                        className={`h-5 w-5 text-black transition-transform ${fabricationOpen ? "rotate-180" : ""}`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pb-4 text-sm text-gray-600 whitespace-pre-wrap">
                      {product.manufacturing_details}
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {product.materials && (
                  <Collapsible open={materialsOpen} onOpenChange={setMaterialsOpen}>
                    <CollapsibleTrigger className="flex w-full items-center justify-between border-t border-gray-200 py-4 text-left">
                      <span className="text-base font-bold text-black">Materiais</span>
                      <ChevronDown
                        className={`h-5 w-5 text-black transition-transform ${materialsOpen ? "rotate-180" : ""}`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pb-4 text-sm text-gray-600">
                      {product.materials}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 items-start">
            {/* Apresentação */}
            {product.presentation_link && (
              <div>
                <h2 className="text-2xl font-bold text-black mb-6">Apresentação</h2>
                <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-xl">
                  {product.presentation_link.includes("youtube.com") ||
                  product.presentation_link.includes("youtu.be") ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={product.presentation_link
                        .replace("watch?v=", "embed/")
                        .replace("youtu.be/", "youtube.com/embed/")}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={product.presentation_link}
                      className="absolute inset-0 w-full h-full object-cover"
                      controls
                      playsInline
                      preload="metadata"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Opiniões */}
            <div className={cn(!product.presentation_link && "lg:col-span-2")}>
              <h2 className="text-2xl font-bold text-black mb-6">Opiniões de compradores</h2>
              <div className="bg-gray-50 rounded-3xl p-8 h-full min-h-[300px] flex flex-col justify-center">
                <TestimonialCarousel reviews={reviews} variant="stacked" arrowsPosition="right" />
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-16 mb-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-black">Produtos que podem te interessar</h2>
                <Link href="/products" className="text-primary font-semibold hover:underline">
                  Ver todos
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((p, index) => (
                  <Link href={`/products/${p.id}`} key={index}>
                    <div className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                      <div className="relative h-64 overflow-hidden bg-gray-100">
                        <Image
                          src={p.image || "/placeholder.svg"}
                          alt={p.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>

                      <div className="p-4">
                        <p className="mb-1 text-xs font-semibold text-primary uppercase">
                          {p.category}
                        </p>
                        <h3 className="mb-3 text-base font-bold text-black truncate">{p.name}</h3>

                        <div className="mb-4 flex items-baseline gap-2">
                          <span className="text-xl font-bold text-black">{formatBRL(p.price)}</span>
                          {p.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatBRL(p.originalPrice)}
                            </span>
                          )}
                        </div>

                        <Button className="w-full bg-accent hover:bg-accent/90">Comprar</Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
