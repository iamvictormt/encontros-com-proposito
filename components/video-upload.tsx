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
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden group bg-brand-black border border-brand-green/10 shadow-lg">
        <video
          ref={videoRef}
          src={value}
          className="w-full h-full object-contain"
          controls
        />
        {!disabled && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-brand-red hover:text-white text-brand-red rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0 z-20"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative border-2 border-dashed border-brand-green/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-white/50 backdrop-blur-sm transition-all hover:bg-white/80 hover:border-brand-green/30 group">
      <div className="p-5 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 border border-brand-green/5">
        {isUploading ? (
          <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
        ) : (
          <Play className="w-8 h-8 text-brand-green fill-brand-green" />
        )}
      </div>
      <div className="text-center">
        <p className="text-[11px] font-bold text-brand-black uppercase tracking-widest">
          {isUploading ? "Enviando..." : "Enviar Vídeo"}
        </p>
        <p className="text-[9px] text-brand-black/40 font-medium mt-1 uppercase tracking-wider">MP4, WebM ou OGG (Max. 90s)</p>
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
