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
import { format } from "path";

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
  setSelectedDelivery
}: FilterContentProps) => (
  <>
    {/* Categorias */}
    <div className="mb-8">
      <h3 className="text-lg font-bold text-primary mb-4">Categorias</h3>
      <div className="space-y-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center justify-between w-full text-left text-sm py-1 transition-colors ${
              selectedCategory === cat.id
                ? "text-black font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{cat.label}</span>
            {selectedCategory === cat.id && (
              <span className="w-2 h-2 rounded-full bg-secondary" />
            )}
          </button>
        ))}
      </div>
    </div>

    {/* Preço */}
    <div className="mb-8">
      <h3 className="text-lg font-bold text-primary mb-4">Preço</h3>
      <div className="space-y-2">
        <Slider
          min={0}
          max={500}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          className="w-full"
        />
        <p className="text-sm text-muted-foreground">{formatBRL(priceRange[0])}</p>
      </div>
    </div>

    {/* Tema */}
    <div className="mb-8">
      <h3 className="text-lg font-bold text-primary mb-4">Tema</h3>
      <div className="space-y-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setSelectedTheme(theme.id)}
            className={`flex items-center justify-between w-full text-left text-sm py-1 transition-colors ${
              selectedTheme === theme.id
                ? "text-black font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{theme.label}</span>
            {selectedTheme === theme.id && <span className="w-2 h-2 rounded-full bg-secondary" />}
          </button>
        ))}
      </div>
    </div>

    {/* Entrega */}
    <div className="mb-8">
      <h3 className="text-lg font-bold text-primary mb-4">Entrega</h3>
      <div className="space-y-2">
        {delivery.map((del) => (
          <button
            key={del.id}
            onClick={() => setSelectedDelivery(del.id)}
            className={`flex items-center justify-between w-full text-left text-sm py-1 transition-colors ${
              selectedDelivery === del.id
                ? "text-black font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{del.label}</span>
            {selectedDelivery === del.id && (
              <span className="w-2 h-2 rounded-full bg-secondary" />
            )}
          </button>
        ))}
      </div>
    </div>
  </>
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
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDynamicCategories([
            { id: "all", label: "Tudo" },
            ...data.map(cat => ({ id: cat.name, label: cat.name }))
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
      if ((selectedDelivery === "download" || selectedDelivery === "online") && product.type !== "Digital") return false;
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
    currentPage * itemsPerPage
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
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 py-8 lg:px-20">
        <div className="mx-auto max-w-7xl flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterContent {...filterProps} />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Page Title and Mobile Filter Button */}
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-black mb-2">Produtos Autorais</h1>
              <p className="text-sm text-muted-foreground">
                Encontre itens exclusivos dos nossos eventos
              </p>

              <div className="mt-4 lg:hidden">
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Filtros
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto px-6">
                    <SheetHeader className="mb-6">
                      <SheetTitle>Filtros</SheetTitle>
                    </SheetHeader>
                    <FilterContent {...filterProps} />
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">Nenhum produto encontrado com os filtros selecionados.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {paginatedProducts.map((product, index) => (
                  <Link href={`/products/${product.id}`} key={index}>
                    <div className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                      <div className="relative h-64 overflow-hidden bg-gray-100">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>

                      <div className="p-4">
                        <p className="mb-1 text-xs font-semibold text-primary uppercase">
                          {product.category}
                        </p>
                        <h3 className="mb-3 text-base font-bold text-black">{product.name}</h3>

                        <div className="mb-4 flex items-baseline gap-2">
                          <span className="text-xl font-bold text-black">
                            {formatBRL(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatBRL(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <Button className="w-full bg-accent hover:bg-accent/90">Comprar</Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-8">
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-transparent text-black hover:bg-gray-50 hover:text-black/80 disabled:opacity-30"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-foreground font-medium">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-transparent text-black hover:bg-gray-50 hover:text-black/80 disabled:opacity-30"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
