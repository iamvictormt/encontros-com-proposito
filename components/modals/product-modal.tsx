"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any;
  isReadOnly?: boolean;
}

const CATEGORIES = [
  "Camisetas",
  "Cartões personalizados",
  'Kits "Mimo Meu e Seu"',
  "Lenços",
  "Cartões",
  "Download Imediato",
  "Outros"
];

const THEMES = [
  "Amor & Relacionamentos",
  "Espiritualidade",
  "Desenvolvimento Pessoal",
  "Profissional / Carreira",
  "Terapias",
  "Outros"
];

export function ProductModal({ isOpen, onClose, onSuccess, product, isReadOnly }: ProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [displayPrice, setDisplayPrice] = useState("");
  const [formData, setFormData] = useState({
    name: product?.name || "",
    stock: product?.stock || 0,
    type: product?.type || "Físico",
    category: product?.category || "",
    theme: product?.theme || "",
    price: product?.price || 0,
    images: product?.images ? JSON.parse(product.images) : [product?.image || ""],
    status: product?.status || "Ativo",
    description: product?.description || "",
    size: product?.size || "",
    manufacturing_details: product?.manufacturing_details || "",
    materials: product?.materials || "",
    presentation_link: product?.presentation_link || "",
    tags: product?.tags || "",
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const handleCreateCategory = async (name: string) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        const newCat = await res.json();
        setCategories(prev => [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name)));
        setFormData({ ...formData, category: newCat.name });
        setOpenCategory(false);
        toast.success(`Categoria "${name}" criada!`);
      }
    } catch (error) {
      toast.error("Erro ao criar categoria");
    }
  };
  useEffect(() => {
    if (product?.price) {
      setDisplayPrice(formatBRL(product.price));
    } else {
      setDisplayPrice("");
    }
  }, [product]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Preparation for API
    const finalImages = formData.images.filter(img => img !== "");
    const body = {
      ...formData,
      image: finalImages[0] || "", // Keep image field for compatibility
      images: JSON.stringify(finalImages)
    };

    try {
      const res = await fetch("/api/products", {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product ? { id: product.id, ...body } : body),
      });

      if (!res.ok) throw new Error("Failed to save product");

      toast.success(product ? "Produto atualizado!" : "Produto criado!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar produto");
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
              {isReadOnly ? "Visualização" : product ? "Edição" : "Criação"}
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-brand-black lg:text-3xl">
            {isReadOnly ? "Detalhes do" : product ? "Editar" : "Novo"}{" "}
            <span className="text-brand-red">Produto</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-10">
          {/* Section: Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-1 w-6 bg-brand-green rounded-full" />
                <Label className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
                  Fotos do Produto (Até 4)
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Column 1: Main Info */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                <div className="h-1 w-6 bg-brand-green rounded-full" />
                <h3 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">Informações Básicas</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Nome do Produto</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="Ex: Kit Mimo Meu e Seu"
                  className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-black placeholder:text-brand-black/20"
                  required 
                  disabled={isReadOnly}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Entrega (Tipo)</Label>
                  <Select 
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger id="type" className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-black">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/10">
                      <SelectItem value="Físico" className="text-[10px] font-black uppercase tracking-widest py-3">Entrega Física</SelectItem>
                      <SelectItem value="Digital" className="text-[10px] font-black uppercase tracking-widest py-3">Download Imediato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="category" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Categoria</Label>
                  <Popover open={openCategory} onOpenChange={setOpenCategory}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCategory}
                        className="w-full justify-between h-14 bg-white/50 border-brand-green/10 rounded-2xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-black uppercase tracking-widest text-[10px] text-brand-black text-left"
                        disabled={isReadOnly}
                      >
                        {formData.category || "Selecione..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 glass border-brand-green/10" align="start">
                      <Command className="bg-transparent">
                        <CommandInput 
                          placeholder="Procurar categoria..." 
                          value={categorySearch}
                          onValueChange={setCategorySearch}
                          className="text-[10px] font-black uppercase tracking-widest"
                        />
                        <CommandList className="premium-scrollbar">
                          <CommandEmpty className="p-2">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start text-brand-green hover:bg-brand-green/5 text-[10px] font-black uppercase tracking-widest"
                              onClick={() => handleCreateCategory(categorySearch)}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Criar "{categorySearch}"
                            </Button>
                          </CommandEmpty>
                          <CommandGroup>
                            {categories.map((cat) => (
                              <CommandItem
                                key={cat.id}
                                value={cat.name}
                                onSelect={(currentValue) => {
                                  setFormData({ ...formData, category: currentValue });
                                  setOpenCategory(false);
                                }}
                                className="text-sm font-medium py-3"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.category === cat.name ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {cat.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="theme" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Tema</Label>
                  <Select 
                    value={formData.theme}
                    onValueChange={(value) => setFormData({ ...formData, theme: value })}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger id="theme" className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-black">
                      <SelectValue placeholder="Selecione o tema" />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/10">
                      {THEMES.map(theme => (
                        <SelectItem key={theme} value={theme} className="text-sm font-medium py-3">{theme}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="stock" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Estoque</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    value={formData.stock} 
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} 
                    className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-black"
                    disabled={isReadOnly}
                  />
                </div>
              </div>

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
            </div>

            {/* Column 2: Details & More */}
            <div className="space-y-10">
              <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                <div className="h-1 w-6 bg-brand-orange rounded-full" />
                <h3 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">Detalhes & Especificações</h3>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="description" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Descrição do Produto</Label>
                <textarea 
                  id="description" 
                  className="w-full min-h-[160px] p-6 bg-white/50 border border-brand-green/10 rounded-[2rem] focus:ring-brand-orange/20 focus:border-brand-orange outline-none resize-none transition-all font-medium text-brand-black text-sm placeholder:text-brand-black/20"
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="Conte mais sobre o que torna este produto especial..."
                  disabled={isReadOnly}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="size" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Tamanho / Dimensões</Label>
                  <Input 
                    id="size" 
                    value={formData.size} 
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })} 
                    placeholder="Ex: 20x30cm ou P, M, G"
                    className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-black placeholder:text-brand-black/20"
                    disabled={isReadOnly}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="materials" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Materiais</Label>
                  <Input 
                    id="materials" 
                    value={formData.materials} 
                    onChange={(e) => setFormData({ ...formData, materials: e.target.value })} 
                    placeholder="Ex: Algodão, Madeira"
                    className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-black placeholder:text-brand-black/20"
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="manufacturing_details" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Detalhes da Fabricação</Label>
                <Input 
                  id="manufacturing_details" 
                  value={formData.manufacturing_details} 
                  onChange={(e) => setFormData({ ...formData, manufacturing_details: e.target.value })} 
                  placeholder="Ex: Feito à mão, sob encomenda"
                  className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-black placeholder:text-brand-black/20"
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="presentation_link" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Link de Apresentação (Vídeo)</Label>
                <Input 
                  id="presentation_link" 
                  value={formData.presentation_link} 
                  onChange={(e) => setFormData({ ...formData, presentation_link: e.target.value })} 
                  placeholder="Link do YouTube ou Vimeo"
                  className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-black placeholder:text-brand-black/20"
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="tags" className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest ml-1">Tags (separadas por vírgula)</Label>
                <Input 
                  id="tags" 
                  value={formData.tags} 
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })} 
                  placeholder="Ex: presente, amor, exclusivo"
                  className="h-12 bg-white/50 border-brand-green/10 rounded-xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-sm text-brand-black placeholder:text-brand-black/20"
                  disabled={isReadOnly}
                />
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
                  ) : (product ? "Salvar Alterações" : "Criar Produto")}
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
