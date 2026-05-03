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
import { cn } from "@/lib/utils";

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
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 px-4 py-16 lg:px-20">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-16 space-y-4">
             <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              B2B & Partnerships
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-brand-black uppercase tracking-tighter leading-none mt-4">
              Impulsione seu <span className="text-brand-orange">Negócio</span>
            </h1>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg">
              Cadastre sua empresa em nossa rede exclusiva e conecte-se a eventos premium, pontos de encontro e oportunidades de vendas.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 items-start">
            {/* Form Section */}
            <div className="lg:col-span-7">
              <div className="glass p-8 md:p-12 rounded-[3rem] border-white/40 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 blur-3xl -mr-16 -mt-16 rounded-full" />
                
                <form onSubmit={handleSubmit} className="space-y-8 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nome da Empresa</label>
                      <Input 
                        placeholder="Nome Fantasia" 
                        className="h-14 rounded-2xl bg-white/50 border-brand-green/10 focus:border-brand-orange transition-all font-medium px-6" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nome do Responsável</label>
                      <Input 
                        placeholder="Seu Nome" 
                        className="h-14 rounded-2xl bg-white/50 border-brand-green/10 focus:border-brand-orange transition-all font-medium px-6" 
                        value={formData.responsible_name}
                        onChange={(e) => setFormData({ ...formData, responsible_name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">WhatsApp Business</label>
                      <Input 
                        placeholder="(00) 00000-0000" 
                        className="h-14 rounded-2xl bg-white/50 border-brand-green/10 focus:border-brand-orange transition-all font-medium px-6" 
                        value={formData.contact_phone}
                        onChange={handlePhoneChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Tipo de Negócio</label>
                      <Select 
                        onValueChange={(v) => setFormData({ ...formData, businessType: v })}
                        value={formData.businessType}
                      >
                        <SelectTrigger className="h-14 rounded-2xl bg-white/50 border-brand-green/10 focus:ring-brand-orange px-6">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-brand-green/10">
                          <SelectItem value="Serviços">Serviços</SelectItem>
                          <SelectItem value="Produtos">Produtos</SelectItem>
                          <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Categoria Principal</label>
                      <Select
                        onValueChange={(v) => setFormData({ ...formData, category: v })}
                        value={formData.category}
                      >
                        <SelectTrigger className="h-14 rounded-2xl bg-white/50 border-brand-green/10 focus:ring-brand-orange px-6">
                          <SelectValue placeholder="Ex: Ponto de encontro" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-brand-green/10">
                          <SelectItem value="Ponto de encontro">Ponto de encontro</SelectItem>
                          <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                          <SelectItem value="Parceiro Estratégico">Parceiro Estratégico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">CEP</label>
                      <Input
                        placeholder="00000-000"
                        className="h-14 rounded-2xl bg-white/50 border-brand-green/10 focus:border-brand-orange transition-all font-medium px-6"
                        value={formData.cep}
                        onChange={onCepChange}
                        maxLength={9}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Cidade / UF</label>
                      <Input
                        placeholder="Cidade/UF"
                        className="h-14 rounded-2xl bg-brand-black/5 border-transparent font-black text-brand-black px-6"
                        value={formData.location}
                        readOnly
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Endereço de Atuação</label>
                    <Input
                      placeholder="Logradouro, Número, Bairro"
                      className="h-14 rounded-2xl bg-brand-black/5 border-transparent font-black text-brand-black px-6"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      readOnly
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 block">Fachada / Branding</label>
                    <div className="p-4 rounded-3xl bg-white/50 border-2 border-dashed border-brand-green/20">
                      <ImageUpload 
                        value={formData.image}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                        onRemove={() => setFormData({ ...formData, image: "" })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 block">Especialidades & Tags</label>
                    <div className="flex flex-wrap gap-2 p-3 bg-white/50 border border-brand-green/10 rounded-2xl min-h-[56px] focus-within:ring-2 focus-within:ring-brand-orange/20 transition-all">
                      {tags.map((tag: string, index: number) => (
                        <Badge 
                          key={index} 
                          className="bg-brand-red hover:bg-brand-red/90 text-white rounded-xl px-4 py-2 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:scale-125 transition-transform"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                      <input
                        className="flex-1 bg-transparent outline-none text-sm min-w-[200px] text-brand-black font-medium px-2"
                        placeholder={tags.length === 0 ? "Ex: Terapia, Viagens, Gastronomia..." : "Adicionar mais..."}
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
                  </div>

                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-16 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-green/20"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      "Solicitar Parceria Premium"
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Benefits Column */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-brand-orange rounded-full" />
                  <h2 className="text-2xl font-black text-brand-black uppercase tracking-tighter">Vantagens Exclusivas</h2>
                </div>

                <div className="grid gap-6">
                  {[
                    { icon: ShieldCheck, title: "Selo de Aprovação", desc: "Garanta credibilidade e confiança perante nossa comunidade selecionada.", color: "bg-brand-green" },
                    { icon: Target, title: "Público High-End", desc: "Acesso direto a um ecossistema de alto valor e conexões estratégicas.", color: "bg-brand-orange" },
                    { icon: Megaphone, title: "Visibilidade Premium", desc: "Destaque garantido em nossos canais oficiais e eventos sazonais.", color: "bg-brand-red" },
                    { icon: Share2, title: "Networking B2B", desc: "Interaja com outros CEOs e fundadores parceiros da MeetOff.", color: "bg-brand-black" }
                  ].map((benefit, i) => (
                    <div key={i} className="glass p-6 rounded-[2rem] border-white/40 shadow-lg flex gap-6 group hover:scale-[1.02] transition-transform">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-lg shadow-black/5", benefit.color)}>
                        <benefit.icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-black text-brand-black uppercase tracking-tight">{benefit.title}</h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats/Social Proof */}
              <div className="premium-card bg-brand-black rounded-[3rem] p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/20 blur-[80px] -mr-32 -mt-32 rounded-full" />
                <div className="relative space-y-6">
                  <h4 className="text-brand-orange font-bold uppercase tracking-[0.3em] text-[10px]">Ecossistema MeetOff</h4>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-4xl font-black tracking-tighter">500+</p>
                      <p className="text-xs font-bold uppercase text-white/60 tracking-widest">Empresas</p>
                    </div>
                    <div>
                      <p className="text-4xl font-black tracking-tighter">50k+</p>
                      <p className="text-xs font-bold uppercase text-white/60 tracking-widest">Membros</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/60 font-medium leading-relaxed">
                    Nossa missão é transformar transações comerciais em relacionamentos duradouros e prósperos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Partners Section */}
          {partners.length > 0 && (
            <div className="mt-32">
              <div className="flex items-end justify-between mb-12">
                <div className="space-y-2">
                  <h4 className="text-brand-orange font-bold uppercase tracking-[0.3em] text-[10px]">Showcase</h4>
                  <h2 className="text-4xl font-black text-brand-black uppercase tracking-tighter">Parceiros em <span className="text-brand-red">Destaque</span></h2>
                </div>
                <Button variant="link" className="text-brand-black font-black uppercase tracking-widest text-[10px] hover:text-brand-orange gap-2">
                  Ver Diretório Completo <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {partners.map((partner, idx) => (
                  <div key={idx} className="group premium-card bg-white rounded-[2.5rem] overflow-hidden flex flex-col shadow-xl">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={partner.image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop"}
                        alt={partner.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-6 left-6">
                        <Badge className="bg-brand-black/80 backdrop-blur-md text-white border-white/20 rounded-xl px-4 py-1.5 font-black text-[10px] uppercase tracking-widest">
                          {partner.type.split(" - ")[0]}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-brand-black uppercase tracking-tight group-hover:text-brand-orange transition-colors">{partner.name}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Target className="w-3 h-3" /> {partner.location}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed">
                        {partner.products}
                      </p>
                      <Button className="w-full h-12 rounded-xl bg-brand-green/5 hover:bg-brand-green text-brand-green hover:text-white font-black uppercase tracking-widest text-[10px] border border-brand-green/10 transition-all">
                        Conhecer Perfil
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>



      <SiteFooter />
    </div>
  );
}
