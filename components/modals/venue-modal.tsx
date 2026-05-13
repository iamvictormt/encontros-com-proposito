"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/image-upload";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";

interface VenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  venue?: any;
  isReadOnly?: boolean;
}

export function VenueModal({ isOpen, onClose, onSuccess, venue, isReadOnly }: VenueModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: venue?.name || "",
    location: venue?.location || "",
    address: venue?.address || "",
    cep: venue?.cep || "",
    type: venue?.type || "",
    image: venue?.image || "",
    status: venue?.status || "Ativo",
    latitude: venue?.latitude || "",
    longitude: venue?.longitude || "",
  });
  const [cepFetchedFields, setCepFetchedFields] = useState<string[]>([]);

  const handleCepLookup = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      setIsLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          const newLocation = `${data.localidade}/${data.uf}`;
          const newAddress = data.logradouro || "";
          
          setFormData(prev => ({
            ...prev,
            location: newLocation,
            address: newAddress
          }));

          const fetched = ["location", "address"];

          // Automatically fetch coordinates after address is found
          const query = `${newAddress}, ${newLocation}`;
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
          );
          const geoData = await geoRes.json();

          if (geoData && geoData.length > 0) {
            setFormData(prev => ({
              ...prev,
              latitude: geoData[0].lat,
              longitude: geoData[0].lon
            }));
            fetched.push("latitude", "longitude");
            toast.success("Endereço e coordenadas localizados!");
          } else {
            toast.success("Endereço preenchido!");
          }
          setCepFetchedFields(fetched);
        } else {
          toast.error("CEP não encontrado");
          setCepFetchedFields([]);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        setCepFetchedFields([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setCepFetchedFields([]);
    }
  };

  const onCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    
    let maskedValue = value;
    if (value.length > 5) maskedValue = `${value.slice(0, 5)}-${value.slice(5)}`;
    
    setFormData(prev => ({ ...prev, cep: maskedValue }));
    if (value.length === 8) {
      handleCepLookup(value);
    } else {
      setCepFetchedFields([]);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/venues", {
        method: venue ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: venue?.id }),
      });

      if (!res.ok) throw new Error("Failed to save venue");

      toast.success(venue ? "Local atualizado!" : "Local criado!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar local");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-[2.5rem] border-none shadow-2xl p-6 sm:p-10 max-w-xl w-[95vw] max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader className="space-y-3 mb-8">
          <DialogTitle className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-brand-black">
            {isReadOnly ? "Detalhes do Local" : venue ? "Editar Local" : "Novo Local"}
          </DialogTitle>
          <p className="text-gray-500 font-medium text-sm">
            Gerencie os estabelecimentos parceiros e locais de eventos.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-8">
            <div className="w-48 h-48 sm:w-64 sm:h-40">
              <ImageUpload 
                value={formData.image} 
                onChange={(url) => setFormData({ ...formData, image: url })}
                onRemove={() => setFormData({ ...formData, image: "" })}
                disabled={isReadOnly}
              />
            </div>
          </div>


          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Nome do Local/Empresa
            </Label>
            <Input 
              id="name" 
              className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              required 
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cep" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              CEP
            </Label>
            <Input 
              id="cep" 
              className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
              value={formData.cep} 
              onChange={onCepChange} 
              placeholder="00000-000"
              disabled={isReadOnly}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Cidade / UF
              </Label>
              <Input 
                id="location" 
                className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
                value={formData.location} 
                onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                required 
                disabled={isReadOnly || cepFetchedFields.includes("location")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Endereço Completo
              </Label>
              <Input 
                id="address" 
                className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
                value={formData.address} 
                onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                placeholder="Rua, Número, Bairro"
                disabled={isReadOnly || cepFetchedFields.includes("address")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Tipo / Categoria
              </Label>
              <Input 
                id="type" 
                placeholder="Ex: Externo, Coworking" 
                className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
                value={formData.type} 
                onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                disabled={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Status de Moderação
              </Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                disabled={isReadOnly}
              >
                <SelectTrigger id="status" className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white font-bold">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-white/20 glass">
                  <SelectItem value="Aprovado" className="text-brand-green font-bold">Aprovado</SelectItem>
                  <SelectItem value="Pendente" className="text-brand-orange font-bold">Pendente</SelectItem>
                  <SelectItem value="Recusado" className="text-brand-red font-bold">Recusado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Latitude
              </Label>
              <Input 
                id="latitude" 
                type="number"
                step="any"
                placeholder="Ex: -23.5505" 
                className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
                value={formData.latitude} 
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} 
                disabled={isReadOnly || cepFetchedFields.includes("latitude")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Longitude
              </Label>
              <Input 
                id="longitude" 
                type="number"
                step="any"
                placeholder="Ex: -46.6333" 
                className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all font-bold"
                value={formData.longitude} 
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} 
                disabled={isReadOnly || cepFetchedFields.includes("longitude")}
              />
            </div>
          </div>

          <DialogFooter className="pt-8 gap-4">
            {isReadOnly ? (
              <Button type="button" className="w-full h-14 rounded-2xl bg-brand-black hover:bg-brand-black/90 text-white font-black uppercase tracking-widest text-[10px] shadow-xl" onClick={onClose}>
                Fechar Detalhes
              </Button>
            ) : (
              <>
                <Button type="button" variant="ghost" className="h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-brand-black" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 h-14 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-green/20" disabled={isLoading}>
                  {isLoading ? "Processando..." : venue ? "Salvar Alterações" : "Criar Local"}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
