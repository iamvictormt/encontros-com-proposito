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
import { toast } from "sonner";
import { isPaymentTestMode, resolvePaymentAmount } from "@/lib/payments";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";
import { Loader2 } from "lucide-react";

const premiumAccessoryPrice = (price: string) => (isPaymentTestMode() ? "R$ 1,00" : price);

type Step =
  | "WELCOME"
  | "TERMS"
  | "CATEGORY"
  | "ACCESSORY_TYPE"
  | "MODEL_SELECTION"
  | "DELIVERY_METHOD"
  | "ADDRESS_FORM"
  | "PARTNER_SELECTION"
  | "PAYMENT"
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
      images: ["/images/lenço-01.png", "/images/lenço-dobrado-01.png"],
      description:
        "Design geométrico sofisticado. Ideal para eventos sociais e encontros. Elegância que conecta pessoas.",
      category: "Relacionamentos",
    },
    {
      id: "lenco-luxury",
      name: "Lenço Luxury Edition",
      price: "R$ 199,00",
      images: ["/images/lenço-02.png", "/images/lenço-dobrado-02.png"],
      description: "Design artístico premium. Exclusivo e elegante.",
      category: "Elite",
    },
  ],
  GRAVATAS: [
    {
      id: "gravata-executive",
      name: "Gravata Executive",
      price: "R$ 249,00",
      images: ["/images/gravata-01.png", "/images/gravata-borboleta-01.png"],
      description: "Estilo corporativo premium. Perfeita para networking.",
      category: "Networking",
    },
    {
      id: "gravata-heritage",
      name: "Gravata Heritage",
      price: "R$ 249,00",
      images: ["/images/gravata-02.png", "/images/gravata-borboleta-02.png"],
      description: "Design sofisticado social para eventos privados e experiências premium.",
      category: "Social",
    },
  ],
};

// Removing static PARTNERS as it will be fetched from the database
const PARTNERS_PLACEHOLDER = [];

const ProductCard = ({
  product,
  onSelect,
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
              idx === currentIdx ? "opacity-100 scale-100" : "opacity-0 scale-105",
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
                idx === currentIdx ? "bg-white w-4" : "bg-white/40",
              )}
            />
          ))}
        </div>

        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/50 z-20">
          <span className="text-[11px] font-black tracking-tighter text-brand-black">
            {premiumAccessoryPrice(product.price)}
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
    email: "",
    birthDate: "",
    cep: "",
    estado: "",
    cidade: "",
    bairro: "",
    endereco: "",
    numero: "",
    complemento: "",
  });
  const [cepFetchedFields, setCepFetchedFields] = useState<string[]>([]);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderInfo, setOrderInfo] = useState<{
    id?: string;
    amount: number;
    userId?: string;
  } | null>(null);
  const [isBrickReady, setIsBrickReady] = useState(false);

  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

  React.useEffect(() => {
    if (publicKey) {
      initMercadoPago(publicKey, { locale: "pt-BR" });
    }
  }, [publicKey]);

  const [credentials, setCredentials] = useState<{
    login: string;
    password: string | null;
    isUpgrade?: boolean;
    orderId?: string;
  } | null>(null);

  const currentYear = new Date().getFullYear().toString();

  const [venues, setVenues] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success("Localização obtida com sucesso!");
        },
        (error) => {
          console.error("Error getting location", error);
          toast.error("Não foi possível obter sua localização.");
        },
      );
    }
  };

  React.useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch("/api/venues");
        if (response.ok) {
          const data = await response.json();
          // Filter only approved/active venues
          setVenues(data.filter((v: any) => v.status === "Aprovado" || v.status === "Ativo"));
        }
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    fetchVenues();
  }, []);

  const stepOrder: Step[] = [
    "WELCOME",
    "TERMS",
    "CATEGORY",
    "ACCESSORY_TYPE",
    "MODEL_SELECTION",
    "DELIVERY_METHOD",
    "ADDRESS_FORM",
    "PAYMENT",
    "CONFIRMATION",
  ];

  const getStepIndex = (s: Step) => {
    if (s === "PARTNER_SELECTION") return stepOrder.indexOf("ADDRESS_FORM");
    return stepOrder.indexOf(s);
  };

  const progressValue = Math.max(
    0,
    ((getStepIndex(step) - 1) / (stepOrder.indexOf("PAYMENT") - 1)) * 100,
  );

  const nextStep = (next: Step) => setStep(next);

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let cep = e.target.value.replace(/\D/g, "");
    if (cep.length > 8) cep = cep.slice(0, 8);

    // Add mask 00000-000
    let maskedCep = cep;
    if (cep.length > 5) {
      maskedCep = `${cep.slice(0, 5)}-${cep.slice(5)}`;
    }

    setFormData((prev) => ({ ...prev, cep: maskedCep }));

    if (cep.length === 8) {
      setIsFetchingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            estado: data.uf || "",
            cidade: data.localidade || "",
            bairro: data.bairro || "",
            endereco: data.logradouro || "",
          }));
          const fetched = [];
          if (data.uf) fetched.push("estado");
          if (data.localidade) fetched.push("cidade");
          if (data.bairro) fetched.push("bairro");
          if (data.logradouro) fetched.push("endereco");
          setCepFetchedFields(fetched);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP", error);
      } finally {
        setIsFetchingCep(false);
      }
    } else {
      setCepFetchedFields([]);
    }
  };

  const handlePurchase = async () => {
    if (!formData.nome.trim()) {
      toast.error("Informe seu nome completo.");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Informe seu e-mail de login.");
      return;
    }

    if (!formData.birthDate) {
      toast.error("Informe sua data de nascimento.");
      return;
    }

    setIsPurchasing(true);
    try {
      const response = await fetch("/api/premium/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          accessoryType,
          model: selectedProduct?.name,
          deliveryMethod,
          category,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        // The account is NOT created yet, we just store the generated password and upgrade status
        setCredentials({
          login: data.login,
          password: data.password,
          isUpgrade: data.isUpgrade,
        });

        const originalPrice = selectedProduct?.price
          ? parseFloat(selectedProduct.price.replace(/[^\d,]/g, "").replace(",", "."))
          : 0;
        const price = resolvePaymentAmount(originalPrice);

        // We don't have an orderId or userId yet
        setOrderInfo({ amount: price });

        nextStep("PAYMENT");
      } else {
        const data = await response.json();
        toast.error(data.message || "Erro ao registrar");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const handlePaymentSubmit = async (paymentData: any) => {
    if (!orderInfo) return;

    setIsProcessingPayment(true);
    try {
      const response = await fetch("/api/premium/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Registration Data
          ...formData,
          accessoryType,
          model: selectedProduct?.name,
          deliveryMethod,
          category,
          password: credentials?.password,

          // Payment Data
          cardTokenId: paymentData.token,
          paymentMethodId: paymentData.payment_method_id,
          issuerId: paymentData.issuer_id,
          installments: paymentData.installments,
          payer: paymentData.payer,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === "APPROVED") {
        // Store the orderId returned by the checkout endpoint for the confirmation screen
        setCredentials((prev) => (prev ? { ...prev, orderId: data.orderId } : null));

        toast.success("Pagamento aprovado! Bem-vindo ao MeetOff Premium!");
        nextStep("CONFIRMATION");
        return;
      }

      // Payment not approved — stay on payment step and show the error
      toast.error(
        data.message || "Pagamento recusado. Verifique os dados do cartão e tente novamente.",
      );
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

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
    if (name === "email") formattedValue = value.trim().toLowerCase();

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
          <span>EXPERIÊNCIA PREMIUM</span>
          <span className="text-[8px] font-bold opacity-60">Cadastro premium simplificado</span>
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
          { label: "Termos de Uso", href: "/privacy" },
          { label: "Política de Privacidade", href: "/privacy" },
          { label: "Política LGPD Brasil", href: "/privacy#conformidade" },
          { label: "Política de Identificação Premium MeetOff", href: "/privacy" },
        ].map((term) => (
          <Link
            key={term.label}
            href={term.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-5 rounded-2xl bg-white border border-brand-black/5 hover:border-brand-red/20 transition-all cursor-pointer group"
          >
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-600">
              {term.label}
            </span>
            <ExternalLink size={14} className="text-gray-300 group-hover:text-brand-red" />
          </Link>
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
            requestLocation();
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

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
            E-mail (será utilizado para login na plataforma)
          </label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="seu@email.com"
            className="h-14 rounded-2xl bg-white border-brand-black/5 text-[11px] font-bold uppercase tracking-widest px-6"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
            Data de nascimento
          </label>
          <Input
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleInputChange}
            className="h-14 rounded-2xl bg-white border-brand-black/5 text-[11px] font-bold uppercase tracking-widest px-6"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
            CEP
          </label>
          <div className="relative">
            <Input
              name="cep"
              value={formData.cep}
              onChange={handleCepChange}
              maxLength={9}
              placeholder="00000-000"
              className="h-14 rounded-2xl bg-white border-brand-black/5 text-[11px] font-bold uppercase tracking-widest px-6"
            />
            {isFetchingCep && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
              </div>
            )}
          </div>
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
              disabled={cepFetchedFields.includes("estado")}
              placeholder="UF"
              className="h-14 rounded-2xl bg-white border-brand-black/5 text-[11px] font-bold uppercase tracking-widest px-6 disabled:opacity-60"
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
              disabled={cepFetchedFields.includes("cidade")}
              placeholder="EX: SÃO PAULO"
              className="h-14 rounded-2xl bg-white border-brand-black/5 text-[11px] font-bold uppercase tracking-widest px-6 disabled:opacity-60"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Bairro
            </label>
            <Input
              name="bairro"
              value={formData.bairro}
              onChange={handleInputChange}
              disabled={cepFetchedFields.includes("bairro")}
              placeholder="BAIRRO"
              className="h-14 rounded-2xl bg-white border-brand-black/5 text-[11px] font-bold uppercase tracking-widest px-6 disabled:opacity-60"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Endereço / Rua
            </label>
            <Input
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
              disabled={cepFetchedFields.includes("endereco")}
              placeholder="LOGRADOURO"
              className="h-14 rounded-2xl bg-white border-brand-black/5 text-[11px] font-bold uppercase tracking-widest px-6 disabled:opacity-60"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Número
            </label>
            <Input
              name="numero"
              value={formData.numero}
              onChange={handleInputChange}
              placeholder="Nº"
              className="h-14 rounded-2xl bg-white border-brand-black/5 text-[11px] font-bold uppercase tracking-widest px-6"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Complemento
            </label>
            <Input
              name="complemento"
              value={formData.complemento}
              onChange={handleInputChange}
              placeholder="APTO, SALA (OPCIONAL)"
              className="h-14 rounded-2xl bg-white border-brand-black/5 text-[11px] font-bold uppercase tracking-widest px-6"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handlePurchase}
        disabled={isPurchasing}
        className="w-full h-16 bg-brand-red hover:bg-brand-red/90 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-brand-red/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        {isPurchasing ? "Processando..." : "Finalizar Solicitação"}
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

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
            Seu Nome Completo
          </label>
          <Input
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            placeholder="COMO CONSTA NO DOCUMENTO"
            className="h-14 rounded-2xl bg-white border-brand-black/5 text-[11px] font-bold uppercase tracking-widest px-6"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
            E-mail (será utilizado para login na plataforma)
          </label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="seu@email.com"
            className="h-14 rounded-2xl bg-white border-brand-black/5 text-[11px] font-bold uppercase tracking-widest px-6"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
            Data de nascimento
          </label>
          <Input
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleInputChange}
            className="w-full h-14 rounded-2xl bg-white border-brand-green/10 focus:border-brand-orange transition-all font-medium px-4 sm:px-6"
          />
        </div>

        <div className="space-y-3">
          {venues.length === 0 ? (
            <div className="p-8 text-center glass rounded-3xl border-white/20">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Buscando locais disponíveis...
              </p>
            </div>
          ) : (
            [...venues]
              .map((venue) => {
                let distanceValue = Infinity;
                if (userLocation && venue.latitude && venue.longitude) {
                  distanceValue = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    parseFloat(venue.latitude),
                    parseFloat(venue.longitude),
                  );
                }
                return { ...venue, distanceValue };
              })
              .sort((a, b) => a.distanceValue - b.distanceValue)
              .map((partner) => (
                <div
                  key={partner.id}
                  onClick={() => {
                    handlePurchase();
                  }}
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
                        {partner.location || partner.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-black text-brand-green uppercase">
                      {partner.distanceValue !== Infinity
                        ? `${partner.distanceValue.toFixed(1)} km`
                        : "Disponível"}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-black uppercase tracking-tighter">Pagamento Seguro</h3>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
          Sua experiência premium está a um passo. <br />O pagamento é processado via Mercado Pago
          em ambiente seguro.
        </p>
      </div>

      <div className="bg-white rounded-[2rem] p-6 border border-brand-black/5 shadow-xl shadow-brand-black/5 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-brand-black/5">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black text-brand-red uppercase tracking-widest">
              Resumo
            </span>
            <h4 className="font-black uppercase tracking-tighter text-sm">
              {selectedProduct?.name}
            </h4>
          </div>
          <div className="text-right">
            <span className="text-xl font-black tracking-tighter text-brand-black">
              {selectedProduct?.price}
            </span>
          </div>
        </div>

        <div className="relative mercado-pago-card-brick py-2">
          {(!isBrickReady || isProcessingPayment) && (
            <div className="absolute inset-0 z-20 flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl bg-white/95 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-red">
                {isProcessingPayment ? "Processando Pagamento..." : "Carregando Checkout..."}
              </p>
            </div>
          )}

          {publicKey && (
            <CardPayment
              initialization={{
                amount: orderInfo?.amount || 0,
                payer: { email: formData.email },
              }}
              customization={{
                paymentMethods: {
                  maxInstallments: 1,
                  types: { included: ["credit_card"] },
                },
                visual: {
                  hideFormTitle: true,
                  style: {
                    theme: "default",
                    customVariables: {
                      baseColor: "#FF1D55",
                      borderRadiusMedium: "20px",
                    },
                  },
                },
              }}
              onReady={() => setIsBrickReady(true)}
              onError={(error) => {
                console.error("MP Error:", error);
                toast.error("Erro ao carregar o checkout.");
              }}
              onSubmit={handlePaymentSubmit}
            />
          )}
        </div>
      </div>

      <p className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-widest">
        Pagamento 100% criptografado e seguro
      </p>
    </div>
  );

  const renderConfirmation = () => (
    <div className="w-full max-w-lg space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-brand-red/10 text-brand-red rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-green/10">
          <Check size={48} strokeWidth={4} />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
          Experiência <br />
          <span className="text-brand-orange">Confirmada!</span>
        </h2>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
          Seu acesso VIP foi liberado com sucesso
        </p>
      </div>

      {credentials && (
        <div className="relative bg-gradient-to-br from-brand-black to-gray-900 text-white p-8 rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-brand-orange/20 blur-3xl rounded-full" />
          <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-brand-red/20 blur-3xl rounded-full" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <div className="w-12 h-12 bg-brand-red text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-brand-red/20">
                <Star size={28} strokeWidth={4} />
              </div>
              <div>
                <h5 className="font-black uppercase tracking-tighter text-lg text-brand-orange leading-none">
                  {credentials.isUpgrade ? "Conta Atualizada" : "Acesso Premium"}
                </h5>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">
                  {credentials.isUpgrade ? "Perfil promovido com sucesso" : "Você já está logado"}
                </p>
              </div>
            </div>

            <div className="space-y-3 font-mono">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <span className="text-[9px] text-brand-orange uppercase block mb-1">
                  E-mail (Login)
                </span>
                <span className="font-bold tracking-widest text-sm">{credentials.login}</span>
              </div>

              {!credentials.isUpgrade && credentials.password && (
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm relative overflow-hidden group">
                  <span className="text-[9px] text-brand-orange uppercase block mb-1">
                    Senha Gerada
                  </span>
                  <span className="font-bold tracking-widest text-xl">{credentials.password}</span>
                  <p className="text-[8px] text-brand-red uppercase mt-2 opacity-80">
                    Enviamos um email com os dados de acesso. Confira sua caixa de spam.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2rem] p-6 border border-brand-black/5 shadow-lg shadow-brand-black/5 space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-brand-black/5 pb-3">
          Detalhes do Pedido
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Produto
            </span>
            <span className="text-[10px] font-black uppercase tracking-tight truncate max-w-[150px]">
              {selectedProduct?.name}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Entrega
            </span>
            <span className="text-[10px] font-black uppercase tracking-tight">
              {deliveryMethod === "RESIDENTIAL" ? "Domicílio" : "Retirada"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Pedido ID
            </span>
            <span className="text-[10px] font-black text-brand-orange tracking-widest">
              #
              {credentials?.orderId
                ? credentials.orderId.substring(0, 8).toUpperCase()
                : "MO-2026-X"}
            </span>
          </div>
        </div>
      </div>

      <Button
        onClick={() => {
          window.location.href = "/events";
        }}
        className="w-full h-16 bg-brand-orange hover:bg-brand-orange/90 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-brand-orange/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        Acessar Plataforma Agora
      </Button>
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
        {step === "PAYMENT" && renderPayment()}
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
          <Link href="/faq" className="hover:text-brand-black transition-colors">
            FAQ
          </Link>
          <Link href="/cookies" className="hover:text-brand-black transition-colors">
            Cookies
          </Link>
        </div>
      </div>
    </div>
  );
}
