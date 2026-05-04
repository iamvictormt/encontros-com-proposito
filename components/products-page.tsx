"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { formatBRL } from "@/lib/utils/format";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { cn } from "@/lib/utils";

const staticThemes = [
  { id: "all", label: "Tudo" },
  { id: "relationships", label: "Amor & Relacionamentos" },
  { id: "spirituality", label: "Espiritualidade" },
  { id: "personal", label: "Desenvolvimento Pessoal" },
  { id: "professional", label: "Profissional / Carreira" },
  { id: "therapy", label: "Terapias" },
];

const deliveryOptions = [
  { id: "all", label: "Tudo" },
  { id: "physical", label: "Entrega Física" },
  { id: "download", label: "Download Imediato" },
  { id: "online", label: "Acesso Online" },
];

// Products will be fetched from API
const API_PRODUCTS_URL = "/api/products";

interface FilterContentProps {
  categories: any[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  themes: any[];
  selectedTheme: string;
  setSelectedTheme: (id: string) => void;
  delivery: any[];
  selectedDelivery: string;
  setSelectedDelivery: (id: string) => void;
}

const FilterContent = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  themes,
  selectedTheme,
  setSelectedTheme,
  delivery,
  selectedDelivery,
  setSelectedDelivery,
}: FilterContentProps) => (
  <div className="space-y-12">
    {/* Categorias */}
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-1 w-8 bg-brand-orange rounded-full" />
        <h3 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
          Categorias
        </h3>
      </div>
      <div className="space-y-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "group flex items-center justify-between w-full text-left px-4 py-3 rounded-xl transition-all duration-300",
              selectedCategory === cat.id
                ? "bg-brand-black text-white shadow-xl shadow-brand-black/20"
                : "text-gray-500 hover:bg-brand-black/5 hover:text-brand-black",
            )}
          >
            <span className="text-[11px] font-black uppercase tracking-widest">{cat.label}</span>
            {selectedCategory === cat.id && (
              <div className="w-1.5 h-1.5 rounded-full bg-brand-orange shadow-[0_0_8px_#FF1D55]" />
            )}
          </button>
        ))}
      </div>
    </div>

    {/* Preço */}
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-1 w-8 bg-brand-green rounded-full" />
        <h3 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
          Preço Máximo
        </h3>
      </div>
      <div className="px-2 space-y-4">
        <Slider
          min={0}
          max={500}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          className="w-full"
        />
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Até</span>
          <span className="text-xl font-black text-brand-black tracking-tighter">
            {formatBRL(priceRange[0])}
          </span>
        </div>
      </div>
    </div>

    {/* Tema */}
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-1 w-8 bg-brand-red rounded-full" />
        <h3 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
          Temas Exclusivos
        </h3>
      </div>
      <div className="space-y-1">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setSelectedTheme(theme.id)}
            className={cn(
              "group flex items-center justify-between w-full text-left px-4 py-3 rounded-xl transition-all duration-300",
              selectedTheme === theme.id
                ? "bg-brand-black text-white shadow-xl shadow-brand-black/20"
                : "text-gray-500 hover:bg-brand-black/5 hover:text-brand-black",
            )}
          >
            <span className="text-[11px] font-black uppercase tracking-widest">{theme.label}</span>
            {selectedTheme === theme.id && (
              <div className="w-1.5 h-1.5 rounded-full bg-brand-red" />
            )}
          </button>
        ))}
      </div>
    </div>

    {/* Entrega */}
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-1 w-8 bg-brand-green rounded-full" />
        <h3 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
          Tipo de Acesso
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {delivery.map((del) => (
          <button
            key={del.id}
            onClick={() => setSelectedDelivery(del.id)}
            className={cn(
              "px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 text-center",
              selectedDelivery === del.id
                ? "bg-brand-green border-brand-green text-white shadow-lg shadow-brand-green/20"
                : "border-brand-black/10 text-gray-500 hover:border-brand-black hover:text-brand-black",
            )}
          >
            {del.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [dynamicCategories, setDynamicCategories] = useState<{ id: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [selectedDelivery, setSelectedDelivery] = useState("all");
  const [priceRange, setPriceRange] = useState([500]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDynamicCategories([
            { id: "all", label: "Tudo" },
            ...data.map((cat) => ({ id: cat.name, label: cat.name })),
          ]);
        }
      });
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTheme, selectedDelivery, priceRange]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_PRODUCTS_URL);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedCategory !== "all") {
      if (product.category !== selectedCategory) return false;
    }

    // Delivery/Type filter
    if (selectedDelivery !== "all") {
      if (selectedDelivery === "physical" && product.type !== "Físico") return false;
      if (
        (selectedDelivery === "download" || selectedDelivery === "online") &&
        product.type !== "Digital"
      )
        return false;
    }

    // Price filter
    if (product.price > priceRange[0]) return false;

    // Theme filter
    if (selectedTheme !== "all") {
      const themeLabel = staticThemes.find((t) => t.id === selectedTheme)?.label;
      if (product.theme !== themeLabel) return false;
    }

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const filterProps = {
    categories: dynamicCategories,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    themes: staticThemes,
    selectedTheme,
    setSelectedTheme,
    delivery: deliveryOptions,
    selectedDelivery,
    setSelectedDelivery,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 sm:px-8 py-10 sm:py-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-10 sm:mb-16 text-center space-y-4">
            <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Exclusividade
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-brand-black tracking-tighter uppercase mt-4">
              Produtos <span className="text-brand-red">Autorais</span>
            </h1>
            <p className="text-gray-500 max-w-lg mx-auto font-medium text-base sm:text-lg">
              Itens exclusivos desenvolvidos para eternizar suas experiências em nossos encontros.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="glass p-10 rounded-[3rem] border-white/40 shadow-xl sticky top-32">
                <FilterContent {...filterProps} />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <div className="lg:hidden mb-12">
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-16 rounded-[2rem] border-white shadow-xl glass bg-white/60 text-brand-black font-black uppercase tracking-widest text-[10px] group transition-all active:scale-95"
                    >
                      <SlidersHorizontal className="mr-3 h-4 w-4 text-brand-orange group-hover:rotate-90 transition-transform duration-500" />
                      Filtrar Coleção
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[85vw] sm:w-[400px] glass border-brand-green/10 px-8 pt-16 overflow-y-auto"
                  >
                    <SheetHeader className="mb-12 text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-1 w-8 bg-brand-orange rounded-full" />
                        <span className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.3em]">
                          Explorar
                        </span>
                      </div>
                      <SheetTitle className="text-4xl font-black uppercase tracking-tighter text-brand-black leading-none">
                        Filtros
                      </SheetTitle>
                    </SheetHeader>
                    <div className="pb-20">
                      <FilterContent {...filterProps} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Products Grid */}
              {isLoading ? (
                <div className="flex justify-center items-center py-24">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-red border-r-transparent"></div>
                </div>
              ) : paginatedProducts.length === 0 ? (
                <div className="text-center py-20 sm:py-24 glass rounded-[2.5rem] border-dashed border-brand-green/20">
                  <div className="text-5xl sm:text-6xl mb-6 grayscale opacity-30">🛍️</div>
                  <h3 className="text-xl sm:text-2xl font-black text-brand-black uppercase tracking-tighter">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mt-2 font-medium px-4">
                    Tente ajustar seus filtros para encontrar o que procura.
                  </p>
                </div>
              ) : (
                <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                  {paginatedProducts.map((product, index) => (
                    <Link href={`/products/${product.id}`} key={index} className="group">
                      <div className="premium-card bg-white rounded-[2.5rem] overflow-hidden flex flex-col h-full border-none shadow-xl hover:shadow-2xl">
                        <div className="relative h-50 overflow-hidden p-6">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-contain transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-6 left-6">
                            <span className="glass-dark px-3 py-1 rounded-lg text-[8px] font-black text-white uppercase tracking-widest shadow-lg">
                              {product.category}
                            </span>
                          </div>
                        </div>

                        <div className="p-6 sm:p-8 flex flex-col flex-1">
                          <h3 className="mb-4 text-lg sm:text-xl font-black text-brand-black leading-tight uppercase tracking-tight group-hover:text-brand-orange transition-colors">
                            {product.name}
                          </h3>

                          <div className="mt-auto pt-6 border-t border-brand-green/5 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-2xl font-black text-brand-black tracking-tighter">
                                {formatBRL(product.price)}
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs text-gray-400 line-through font-bold">
                                  {formatBRL(product.originalPrice)}
                                </span>
                              )}
                            </div>
                            <Button
                              size="icon"
                              className="w-12 h-12 rounded-2xl bg-brand-green hover:bg-brand-green/90 shadow-lg shadow-brand-green/20"
                            >
                              <ArrowRight className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-20 flex items-center justify-center gap-6">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-2xl border-brand-green/10 bg-white text-brand-black hover:bg-brand-green hover:text-white transition-all shadow-sm disabled:opacity-20"
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
                    className="h-12 w-12 rounded-2xl border-brand-green/10 bg-white text-brand-black hover:bg-brand-green hover:text-white transition-all shadow-sm disabled:opacity-20"
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
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
