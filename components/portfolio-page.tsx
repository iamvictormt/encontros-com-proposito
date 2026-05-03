"use client";

import { Button } from "@/components/ui/button";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Linkedin, Instagram, Phone, Facebook, Heart, User, Users, Frown, ArrowRight } from "lucide-react";
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
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 px-4 py-16 lg:px-20">
        <div className="mx-auto max-w-7xl">
          {/* Founders Hero Section */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-10 relative">
               <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
                Nossa História & Propósito
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-brand-black uppercase tracking-tighter leading-[0.85] mt-4">
                Olá, Nós somos <br/>
                <span className="text-brand-orange">João Carlos</span> <br/>
                <span className="text-brand-black">&</span> <span className="text-brand-red">Labernarde</span>
              </h1>
              <p className="text-gray-500 font-medium text-lg md:text-xl leading-relaxed max-w-xl">
                Facilitadores de conexões reais e terapeutas especializados em reencontros profundos e restauração de propósitos.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Button
                  asChild
                  className="h-16 rounded-2xl bg-brand-orange hover:bg-brand-orange/90 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-orange/20 px-8 transition-all active:scale-95"
                >
                  <Link href="/schedule-session">Agendar com Fundadores</Link>
                </Button>
                <Link href="#about" className="text-xs font-black uppercase tracking-widest text-brand-black hover:text-brand-orange transition-colors flex items-center gap-3 group">
                  Conheça nossa Jornada <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 relative">
              <div className="absolute inset-0 bg-brand-orange/10 blur-[100px] rounded-full" />
              <div className="space-y-6 relative translate-y-12">
                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src="./images/joao-carlos.png"
                    alt="João Carlos"
                    className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110"
                  />
                </div>
                <div className="px-4">
                   <h3 className="font-black text-brand-black uppercase tracking-tight text-lg">João Carlos</h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fundador & CEO</p>
                </div>
              </div>
              <div className="space-y-6 relative">
                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src="./images/alesca-de-labernarde.png"
                    alt="Aiesca de Labernarde"
                    className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110"
                  />
                </div>
                <div className="px-4">
                   <h3 className="font-black text-brand-black uppercase tracking-tight text-lg">Labernarde</h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Co-Founder & Especialista</p>
                </div>
              </div>

              {/* Float Socials */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 hidden xl:flex flex-col gap-4">
                {[Linkedin, Instagram, Phone, Facebook].map((Icon, i) => (
                  <Link key={i} href="#" className="w-12 h-12 rounded-2xl glass border-white/40 flex items-center justify-center text-brand-black hover:bg-brand-black hover:text-white transition-all shadow-xl">
                    <Icon size={20} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="glass rounded-[3rem] p-12 border-white/40 shadow-2xl mb-32 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 blur-3xl -mr-32 -mt-32 rounded-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="text-center space-y-2">
                <div className="text-6xl font-black text-brand-black tracking-tighter">10+</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Anos de Experiência</div>
              </div>
              <div className="text-center space-y-2 border-y md:border-y-0 md:border-x border-brand-green/10 py-8 md:py-0">
                <div className="text-6xl font-black text-brand-black tracking-tighter">300+</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Casos Transformados</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-6xl font-black text-brand-black tracking-tighter">99%</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Taxa de Satisfação</div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div id="about" className="grid lg:grid-cols-12 gap-16 mb-32 items-start">
            <div className="lg:col-span-4 space-y-6 sticky top-24">
              <div className="h-1 w-20 bg-brand-red rounded-full" />
              <h2 className="text-4xl font-black text-brand-black uppercase tracking-tighter leading-none">
                Nossa <br/><span className="text-brand-red">Bagagem</span>
              </h2>
              <p className="text-gray-500 font-medium leading-relaxed italic">
                "Acreditamos que cada conexão verdadeira pode transformar vidas e restaurar o equilíbrio que o mundo moderno tenta nos tirar."
              </p>
            </div>
            <div className="lg:col-span-8 space-y-8">
              <div className="premium-card bg-white p-12 rounded-[2.5rem] shadow-xl space-y-6">
                <p className="text-gray-600 font-medium leading-relaxed">
                  João Carlos é terapeuta com experiência internacional, com formações e cursos realizados em Lisboa, Portugal. Atua como terapeuta de casal, familiar, constelador familiar e coach de relacionamento, sendo reconhecido como um verdadeiro facilitador de encontros. Sua vivência possibilitou compreender diferentes culturas e comportamentos na escolha de um companheiro da vida.
                </p>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Aiesca de Labernarde, após anos na advocacia, descobriu sua verdadeira vocação: atender mulheres e compreender a complexidade de relacionamentos saudáveis. Especialista em questões familiares, dedica-se a aliviar as dores emocionais e promover o acolhimento em momentos delicados.
                </p>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Juntos, fundaram o ecossistema MeetOff, integrando viagens, eventos e tecnologia para resgatar a forma mais natural de conectar pessoas para compartilhar a vida, seja para amor, networking ou amizade.
                </p>
              </div>
            </div>
          </div>

          {/* Service Areas */}
          <div className="mb-32">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-black text-brand-black uppercase tracking-tighter">Áreas de <span className="text-brand-red">Atuação</span></h2>
              <p className="text-gray-500 font-medium">Soluções personalizadas para cada fase da sua jornada emocional.</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
              {[
                { icon: Heart, label: "Relacionamentos" },
                { icon: User, label: "Solteiras" },
                { icon: Users, label: "Divorciadas" },
                { icon: Frown, label: "Viúvas" },
                { icon: Users, label: "Casais" },
                { icon: Users, label: "Famílias" }
              ].map((item, i) => (
                <div key={i} className="group glass p-8 rounded-[2rem] border-white/40 shadow-lg flex flex-col items-center justify-center gap-4 hover:bg-brand-black hover:-translate-y-2 transition-all cursor-pointer">
                  <item.icon className="w-10 h-10 text-brand-orange group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-black text-brand-black group-hover:text-white uppercase tracking-widest text-center">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-12">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-brand-orange rounded-full" />
              <h2 className="text-3xl font-black text-brand-black uppercase tracking-tighter">Vozes da Comunidade</h2>
            </div>
            <div className="min-h-[400px] flex items-center">
              <TestimonialCarousel reviews={reviews} variant="stacked" arrowsPosition="right" />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
