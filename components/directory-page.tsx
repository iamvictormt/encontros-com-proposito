"use client";

import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  Target,
  Search,
  MapPin,
  Store,
  ArrowRight,
  Filter,
  Loader2,
  Navigation,
  Globe,
  LayoutGrid,
  List,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Partner {
  id: string;
  name: string;
  type: string;
  location: string;
  products: string;
  image: string;
  category: string;
  google_maps_link?: string;
  qr_code_token?: string;
}

export function DirectoryPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch("/api/venues");
        const data = await res.json();
        const approved = data.filter((v: any) => v.status === "Aprovado" || v.status === "Ativo");

        setPartners(
          approved.map((v: any) => ({
            id: v.id,
            name: v.name,
            type: v.type,
            location: v.location,
            products: v.description || "Produtos e Serviços exclusivos para membros MeetOff.",
            image: v.image,
            category: v.category || v.type.split(" - ")[0],
            google_maps_link: v.google_maps_link,
            qr_code_token: v.qr_code_token,
          })),
        );
      } catch (error) {
        console.error("Error fetching partners:", error);
        toast.error("Erro ao carregar o diretório");
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(partners.map((p) => p.category));
    return ["all", ...Array.from(cats)];
  }, [partners]);

  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()) ||
        p.products.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [partners, search, categoryFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD] font-sans selection:bg-brand-orange/30">
      <SiteHeader />

      <main className="flex-1 pb-32">
        {/* Cinematic Header Section */}
        <section className="relative h-[40vh] sm:h-[50vh] flex items-center justify-center overflow-hidden bg-brand-black">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200"
              alt="Directory Cover"
              fill
              className="object-cover opacity-40 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-black/80 via-brand-black/40 to-brand-black" />
          </div>

          <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl mx-auto">
            <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Ecossistema Premium
            </span>
            <h1 className="text-4xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none pt-4">
              Diretório de <span className="text-brand-orange">Parceiros</span>
            </h1>
            
            <p className="text-white/60 font-medium text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Explore uma curadoria exclusiva de empresas, serviços e pontos de encontro
              selecionados para a elite da comunidade MeetOff Brasil.
            </p>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="sticky top-20 z-40 px-4 -mt-10 sm:-mt-12">
          <div className="max-w-6xl mx-auto glass p-4 sm:p-6 rounded-[2.5rem] border-white/60 shadow-2xl backdrop-blur-3xl flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por nome, local ou serviço..."
                className="pl-14 h-14 rounded-2xl bg-white/50 border-brand-black/5 focus:bg-white transition-all font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[200px] h-14 rounded-2xl bg-white/50 border-brand-black/5 font-bold uppercase tracking-widest text-[10px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat}
                      value={cat}
                      className="font-bold uppercase tracking-widest text-[10px] py-3"
                    >
                      {cat === "all" ? "Todas Categorias" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="h-10 w-px bg-brand-black/5 hidden sm:block" />

              <div className="flex bg-white/50 p-1.5 rounded-2xl border border-brand-black/5">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "rounded-xl transition-all",
                    viewMode === "grid" ? "bg-white shadow-sm text-brand-orange" : "text-gray-400",
                  )}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "rounded-xl transition-all",
                    viewMode === "list" ? "bg-white shadow-sm text-brand-orange" : "text-gray-400",
                  )}
                  onClick={() => setViewMode("list")}
                >
                  <List size={20} />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Grid/List */}
        <section className="max-w-7xl mx-auto px-4 mt-20 sm:mt-24">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <Loader2 className="w-12 h-12 text-brand-orange animate-spin" />
              <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">
                Carregando Ecossistema...
              </p>
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="text-center py-32 space-y-8 bg-white rounded-[3rem] border border-dashed border-gray-100">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <Filter className="w-10 h-10 text-gray-200" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-brand-black uppercase tracking-tighter">
                  Nenhum parceiro encontrado
                </h3>
                <p className="text-gray-400 font-medium">Tente ajustar seus filtros de busca.</p>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="group premium-card bg-white rounded-[3rem] overflow-hidden flex flex-col shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={
                        partner.image ||
                        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800"
                      }
                      alt={partner.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-brand-black/80 backdrop-blur-md text-white border-white/20 rounded-xl px-5 py-2 font-black text-[9px] uppercase tracking-widest">
                        {partner.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-8 sm:p-10 space-y-6 flex-1 flex flex-col">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-brand-black uppercase tracking-tighter group-hover:text-brand-orange transition-colors line-clamp-1">
                        {partner.name}
                      </h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-brand-orange" /> {partner.location}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 font-medium line-clamp-3 leading-relaxed flex-1">
                      {partner.products}
                    </p>
                    <Button
                      onClick={() => setSelectedPartner(partner)}
                      className="w-full h-14 rounded-2xl bg-brand-black hover:bg-brand-black/90 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-black/20 transition-all active:scale-95"
                    >
                      Conhecer Perfil
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="group glass p-4 sm:p-6 rounded-[2.5rem] border-white/60 shadow-xl flex flex-col sm:flex-row items-center gap-8 hover:bg-white transition-all"
                >
                  <div className="relative w-full sm:w-48 h-48 sm:h-32 rounded-[2rem] overflow-hidden shrink-0">
                    <Image src={partner.image} alt={partner.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <h3 className="text-xl font-black text-brand-black uppercase tracking-tighter">
                        {partner.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className="w-fit mx-auto sm:mx-0 rounded-lg border-brand-black/10 font-black text-[8px] uppercase tracking-[0.2em]"
                      >
                        {partner.category}
                      </Badge>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2">
                      <MapPin size={12} className="text-brand-orange" /> {partner.location}
                    </p>
                    <p className="text-xs text-gray-500 font-medium line-clamp-1">
                      {partner.products}
                    </p>
                  </div>
                  <Button
                    onClick={() => setSelectedPartner(partner)}
                    className="h-14 sm:h-16 px-10 rounded-2xl bg-brand-black text-white font-black uppercase tracking-widest text-[10px]"
                  >
                    Perfil
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Partner Profile Modal */}
      <Dialog open={!!selectedPartner} onOpenChange={(open) => !open && setSelectedPartner(null)}>
        <DialogContent className="sm:max-w-2xl bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
          {selectedPartner && (
            <div className="flex flex-col">
              <DialogHeader className="sr-only">
                <DialogTitle>{selectedPartner.name}</DialogTitle>
                <DialogDescription>
                  Detalhes do perfil da empresa {selectedPartner.name}
                </DialogDescription>
              </DialogHeader>

              <div className="h-48 sm:h-72 relative">
                <Image
                  src={
                    selectedPartner.image ||
                    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800"
                  }
                  alt={selectedPartner.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-10 right-10">
                  <Badge className="bg-brand-orange text-white border-none rounded-lg px-4 py-1.5 font-black text-[9px] uppercase tracking-widest mb-3">
                    {selectedPartner.category}
                  </Badge>
                  <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                    {selectedPartner.name}
                  </h2>
                </div>
              </div>

              <div className="p-10 sm:p-12 space-y-10">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={12} className="text-brand-orange" /> Localização
                    </span>
                    <p className="text-base font-black text-brand-black uppercase tracking-tight">
                      {selectedPartner.location}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Store size={12} className="text-brand-green" /> Tipo de Negócio
                    </span>
                    <p className="text-base font-black text-brand-black uppercase tracking-tight">
                      {selectedPartner.type}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-10 bg-brand-red rounded-full" />
                    <h3 className="text-xl font-black text-brand-black uppercase tracking-tighter">
                      Sobre o Parceiro
                    </h3>
                  </div>
                  <p className="text-gray-500 font-medium text-base leading-relaxed">
                    {selectedPartner.products}
                  </p>
                </div>

                <div className="pt-8 border-t border-brand-black/5 flex flex-col sm:flex-row gap-4">
                  <Button
                    className="flex-1 h-16 rounded-2xl bg-brand-black hover:bg-brand-black/90 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-black/20 transition-all active:scale-95"
                    onClick={() => setSelectedPartner(null)}
                  >
                    Fechar Perfil
                  </Button>
                  {selectedPartner.google_maps_link && (
                    <Button
                      variant="outline"
                      className="flex-1 h-16 rounded-2xl border-brand-black/10 hover:bg-gray-50 font-black uppercase tracking-widest text-[10px] gap-3"
                      onClick={() => window.open(selectedPartner.google_maps_link, "_blank")}
                    >
                      <Navigation size={14} className="text-brand-orange" /> Visitar Local
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </div>
  );
}
