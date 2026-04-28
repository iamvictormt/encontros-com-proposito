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
import { ShieldCheck, Target, CalendarDays, Megaphone, Share2, X, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ImageUpload } from "./image-upload";

interface Partner {
  name: string;
  type: string;
  location: string;
  products: string;
  image: string;
}

export function PartnersPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    responsible_name: "",
    contact_phone: "",
    businessType: "",
    category: "",
    cep: "",
    location: "",
    address: "",
    image: "",
    selectedProduct: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleCepLookup = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            location: `${data.localidade}/${data.uf}`,
            address: data.logradouro || ""
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
    
    // Apply mask 00000-000
    let maskedValue = value;
    if (value.length > 5) {
      maskedValue = `${value.slice(0, 5)}-${value.slice(5)}`;
    } else if (value.length > 0) {
      maskedValue = value;
    }

    setFormData({ ...formData, cep: maskedValue });
    if (value.length === 8) {
      handleCepLookup(value);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    // Apply mask (00) 00000-0000
    let maskedValue = value;
    if (value.length > 7) {
      maskedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      maskedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      maskedValue = `(${value}`;
    }
    setFormData({ ...formData, contact_phone: maskedValue });
  };

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch("/api/venues");
        const data = await res.json();
        const approved = data
          .filter((v: any) => v.status === "Aprovado" || v.status === "Ativo")
          .slice(0, 3);
          
        if (approved.length > 0) {
          setPartners(approved.map((v: any) => ({
            name: v.name,
            type: v.type,
            location: v.location,
            products: v.description || "Produtos e Serviços",
            image: v.image
          })));
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };
    fetchPartners();
  }, []);

  const totalPages = Math.max(1, Math.ceil(partners.length / itemsPerPage));
  const paginatedPartners = partners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddTag = (value: string) => {
    if (value && !tags.includes(value)) {
      setTags([...tags, value]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.businessType || !formData.responsible_name || !formData.contact_phone) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          responsible_name: formData.responsible_name,
          contact_phone: formData.contact_phone,
          location: formData.location,
          address: formData.address,
          category: formData.category,
          type: `${formData.businessType}${formData.category ? ` - ${formData.category}` : ""}`,
          description: tags.join(", "),
          image: formData.image,
          status: "Pendente"
        })
      });

      if (res.ok) {
        toast.success("Cadastro enviado com sucesso! Aguarde a aprovação e o envio da sua placa oficial.");
        setFormData({
          name: "",
          responsible_name: "",
          contact_phone: "",
          businessType: "",
          category: "",
          cep: "",
          location: "",
          address: "",
          image: "",
          selectedProduct: "",
        });
        setTags([]);
      } else {
        toast.error("Erro ao enviar cadastro. Tente novamente.");
      }
    } catch (error) {
      toast.error("Erro de conexão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="px-4 py-8 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">Empresas e Parcerias</h1>
            <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
              Cadastre sua empresa e conecte-se a eventos, pontos de encontro e vendas!
            </p>
          </div>
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-16 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Empresa
                </label>
                <Input 
                  placeholder="Informe o nome da sua empresa" 
                  className="bg-white" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Responsável
                  </label>
                  <Input 
                    placeholder="Nome completo do responsável" 
                    className="bg-white" 
                    value={formData.responsible_name}
                    onChange={(e) => setFormData({ ...formData, responsible_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contato (WhatsApp)
                  </label>
                  <Input 
                    placeholder="(00) 00000-0000" 
                    className="bg-white" 
                    value={formData.contact_phone}
                    onChange={handlePhoneChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Negócio
                  </label>
                  <Select 
                    onValueChange={(v) => setFormData({ ...formData, businessType: v })}
                    value={formData.businessType}
                  >
                    <SelectTrigger className="bg-white w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Serviços">Serviços</SelectItem>
                      <SelectItem value="Produtos">Produtos</SelectItem>
                      <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <Select
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                    value={formData.category}
                  >
                    <SelectTrigger className="bg-white w-full">
                      <SelectValue placeholder="Ex: Ponto de encontro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ponto de encontro">Ponto de encontro</SelectItem>
                      <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                      <SelectItem value="Parceiro Estratégico">Parceiro Estratégico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                  <Input
                    placeholder="00000-000"
                    className="bg-white"
                    value={formData.cep}
                    onChange={onCepChange}
                    maxLength={9}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localização (Cidade/UF)</label>
                  <Input
                    placeholder="Cidade/UF"
                    className="bg-gray-50 font-medium text-black"
                    value={formData.location}
                    readOnly
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                <Input
                  placeholder="Logradouro, Número, Bairro"
                  className="bg-gray-50 font-medium text-black"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto da Empresa / Fachada
                </label>
                <ImageUpload 
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  onRemove={() => setFormData({ ...formData, image: "" })}
                />
                <p className="text-xs text-gray-400 mt-2 italic">
                  * Uma boa foto ajuda na aprovação e atrai mais clientes.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produtos/Serviços
                </label>
                <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-md min-h-[42px] focus-within:ring-2 focus-within:ring-[#E58043]/20 transition-all">
                  {tags.map((tag: string, index: number) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="bg-[#8B2F2A] hover:bg-[#8B2F2A]/90 text-white rounded-md px-3 py-1 font-normal flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-gray-200 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  <input
                    className="flex-1 bg-transparent outline-none text-sm min-w-[150px] text-gray-700"
                    placeholder={tags.length === 0 ? "Ex: Terapia, Viagens, Alimentação..." : ""}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        const newTag = tagInput.trim().replace(",", "");
                        if (newTag && !tags.includes(newTag)) {
                          setTags([...tags, newTag]);
                          setTagInput("");
                        }
                      } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
                        const newTags = [...tags];
                        newTags.pop();
                        setTags(newTags);
                      }
                    }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Pressione Espaço, vírgula (,) ou Enter para adicionar</p>
              </div>
            </div>

            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#E58043] hover:bg-[#E58043]/90 text-white py-6 text-base rounded-md font-semibold"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Enviar Cadastro para Aprovação"
              )}
            </Button>
          </form>
          {/* Separator */}
          <div className="w-24 h-px bg-gray-200 mx-auto mb-12"></div>
          {/* Featured Partners */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-black mb-8 text-center">Parceiros em destaque</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {paginatedPartners.map((partner, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={partner.image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop"}
                      alt={partner.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-black text-lg mb-3">{partner.name}</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-500">
                        <span className="text-gray-400">Tipo:</span>{" "}
                        <span className="font-semibold text-secondary">{partner.type}</span>
                      </p>
                      <p className="text-gray-500">
                        <span className="text-gray-400">Local:</span>{" "}
                        <span className="font-semibold text-secondary underline underline-offset-2">
                          {partner.location}
                        </span>
                      </p>
                      <p className="text-gray-500">
                        <span className="text-gray-400">Produtos:</span>{" "}
                        <span className="font-semibold text-secondary">{partner.products}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button className="text-primary text-sm tracking-wide hover:underline underline-offset-4 cursor-pointer">
                Ver Mais
              </button>
            </div>
          </div>
          {/* Separator */}
          <div className="w-24 h-px bg-gray-200 mx-auto mb-12"></div>
          {/* Benefits */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-center text-black mb-10">
              Benefícios para Parceiros
            </h2>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 mb-10">
                <div>
                  <ShieldCheck className="w-6 h-6 text-gray-800 mb-3" />
                  <h3 className="text-md text-black mb-2">Selo Oficial</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Ganhe o selo de aprovação, aumentando a confiança e credibilidade do seu
                    negócio.
                  </p>
                </div>
                <div>
                  <Target className="w-6 h-6 text-gray-800 mb-3" />
                  <h3 className="text-md text-black mb-2">Público Qualificado</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Conecte-se diretamente com pessoas interessadas nos seus serviços e produtos.
                  </p>
                </div>
                <div>
                  <CalendarDays className="w-6 h-6 text-gray-800 mb-3" />
                  <h3 className="text-md text-black mb-2">Participação em Eventos</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Presença garantida nos eventos e ações exclusivas da plataforma.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 lg:w-2/3 lg:mx-auto">
                <div>
                  <Megaphone className="w-6 h-6 text-gray-800 mb-3" />
                  <h3 className="text-md text-black mb-2">Divulgação Premium</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Destaque em banners e áreas de maior visibilidade no sistema.
                  </p>
                </div>
                <div>
                  <Share2 className="w-6 h-6 text-gray-800 mb-3" />
                  <h3 className="text-md text-black mb-2">Rede de Parcerias</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Faça networking com outros parceiros estratégicos para gerar mais oportunidades.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
