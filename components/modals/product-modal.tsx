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
      <DialogContent className="sm:max-w-[1000px] w-[95vw] max-h-[90vh] overflow-y-auto bg-white rounded-[2.5rem] border-none shadow-2xl p-6 sm:p-10 scrollbar-hide">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-brand-black">
            {isReadOnly ? "Detalhes do Produto" : product ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <p className="text-gray-500 font-medium text-sm">
            Gerencie o catálogo de produtos e itens exclusivos MeetOff.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section: Images */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-6 w-1 bg-brand-orange rounded-full" />
              <Label className="text-[10px] font-black uppercase tracking-widest text-brand-black">Galeria de Fotos (Até 4)</Label>
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
                  <p className="text-[9px] font-black uppercase tracking-widest text-center text-brand-black/20">Foto {index + 1}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Column 1: Main Info */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 bg-brand-green rounded-full" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-black">Informações de Venda</h3>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nome do Produto</Label>
                    <Input 
                      id="name" 
                      className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      placeholder="Ex: Camiseta MeetOff Original"
                      required 
                      disabled={isReadOnly}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="type" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Modalidade</Label>
                    <Select 
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger id="type" className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white font-bold">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-white/20 glass">
                        <SelectItem value="Físico" className="font-bold">📦 Produto Físico</SelectItem>
                        <SelectItem value="Digital" className="font-bold">⚡ Digital / Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Categoria</Label>
                    <Popover open={openCategory} onOpenChange={setOpenCategory}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCategory}
                          className="w-full justify-between h-12 rounded-xl border-brand-black/5 bg-gray-50 hover:bg-gray-100 font-bold px-4"
                          disabled={isReadOnly}
                        >
                          <span className="truncate">{formData.category || "Selecionar..."}</span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-none shadow-2xl rounded-2xl overflow-hidden" align="start">
                        <Command className="rounded-2xl">
                          <CommandInput placeholder="Filtrar categorias..." className="h-12 border-none" />
                          <CommandList>
                            <CommandEmpty className="p-4">
                              <Button 
                                variant="outline" 
                                className="w-full h-10 border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-widest rounded-xl"
                                onClick={() => handleCreateCategory(categorySearch)}
                              >
                                <Plus className="mr-2 h-3 w-3" />
                                Criar "{categorySearch}"
                              </Button>
                            </CommandEmpty>
                            <CommandGroup className="p-2">
                              {categories.map((cat) => (
                                <CommandItem
                                  key={cat.id}
                                  value={cat.name}
                                  onSelect={(currentValue) => {
                                    setFormData({ ...formData, category: currentValue });
                                    setOpenCategory(false);
                                  }}
                                  className="rounded-lg px-4 py-3 text-xs font-bold mb-1"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4 text-brand-orange",
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
                    <Label htmlFor="theme" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Temática</Label>
                    <Select 
                      value={formData.theme}
                      onValueChange={(value) => setFormData({ ...formData, theme: value })}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger id="theme" className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white font-bold">
                        <SelectValue placeholder="Tema" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-white/20 glass">
                        {THEMES.map(theme => (
                          <SelectItem key={theme} value={theme} className="font-bold">{theme}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="stock" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Estoque Inicial</Label>
                    <Input 
                      id="stock" 
                      type="number" 
                      className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
                      value={formData.stock} 
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} 
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Valor do Produto</Label>
                  <Input 
                    id="price" 
                    value={displayPrice} 
                    onChange={handlePriceChange}
                    placeholder="R$ 0,00"
                    className="h-14 rounded-2xl border-brand-black/5 bg-brand-black/5 focus:bg-white focus:ring-brand-orange/20 focus:border-brand-orange transition-all px-6 text-xl font-black text-brand-orange"
                    required
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </div>

            {/* Column 2: Details & More */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 bg-brand-red rounded-full" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-black">Especificações Técnicas</h3>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Descrição Comercial</Label>
                  <textarea 
                    id="description" 
                    className="w-full min-h-[120px] p-4 bg-gray-50 border-brand-black/5 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-orange/20 outline-none resize-none transition-all font-medium"
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    placeholder="Conte a história por trás deste produto..."
                    disabled={isReadOnly}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="size" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Dimensões / Tamanho</Label>
                    <Input 
                      id="size" 
                      className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
                      value={formData.size} 
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })} 
                      placeholder="Ex: P, M, G ou 20x30cm"
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="materials" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Composição</Label>
                    <Input 
                      id="materials" 
                      className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
                      value={formData.materials} 
                      onChange={(e) => setFormData({ ...formData, materials: e.target.value })} 
                      placeholder="Ex: 100% Algodão"
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="presentation_link" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Vídeo de Apresentação</Label>
                  <Input 
                    id="presentation_link" 
                    className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
                    value={formData.presentation_link} 
                    onChange={(e) => setFormData({ ...formData, presentation_link: e.target.value })} 
                    placeholder="Link do YouTube ou Vimeo"
                    disabled={isReadOnly}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="tags" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Palavras-chave (Separadas por vírgula)</Label>
                  <Input 
                    id="tags" 
                    className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
                    value={formData.tags} 
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })} 
                    placeholder="Ex: presente, sustentável, exclusivo"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-12 gap-4 border-t border-brand-black/5">
            {isReadOnly ? (
              <Button type="button" className="w-full h-16 rounded-[2rem] bg-brand-black hover:bg-brand-black/90 text-white font-black uppercase tracking-widest text-[12px] shadow-2xl" onClick={onClose}>
                Fechar Painel
              </Button>
            ) : (
              <>
                <Button type="button" variant="ghost" className="h-16 rounded-[2rem] font-black uppercase tracking-widest text-[12px] text-gray-400 hover:text-brand-black px-8" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 h-16 rounded-[2rem] bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[12px] shadow-2xl shadow-brand-green/20" disabled={isLoading}>
                  {isLoading ? "Processando..." : (product ? "Salvar Alterações" : "Publicar Produto")}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
