"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Play } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function VideoUpload({ value, onChange, onRemove, disabled }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's a video
    if (!file.type.startsWith("video/")) {
      toast.error("Por favor, selecione um arquivo de vídeo.");
      return;
    }

    // Check duration
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = async () => {
      window.URL.revokeObjectURL(video.src);
      if (video.duration > 90) {
        toast.error("O vídeo deve ter no máximo 90 segundos.");
        return;
      }

      // Proceed with upload
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
        toast.success("Vídeo enviado com sucesso!");
      } catch (error) {
        toast.error("Erro ao enviar vídeo");
        console.error(error);
      } finally {
        setIsUploading(false);
      }
    };
    video.src = URL.createObjectURL(file);
  };

  if (value) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden group bg-black">
        <video
          ref={videoRef}
          src={value}
          className="w-full h-full object-contain"
          controls
        />
        {!disabled && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center gap-4 bg-gray-50/50">
      <div className="p-4 bg-white rounded-full shadow-sm">
        {isUploading ? (
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        ) : (
          <Play className="w-8 h-8 text-primary fill-primary" />
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-black">
          {isUploading ? "Enviando..." : "Clique para enviar vídeo de apresentação"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">MP4, WebM ou OGG (Max. 90s)</p>
      </div>
      <input
        type="file"
        accept="video/*"
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
