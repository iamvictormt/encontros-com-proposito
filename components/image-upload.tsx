"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
  aspect?: 'video' | 'square';
}

export function ImageUpload({ value, onChange, onRemove, disabled, aspect = 'video' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onChange(data.secure_url);
      toast.success("Imagem enviada com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar imagem");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  if (value) {
    return (
      <div className={cn(
        "relative w-full rounded-2xl overflow-hidden group border border-brand-green/10 shadow-sm transition-all hover:shadow-md", 
        aspect === 'square' ? 'aspect-square' : 'aspect-video'
      )}>
        <Image 
          src={value} 
          alt="Upload" 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        {!disabled && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-brand-red hover:text-white text-brand-red rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "relative w-full border-2 border-dashed border-brand-green/10 rounded-2xl flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm transition-all hover:bg-white/80 hover:border-brand-green/30 group", 
      aspect === 'square' ? 'aspect-square' : 'aspect-video'
    )}>
      <div className="p-4 bg-white rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform duration-300 border border-brand-green/5">
        {isUploading ? (
          <Loader2 className="w-6 h-6 text-brand-green animate-spin" />
        ) : (
          <Upload className="w-6 h-6 text-brand-green" />
        )}
      </div>
      <div className="text-center px-4">
        <p className="text-[11px] font-bold text-brand-black uppercase tracking-widest">
          {isUploading ? "Enviando..." : "Enviar Foto"}
        </p>
        <p className="text-[9px] text-brand-black/40 font-medium mt-1">PNG, JPG ou WEBP</p>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className={cn(
          "absolute inset-0 opacity-0",
          !disabled && !isUploading ? "cursor-pointer" : "cursor-default"
        )}
        disabled={isUploading || disabled}
      />
    </div>
  );
}
