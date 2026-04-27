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
}

export function ImageUpload({ value, onChange, onRemove, disabled }: ImageUploadProps) {
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
      <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
        <Image src={value} alt="Upload" fill className="object-cover" />
        {!disabled && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center bg-gray-50/50">
      <div className="p-3 bg-white rounded-full shadow-sm mb-2">
        {isUploading ? (
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        ) : (
          <Upload className="w-6 h-6 text-primary" />
        )}
      </div>
      <div className="text-center px-4">
        <p className="text-[13px] font-medium text-black">
          {isUploading ? "Enviando..." : "Clique para enviar imagem"}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG ou WEBP (Max. 5MB)</p>
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
