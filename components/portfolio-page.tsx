"use client";

import { Button } from "@/components/ui/button";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Linkedin, Instagram, Phone, Facebook, Heart, User, Users, Frown } from "lucide-react";
import Link from "next/link";
import { TestimonialCarousel, Review } from "./testimonial-carousel";

const reviews: Review[] = [
  {
    id: 1,
    text: "Lorem ipsum dolor sit amet consectetur. Convallis mi tempor mattis amet urna habitant semper id. Ac non a id tellus auctor non. Diam in cras eget in. Elementum feugiat amet quis posuere quam amet lectus nisl.",
    author: "Luciana Cardoso",
  },
  {
    id: 2,
    text: "Profissionais maravilhosos! Ajudaram muito no meu processo de recuperação e autoconhecimento. Recomendo de olhos fechados.",
    author: "Mariana Silva",
  },
  {
    id: 3,
    text: "A experiência com eles foi transformadora. Me senti acolhida desde o primeiro momento e voltei a enxergar minha verdadeira força.",
    author: "Juliana Fernandes",
  },
];

export function PortfolioPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F6]">
      <SiteHeader />

      <main className="px-4 py-8 lg:px-20">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                <img
                  src="./images/joao-carlos.png"
                  alt="João Carlos"
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-bold text-lg text-black">João Carlos</h3>
              <p className="text-sm text-gray-500 mb-2">Profissionais na área de terapia</p>
              <p className="text-sm">
                Email:{" "}
                <a
                  href="mailto:FigmaDesignUXUI@email.com"
                  className="text-secondary underline decoration-secondary"
                >
                  FigmaDesignUXUI@email.com
                </a>
              </p>
            </div>

            <div className="flex-1">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                <img
                  src="./images/alesca-de-labernarde.png"
                  alt="Aiesca de Labernarde"
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-bold text-lg text-black">Alesca de Labernarde</h3>
              <p className="text-sm text-gray-500 mb-2">
                Profissionais na área de advocacia e comércio exterior
              </p>
              <p className="text-sm">
                Email:{" "}
                <a
                  href="mailto:FigmaDesignUXUI@email.com"
                  className="text-secondary underline decoration-secondary"
                >
                  FigmaDesignUXUI@email.com
                </a>
              </p>
            </div>
          </div>

          {/* Intro Text */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8 mt-22">
            <div className="w-full md:w-[95%] pr-0 md:pr-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
                Olá, Nós somos <span className="text-primary">João Carlos</span> &{" "}
                <span className="text-secondary">Labernarde</span>
                <br />
                Terapia especializada em atender mulheres que buscam reencontrar sua força
              </h1>
              <p className="text-gray-500 mb-6 max-w-4xl">
                Apoio psicológico acolhedor e direcionado para mulheres que passaram por abuso e
                outras situações traumáticas, com foco no seu bem-estar e recuperação.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  className="bg-accent hover:bg-accent/90 text-white rounded-md px-6 py-6 button-base"
                >
                  <Link href="/schedule-session">Agendar Sessão com Fundadores</Link>
                </Button>
                <button className="text-sm font-medium flex items-center hover:underline text-black cursor-pointer">
                  Saiba mais sobre meu trabalho
                  <span className="ml-1">↓</span>
                </button>
              </div>
            </div>

            <div className="w-full md:w-[5%] flex justify-end">
              <div className="flex flex-col gap-3 text-gray-600 border border-gray-100 rounded-full py-4 px-2 shadow-sm items-center">
                <Link href="#" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Linkedin size={20} />
                </Link>
                <Link href="#" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Instagram size={20} />
                </Link>
                <Link href="#" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Phone size={20} />
                </Link>
                <Link href="#" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Facebook size={20} />
                </Link>
              </div>
            </div>
          </div>

          {/* Sobre os Profissionais */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6 text-black">Sobre os Profissionais</h2>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                João Carlos é terapeuta com experiência internacional, com formações e cursos
                realizados em Lisboa, Portugal, voltados para relacionamentos. Atua como terapeuta
                de casal, terapeuta familiar, constelador familiar e coach de relacionamento, sendo
                reconhecido como um verdadeiro facilitador de encontros.
              </p>
              <p>
                Sua vivência em diversos países europeus possibilitou compreender diferentes
                culturas e comportamentos na escolha de um companheiro da vida. Morou em Portugal e
                na Irlanda, além de ter realizado cursos no Brasil e no exterior. Com essa bagagem,
                trouxe para o Brasil projetos inovadores que resgatam a forma mais natural e
                verdadeira de conectar alguém para compartilhar a vida.
              </p>
              <p>
                Com sua experiência como empreendedor na área de viagens, eventos e turismo,
                desenvolveu uma ideia inovadora ao unirem esses serviços à encontros específicos
                para solteiros, casais, famílias, além de promover interações voltadas para
                networking e negócios, criando assim um formato diferenciado de conexão presencial.
              </p>
              <p>
                Aiesca de Labernarde é formada em advocacia e comércio exterior. Após anos de
                carreira, descobriu sua verdadeira vocação: atender mulheres e compreender a
                complexidade e a importância de um relacionamento saudável. Especialista em questões
                familiares, presenciou inúmeros casos em que pequenos detalhes não percebidos ao
                longo dos anos levaram a destruição de famílias. Ao perceber a fragilidade das
                mulheres após uma separação e os impactos de um divórcio, decidiu unir forças para
                aliviar as dores emocionais que surgem nestes momentos.
              </p>
              <p>
                Junto com seu marido, criou um formato de atendimento único voltado especialmente
                para mulheres em busca de apoio emocional, oferecendo compreensão e acolhimento nos
                períodos mais delicados.
              </p>
              <p>
                João Carlos é fundador e CEO do FindB, Encontre seu Equilíbrio, MeetOff, Mimo Meu e
                Seu Projeto Esposa Feliz e Check-In Love. Todos esses aplicativos têm como objetivo
                facilitar a conexão entre pessoas, seja para relacionamentos, amizades, networking,
                negócios, parcerias de viagem ou eventos presenciais. A proposta é criar
                oportunidades reais de encontro, valorizando a interação humana e o contato pessoal.
              </p>
              <p>
                João Carlos e Aiesca de Labernarde são facilitadores de encontros e acreditam que
                cada conexão verdadeira pode transformar vidas.
              </p>
            </div>
          </div>

          {/* Stats Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 border-t border-b border-gray-100 py-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">10+</div>
              <div className="text-xs font-semibold text-black uppercase tracking-widest">
                Anos de Experiência
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">300+</div>
              <div className="text-xs font-semibold text-black uppercase tracking-widest">
                casos atendidos
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">99%</div>
              <div className="text-xs font-semibold text-black uppercase tracking-widest">
                de taxa de satisfação das pacientes
              </div>
            </div>
          </div>

          {/* Categorias de Atendimento */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6 text-black">Categorias de Atendimento</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-6 border rounded-xl hover:border-gray-300 transition-all bg-gray-50/50">
                <Heart className="w-8 h-8 text-secondary mb-3" />
                <span className="font-semibold text-sm text-black">Relacionamentos</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 border rounded-xl hover:border-gray-300 transition-all bg-gray-50/50">
                <User className="w-8 h-8 text-secondary mb-3" />
                <span className="font-semibold text-sm text-black">Solteiras</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 border rounded-xl hover:border-gray-300 transition-all bg-gray-50/50">
                <Users className="w-8 h-8 text-secondary mb-3" />
                <span className="font-semibold text-sm text-black">Divorciadas</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 border rounded-xl hover:border-gray-300 transition-all bg-gray-50/50">
                <Frown className="w-8 h-8 text-secondary mb-3" />
                <span className="font-semibold text-sm text-black">Viúvas</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 border rounded-xl hover:border-gray-300 transition-all bg-gray-50/50">
                <Users className="w-8 h-8 text-secondary mb-3" />
                <span className="font-semibold text-sm text-black">Casais</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 border rounded-xl hover:border-gray-300 transition-all bg-gray-50/50">
                <Users className="w-8 h-8 text-secondary mb-3" />
                <span className="font-semibold text-sm text-black">Famílias e Grupos</span>
              </div>
            </div>
          </div>

          {/* O que minhas pacientes dizem */}
          <div>
            <h2 className="text-xl font-bold mb-6 text-black">O que minhas pacientes dizem</h2>
            <div className="max-w-2xl mx-auto">
              <TestimonialCarousel reviews={reviews} />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
