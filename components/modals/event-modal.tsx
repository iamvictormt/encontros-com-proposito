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
      <DialogContent className="sm:max-w-[1000px] w-[95vw] max-h-[90vh] overflow-y-auto glass border-brand-green/5 rounded-[2rem] p-0 gap-0 shadow-2xl">
        <DialogHeader className="p-6 lg:p-8 border-b border-brand-green/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-6 bg-brand-orange rounded-full" />
            <span className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.3em]">
              {isReadOnly ? "Visualização" : event ? "Edição" : "Criação"}
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-brand-black lg:text-3xl">
            {isReadOnly ? "Detalhes do" : event ? "Editar" : "Novo"}{" "}
            <span className="text-brand-red">Evento</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-10">
          {/* Fotos Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-1 w-6 bg-brand-green rounded-full" />
                <Label className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
                  Fotos do Evento (Até 4)
                </Label>
              </div>
              <span className="text-[10px] font-black text-brand-black/20 uppercase tracking-widest italic">
                A primeira será a principal
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="space-y-3">
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
                  />
                  <p className="text-[10px] font-black text-center text-brand-black/40 uppercase tracking-widest">
                    Foto {index + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Vídeo Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-1 w-6 bg-brand-red rounded-full" />
              <Label className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em] flex items-center gap-2">
                <Video className="w-4 h-4" />
                Vídeo de Apresentação (Até 90s)
              </Label>
            </div>
            <VideoUpload
              value={formData.video_url}
              onChange={(url) => setFormData({ ...formData, video_url: url })}
              onRemove={() => setFormData({ ...formData, video_url: "" })}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-10">
            {/* Título e Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3 space-y-2">
                <Label htmlFor="title" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">
                  Título do Evento
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Ritual do Amor Interior"
                  className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all text-sm font-medium text-brand-black placeholder:text-brand-black/20"
                  required
                  autoFocus
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                  disabled={isReadOnly}
                >
                  <SelectTrigger
                    id="status"
                    className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-black"
                  >
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="glass border-brand-green/10">
                    <SelectItem value="Ativo" className="text-sm font-medium py-3">Ativo</SelectItem>
                    <SelectItem value="Offline" className="text-sm font-medium py-3">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left Column: Logística e Investimento */}
              <div className="space-y-10">
                <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                  <div className="h-1 w-6 bg-brand-green rounded-full" />
                  <h3 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <Settings2 className="w-4 h-4" />
                    Logística & Investimento
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="date" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-black"
                      required
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="time" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Horário</Label>
                    <Input
                      id="time"
                      placeholder="00:00"
                      value={formData.time}
                      onChange={onTimeChange}
                      className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-black"
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="price" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Preço de Venda</Label>
                    <Input
                      id="price"
                      value={displayPrice}
                      onChange={handlePriceChange}
                      placeholder="R$ 0,00"
                      className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-red"
                      required
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="capacity" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Vagas Totais</Label>
                    <Input
                      id="capacity"
                      type="text"
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
                      className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-black"
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Tags</Label>
                  <div className="flex flex-wrap gap-2 p-4 bg-white/30 backdrop-blur-sm border border-brand-green/10 rounded-2xl min-h-[56px] focus-within:ring-2 focus-within:ring-brand-orange/20 transition-all">
                    {formData.tags.map((tag: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="bg-brand-green text-white font-black uppercase tracking-[0.2em] text-[8px] py-2 px-3 rounded-lg shadow-sm flex items-center gap-2"
                      >
                        {tag}
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => {
                              const newTags = formData.tags.filter((_, i) => i !== index);
                              setFormData({ ...formData, tags: newTags });
                            }}
                            className="hover:text-brand-orange transition-colors"
                          >
                            <Plus className="w-3 h-3 rotate-45" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {!isReadOnly && (
                      <input
                        className="flex-1 bg-transparent outline-none text-[10px] font-black uppercase tracking-widest text-brand-black min-w-[120px] placeholder:text-brand-black/20"
                        placeholder={formData.tags.length === 0 ? "Ex: Casais, Noite..." : "Adicionar..."}
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
                  <p className="text-[9px] font-black text-brand-black/30 uppercase tracking-widest ml-1 italic">Pressione Espaço, vírgula (,) ou Enter para adicionar tags</p>
                </div>
              </div>

              {/* Right Column: Localização e Público */}
              <div className="space-y-10">
                <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                  <div className="h-1 w-6 bg-brand-orange rounded-full" />
                  <h3 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Público & Localização
                  </h3>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="type_event" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Formato do Evento</Label>
                  <Select
                    value={formData.type_event || "Presencial"}
                    onValueChange={(value) => setFormData({ ...formData, type_event: value })}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger id="type_event" className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-black uppercase tracking-widest text-[10px] text-brand-black">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/10">
                      <SelectItem value="Presencial" className="text-[10px] font-black uppercase tracking-widest py-3">📍 Presencial</SelectItem>
                      <SelectItem value="Online" className="text-[10px] font-black uppercase tracking-widest py-3">💻 Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="target_audience" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Aberto para</Label>
                    <Select
                      value={formData.target_audience}
                      onValueChange={(value) => setFormData({ ...formData, target_audience: value })}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger id="target_audience" className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-black uppercase tracking-widest text-[10px] text-brand-black">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="glass border-brand-green/10">
                        {[
                          "Todos os públicos", "Apenas casais", "Solteiros", 
                          "Apenas homens", "Apenas mulheres", "LGBTQIA+", 
                          "Famílias", "Melhor Idade", "Jovens"
                        ].map(val => (
                          <SelectItem key={val} value={val} className="text-[10px] font-black uppercase tracking-widest py-3">{val}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="age_range" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Faixa Etária</Label>
                    <Select
                      value={formData.age_range}
                      onValueChange={(value) => setFormData({ ...formData, age_range: value })}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger id="age_range" className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-black uppercase tracking-widest text-[10px] text-brand-black">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="glass border-brand-green/10">
                        {[
                          "Todas as idades", "18-25 anos", "26-35 anos", 
                          "36-45 anos", "46-55 anos", "55+ anos"
                        ].map(val => (
                          <SelectItem key={val} value={val} className="text-[10px] font-black uppercase tracking-widest py-3">{val}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="cep" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">CEP</Label>
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      value={formData.cep}
                      onChange={onCepChange}
                      className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-black uppercase tracking-widest text-[10px] text-brand-black"
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Cidade/UF</Label>
                    <Input
                      id="location"
                      placeholder="Ex: São Paulo/SP"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-black uppercase tracking-widest text-[10px] text-brand-black"
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="address" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Endereço Completo</Label>
                  <Input
                    id="address"
                    placeholder="Rua, Número, Bairro..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-black uppercase tracking-widest text-[10px] text-brand-black"
                    disabled={isReadOnly}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="conductor" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Organizador (a)</Label>
                  <Input
                    id="conductor"
                    placeholder="Quem organiza o evento?"
                    value={formData.conductor}
                    onChange={(e) => setFormData({ ...formData, conductor: e.target.value })}
                    className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-black uppercase tracking-widest text-[10px] text-brand-black"
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              {/* Description spans full width */}
              <div className="md:col-span-2 space-y-3">
                <Label htmlFor="description" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Descrição Detalhada</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[180px] p-6 bg-white/50 border border-brand-green/10 rounded-[2rem] focus:ring-brand-orange/20 focus:border-brand-orange outline-none resize-none transition-all font-medium text-brand-black text-sm placeholder:text-brand-black/20"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Conte mais sobre o evento, cronograma, o que levar..."
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Unified Attachments Section */}
          <div className="space-y-12">
            {/* Products Attachment */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                <div className="h-1 w-6 bg-brand-red rounded-full" />
                <h3 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Produtos Opcionais
                </h3>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green" />
                  <Input
                    type="text"
                    placeholder="Pesquisar produto pelo nome..."
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="pl-12 h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all text-[10px] font-black uppercase tracking-widest text-brand-black"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto p-1 pr-4 premium-scrollbar">
                  {sortedAndFilteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-4 p-4 glass rounded-2xl border border-brand-green/5 transition-all hover:bg-brand-green/5 group shadow-sm"
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
                        className="border-brand-green/20 data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                        disabled={isReadOnly}
                      />
                      <label
                        htmlFor={`col-prod-${product.id}`}
                        className="text-[10px] font-black uppercase tracking-widest cursor-pointer flex-1 text-brand-black/70 group-hover:text-brand-black transition-colors"
                      >
                        {product.name}
                      </label>
                      <span className="text-[10px] font-black text-brand-green uppercase tracking-widest">
                        {formatBRL(product.price)}
                      </span>
                    </div>
                  ))}
                  {sortedAndFilteredProducts.length === 0 && (
                    <p className="md:col-span-2 text-[10px] font-black text-brand-black/20 uppercase tracking-[0.2em] text-center py-12 italic">
                      {productSearchQuery ? "Nenhum produto encontrado." : "Nenhum produto cadastrado."}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Brands Attachment */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-brand-green/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-6 bg-brand-orange rounded-full" />
                  <h3 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <Settings2 className="w-4 h-4" />
                    Marcas Associadas
                  </h3>
                </div>
                {!isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-[10px] font-black uppercase tracking-widest text-brand-green hover:bg-brand-green/10 rounded-lg gap-2"
                    onClick={() => setIsBrandModalOpen(true)}
                  >
                    <Plus className="w-3.5 h-3.5" /> Nova Marca
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Selected Brands Badges */}
                {formData.associated_brands.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {formData.associated_brands.map((brandId: string) => {
                      const brand = availableBrands.find((b) => b.id === brandId);
                      return (
                        <Badge
                          key={brandId}
                          variant="secondary"
                          className="bg-white/50 backdrop-blur-sm border border-brand-green/10 text-brand-black font-black uppercase tracking-widest text-[9px] py-2 px-4 rounded-xl shadow-sm flex items-center gap-3"
                        >
                          {brand?.name || "Marca Desconhecida"}
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
                              <Plus className="w-3.5 h-3.5 rotate-45" />
                            </button>
                          )}
                        </Badge>
                      );
                    })}
                  </div>
                )}

                {/* Dropdown to select brands */}
                {!isReadOnly && availableBrands.filter(b => !formData.associated_brands.includes(b.id)).length > 0 && (
                  <Select
                    value=""
                    onValueChange={(val) => {
                      if (val) {
                        setFormData((prev) => ({
                          ...prev,
                          associated_brands: [...prev.associated_brands, val],
                        }));
                      }
                    }}
                  >
                    <SelectTrigger className="w-full md:w-[400px] h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-black uppercase tracking-widest text-[10px] text-brand-black">
                      <SelectValue placeholder="Adicionar marca parceira..." />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/10">
                      {availableBrands
                        .filter(b => !formData.associated_brands.includes(b.id))
                        .map(brand => (
                          <SelectItem key={brand.id} value={brand.id} className="text-[10px] font-black uppercase tracking-widest py-3">
                            {brand.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
                
                {availableBrands.length === 0 && (
                  <p className="text-[10px] font-black text-brand-black/20 uppercase tracking-[0.2em] italic">
                    Nenhuma marca parceira cadastrada.
                  </p>
                )}
              </div>
            </div>

            {/* Groups Attachment */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                <div className="h-1 w-6 bg-brand-green rounded-full" />
                <h3 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em] flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Grupos de Participação
                </h3>
              </div>

              <div className="space-y-6">
                {!isReadOnly && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-14 gap-3 text-[10px] font-black uppercase tracking-widest border-brand-green/10 border-dashed bg-white/50 hover:bg-brand-green/5 rounded-2xl text-brand-green transition-all"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        groups: [
                          ...formData.groups,
                          { name: `Grupo ${formData.groups.length + 1}`, capacity: 10, category: "Todos", age_range: "Livre", link: "", image: "" },
                        ],
                      });
                    }}
                  >
                    <Plus className="w-4 h-4" /> Adicionar Novo Grupo de Participação
                  </Button>
                )}
                
                <div className="grid grid-cols-1 gap-8 max-h-[600px] overflow-y-auto pr-4 premium-scrollbar">
                  {formData.groups.map((group: any, index: number) => (
                    <div
                      key={index}
                      className="glass rounded-[2rem] border border-brand-green/10 p-8 space-y-8 premium-card shadow-xl"
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-8">
                        {/* Left Side: Image Upload */}
                        <div className="w-40 space-y-3 shrink-0 mx-auto sm:mx-0">
                          <Label className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1 text-center block">Capa do Grupo</Label>
                          <ImageUpload
                            value={group.image || ""}
                            aspect="square"
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

                        {/* Right Side: Fields */}
                        <div className="flex-1 space-y-6 w-full">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <div className="flex-1 space-y-3">
                              <Label className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Nome do Grupo</Label>
                              <Input
                                placeholder="Ex: Caravana Mulheres 40+"
                                value={group.name}
                                onChange={(e) => {
                                  const newGroups = [...formData.groups];
                                  newGroups[index].name = e.target.value;
                                  setFormData({ ...formData, groups: newGroups });
                                }}
                                className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-black uppercase tracking-widest text-[10px] text-brand-black"
                                disabled={isReadOnly}
                              />
                            </div>
                            <div className="flex items-end gap-3">
                              <div className="flex-1 sm:w-32 space-y-3">
                                <Label className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1 text-center block">Vagas</Label>
                                <Input
                                  type="text"
                                  placeholder="10"
                                  value={group.capacity}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    const num = parseInt(val);
                                    const newGroups = [...formData.groups];
                                    if (!val) {
                                      newGroups[index].capacity = '';
                                      setFormData({ ...formData, groups: newGroups });
                                    } else if (num >= 0 && num <= 10000) {
                                      newGroups[index].capacity = num;
                                      setFormData({ ...formData, groups: newGroups });
                                    }
                                  }}
                                  className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-black uppercase tracking-widest text-[10px] text-brand-black text-center"
                                  disabled={isReadOnly}
                                />
                              </div>
                              {!isReadOnly && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-12 w-12 text-brand-red hover:bg-brand-red/10 rounded-xl transition-colors"
                                  onClick={() => {
                                    const newGroups = formData.groups.filter(
                                      (_: any, i: number) => i !== index
                                    );
                                    setFormData({ ...formData, groups: newGroups });
                                  }}
                                >
                                  <Trash2 className="w-5 h-5" />
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <Label className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Categoria</Label>
                              <Select
                                value={group.category || "Todos"}
                                onValueChange={(val) => {
                                  const newGroups = [...formData.groups];
                                  newGroups[index].category = val;
                                  setFormData({ ...formData, groups: newGroups });
                                }}
                                disabled={isReadOnly}
                              >
                                <SelectTrigger className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-black uppercase tracking-widest text-[10px] text-brand-black">
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent className="glass border-brand-green/10">
                                  {[
                                    "Todos", "Só mulheres", "Só homens", 
                                    "Mulheres e homens", "Crianças", 
                                    "Gêneros diversos", "Comunidade Gays"
                                  ].map(val => (
                                    <SelectItem key={val} value={val} className="text-[10px] font-black uppercase tracking-widest py-3">{val}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-3">
                              <Label className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Faixa Etária</Label>
                              <Select
                                value={group.age_range || "Livre"}
                                onValueChange={(val) => {
                                  const newGroups = [...formData.groups];
                                  newGroups[index].age_range = val;
                                  setFormData({ ...formData, groups: newGroups });
                                }}
                                disabled={isReadOnly}
                              >
                                <SelectTrigger className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-black uppercase tracking-widest text-[10px] text-brand-black">
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent className="glass border-brand-green/10">
                                  {["Livre", "18+", "30+", "40+", "50+", "60+"].map(val => (
                                    <SelectItem key={val} value={val} className="text-[10px] font-black uppercase tracking-widest py-3">{val}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Link do Grupo (WhatsApp)</Label>
                            <Input
                              placeholder="https://chat.whatsapp.com/..."
                              value={group.link || ""}
                              onChange={(e) => {
                                const newGroups = [...formData.groups];
                                newGroups[index].link = e.target.value;
                                setFormData({ ...formData, groups: newGroups });
                              }}
                              className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-brand-black text-xs"
                              disabled={isReadOnly}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {formData.groups.length === 0 && (
                    <p className="text-[10px] font-black text-brand-black/20 uppercase tracking-[0.2em] text-center py-20 italic glass rounded-[2rem] border border-brand-green/5">
                      Nenhum grupo de participação configurado para este evento.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-8 border-t border-brand-green/5 bg-brand-green/5 flex flex-col sm:flex-row gap-3">
            {isReadOnly ? (
              <Button
                type="button"
                className="h-12 bg-brand-black hover:bg-brand-black/80 text-white font-bold text-xs px-10 rounded-xl shadow-xl shadow-brand-black/20 transition-all flex-1 sm:flex-none ml-auto"
                onClick={onClose}
              >
                Fechar Detalhes
              </Button>
            ) : (
              <>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  disabled={isLoading}
                  className="h-12 border-brand-green/10 bg-white/50 text-brand-black/60 hover:bg-brand-green/5 font-bold text-xs px-8 rounded-xl flex-1 sm:flex-none"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="h-12 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs px-10 rounded-xl shadow-xl shadow-brand-green/20 transition-all flex-1 sm:flex-none ml-auto"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Salvando...</span>
                    </div>
                  ) : event ? "Salvar Alterações" : "Criar Evento"}
                </Button>
              </>
            )}
          </div>
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
