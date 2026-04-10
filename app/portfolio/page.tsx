import { PortfolioPage } from "@/components/portfolio-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfólio | Meet Off",
  description: "Conheça nossos profissionais e as áreas de atendimento",
};

export default function Page() {
  return <PortfolioPage />;
}
