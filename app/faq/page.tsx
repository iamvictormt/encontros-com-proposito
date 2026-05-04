import { FAQPage } from "@/components/faq-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ – Perguntas Frequentes | MeetOff Brasil",
  description: "Tire todas as suas dúvidas sobre o funcionamento da MeetOff, planos, segurança e como promover conexões reais.",
};

export default function FAQ() {
  return <FAQPage />;
}
