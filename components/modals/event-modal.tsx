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
import { Plus, Trash2, Users, ChevronDown, ShoppingBag, Settings2, Video } from "lucide-react";
import { VideoUpload } from "@/components/video-upload";
import { useEffect } from "react";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event?: any;
  isReadOnly?: boolean;
}

export function EventModal({ isOpen, onClose, onSuccess, event, isReadOnly }: EventModalProps) {
  const [isLoading, setIsLoading] = useState(false);
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
    target_audience: event?.target_audience || "Todos os públicos",
    conductor: event?.conductor || "",
    has_certificate: event ? event.has_certificate : true,
    video_url: event?.video_url || "",
    age_range: event?.age_range || "Todas as idades",
  });
  const [tagInput, setTagInput] = useState("");

  const [availableProducts, setAvailableProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setAvailableProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

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
      <DialogContent className="sm:max-w-[1200px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isReadOnly ? "Detalhes do Evento" : event ? "Editar Evento" : "Novo Evento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <Label className="text-base font-bold">Fotos do Evento (Até 4)</Label>
              <span className="text-xs text-muted-foreground italic">
                A primeira será a principal
              </span>
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
                  />
                  <p className="text-[10px] text-center text-muted-foreground">Foto {index + 1}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                <Label className="text-base font-bold">Vídeo de Apresentação (Até 90s)</Label>
              </div>
            </div>
            <VideoUpload
              value={formData.video_url}
              onChange={(url) => setFormData({ ...formData, video_url: url })}
              onRemove={() => setFormData({ ...formData, video_url: "" })}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-6">
            {/* Top Row: Title and Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3 space-y-2">
                <Label htmlFor="title">Título do Evento</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Ritual do Amor Interior"
                  className="text-lg font-medium"
                  required
                  autoFocus
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                  disabled={isReadOnly}
                >
                  <SelectTrigger
                    id="status"
                    className="bg-white border border-input focus:ring-2 focus:ring-primary/20"
                  >
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {/* Left Column: Logística e Investimento */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary/70 pb-2 border-b flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  Logística & Investimento
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Horário</Label>
                    <Input
                      id="time"
                      placeholder="00:00"
                      value={formData.time}
                      onChange={onTimeChange}
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="text-lg font-bold text-secondary"
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Vagas Totais</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-md min-h-[42px] focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    {formData.tags.map((tag: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="flex items-center gap-1 py-1 px-2 text-xs font-medium"
                      >
                        {tag}
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => {
                              const newTags = formData.tags.filter((_, i) => i !== index);
                              setFormData({ ...formData, tags: newTags });
                            }}
                            className="hover:text-red-500 transition-colors"
                          >
                            <Plus className="w-3 h-3 rotate-45" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {!isReadOnly && (
                      <input
                        className="flex-1 bg-transparent outline-none text-sm min-w-[120px]"
                        placeholder={formData.tags.length === 0 ? "Ex: Casais, Noite..." : ""}
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
                  <p className="text-[10px] text-muted-foreground">Pressione Espaço, vírgula (,) ou Enter para adicionar tags</p>
                </div>
              </div>

              {/* Right Column: Localização e Público */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary/70 pb-2 border-b flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Público & Localização
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target_audience">Aberto para</Label>
                    <Select
                      value={formData.target_audience}
                      onValueChange={(value) => setFormData({ ...formData, target_audience: value })}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger id="target_audience">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todos os públicos">Todos os públicos</SelectItem>
                        <SelectItem value="Apenas casais">Apenas casais</SelectItem>
                        <SelectItem value="Solteiros">Solteiros</SelectItem>
                        <SelectItem value="Apenas homens">Apenas homens</SelectItem>
                        <SelectItem value="Apenas mulheres">Apenas mulheres</SelectItem>
                        <SelectItem value="LGBTQIA+">LGBTQIA+</SelectItem>
                        <SelectItem value="Famílias">Famílias</SelectItem>
                        <SelectItem value="Melhor Idade">Melhor Idade</SelectItem>
                        <SelectItem value="Jovens">Jovens</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age_range">Faixa Etária</Label>
                    <Select
                      value={formData.age_range}
                      onValueChange={(value) => setFormData({ ...formData, age_range: value })}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger id="age_range">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todas as idades">Todas as idades</SelectItem>
                        <SelectItem value="18-25 anos">18-25 anos</SelectItem>
                        <SelectItem value="26-35 anos">26-35 anos</SelectItem>
                        <SelectItem value="36-45 anos">36-45 anos</SelectItem>
                        <SelectItem value="46-55 anos">46-55 anos</SelectItem>
                        <SelectItem value="55+ anos">55+ anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      value={formData.cep}
                      onChange={onCepChange}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Cidade/UF</Label>
                    <Input
                      id="location"
                      placeholder="Ex: São Paulo/SP"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Input
                    id="address"
                    placeholder="Rua, Número, Bairro..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conductor">Condutor(a)</Label>
                  <Input
                    id="conductor"
                    placeholder="Quem conduzirá o evento?"
                    value={formData.conductor}
                    onChange={(e) => setFormData({ ...formData, conductor: e.target.value })}
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              {/* Description spans full width */}
              <div className="md:col-span-2 space-y-2 pt-4">
                <Label htmlFor="description">Descrição Detalhada</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[150px] px-3 py-2 bg-white border rounded-md text-sm border-input focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Conte mais sobre o evento, cronograma, o que levar..."
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Unified Attachments Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {/* Products Attachment using Collapsible */}
            <div className="space-y-3">
              <Collapsible className="border rounded-lg bg-gray-50/50 overflow-hidden">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold">Produtos Obrigatórios</span>
                      <Badge variant="outline" className="text-[10px] h-5">
                        {formData.mandatory_products.length} Itens
                      </Badge>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-3 pt-0 space-y-3 animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
                    {availableProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-2 p-2 hover:bg-white rounded-md transition-colors border-b border-gray-100/50 last:border-0"
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
                          disabled={isReadOnly}
                        />
                        <label
                          htmlFor={`col-prod-${product.id}`}
                          className="text-xs font-medium cursor-pointer flex-1"
                        >
                          {product.name}
                        </label>
                        <span className="text-[10px] text-muted-foreground font-bold">
                          R$ {product.price}
                        </span>
                      </div>
                    ))}
                    {availableProducts.length === 0 && (
                      <p className="text-[10px] text-muted-foreground text-center py-4 italic">
                        Nenhum produto cadastrado.
                      </p>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Groups Attachment using Collapsible */}
            <div className="space-y-3">
              <Collapsible className="border rounded-lg bg-gray-50/50 overflow-hidden">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold">Grupos de Participação</span>
                      <Badge variant="outline" className="text-[10px] h-5">
                        {formData.groups.length} Grupos
                      </Badge>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-3 pt-0 space-y-3 animate-in slide-in-from-top-2 duration-200">
                  {!isReadOnly && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full h-8 gap-1 text-xs mb-2 border-dashed bg-white"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          groups: [
                            ...formData.groups,
                            { name: `Grupo ${formData.groups.length + 1}`, capacity: 10 },
                          ],
                        });
                      }}
                    >
                      <Plus className="w-3 h-3" /> Adicionar Grupo
                    </Button>
                  )}
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {formData.groups.map((group: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-white rounded-md border shadow-sm group"
                      >
                        <Input
                          placeholder="Nome"
                          value={group.name}
                          onChange={(e) => {
                            const newGroups = [...formData.groups];
                            newGroups[index].name = e.target.value;
                            setFormData({ ...formData, groups: newGroups });
                          }}
                          className="h-7 text-xs flex-1"
                          disabled={isReadOnly}
                        />
                        <Input
                          type="number"
                          placeholder="Vagas"
                          value={group.capacity}
                          onChange={(e) => {
                            const newGroups = [...formData.groups];
                            newGroups[index].capacity = parseInt(e.target.value);
                            setFormData({ ...formData, groups: newGroups });
                          }}
                          className="h-7 text-xs w-16 text-center"
                          disabled={isReadOnly}
                        />
                        {!isReadOnly && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-white hover:bg-red-500 rounded-md"
                            onClick={() => {
                              const newGroups = formData.groups.filter(
                                (_: any, i: number) => i !== index,
                              );
                              setFormData({ ...formData, groups: newGroups });
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {formData.groups.length === 0 && (
                      <p className="text-[10px] text-muted-foreground text-center py-2 italic">
                        Nenhum grupo configurado.
                      </p>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-6">
            {isReadOnly ? (
              <Button
                type="button"
                className="bg-secondary hover:bg-secondary/90 text-white min-w-[120px]"
                onClick={onClose}
              >
                Fechar
              </Button>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-secondary hover:bg-secondary/90 text-white min-w-[120px]"
                  disabled={isLoading}
                >
                  {isLoading ? "Salvando..." : event ? "Salvar Alterações" : "Criar Evento"}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
