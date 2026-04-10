import { PartnersPage } from "@/components/partners-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Empresas e Parcerias - Encontros com Propósito",
  description: "Cadastre sua empresa e conecte-se a eventos, pontos de encontro e vendas!",
};

export default function Page() {
  return <PartnersPage />;
}
