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
      <DialogContent className="sm:max-w-[1200px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isReadOnly ? "Detalhes do Produto" : product ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 py-4">
          {/* Section: Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-bold">Fotos do Produto (Até 4)</Label>
              <span className="text-xs text-muted-foreground italic">A primeira será a principal</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Column 1: Main Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary/70">Informações Básicas</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto</Label>
                    <Input 
                      id="name" 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      placeholder="Ex: Kit Mimo Meu e Seu"
                      required 
                      disabled={isReadOnly}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Entrega (Tipo)</Label>
                    <Select 
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger id="type" className="bg-white border border-input focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Físico">Entrega Física</SelectItem>
                        <SelectItem value="Digital">Download Imediato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Popover open={openCategory} onOpenChange={setOpenCategory}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCategory}
                          className="w-full justify-between bg-white border-input h-11 sm:h-12 font-normal"
                          disabled={isReadOnly}
                        >
                          {formData.category || "Selecione a categoria"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                          <CommandInput 
                            placeholder="Procurar categoria..." 
                            value={categorySearch}
                            onValueChange={setCategorySearch}
                          />
                          <CommandList>
                            <CommandEmpty>
                              <Button 
                                variant="ghost" 
                                className="w-full justify-start text-primary"
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Tema</Label>
                    <Select 
                      value={formData.theme}
                      onValueChange={(value) => setFormData({ ...formData, theme: value })}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger id="theme" className="bg-white border border-input focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Selecione o tema" />
                      </SelectTrigger>
                      <SelectContent>
                        {THEMES.map(theme => (
                          <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Estoque</Label>
                    <Input 
                      id="stock" 
                      type="number" 
                      value={formData.stock} 
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} 
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Preço de Venda</Label>
                  <Input 
                    id="price" 
                    value={displayPrice} 
                    onChange={handlePriceChange}
                    placeholder="R$ 0,00"
                    className="text-lg font-bold text-primary"
                    required
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </div>

            {/* Column 2: Details & More */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary/70">Detalhes & Especificações</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição do Produto</Label>
                  <textarea 
                    id="description" 
                    className="w-full min-h-[120px] px-3 py-2 bg-white border rounded-md text-sm border-input focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    placeholder="Conte mais sobre o que torna este produto especial..."
                    disabled={isReadOnly}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">Tamanho / Dimensões</Label>
                    <Input 
                      id="size" 
                      value={formData.size} 
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })} 
                      placeholder="Ex: 20x30cm ou P, M, G"
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="materials">Materiais</Label>
                    <Input 
                      id="materials" 
                      value={formData.materials} 
                      onChange={(e) => setFormData({ ...formData, materials: e.target.value })} 
                      placeholder="Ex: Algodão, Madeira"
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manufacturing_details">Detalhes da Fabricação</Label>
                  <Input 
                    id="manufacturing_details" 
                    value={formData.manufacturing_details} 
                    onChange={(e) => setFormData({ ...formData, manufacturing_details: e.target.value })} 
                    placeholder="Ex: Feito à mão, sob encomenda"
                    disabled={isReadOnly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="presentation_link">Link de Apresentação (Vídeo)</Label>
                  <Input 
                    id="presentation_link" 
                    value={formData.presentation_link} 
                    onChange={(e) => setFormData({ ...formData, presentation_link: e.target.value })} 
                    placeholder="Link do YouTube ou Vimeo"
                    disabled={isReadOnly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                  <Input 
                    id="tags" 
                    value={formData.tags} 
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })} 
                    placeholder="Ex: presente, amor, exclusivo"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-6 border-t">
            {isReadOnly ? (
              <Button type="button" className="bg-secondary hover:bg-secondary/90 text-white min-w-[120px]" onClick={onClose}>
                Fechar
              </Button>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white min-w-[120px]" disabled={isLoading}>
                  {isLoading ? "Salvando..." : (product ? "Salvar Alterações" : "Criar Produto")}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
