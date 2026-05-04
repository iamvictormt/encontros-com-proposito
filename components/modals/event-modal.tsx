"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import { toast } from "sonner";
import { formatBRL } from "@/lib/utils/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Users, ChevronDown, ShoppingBag, Settings2, Video, Search } from "lucide-react";
import { VideoUpload } from "@/components/video-upload";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { BrandModal } from "@/components/modals/brand-modal";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event?: any;
  isReadOnly?: boolean;
}

export function EventModal({ isOpen, onClose, onSuccess, event, isReadOnly }: EventModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [displayPrice, setDisplayPrice] = useState("");
  const [formData, setFormData] = useState({
    title: event?.title || "",
    image: event?.image || "",
    images: event?.images ? JSON.parse(event.images) : [event?.image || ""],
    status: event?.status || "Ativo",
    tags: Array.isArray(event?.tags) ? event.tags : [],
    date: event?.date ? new Date(event.date).toISOString().split("T")[0] : "",
    time: event?.time || "",
    cep: event?.cep || "",
    location: event?.location || "",
    address: event?.address || "",
    price: event?.price || 0,
    capacity: event?.capacity || 0,
    description: event?.description || "",
    mandatory_products: event?.mandatory_products
      ? typeof event.mandatory_products === "string"
        ? JSON.parse(event.mandatory_products)
        : event.mandatory_products
      : [],
    groups: event?.groups
      ? typeof event.groups === "string"
        ? JSON.parse(event.groups)
        : event.groups
      : [],
    associated_brands: event?.associated_brands
      ? typeof event.associated_brands === "string"
        ? JSON.parse(event.associated_brands)
        : event.associated_brands
      : [],
    target_audience: event?.target_audience || "Todos os públicos",
    conductor: event?.conductor || "",
    has_certificate: event ? event.has_certificate : true,
    video_url: event?.video_url || "",
    age_range: event?.age_range || "Todas as idades",
    type_event: event?.type_event || "Presencial",
  });
  const [tagInput, setTagInput] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [brandSearchQuery, setBrandSearchQuery] = useState("");

  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [availableBrands, setAvailableBrands] = useState<any[]>([]);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  const fetchProductsAndBrands = async () => {
    try {
      const [resProducts, resBrands] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/brands")
      ]);
      const dataProducts = await resProducts.json();
      const dataBrands = await resBrands.json();
      
      setAvailableProducts(Array.isArray(dataProducts) ? dataProducts : []);
      setAvailableBrands(Array.isArray(dataBrands) ? dataBrands : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchProductsAndBrands();
  }, []);

  const sortedAndFilteredProducts = [...availableProducts]
    .filter((product) =>
      product.name.toLowerCase().includes(productSearchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const sortedAndFilteredBrands = [...availableBrands]
    .filter((brand) =>
      brand.name.toLowerCase().includes(brandSearchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (event?.price) {
      setDisplayPrice(formatBRL(event.price));
    } else {
      setDisplayPrice("");
    }
  }, [event]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (!value) {
      setDisplayPrice("");
      setFormData({ ...formData, price: 0 });
      return;
    }

    const numericValue = parseFloat(value) / 100;
    setDisplayPrice(formatBRL(numericValue));
    setFormData({ ...formData, price: numericValue });
  };

  const handleCepLookup = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            location: `${data.localidade}/${data.uf}`,
          }));
        } else {
          toast.error("CEP não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const onCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);

    let maskedValue = value;
    if (value.length > 5) {
      maskedValue = `${value.slice(0, 5)}-${value.slice(5)}`;
    }

    setFormData({ ...formData, cep: maskedValue });
    if (value.length === 8) {
      handleCepLookup(value);
    }
  };

  const onTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);

    // Validate hours
    if (value.length >= 2) {
      let hours = parseInt(value.slice(0, 2));
      if (hours > 23) hours = 23;
      value = hours.toString().padStart(2, "0") + value.slice(2);
    }

    // Validate minutes
    if (value.length === 4) {
      let mins = parseInt(value.slice(2, 4));
      if (mins > 59) mins = 59;
      value = value.slice(0, 2) + mins.toString().padStart(2, "0");
    }

    let maskedValue = value;
    if (value.length > 2) {
      maskedValue = `${value.slice(0, 2)}:${value.slice(2)}`;
    }

    setFormData({ ...formData, time: maskedValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const finalImages = formData.images.filter((img: string) => img !== "");
      const payload = {
        ...formData,
        id: event?.id,
        image: finalImages[0] || "",
        images: JSON.stringify(finalImages),
        tags: formData.tags,
        price: parseFloat(formData.price.toString()),
        capacity: parseInt(formData.capacity.toString()),
        mandatory_products: JSON.stringify(formData.mandatory_products),
        groups: JSON.stringify(formData.groups),
        associated_brands: JSON.stringify(formData.associated_brands),
      };

      const res = await fetch("/api/events", {
        method: event ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save event");

      toast.success(event ? "Evento atualizado!" : "Evento criado!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar evento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] w-[95vw] max-h-[90vh] overflow-y-auto bg-white rounded-[2.5rem] border-none shadow-2xl p-6 sm:p-10 scrollbar-hide">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-brand-black">
            {isReadOnly ? "Visualizar Evento" : event ? "Editar Evento" : "Novo Evento"}
          </DialogTitle>
          <p className="text-gray-500 font-medium text-sm">
            Configure todos os detalhes da experiência MeetOff.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Photos and Video Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-6 w-1 bg-brand-orange rounded-full" />
                <Label className="text-[10px] font-black uppercase tracking-widest text-brand-black">Fotos do Evento (Até 4)</Label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="space-y-2">
                    <ImageUpload
                      value={formData.images[index] || ""}
                      onChange={(url) => {
                        const newImages = [...formData.images];
                        newImages[index] = url;
                        setFormData({ ...formData, images: newImages });
                      }}
                      onRemove={() => {
                        const newImages = [...formData.images];
                        newImages[index] = "";
                        setFormData({ ...formData, images: newImages });
                      }}
                      disabled={isReadOnly}
                      aspect="square"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-6 w-1 bg-brand-red rounded-full" />
                <Label className="text-[10px] font-black uppercase tracking-widest text-brand-black">Vídeo Teaser</Label>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md">
                <VideoUpload
                  value={formData.video_url}
                  onChange={(url) => setFormData({ ...formData, video_url: url })}
                  onRemove={() => setFormData({ ...formData, video_url: "" })}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Top Row: Title and Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-3 space-y-3">
                <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Título da Experiência</Label>
                <Input
                  id="title"
                  className="h-14 rounded-2xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all text-lg font-black uppercase tracking-tight"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: RITUAL DO AMOR INTERIOR"
                  required
                  autoFocus
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="status" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Visibilidade</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                  disabled={isReadOnly}
                >
                  <SelectTrigger id="status" className="h-14 rounded-2xl border-brand-black/5 bg-gray-50 focus:bg-white font-bold px-6">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-white/20 glass">
                    <SelectItem value="Ativo" className="text-brand-green font-bold">● Ativo</SelectItem>
                    <SelectItem value="Offline" className="text-brand-red font-bold">● Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column: Logística e Investimento */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 bg-brand-green rounded-full" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-black">Logística & Investimento</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold px-4"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="time" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Horário</Label>
                    <Input
                      id="time"
                      placeholder="00:00"
                      className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold px-4 text-center"
                      value={formData.time}
                      onChange={onTimeChange}
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Investimento</Label>
                    <Input
                      id="price"
                      className="h-14 rounded-2xl border-brand-black/5 bg-brand-black/5 focus:bg-white focus:ring-brand-orange/20 focus:border-brand-orange transition-all px-6 text-xl font-black text-brand-orange"
                      value={displayPrice}
                      onChange={handlePriceChange}
                      placeholder="R$ 0,00"
                      required
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="capacity" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Vagas Totais</Label>
                    <Input
                      id="capacity"
                      type="text"
                      className="h-14 rounded-2xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all px-6 font-black text-center text-xl"
                      value={formData.capacity}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        const num = parseInt(val);
                        if (!val) {
                          setFormData({ ...formData, capacity: '' });
                        } else if (num >= 0 && num <= 10000) {
                          setFormData({ ...formData, capacity: val });
                        }
                      }}
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Tags de Identificação</Label>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-brand-black/5 rounded-2xl min-h-[56px] focus-within:bg-white transition-all">
                    {formData.tags.map((tag: string, index: number) => (
                      <Badge 
                        key={index} 
                        className="bg-brand-black text-white py-1.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2"
                      >
                        {tag}
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => {
                              const newTags = formData.tags.filter((_: any, i: any) => i !== index);
                              setFormData({ ...formData, tags: newTags });
                            }}
                            className="hover:text-brand-orange transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 rotate-45" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {!isReadOnly && (
                      <input
                        className="flex-1 bg-transparent outline-none text-xs font-bold min-w-[120px] px-2"
                        placeholder={formData.tags.length === 0 ? "Ex: Casais, Noite, Zen..." : ""}
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            const newTag = tagInput.trim().replace(",", "");
                            if (newTag && !formData.tags.includes(newTag)) {
                              setFormData({ ...formData, tags: [...formData.tags, newTag] });
                              setTagInput("");
                            }
                          } else if (e.key === "Backspace" && !tagInput && formData.tags.length > 0) {
                            const newTags = [...formData.tags];
                            newTags.pop();
                            setFormData({ ...formData, tags: newTags });
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Localização e Público */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 bg-brand-red rounded-full" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-black">Público & Localização</h3>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="type_event" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Formato</Label>
                  <Select
                    value={formData.type_event || "Presencial"}
                    onValueChange={(value) => setFormData({ ...formData, type_event: value })}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger id="type_event" className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white font-bold px-6">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-white/20 glass">
                      <SelectItem value="Presencial" className="font-bold">📍 Presencial</SelectItem>
                      <SelectItem value="Online" className="font-bold">💻 Online / Meet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="target_audience" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Aberto para</Label>
                    <Select
                      value={formData.target_audience}
                      onValueChange={(value) => setFormData({ ...formData, target_audience: value })}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger id="target_audience" className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white font-bold px-4">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-white/20 glass">
                        <SelectItem value="Todos os públicos" className="font-bold">Todos os públicos</SelectItem>
                        <SelectItem value="Apenas casais" className="font-bold">Apenas casais</SelectItem>
                        <SelectItem value="Solteiros" className="font-bold">Solteiros</SelectItem>
                        <SelectItem value="Apenas homens" className="font-bold">Apenas homens</SelectItem>
                        <SelectItem value="Apenas mulheres" className="font-bold">Apenas mulheres</SelectItem>
                        <SelectItem value="LGBTQIA+" className="font-bold">LGBTQIA+</SelectItem>
                        <SelectItem value="Famílias" className="font-bold">Famílias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="age_range" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Faixa Etária</Label>
                    <Select
                      value={formData.age_range}
                      onValueChange={(value) => setFormData({ ...formData, age_range: value })}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger id="age_range" className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white font-bold px-4">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-white/20 glass">
                        <SelectItem value="Todas as idades" className="font-bold">Livre</SelectItem>
                        <SelectItem value="18-25 anos" className="font-bold">18-25 anos</SelectItem>
                        <SelectItem value="26-35 anos" className="font-bold">26-35 anos</SelectItem>
                        <SelectItem value="36-45 anos" className="font-bold">36-45 anos</SelectItem>
                        <SelectItem value="46-55 anos" className="font-bold">46-55 anos</SelectItem>
                        <SelectItem value="55+ anos" className="font-bold">55+ anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="cep" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">CEP</Label>
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
                      value={formData.cep}
                      onChange={onCepChange}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Cidade / UF</Label>
                    <Input
                      id="location"
                      placeholder="Ex: São Paulo/SP"
                      className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Endereço Completo</Label>
                  <Input
                    id="address"
                    placeholder="Rua, Número, Bairro..."
                    className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="conductor" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Organizador (a)</Label>
                  <Input
                    id="conductor"
                    placeholder="Quem organiza o evento?"
                    className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
                    value={formData.conductor}
                    onChange={(e) => setFormData({ ...formData, conductor: e.target.value })}
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              {/* Description spans full width */}
              <div className="md:col-span-2 space-y-3">
                <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">História & Propósito do Evento</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[180px] p-6 bg-gray-50 border-brand-black/5 rounded-3xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-orange/20 outline-none resize-none transition-all font-medium leading-relaxed"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva a experiência única que este evento proporciona..."
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Unified Attachments Section */}
          <div className="space-y-12">
            {/* Products Attachment */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 bg-brand-orange rounded-full" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-black">Kit de Produtos Opcionais</h3>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 sm:p-8">
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green" />
                  <Input
                    type="text"
                    placeholder="Pesquisar catálogo..."
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="h-12 pl-12 rounded-xl border-none bg-white shadow-sm font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {sortedAndFilteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className={cn(
                        "flex items-center space-x-4 p-4 rounded-2xl transition-all border border-transparent shadow-sm",
                        formData.mandatory_products.includes(product.id) ? "bg-brand-black text-white" : "bg-white text-brand-black hover:border-brand-green/20"
                      )}
                    >
                      <Checkbox
                        id={`col-prod-${product.id}`}
                        checked={formData.mandatory_products.includes(product.id)}
                        onCheckedChange={(checked) => {
                          const newProducts = checked
                            ? [...formData.mandatory_products, product.id]
                            : formData.mandatory_products.filter(
                                (id: string) => id !== product.id,
                              );
                          setFormData({ ...formData, mandatory_products: newProducts });
                        }}
                        className="w-5 h-5 rounded-lg border-brand-black/10 data-[state=checked]:bg-brand-orange data-[state=checked]:border-brand-orange"
                        disabled={isReadOnly}
                      />
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={`col-prod-${product.id}`}
                          className="text-xs font-black uppercase tracking-widest cursor-pointer truncate block"
                        >
                          {product.name}
                        </label>
                        <p className={cn("text-[9px] font-bold", formData.mandatory_products.includes(product.id) ? "text-brand-orange" : "text-brand-green")}>
                          {formatBRL(product.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Brands Attachment */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 bg-brand-red rounded-full" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-black">Marcas & Colaboradores</h3>
                </div>
                {!isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-10 text-[10px] font-black uppercase tracking-widest text-brand-green hover:bg-brand-green/5 rounded-xl"
                    onClick={() => setIsBrandModalOpen(true)}
                  >
                    <Plus className="w-3.5 h-3.5 mr-2" /> Nova Marca
                  </Button>
                )}
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 sm:p-8">
                <div className="flex flex-wrap gap-3 mb-6">
                  {formData.associated_brands.map((brandId: string) => {
                    const brand = availableBrands.find((b) => b.id === brandId);
                    return (
                      <Badge
                        key={brandId}
                        className="bg-white text-brand-black py-2.5 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-brand-black/5 gap-3"
                      >
                        {brand?.name || "Desconhecido"}
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                associated_brands: prev.associated_brands.filter(
                                  (id: string) => id !== brandId
                                ),
                              }));
                            }}
                            className="hover:text-brand-red transition-colors"
                          >
                            <Plus className="w-4 h-4 rotate-45" />
                          </button>
                        )}
                      </Badge>
                    );
                  })}
                  {formData.associated_brands.length === 0 && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Nenhuma marca associada.</p>
                  )}
                </div>

                {!isReadOnly && (
                  <Select
                    value=""
                    onValueChange={(val) => {
                      if (val && !formData.associated_brands.includes(val)) {
                        setFormData((prev) => ({
                          ...prev,
                          associated_brands: [...prev.associated_brands, val],
                        }));
                      }
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-80 h-12 rounded-xl bg-white border-none shadow-sm px-6 font-bold">
                      <SelectValue placeholder="Adicionar marca..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-white/20 glass">
                      {availableBrands
                        .filter(b => !formData.associated_brands.includes(b.id))
                        .map(brand => (
                          <SelectItem key={brand.id} value={brand.id} className="font-bold">
                            {brand.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* Groups Attachment */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 bg-brand-green rounded-full" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-black">Grupos de Participação</h3>
                </div>
                {!isReadOnly && (
                  <Button
                    type="button"
                    className="h-10 bg-brand-black hover:bg-brand-black/90 text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        groups: [
                          ...formData.groups,
                          { name: `GRUPO ${formData.groups.length + 1}`, capacity: 10, category: "Todos", age_range: "Livre", link: "", image: "" },
                        ],
                      });
                    }}
                  >
                    <Plus className="w-3.5 h-3.5 mr-2" /> Novo Grupo
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.groups.map((group: any, index: number) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-[2rem] p-6 sm:p-8 relative group"
                  >
                    <div className="flex flex-col sm:flex-row gap-8">
                      <div className="w-62 h-40 shrink-0 mx-auto sm:mx-0">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Capa do Grupo</Label>
                          <ImageUpload
                            value={group.image || ""}
                            onChange={(url) => {
                              const newGroups = [...formData.groups];
                              newGroups[index].image = url;
                              setFormData({ ...formData, groups: newGroups });
                            }}
                            onRemove={() => {
                              const newGroups = [...formData.groups];
                              newGroups[index].image = "";
                              setFormData({ ...formData, groups: newGroups });
                            }}
                            disabled={isReadOnly}
                          />
                      </div>

                      <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div className="sm:col-span-2 space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Identificação</Label>
                            <Input
                              className="h-12 rounded-xl bg-white border-none shadow-sm font-black uppercase tracking-tight"
                              value={group.name}
                              onChange={(e) => {
                                const newGroups = [...formData.groups];
                                newGroups[index].name = e.target.value.toUpperCase();
                                setFormData({ ...formData, groups: newGroups });
                              }}
                              disabled={isReadOnly}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Vagas</Label>
                            <Input
                              className="h-12 rounded-xl bg-white border-none shadow-sm font-black text-center text-lg"
                              value={group.capacity}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                const newGroups = [...formData.groups];
                                newGroups[index].capacity = val;
                                setFormData({ ...formData, groups: newGroups });
                              }}
                              disabled={isReadOnly}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Público</Label>
                            <Select
                              value={group.category || "Todos"}
                              onValueChange={(val) => {
                                const newGroups = [...formData.groups];
                                newGroups[index].category = val;
                                setFormData({ ...formData, groups: newGroups });
                              }}
                              disabled={isReadOnly}
                            >
                              <SelectTrigger className="h-12 rounded-xl bg-white border-none shadow-sm font-bold px-6">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-white/20 glass">
                                <SelectItem value="Todos" className="font-bold">Todos os públicos</SelectItem>
                                <SelectItem value="Só mulheres" className="font-bold">Só mulheres</SelectItem>
                                <SelectItem value="Só homens" className="font-bold">Só homens</SelectItem>
                                <SelectItem value="LGBTQIA+" className="font-bold">LGBTQIA+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Link Comunidade</Label>
                            <Input
                              placeholder="URL do WhatsApp"
                              className="h-12 rounded-xl bg-white border-none shadow-sm font-bold text-xs"
                              value={group.link || ""}
                              onChange={(e) => {
                                const newGroups = [...formData.groups];
                                newGroups[index].link = e.target.value;
                                setFormData({ ...formData, groups: newGroups });
                              }}
                              disabled={isReadOnly}
                            />
                          </div>
                        </div>
                      </div>

                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => {
                            const newGroups = formData.groups.filter((_: any, i: number) => i !== index);
                            setFormData({ ...formData, groups: newGroups });
                          }}
                          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white transition-all self-end sm:self-start"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {formData.groups.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nenhum grupo ativo.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-12 gap-4 border-t border-brand-black/5">
            {isReadOnly ? (
              <Button
                type="button"
                className="w-full h-16 rounded-[2rem] bg-brand-black hover:bg-brand-black/90 text-white font-black uppercase tracking-widest text-[12px] shadow-2xl"
                onClick={onClose}
              >
                Fechar Painel
              </Button>
            ) : (
              <>
                <Button type="button" variant="ghost" className="h-16 rounded-[2rem] font-black uppercase tracking-widest text-[12px] text-gray-400 hover:text-brand-black px-8" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-16 rounded-[2rem] bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[12px] shadow-2xl shadow-brand-green/20"
                  disabled={isLoading}
                >
                  {isLoading ? "Processando..." : event ? "Salvar Alterações" : "Publicar Experiência"}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>

      {isBrandModalOpen && (
        <BrandModal
          isOpen={isBrandModalOpen}
          onClose={() => setIsBrandModalOpen(false)}
          onSuccess={() => fetchProductsAndBrands()}
        />
      )}
    </Dialog>
  );
}
