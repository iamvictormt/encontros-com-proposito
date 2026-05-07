import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authService } from "@/lib/services/auth.service";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { DocumentUploadForm } from "@/components/document-upload-form";

export default async function EmAnalisePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (token) {
    const payload = await verifyJWT(token);
    if (payload && payload.verificationStatus === "APROVADO") {
      redirect("/");
    }
  } else {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center space-y-8 border border-brand-green/10">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-brand-orange/10 text-brand-orange rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <h1 className="text-2xl font-black text-brand-black uppercase tracking-tight">
            Cadastro em Verificação
          </h1>
          <p className="text-gray-500 font-medium">
            A MeetOff Brasil é uma plataforma exclusiva e monitorada. Nossa equipe está analisando seu perfil para garantir a segurança de nossa comunidade.
          </p>
          <p className="text-sm text-brand-orange font-bold">
            Você receberá uma notificação quando seu acesso for liberado.
          </p>
        </div>

        <DocumentUploadForm />

        <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
          <Button variant="outline" className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-xs" asChild>
            <Link href="/">Voltar ao Início</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
