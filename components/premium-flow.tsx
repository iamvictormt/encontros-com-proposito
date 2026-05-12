"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  MapPin,
  Truck,
  Briefcase,
  Heart,
  ExternalLink,
  Users,
  Shield,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import Link from "next/link";

type Step =
  | "WELCOME"
  | "TERMS"
  | "CATEGORY"
  | "ACCESSORY_TYPE"
  | "MODEL_SELECTION"
  | "DELIVERY_METHOD"
  | "ADDRESS_FORM"
  | "PARTNER_SELECTION"
  | "CONFIRMATION";

type Category = "RELACIONAMENTOS" | "NETWORKING";
type AccessoryType = "LENCOS" | "GRAVATAS";

interface Product {
  id: string;
  name: string;
  price: string;
  images: string[];
  description: string;
  category: string;
}

const PRODUCTS: Record<AccessoryType, Product[]> = {
  LENCOS: [
    {
      id: "lenco-signature",
      name: "Lenço Signature",
      price: "R$ 199,00",
      images: ["/images/lenço-01.png", "/images/lenço-02.png"],
      description:
        "Design geométrico sofisticado. Ideal para eventos sociais e encontros. Elegância que conecta pessoas.",
      category: "Relacionamentos",
    },
    {
      id: "lenco-luxury",
      name: "Lenço Luxury Edition",
      price: "R$ 199,00",
      images: ["/images/lenço-dobrado-01.png", "/images/lenço-dobrado-02.png"],
      description: "Design artístico premium. Exclusivo e elegante.",
      category: "Elite",
    },
  ],
  GRAVATAS: [
    {
      id: "gravata-executive",
      name: "Gravata Executive",
      price: "R$ 249,00",
      images: ["/images/gravata-01.png", "/images/gravata-02.png"],
      description: "Estilo corporativo premium. Perfeita para networking.",
      category: "Networking",
    },
    {
      id: "gravata-heritage",
      name: "Gravata Heritage",
      price: "R$ 249,00",
      images: ["/images/gravata-borboleta-01.png", "/images/gravata-borboleta-02.png"],
      description:
        "Design sofisticado social para eventos privados e experiências premium.",
      category: "Social",
    },
  ],
};

const PARTNERS = [
  { id: "1", name: "Hotel Fasano", address: "São Paulo - SP", distance: "2,4 km" },
  { id: "2", name: "WeWork Paulista", address: "São Paulo - SP", distance: "2,7 km" },
  { id: "3", name: "Café Cultura", address: "São Paulo - SP", distance: "3,1 km" },
  { id: "4", name: "MeetOff Point Jardins", address: "São Paulo - SP", distance: "3,8 km" },
];

const ProductCard = ({ 
  product, 
  onSelect 
}: { 
  product: Product; 
  onSelect: (p: Product) => void;
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  React.useEffect(() => {
    if (isHovered || product.images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % product.images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isHovered, product.images.length]);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-brand-black/5 hover:border-brand-red/20 transition-all hover:shadow-2xl hover:shadow-brand-red/5"
    >
      <div className="relative aspect-square">
        {product.images.map((img, idx) => (
          <Image
            key={img}
            src={img}
            alt={`${product.name} - ${idx}`}
            fill
            className={cn(
              "object-cover transition-all duration-1000",
              idx === currentIdx ? "opacity-100 scale-100" : "opacity-0 scale-105"
            )}
          />
        ))}
        
        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {product.images.map((_, idx) => (
            <div 
              key={idx}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-500",
                idx === currentIdx ? "bg-white w-4" : "bg-white/40"
              )}
            />
          ))}
        </div>

        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/50 z-20">
          <span className="text-[11px] font-black tracking-tighter text-brand-black">
            {product.price}
          </span>
        </div>
      </div>
      <div className="p-8 space-y-4">
        <div className="space-y-1">
          <h4 className="font-black uppercase tracking-tighter text-lg leading-tight">
            {product.name}
          </h4>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-red">
            {product.category}
          </p>
        </div>
        <p className="text-[11px] font-medium text-gray-400 leading-relaxed line-clamp-2">
          {product.description}
        </p>
        <Button
          onClick={() => onSelect(product)}
          className="w-full h-14 bg-brand-black hover:bg-brand-red text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-brand-black/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Selecionar
        </Button>
      </div>
    </div>
  );
};

export function PremiumFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("WELCOME");
  const [category, setCategory] = useState<Category | null>(null);
  const [accessoryType, setAccessoryType] = useState<AccessoryType | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"RESIDENTIAL" | "PARTNER" | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    estado: "",
    cidade: "",
    endereco: "",
    cep: "",
    telefone: "",
  });

  const currentYear = new Date().getFullYear().toString();

  const stepOrder: Step[] = [
    "WELCOME",
    "TERMS",
    "CATEGORY",
    "ACCESSORY_TYPE",
    "MODEL_SELECTION",
    "DELIVERY_METHOD",
    "ADDRESS_FORM",
    "CONFIRMATION",
  ];
  const progressValue = ((stepOrder.indexOf(step) + 1) / stepOrder.length) * 100;

  const nextStep = (next: Step) => setStep(next);

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cep") formattedValue = formatCEP(value);
    if (name === "telefone") formattedValue = formatPhone(value);

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const renderWelcome = () => (
    <div className="w-full max-w-lg space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4 text-center">
        <Logo className="justify-center flex" />
        <h2 className="text-4xl lg:text-5xl font-black text-brand-black tracking-tighter uppercase leading-none text-pretty">
          Conexões reais começam com <span className="text-brand-orange">presença.</span>
        </h2>
        <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-xs mx-auto">
          Escolha como deseja iniciar sua jornada exclusiva na MeetOff Brasil.
        </p>
      </div>

      <div className="space-y-4">
        <Button
          onClick={() => nextStep("TERMS")}
          className="w-full h-20 bg-brand-red hover:bg-brand-red/90 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-brand-red/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col gap-1"
        >
          <span>EXPERIÊNCIA RÁPIDA</span>
          <span className="text-[8px] font-bold opacity-60">Sem login, sem cadastro</span>
        </Button>

        <Button
          onClick={() => router.push("/signup")}
          className="w-full h-20 bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-brand-green/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col gap-1"
        >
          <span>CONTA COMPLETA</span>
          <span className="text-[8px] font-bold opacity-60">Criar minha conta</span>
        </Button>
      </div>

      <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
        Já tem conta?{" "}
        <button onClick={() => router.push("/login")} className="text-brand-red hover:underline">
          Entrar
        </button>
      </p>
    </div>
  );

  const renderTerms = () => (
    <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setStep("WELCOME")}
          className="rounded-full"
        >
          <ChevronLeft size={20} />
        </Button>
        <h3 className="text-xl font-black uppercase tracking-tighter">Antes de continuar</h3>
      </div>

      <div className="space-y-3">
        {[
          "Termos de Uso",
          "Política de Privacidade",
          "Política LGPD Brasil",
          "Política de Identificação Premium MeetOff",
        ].map((term) => (
          <div
            key={term}
            className="flex items-center justify-between p-5 rounded-2xl bg-white border border-brand-black/5 hover:border-brand-red/20 transition-all cursor-pointer group"
          >
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-600">
              {term}
            </span>
            <ExternalLink size={14} className="text-gray-300 group-hover:text-brand-red" />
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 p-2">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
          className="mt-1 data-[state=checked]:bg-brand-red data-[state=checked]:border-brand-red"
        />
        <label
          htmlFor="terms"
          className="text-xs font-medium text-gray-500 leading-relaxed cursor-pointer"
        >
          Li e aceito todos os termos, políticas de privacidade e condições de uso para continuar.
        </label>
      </div>

      <Button
        disabled={!termsAccepted}
        onClick={() => nextStep("CATEGORY")}
        className="w-full h-16 bg-brand-black hover:bg-brand-black/90 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-brand-black/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-20"
      >
        ACEITAR E CONTINUAR
      </Button>
    </div>
  );

  const renderCategory = () => (
    <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setStep("TERMS")}
          className="rounded-full"
        >
          <ChevronLeft size={20} />
        </Button>
        <h3 className="text-xl font-black uppercase tracking-tighter">Finalidade</h3>
      </div>

      <div className="space-y-4">
        <div
          onClick={() => {
            setCategory("RELACIONAMENTOS");
            nextStep("ACCESSORY_TYPE");
          }}
          className="flex items-center gap-5 p-6 rounded-[2rem] bg-white border border-brand-black/5 hover:border-brand-red/40 hover:shadow-2xl hover:shadow-brand-red/5 transition-all cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-2xl bg-brand-red/10 flex items-center justify-center text-brand-red group-hover:scale-110 transition-transform">
            <Heart size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-black uppercase tracking-widest text-[13px]">Relacionamentos</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Encontros e conexões reais
            </p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </div>

        <div
          onClick={() => {
            setCategory("NETWORKING");
            nextStep("ACCESSORY_TYPE");
          }}
          className="flex items-center gap-5 p-6 rounded-[2rem] bg-white border border-brand-black/5 hover:border-brand-green/40 hover:shadow-2xl hover:shadow-brand-green/5 transition-all cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green group-hover:scale-110 transition-transform">
            <Briefcase size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-black uppercase tracking-widest text-[13px]">Networking</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Conexões profissionais
            </p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </div>
      </div>
    </div>
  );

  const renderAccessoryType = () => (
    <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setStep("CATEGORY")}
          className="rounded-full"
        >
          <ChevronLeft size={20} />
        </Button>
        <h3 className="text-xl font-black uppercase tracking-tighter">Escolha seu acessório</h3>
      </div>

      <div className="space-y-4">
        <div
          onClick={() => {
            setAccessoryType("LENCOS");
            nextStep("MODEL_SELECTION");
          }}
          className="flex items-center gap-5 p-5 rounded-[2rem] bg-white border border-brand-black/5 hover:border-brand-red/20 transition-all cursor-pointer group"
        >
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-brand-black/5">
            <Image src="/images/lenço-01.png" alt="Lenços" fill className="object-cover" />
          </div>
          <div className="flex-1">
            <h4 className="font-black uppercase tracking-widest text-[13px]">Lenços</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              2 modelos exclusivos
            </p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </div>

        <div
          onClick={() => {
            setAccessoryType("GRAVATAS");
            nextStep("MODEL_SELECTION");
          }}
          className="flex items-center gap-5 p-5 rounded-[2rem] bg-white border border-brand-black/5 hover:border-brand-red/20 transition-all cursor-pointer group"
        >
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-brand-black/5">
            <Image src="/images/gravata-01.png" alt="Gravatas" fill className="object-cover" />
          </div>
          <div className="flex-1">
            <h4 className="font-black uppercase tracking-widest text-[13px]">Gravatas</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              2 modelos executivos
            </p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </div>
      </div>
    </div>
  );

  const renderModelSelection = () => (
    <div className="w-full max-w-lg space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setStep("ACCESSORY_TYPE")}
            className="rounded-full"
          >
            <ChevronLeft size={20} />
          </Button>
          <h3 className="text-xl font-black uppercase tracking-tighter">Modelos Oficiais</h3>
        </div>
        <div className="bg-brand-red/10 text-brand-red text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
          Premium
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {(accessoryType ? PRODUCTS[accessoryType] : []).map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onSelect={(p) => { 
              setSelectedProduct(p); 
              nextStep("DELIVERY_METHOD"); 
            }} 
          />
        ))}
      </div>
    </div>
  );

  const renderDeliveryMethod = () => (
    <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setStep("MODEL_SELECTION")}
          className="rounded-full"
        >
          <ChevronLeft size={20} />
        </Button>
        <h3 className="text-xl font-black uppercase tracking-tighter">Recebimento</h3>
      </div>

      <div className="space-y-4">
        <div
          onClick={() => {
            setDeliveryMethod("RESIDENTIAL");
            nextStep("ADDRESS_FORM");
          }}
          className="flex items-center gap-6 p-8 rounded-[2.5rem] bg-white border border-brand-black/5 hover:border-brand-red/20 transition-all cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-2xl bg-brand-red/10 flex items-center justify-center text-brand-red">
            <Truck size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-black uppercase tracking-widest text-[13px]">
              Entrega Residencial
            </h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Todo o Brasil
            </p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </div>

        <div
          onClick={() => {
            setDeliveryMethod("PARTNER");
            setStep("PARTNER_SELECTION");
          }}
          className="flex items-center gap-6 p-8 rounded-[2.5rem] bg-white border border-brand-black/5 hover:border-brand-green/20 transition-all cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
            <MapPin size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-black uppercase tracking-widest text-[13px]">Retirada Local</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Parceiros Oficiais
            </p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </div>
      </div>

      <button className="w-full text-center text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-brand-red transition-colors">
        Saiba mais sobre as políticas de entrega
      </button>
    </div>
  );

  const renderAddressForm = () => (
    <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setStep("DELIVERY_METHOD")}
          className="rounded-full"
        >
          <ChevronLeft size={20} />
        </Button>
        <h3 className="text-xl font-black uppercase tracking-tighter">Dados de Entrega</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
            Nome completo
          </label>
          <Input
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            placeholder="COMO CONSTA NO DOCUMENTO"
            className="h-14 rounded-2xl bg-white border-brand-black/5 text-[11px] font-bold uppercase tracking-widest px-6"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Estado
            </label>
            <Input
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              placeholder="UF"
              className="h-14 rounded-2xl bg-white border-brand-black/5 text-[11px] font-bold uppercase tracking-widest px-6 text-center"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Cidade
            </label>
            <Input
              name="cidade"
              value={formData.cidade}
              onChange={handleInputChange}
              placeholder="EX: SÃO PAULO"
              className="h-14 rounded-2xl bg-white border-brand-black/5 text-[11px] font-bold uppercase tracking-widest px-6"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
            Endereço
          </label>
          <Input
            name="endereco"
            value={formData.endereco}
            onChange={handleInputChange}
            placeholder="RUA, NÚMERO, COMPLEMENTO"
            className="h-14 rounded-2xl bg-white border-brand-black/5 text-[11px] font-bold uppercase tracking-widest px-6"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              CEP
            </label>
            <Input
              name="cep"
              value={formData.cep}
              onChange={handleInputChange}
              maxLength={9}
              placeholder="00000-000"
              className="h-14 rounded-2xl bg-white border-brand-black/5 text-[11px] font-bold uppercase tracking-widest px-6"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              WhatsApp
            </label>
            <Input
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
              maxLength={15}
              placeholder="(00) 00000-0000"
              className="h-14 rounded-2xl bg-white border-brand-black/5 text-[11px] font-bold uppercase tracking-widest px-6"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={() => nextStep("CONFIRMATION")}
        className="w-full h-16 bg-brand-red hover:bg-brand-red/90 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-brand-red/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        Finalizar Solicitação
      </Button>
    </div>
  );

  const renderPartnerSelection = () => (
    <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setStep("DELIVERY_METHOD")}
          className="rounded-full"
        >
          <ChevronLeft size={20} />
        </Button>
        <h3 className="text-xl font-black uppercase tracking-tighter">Locais de Retirada</h3>
      </div>

      <div className="space-y-3">
        {PARTNERS.map((partner) => (
          <div
            key={partner.id}
            onClick={() => nextStep("CONFIRMATION")}
            className="flex items-center justify-between p-6 rounded-[2rem] bg-white border border-brand-black/5 hover:border-brand-green/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center">
                {partner.name.includes("Hotel") ? <Star size={20} /> : <MapPin size={20} />}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-black uppercase tracking-tight text-sm leading-none">
                  {partner.name}
                </h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {partner.address}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-black text-brand-green uppercase">
                {partner.distance}
              </span>
              <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="w-full max-w-lg space-y-10 animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-brand-green/10 text-brand-green rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
          <Check size={48} strokeWidth={4} />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
          Pedido <br />
          <span className="text-brand-green">Confirmado!</span>
        </h2>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
          Identificação Premium MeetOff Brasil
        </p>
      </div>

      <div className="bg-white rounded-[3rem] p-10 border border-brand-black/5 shadow-2xl shadow-brand-black/5 space-y-6">
        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-red border-b border-brand-black/5 pb-4">
          Protocolo de Solicitação
        </h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Produto
            </span>
            <span className="text-[11px] font-black uppercase tracking-tight">
              {selectedProduct?.name}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Finalidade
            </span>
            <span className="text-[11px] font-black uppercase tracking-tight text-brand-red">
              {category}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Tipo
            </span>
            <span className="text-[11px] font-black uppercase tracking-tight">
              {deliveryMethod === "RESIDENTIAL" ? "Entrega" : "Retirada"}
            </span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-brand-black/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-black">
              Pedido ID
            </span>
            <span className="text-sm font-black text-brand-orange tracking-widest">#MO-2026-X</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Button className="w-full h-16 bg-brand-black hover:bg-brand-black/90 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-brand-black/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
          Meus Pedidos
        </Button>
        <Button
          variant="outline"
          onClick={() => setStep("WELCOME")}
          className="w-full h-16 border-2 border-brand-black/10 text-brand-black font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all hover:bg-brand-black/5 hover:scale-[1.02] active:scale-[0.98]"
        >
          Voltar para Início
        </Button>
      </div>

      <div className="pt-12 border-t border-brand-black/5 space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-brand-red text-white rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-xl shadow-brand-red/20 animate-bounce">
            88
          </div>
          <div className="text-center space-y-1">
            <h4 className="font-black uppercase tracking-tighter text-xl">Acesso Premium</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Benefícios liberados para seu perfil
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {[
            "MeetOff Private Experience",
            "Executive Networking Brasil",
            "Relationship Experience",
          ].map((benefit) => (
            <div
              key={benefit}
              className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-brand-black/5"
            >
              <Users size={16} className="text-brand-red" />
              <span className="text-[11px] font-black uppercase tracking-tight">{benefit}</span>
            </div>
          ))}
        </div>

        <Button className="w-full h-14 bg-brand-orange hover:bg-brand-orange/90 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-brand-orange/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
          Visualizar Eventos Exclusivos
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-6 sm:px-12 relative overflow-hidden font-sans">
      {step !== "WELCOME" && step !== "CONFIRMATION" && (
        <div className="w-full max-w-lg mb-12 animate-in fade-in duration-1000">
          <Progress value={progressValue} className="h-2 bg-brand-black/5" />
          <div className="flex justify-between mt-3">
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
              Etapa de Solicitação
            </span>
            <span className="text-[9px] font-black text-brand-red uppercase tracking-widest">
              {Math.round(progressValue)}%
            </span>
          </div>
        </div>
      )}

      <div className="w-full flex-1 flex flex-col items-center pt-8 pb-12">
        {step === "WELCOME" && renderWelcome()}
        {step === "TERMS" && renderTerms()}
        {step === "CATEGORY" && renderCategory()}
        {step === "ACCESSORY_TYPE" && renderAccessoryType()}
        {step === "MODEL_SELECTION" && renderModelSelection()}
        {step === "DELIVERY_METHOD" && renderDeliveryMethod()}
        {step === "ADDRESS_FORM" && renderAddressForm()}
        {step === "PARTNER_SELECTION" && renderPartnerSelection()}
        {step === "CONFIRMATION" && renderConfirmation()}
      </div>

      <div className="mt-12 w-full max-w-lg flex flex-col items-center justify-between gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-t border-brand-black/5 pt-8">
        <span>© MeetOff {currentYear}</span>

        <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
          <Link href="/privacy" className="hover:text-brand-black transition-colors">
            Políticas e Termos
          </Link>
          <Link href="/consent" className="hover:text-brand-black transition-colors">
            Consentimento
          </Link>
          <Link href="/security" className="hover:text-brand-black transition-colors">
            Segurança
          </Link>
          <Link href="/cookies" className="hover:text-brand-black transition-colors">
            Cookies
          </Link>
        </div>
      </div>
    </div>
  );
}
