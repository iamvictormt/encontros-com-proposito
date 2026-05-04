import { DirectoryPage } from "@/components/directory-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diretório de Parceiros | MeetOff Brasil",
  description: "Explore nosso ecossistema exclusivo de empresas e serviços selecionados para a comunidade MeetOff.",
};

export default function DirectoryRoute() {
  return <DirectoryPage />;
}
