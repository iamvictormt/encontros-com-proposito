"use client";

import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, ShieldCheck, CreditCard, Users, Store, AlertTriangle, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQPage() {
  const faqData = [
    {
      id: "item-1",
      icon: HelpCircle,
      question: "1. O QUE É A MEETOFF?",
      answer: (
        <div className="space-y-3">
          <p>A Meetoff Brasil é uma plataforma que promove conexões reais entre pessoas, através de:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Encontros presenciais.</li>
            <li>Eventos.</li>
            <li>Comunidades.</li>
            <li>Networking.</li>
            <li>Relacionamentos.</li>
            <li>Negócios.</li>
          </ul>
          <p>O foco é sair do digital e viver experiências no mundo real.</p>
        </div>
      )
    },
    {
      id: "item-2",
      icon: MessageCircle,
      question: "2. COMO FUNCIONA A MEETOFF?",
      answer: (
        <div className="space-y-3">
          <p>Após o cadastro, você pode:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Criar seu perfil.</li>
            <li>Escolher seus interesses.</li>
            <li>Participar de grupos e comunidades.</li>
            <li>Acessar eventos.</li>
            <li>Conectar-se com outras pessoas.</li>
          </ul>
          <p>A interação pode acontecer online, mas o objetivo principal é o encontro presencial.</p>
        </div>
      )
    },
    {
      id: "item-3",
      icon: CreditCard,
      question: "3. QUAIS SÃO OS PLANOS DISPONÍVEIS?",
      answer: (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="font-black text-brand-black">Plano Usuário – R$ 170,30/mês</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Relacionamentos e encontros.</li>
              <li>Grupos de WhatsApp.</li>
              <li>Amizades, famílias e casais.</li>
              <li>Cartão de membro virtual.</li>
              <li>Networking e negócios.</li>
              <li>Eventos online e presenciais.</li>
              <li>Parceiros de viagens.</li>
              <li>Produtos exclusivos.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-black text-brand-black">Plano Empresas/Parceiros – R$ 232,70/mês</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ponto de Encontro (PEF).</li>
              <li>Ponto de Referência (PRF).</li>
              <li>Gestão de comunidades.</li>
              <li>Criação de eventos.</li>
              <li>Cartões físicos para identificação.</li>
              <li>Profissionais certificados.</li>
              <li>Networking empresarial.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "item-4",
      icon: ShieldCheck,
      question: "4. O CARTÃO FÍSICO É OBRIGATÓRIO?",
      answer: (
        <div className="space-y-3">
          <p>Não. O cartão físico é opcional, mas recomendado para:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Identificação em eventos.</li>
            <li>Networking presencial.</li>
            <li>Mais credibilidade e segurança.</li>
          </ul>
          <p className="font-black text-brand-black">Valor do cartão físico: R$ 120,30</p>
        </div>
      )
    },
    {
      id: "item-5",
      icon: CreditCard,
      question: "5. O QUE É O CARTÃO DE MEMBRO MEETOFF?",
      answer: (
        <div className="space-y-3">
          <p>É um cartão de identificação que pode ser:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Digital (gratuito).</li>
            <li>Físico (pago).</li>
          </ul>
          <p>Pode incluir: QR Code, NFC, Seus interesses e perfil.</p>
        </div>
      )
    },
    {
      id: "item-6",
      icon: Store,
      question: "6. O QUE É PEF E PRF?",
      answer: (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="font-black text-brand-black underline">PEF – Ponto de Encontro</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Locais cadastrados para encontros.</li>
              <li>Restaurantes, eventos, espaços sociais.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-black text-brand-black underline">PRF – Ponto de Referência</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Locais seguros.</li>
              <li>Registro de data, horário e local.</li>
              <li>Mais proteção para os usuários.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "item-7",
      icon: AlertTriangle,
      question: "7. COMO IDENTIFICAR PERFIS SUSPEITOS?",
      answer: (
        <div className="space-y-3">
          <p>Fique atento a:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Pedidos de dinheiro.</li>
            <li>Perfis inconsistentes.</li>
            <li>Pressa excessiva.</li>
            <li>Evitar encontros reais.</li>
          </ul>
          <p className="font-black text-brand-red">➡ Sempre denuncie dentro da plataforma.</p>
        </div>
      )
    },
    {
      id: "item-8",
      icon: ShieldCheck,
      question: "8. POSSO CANCELAR MINHA ASSINATURA?",
      answer: (
        <div className="space-y-3">
          <p>Sim. De acordo com o Código de Defesa do Consumidor:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Você pode cancelar.</li>
            <li>Há prazo de 7 dias para arrependimento (se aplicável).</li>
          </ul>
        </div>
      )
    },
    {
      id: "item-9",
      icon: CreditCard,
      question: "9. A MEETOFF FAZ COBRANÇAS AUTOMÁTICAS?",
      answer: (
        <div className="space-y-3">
          <p>Depende do plano contratado.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Assinaturas podem ser recorrentes.</li>
            <li>Os termos são informados antes da contratação.</li>
          </ul>
        </div>
      )
    },
    {
      id: "item-10",
      icon: Store,
      question: "10. POSSO USAR A MEETOFF PARA NEGÓCIOS?",
      answer: (
        <div className="space-y-3">
          <p>Sim. A plataforma oferece:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Networking.</li>
            <li>Parcerias.</li>
            <li>Divulgação de serviços.</li>
            <li>Eventos.</li>
          </ul>
        </div>
      )
    },
    {
      id: "item-11",
      icon: Users,
      question: "11. EXISTEM PROFISSIONAIS NA PLATAFORMA?",
      answer: (
        <div className="space-y-3">
          <p>Sim. A Meetoff pode incluir:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Consultores.</li>
            <li>Terapeutas.</li>
            <li>Especialistas.</li>
            <li>Profissionais certificados.</li>
          </ul>
          <p className="text-brand-orange font-bold">⚠ Sempre verifique se estão nos canais oficiais.</p>
        </div>
      )
    },
    {
      id: "item-12",
      icon: AlertTriangle,
      question: "12. O QUE ACONTECE SE EU VIOLAR AS REGRAS?",
      answer: (
        <div className="space-y-3">
          <p>Você poderá:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Receber advertência.</li>
            <li>Ser suspenso.</li>
            <li>Ser banido.</li>
            <li>Ser denunciado às autoridades (casos graves).</li>
          </ul>
        </div>
      )
    },
    {
      id: "item-13",
      icon: ShieldCheck,
      question: "13. A MEETOFF SE RESPONSABILIZA POR USUÁRIOS?",
      answer: (
        <div className="space-y-3">
          <p>Não. Cada utilizador é responsável por:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Suas ações.</li>
            <li>Suas interações.</li>
            <li>Seus acordos.</li>
          </ul>
        </div>
      )
    },
    {
      id: "item-14",
      icon: Users,
      question: "14. POSSO PARTICIPAR DE EVENTOS?",
      answer: (
        <div className="space-y-3">
          <p>Sim. Eventos podem ser:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Online.</li>
            <li>Presenciais.</li>
          </ul>
          <p className="font-black text-brand-green">➡ Sempre verifique informações e segurança.</p>
        </div>
      )
    },
    {
      id: "item-15",
      icon: ShieldCheck,
      question: "15. COMO PROTEGER MEUS DADOS?",
      answer: (
        <div className="space-y-3">
          <p>Não partilhe informações sensíveis.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Evite enviar documentos.</li>
            <li>Use apenas canais oficiais.</li>
          </ul>
        </div>
      )
    },
    {
      id: "item-16",
      icon: AlertTriangle,
      question: "16. COMO DENUNCIAR ALGUÉM?",
      answer: (
        <div className="space-y-3">
          <p>Você pode:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Usar ferramentas da plataforma.</li>
            <li>Entrar em contacto com o suporte.</li>
          </ul>
        </div>
      )
    },
    {
      id: "item-17",
      icon: LifeBuoy,
      question: "17. COMO FALAR COM A MEETOFF?",
      answer: (
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="font-black text-brand-black">E-mail:</p>
            <p>suporte@meetoff.com.br</p>
          </div>
          <div className="space-y-1">
            <p className="font-black text-brand-black">Telefones:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Brasil: +55 67 99223-6484.</li>
              <li>Portugal: +351 920323977.</li>
            </ul>
          </div>
          <div className="space-y-1">
            <p className="font-black text-brand-black">Sites:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>www.meetoff.com.br</li>
              <li>www.desligueoappvivaoencontro.com</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-20 lg:py-32">
        <div className="space-y-4 text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 px-4 py-1.5 rounded-full">
            <HelpCircle size={14} className="text-brand-orange" />
            <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em]">Central de Ajuda</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-brand-black uppercase tracking-tighter leading-none">
            FAQ – <span className="text-brand-red">MEETOFF BRASIL</span>
          </h1>
          <p className="text-gray-400 font-medium text-lg">
            Perguntas Frequentes e orientações sobre nossa plataforma.
          </p>
        </div>

        <div className="glass rounded-[3rem] p-4 sm:p-10 border-white/40 shadow-2xl backdrop-blur-xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-none px-6 py-2 rounded-2xl bg-brand-black/[0.02] hover:bg-brand-black/[0.04] transition-all">
                <AccordionTrigger className="hover:no-underline py-4 text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-brand-black/5">
                      <item.icon className="w-5 h-5 text-brand-orange" />
                    </div>
                    <span className="text-sm sm:text-base font-black text-brand-black uppercase tracking-tight leading-snug">
                      {item.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 font-medium text-sm sm:text-base leading-relaxed pl-14 pb-6 pr-6">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-20 premium-card bg-brand-black rounded-[3rem] p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/20 blur-[100px] -mr-32 -mt-32 rounded-full" />
          <div className="relative space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter">Ainda tem dúvidas?</h2>
            <p className="text-white/60 max-w-md mx-auto font-medium leading-relaxed">
              Nossa equipe está pronta para te ajudar a viver a melhor experiência real.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:suporte@meetoff.com.br" className="w-full sm:w-auto h-12 px-8 bg-brand-red text-white rounded-xl flex items-center justify-center font-black uppercase tracking-widest text-[10px] shadow-lg shadow-brand-red/20 transition-all active:scale-95">
                Enviar E-mail
              </a>
              <a href="https://wa.me/5567992236484" className="w-full sm:w-auto h-12 px-8 bg-white/10 text-white rounded-xl flex items-center justify-center font-black uppercase tracking-widest text-[10px] backdrop-blur-md border border-white/20 transition-all hover:bg-white/20">
                Chamar no WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center space-y-4">
          <p className="text-brand-black font-black text-xl italic uppercase tracking-widest">
            Desligue o app. <span className="text-brand-red">Viva o encontro.</span>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
