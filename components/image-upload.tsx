"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
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
      <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
        <Image src={value} alt="Upload" fill className="object-cover" />
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center gap-4 bg-gray-50/50">
      <div className="p-4 bg-white rounded-full shadow-sm">
        {isUploading ? (
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        ) : (
          <Upload className="w-8 h-8 text-primary" />
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-black">
          {isUploading ? "Enviando..." : "Clique para enviar imagem"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">PNG, JPG ou WEBP (Max. 5MB)</p>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="absolute inset-0 opacity-0 cursor-pointer"
        disabled={isUploading}
      />
    </div>
  );
}
