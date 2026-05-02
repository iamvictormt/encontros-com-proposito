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
import { useLoading } from "@/providers/loading-provider";

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
  const { setIsLoading: setGlobalLoading } = useLoading();
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

  useEffect(() => {
    setGlobalLoading(isLoading);
  }, [isLoading, setGlobalLoading]);

  if (isLoading) {
    return null;
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
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 py-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-6">
              <div className="relative h-[400px] sm:h-[600px] rounded-[3rem] overflow-hidden glass border-white/40 shadow-2xl group p-12">
                <Image
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-contain p-12 transition-transform duration-700 group-hover:scale-110"
                />

                {images.length > 1 && (
                  <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                    <Button
                      onClick={handlePreviousImage}
                      size="icon"
                      className="w-12 h-12 rounded-2xl glass-dark text-white pointer-events-auto shadow-xl hover:scale-110 transition-transform"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      onClick={handleNextImage}
                      size="icon"
                      className="w-12 h-12 rounded-2xl glass-dark text-white pointer-events-auto shadow-xl hover:scale-110 transition-transform"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>
                )}
                
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-dark px-4 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex gap-4 justify-center">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        "relative h-20 w-20 rounded-2xl overflow-hidden transition-all duration-300 border-2",
                        selectedImageIndex === index
                          ? "border-brand-orange shadow-lg scale-110"
                          : "border-transparent grayscale opacity-50 hover:grayscale-0 hover:opacity-100"
                      )}
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

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-6">
                 <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em]">
                  {product.category}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-black text-brand-black mb-6 uppercase tracking-tighter leading-none">
                {product.name}
              </h1>

              <div className="flex items-center gap-6 mb-10">
                <div className="flex items-center gap-2 text-brand-green">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-sm font-black uppercase tracking-widest">
                    {product.stock > 0 ? `${product.stock} em estoque` : "Esgotado"}
                  </span>
                </div>
                {product.type && (
                  <span className="bg-brand-red/5 text-brand-red px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-brand-red/10">
                    {product.type}
                  </span>
                )}
              </div>

              <div className="glass p-10 rounded-[2.5rem] border-white/40 shadow-xl mb-10">
                <div className="flex flex-col gap-1 mb-8">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor do Investimento</p>
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-black text-brand-black tracking-tighter">{formatBRL(product.price)}</span>
                    {product.price && (
                      <span className="text-xl text-gray-400 line-through font-bold">
                        {formatBRL(product.price * 1.15)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    className="h-16 rounded-2xl bg-brand-orange hover:bg-brand-orange/90 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-orange/20"
                    onClick={() => {
                      toast.info("A funcionalidade de compra será implementada em breve!");
                    }}
                  >
                    Garantir Agora
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 rounded-2xl border-brand-black/10 bg-white text-brand-black hover:bg-brand-black hover:text-white font-black uppercase tracking-widest text-sm transition-all"
                    onClick={() => {
                      const url = window.location.href;
                      if (navigator.share) {
                        navigator.share({ title: product.name, text: product.description, url }).catch(console.error);
                      } else {
                        navigator.clipboard.writeText(url);
                        toast.success("Link copiado!");
                      }
                    }}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartilhar
                  </Button>
                </div>
              </div>

              {sizes.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Escolha seu Tamanho</h3>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-black transition-all border-2",
                          selectedSize === size
                            ? "bg-brand-black border-brand-black text-white shadow-lg scale-110"
                            : "bg-white border-brand-green/10 text-brand-black hover:border-brand-orange"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-8 bg-brand-orange rounded-full" />
                  <h2 className="text-lg font-black text-brand-black uppercase tracking-tight">Detalhes</h2>
                </div>
                <p className="text-gray-500 font-medium leading-relaxed">
                  {product.description}
                </p>

                <div className="pt-6 space-y-2">
                  {product.manufacturing_details && (
                    <Collapsible open={fabricationOpen} onOpenChange={setFabricationOpen} className="glass rounded-2xl border-white/40 overflow-hidden">
                      <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-4 hover:bg-white/40 transition-colors">
                        <span className="text-xs font-black text-brand-black uppercase tracking-widest">Fabricação</span>
                        <ChevronDown className={cn("h-4 w-4 text-brand-black transition-transform", fabricationOpen && "rotate-180")} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-6 pb-4 text-sm text-gray-500 font-medium leading-relaxed">
                        {product.manufacturing_details}
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {product.materials && (
                    <Collapsible open={materialsOpen} onOpenChange={setMaterialsOpen} className="glass rounded-2xl border-white/40 overflow-hidden">
                      <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-4 hover:bg-white/40 transition-colors">
                        <span className="text-xs font-black text-brand-black uppercase tracking-widest">Composição</span>
                        <ChevronDown className={cn("h-4 w-4 text-brand-black transition-transform", materialsOpen && "rotate-180")} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-6 pb-4 text-sm text-gray-500 font-medium leading-relaxed">
                        {product.materials}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Video & Reviews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-24">
            {product.presentation_link && (
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-brand-red rounded-full" />
                  <h2 className="text-2xl font-black text-brand-black uppercase tracking-tighter">Apresentação</h2>
                </div>
                <div className="relative w-full aspect-video bg-brand-black rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/50">
                  {product.presentation_link.includes("youtube.com") || product.presentation_link.includes("youtu.be") ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={product.presentation_link.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                      allowFullScreen
                    />
                  ) : (
                    <video src={product.presentation_link} className="absolute inset-0 w-full h-full object-cover" controls />
                  )}
                </div>
              </div>
            )}

            <div className={cn("space-y-8", !product.presentation_link && "lg:col-span-2")}>
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-brand-green rounded-full" />
                <h2 className="text-2xl font-black text-brand-black uppercase tracking-tighter">Feedback da Comunidade</h2>
              </div>
              <div className="glass rounded-[3.5rem] p-12 border-white/40 shadow-xl min-h-[400px] flex items-center">
                <TestimonialCarousel reviews={reviews} variant="stacked" arrowsPosition="right" />
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-32">
              <div className="flex items-end justify-between mb-12">
                <div className="space-y-2">
                  <h4 className="text-brand-orange font-bold uppercase tracking-[0.3em] text-[10px]">Recomendações</h4>
                  <h2 className="text-4xl font-black text-brand-black uppercase tracking-tighter">Complemente seu <span className="text-brand-red">Lifestyle</span></h2>
                </div>
                <Link href="/products" className="hidden sm:flex items-center gap-2 text-brand-black font-black uppercase tracking-widest text-[10px] hover:text-brand-orange transition-colors">
                  Ver Coleção Completa <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((p, index) => (
                  <Link href={`/products/${p.id}`} key={index} className="group">
                    <div className="premium-card bg-white rounded-[2.5rem] overflow-hidden h-full flex flex-col shadow-xl">
                      <div className="relative h-64 overflow-hidden bg-gray-50 p-6">
                        <Image
                          src={p.image || "/placeholder.svg"}
                          alt={p.name}
                          fill
                          className="object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-8 flex flex-col flex-1">
                        <h3 className="text-lg font-black text-brand-black uppercase tracking-tight group-hover:text-brand-orange transition-colors mb-4 line-clamp-2">{p.name}</h3>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-xl font-black text-brand-black tracking-tighter">{formatBRL(p.price)}</span>
                          <Button size="icon" className="w-10 h-10 rounded-xl bg-brand-green hover:bg-brand-green/90">
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
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
