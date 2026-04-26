"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
    status: event?.status || "Ativo",
    tags: event?.tags?.join(", ") || "",
    date: event?.date ? new Date(event.date).toISOString().split("T")[0] : "",
    time: event?.time || "",
    location: event?.location || "",
    address: event?.address || "",
    price: event?.price || 0,
    capacity: event?.capacity || 0,
    description: event?.description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        id: event?.id,
        tags: formData.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        price: parseFloat(formData.price.toString()),
        capacity: parseInt(formData.capacity.toString()),
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isReadOnly ? "Detalhes do Evento" : event ? "Editar Evento" : "Novo Evento"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
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
                <SelectTrigger id="status" className="bg-white">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Imagem de Capa</Label>
            <ImageUpload 
              value={formData.image} 
              onChange={(url) => setFormData({ ...formData, image: url })}
              onRemove={() => setFormData({ ...formData, image: "" })}
              disabled={isReadOnly}
            />
          </div>


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
                placeholder="Ex: 19:30" 
                value={formData.time} 
                onChange={(e) => setFormData({ ...formData, time: e.target.value })} 
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="address">Endereço Completo</Label>
              <Input 
                id="address" 
                value={formData.address} 
                onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
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

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input 
              id="tags" 
              placeholder="Ex: Casais, Sem Crianças" 
              value={formData.tags} 
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })} 
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              rows={4} 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              disabled={isReadOnly}
            />
          </div>

          <DialogFooter>
            {isReadOnly ? (
              <Button type="button" className="bg-secondary hover:bg-secondary/90 text-white" onClick={onClose}>Fechar</Button>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar Evento"}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
