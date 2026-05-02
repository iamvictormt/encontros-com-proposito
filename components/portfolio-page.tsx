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
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="px-4 py-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="order-2 lg:order-1">
               <h1 className="text-5xl sm:text-7xl font-black text-black uppercase italic tracking-tighter leading-[0.9] mb-8">
                 Conecte-se com <span className="text-primary">Propósito</span>
               </h1>
               <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-xl font-medium">
                 João Carlos & Labernarde: Facilitadores de encontros reais e transformadores.
                 Nossa missão é resgatar a essência das conexões humanas.
               </p>
               <div className="flex flex-col sm:flex-row items-center gap-6">
                 <Button
                   asChild
                   className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 py-8 text-lg font-black uppercase italic w-full sm:w-auto"
                 >
                   <Link href="/schedule-session">Agendar Sessão</Link>
                 </Button>
                 <div className="flex gap-4">
                   <Link href="#" className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-100 text-gray-400 hover:text-primary hover:border-primary transition-all">
                     <Instagram size={20} />
                   </Link>
                   <Link href="#" className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-100 text-gray-400 hover:text-primary hover:border-primary transition-all">
                     <Linkedin size={20} />
                   </Link>
                 </div>
               </div>
            </div>

            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                 <div className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl">
                    <img src="./images/joao-carlos.png" alt="João Carlos" className="w-full h-full object-cover" />
                 </div>
                 <div className="bg-secondary p-6 rounded-[2rem] text-white">
                    <div className="text-2xl font-black italic">10+</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest opacity-60">Anos de Experiência</div>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="bg-accent p-6 rounded-[2rem] text-white">
                    <div className="text-2xl font-black italic">300+</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest opacity-60">Casos Atendidos</div>
                 </div>
                 <div className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl">
                    <img src="./images/alesca-de-labernarde.png" alt="Aiesca de Labernarde" className="w-full h-full object-cover" />
                 </div>
              </div>
            </div>
          </div>

          {/* Sobre os Profissionais */}
          <div className="mb-24 py-16 px-8 sm:px-16 bg-gray-50 rounded-[4rem]">
            <h2 className="text-3xl font-black uppercase italic text-black mb-12 text-center lg:text-left">Os Fundadores</h2>
            <div className="columns-1 lg:columns-2 gap-12 space-y-6 text-base text-gray-500 leading-relaxed font-medium">
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
          <div className="mb-24">
            <h2 className="text-3xl font-black uppercase italic text-black mb-12 text-center lg:text-left">Áreas de Atuação</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: Heart, label: "Relacionamentos" },
                { icon: User, label: "Solteiras" },
                { icon: Users, label: "Divorciadas" },
                { icon: Frown, label: "Viúvas" },
                { icon: Users, label: "Casais" },
                { icon: Users, label: "Famílias" },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-8 rounded-[2rem] bg-white border border-gray-50 hover:border-primary/20 hover:shadow-xl transition-all group">
                  <item.icon className="w-10 h-10 text-gray-300 group-hover:text-primary transition-colors mb-4" />
                  <span className="font-black text-[10px] uppercase tracking-widest text-black text-center">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* O que minhas pacientes dizem */}
          <div>
            <h2 className="text-xl font-bold mb-6 text-black">O que minhas pacientes dizem</h2>
            <div className="max-w-5xl mx-auto">
              <TestimonialCarousel reviews={reviews} />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
