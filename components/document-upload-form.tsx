"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { Loader2, UploadCloud, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DocumentUploadForm() {
  const { user, refreshAuth } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload to Cloudinary via our route
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Erro ao enviar arquivo");

      const uploadData = await uploadRes.json();
      const documentUrl = uploadData.secure_url;

      // Update user document
      const docPayload: any = {};
      if (user?.userCategory === "EMPRESA") {
        docPayload.companyDocsUrl = documentUrl;
      } else if (user?.userCategory === "PARCEIRO") {
        docPayload.partnerDocsUrl = documentUrl;
      } else {
        docPayload.documentUrl = documentUrl;
      }

      const updateRes = await fetch("/api/auth/me/documents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docPayload),
      });

      if (!updateRes.ok) throw new Error("Erro ao salvar documento");

      toast.success("Documento enviado com sucesso! Seu perfil está em análise.");
      await refreshAuth();
      router.refresh();
      
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao enviar seu documento.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return null;

  // If user already has the respective document URL, we don't need to show the upload form
  const hasUploaded = 
    (user.userCategory === "EMPRESA" && user.companyDocsUrl) ||
    (user.userCategory === "PARCEIRO" && user.partnerDocsUrl) ||
    (user.userCategory === "COMUM" && user.documentUrl) ||
    (!user.userCategory && user.documentUrl);

  if (hasUploaded) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-brand-green/5 border border-brand-green/20 rounded-2xl space-y-3">
        <CheckCircle2 className="w-10 h-10 text-brand-green" />
        <p className="text-sm font-bold text-brand-black text-center">
          Documentos recebidos com sucesso!
        </p>
        <p className="text-xs text-gray-500 text-center">
          Nossa equipe está analisando seu perfil. Você será notificado assim que for aprovado.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-100 rounded-2xl space-y-4">
      <div className="w-12 h-12 bg-brand-orange/10 text-brand-orange rounded-full flex items-center justify-center">
        <UploadCloud className="w-6 h-6" />
      </div>
      <div className="text-center space-y-1">
        <h3 className="text-sm font-black uppercase tracking-wider text-brand-black">
          Validação de Identidade
        </h3>
        <p className="text-xs text-gray-500 font-medium px-2">
          {user.userCategory === "EMPRESA"
            ? "Faça upload do cartão CNPJ ou Contrato Social para prosseguir."
            : "Faça upload de um documento de identidade (RG ou CNH) para prosseguir."}
        </p>
      </div>

      <div className="w-full">
        <input
          type="file"
          id="document-upload"
          className="hidden"
          accept="image/*,.pdf"
          onChange={handleFileChange}
        />
        <label
          htmlFor="document-upload"
          className="w-full h-12 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-brand-orange transition-colors bg-white text-xs font-bold text-gray-600"
        >
          {file ? file.name : "Selecionar Arquivo..."}
        </label>
      </div>

      <Button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full h-12 rounded-xl bg-brand-black hover:bg-brand-black/90 text-white font-bold uppercase tracking-widest text-xs"
      >
        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar Documento"}
      </Button>
    </div>
  );
}
