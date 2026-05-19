import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  MessageSquare,
  ShieldAlert,
  Users,
  Phone,
  Scale,
  Ban,
  AlertTriangle,
  CheckCircle2,
  Search,
  Lock,
  UserCheck,
  Shield,
  Gavel,
  HelpCircle,
  FileText,
  Globe,
  Fingerprint,
} from "lucide-react";

export default function ConsentPage() {
  const sections = [
    {
      id: "controlador",
      title: "1. Identificação do Controlador",
      icon: <Globe className="w-5 h-5 text-brand-orange" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-gray-500 font-medium">
          <div className="space-y-2">
            <p>
              <strong>Apresente política é gerida por:</strong> Meetoff Brasil
            </p>
            <p>
              <strong>Websites:</strong> www.meetoff.com.br <br /> www.desligueoappvivaoencontro.com
            </p>
            <p>
              <strong>E-mail:</strong> suporte@meetoff.com.br
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <strong>Brasil:</strong> +55 67 99223-6484
            </p>
            <p>
              <strong>Portugal:</strong> +351 920323977
            </p>
            <p className="text-[10px] opacity-70">Rua das Amapolas, nº 554, Campo Grande - MS</p>
          </div>
        </div>
      ),
    },
    {
      id: "objeto",
      title: "2. Objeto",
      icon: <FileText className="w-5 h-5 text-brand-green" />,
      content: (
        <p className="text-sm text-gray-600 leading-relaxed">
          O presente documento estabelece as regras, condições, deveres e consentimento aplicáveis à
          participação de utilizadores em grupos externos de comunicação, nomeadamente através do
          WhatsApp ou outras plataformas similares, no contexto da utilização da Meetoff.
        </p>
      ),
    },
    {
      id: "natureza",
      title: "3. Natureza da Comunicação Externa",
      icon: <MessageSquare className="w-5 h-5 text-brand-orange" />,
      content: (
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />A comunicação
            ocorre fora da infraestrutura da Meetoff.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />A Meetoff não
            controla a tecnologia dessas plataformas.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />O funcionamento
            depende exclusivamente de terceiros.
          </li>
        </ul>
      ),
    },
    {
      id: "exposicao",
      title: "4. Exposição de Dados Pessoais",
      icon: <Phone className="w-5 h-5 text-brand-green" />,
      content: (
        <div className="p-6 rounded-2xl bg-brand-green/5 border border-brand-green/10 space-y-4">
          <p className="text-sm font-bold text-brand-green uppercase tracking-tight italic">
            Ao ingressar nos grupos, o utilizador reconhece que:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
            <li>• O seu número de telefone será visível a outros participantes.</li>
            <li>• Poderá ser identificado por terceiros.</li>
            <li>• Há partilha voluntária de dados pessoais.</li>
            <li>• Interações ocorrem fora do controlo da Meetoff.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "lgpd-consent",
      title: "5. Consentimento Livre e Inequívoco (LGPD)",
      icon: <UserCheck className="w-5 h-5 text-brand-black" />,
      content: (
        <div className="flex flex-wrap gap-2">
          {[
            "Autoriza uso do telefone",
            "Compreende os riscos",
            "Aceita plataformas externas",
            "Assume responsabilidade",
          ].map((item, i) => (
            <span
              key={i}
              className="px-4 py-2 rounded-xl bg-brand-black text-white text-[9px] font-black uppercase tracking-widest"
            >
              {item}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: "limitacao",
      title: "6. Limitação de Responsabilidade",
      icon: <Scale className="w-5 h-5 text-brand-red" />,
      content: (
        <p className="text-sm text-gray-600 leading-relaxed">
          A Meetoff não se responsabiliza por condutas de terceiros, conteúdos partilhados em grupos
          externos, uso indevido de dados pessoais ou relações/acordos realizados fora da plataforma
          oficial.
        </p>
      ),
    },
    {
      id: "regras",
      title: "7. Regras da Comunidade Meetoff",
      icon: <Users className="w-5 h-5 text-brand-black" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-green">
                Condutas Obrigatórias
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Respeitar todos os membros</li>
                <li>• Manter comunicação adequada e ética</li>
                <li>• Utilizar o grupo para fins legítimos</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-red">
                Proibições
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Contactar membros em privado sem consentimento</li>
                <li>• Assédio ou importunação</li>
                <li>• Linguagem ofensiva ou agressiva</li>
                <li>• Discriminação de qualquer natureza</li>
                <li>• Discussões políticas ou temas de conflito</li>
              </ul>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-brand-red/5 border border-brand-red/20 border-dashed">
            <div className="flex items-center gap-3 mb-4 text-brand-red font-black uppercase tracking-widest text-[10px]">
              <ShieldAlert className="w-4 h-4" /> ATENÇÃO: MENSAGENS PRIVADAS (PV)
            </div>
            <p className="text-sm text-gray-600 mb-4 font-medium">
              É expressamente proibido assédio, importunação sexual ou constrangimento em privado.
              Se ocorrer:{" "}
              <strong>Recolha provas (prints) e reporte à administração da Meetoff.</strong>
            </p>
            <div className="mt-4 p-4 rounded-xl bg-white border border-brand-red/10">
              <h5 className="text-[9px] font-black uppercase text-brand-red mb-2">
                Sanções Possíveis
              </h5>
              <p className="text-[10px] text-gray-500">
                Advertência, remoção dos grupos, banimento da plataforma ou comunicação às
                autoridades.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "responsabilidade-individual",
      title: "8. Responsabilidade Individual",
      icon: <UserCheck className="w-5 h-5 text-brand-orange" />,
      content: (
        <p className="text-sm text-gray-600">
          O utilizador é integralmente responsável por todas as suas ações, conteúdos partilhados e
          interações dentro e fora da plataforma.
        </p>
      ),
    },
    {
      id: "moderacao",
      title: "9. Moderação e Intervenção",
      icon: <Gavel className="w-5 h-5 text-brand-black" />,
      content: (
        <p className="text-sm text-gray-600">
          A Meetoff poderá, a qualquer momento e sem aviso prévio, remover conteúdos, suspender
          contas ou restringir funcionalidades quando necessário para a segurança da comunidade.
        </p>
      ),
    },
    {
      id: "crimes",
      title: "10. Crimes Digitais e Responsabilização",
      icon: <Ban className="w-5 h-5 text-brand-red" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Condutas ilícitas poderão enquadrar-se na legislação brasileira:
          </p>
          <div className="flex flex-wrap gap-2">
            {["Crimes Informáticos", "Assédio", "Fraude", "Extorsão", "Uso Indevido de Dados"].map(
              (item, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 text-[9px] font-bold text-gray-500 uppercase"
                >
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
      ),
    },
    {
      id: "autoridades",
      title: "11. Cooperação com Autoridades",
      icon: <Scale className="w-5 h-5 text-brand-black" />,
      content: (
        <p className="text-sm text-gray-600 italic">
          A Meetoff poderá preservar dados e fornecer informações mediante ordem legal, colaborando
          com investigações conforme o Art. 7º, II da LGPD.
        </p>
      ),
    },
    {
      id: "seguranca-info",
      title: "12. Segurança da Informação",
      icon: <Lock className="w-5 h-5 text-brand-green" />,
      content: (
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Monitoramento de comportamento</li>
          <li>• Controle de acessos rigoroso</li>
          <li>• Registros detalhados de atividade</li>
        </ul>
      ),
    },
    {
      id: "tratamento",
      title: "13. Tratamento de Dados (LGPD)",
      icon: <Fingerprint className="w-5 h-5 text-brand-black" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {["Segurança da Plataforma", "Prevenção de Fraudes", "Cumprimento Legal"].map(
            (item, i) => (
              <div
                key={i}
                className="p-3 text-center border border-brand-black/5 rounded-xl text-[9px] font-black uppercase text-brand-black"
              >
                {item}
              </div>
            ),
          )}
        </div>
      ),
    },
    {
      id: "direitos-art18",
      title: "14. Direitos do Titular (Art. 18 LGPD)",
      icon: <Shield className="w-5 h-5 text-brand-green" />,
      content: (
        <div className="flex flex-wrap gap-2">
          {[
            "Acessar Dados",
            "Corrigir Informações",
            "Solicitar Exclusão",
            "Revogar Consentimento",
          ].map((item, i) => (
            <span
              key={i}
              className="px-4 py-2 rounded-xl border border-brand-green/20 text-[10px] font-bold text-brand-green uppercase"
            >
              {item}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: "aceitacao-final",
      title: "15. Consentimento de Participação",
      icon: <CheckCircle2 className="w-5 h-5 text-brand-orange" />,
      content: (
        <p className="text-sm text-gray-600 italic font-medium">
          Ao participar dos grupos, o utilizador declara que leu, compreendeu e aceita integralmente
          as condições, autorizando o tratamento de dados.
        </p>
      ),
    },
    {
      id: "aviso-comunidade",
      title: "16. Aviso Importante à Comunidade",
      icon: <AlertTriangle className="w-5 h-5 text-brand-orange" />,
      content: (
        <div className="space-y-6">
          <p className="text-sm text-gray-500">
            Sua segurança é prioridade. Se alguém entrar em contacto afirmando representar a
            Meetoff:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-brand-black/5 bg-white shadow-sm">
              <Search className="w-4 h-4 text-brand-orange mb-2" />
              <h5 className="text-[9px] font-black uppercase mb-1">Verifique Sempre</h5>
              <p className="text-[10px] text-gray-400">
                A Meetoff não faz abordagens informais sem identificação clara.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-brand-black/5 bg-white shadow-sm">
              <Shield className="w-4 h-4 text-brand-red mb-2" />
              <h5 className="text-[9px] font-black uppercase mb-1">Profissionais Oficiais</h5>
              <p className="text-[10px] text-gray-400">
                Somente são válidos aqueles listados nos canais oficiais.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "finais",
      title: "17. Disposições Finais",
      icon: <HelpCircle className="w-5 h-5 text-brand-black" />,
      content: (
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• A Meetoff pode atualizar este documento a qualquer momento.</li>
          <li>• O uso contínuo implica aceitação integral.</li>
          <li>• Este documento segue a legislação brasileira.</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <SiteHeader />

      <main className="relative py-20 px-4 sm:px-8 lg:px-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-[140px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20 space-y-6">
            <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Consentimento
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-brand-black tracking-tighter uppercase leading-[0.9] mt-4">
              Uso de Grupos <br />
              <span className="text-brand-green">Externos</span> <br />
              <span className="text-brand-red">& WhatsApp</span>
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-6">
              REGRAS, NORMAS E PROTEÇÃO LEGAL • MEETOFF BRASIL
            </p>
          </div>

          {/* Intro Section */}
          <div className="glass rounded-[3rem] p-10 mb-16 border-brand-green/10 text-center">
            <h3 className="text-lg font-black text-brand-black uppercase mb-4">Aviso Legal</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto font-medium">
              A sua participação em grupos de comunicação externos vinculados à Meetoff está sujeita
              às regras e condições detalhadas abaixo. Priorize sempre a sua segurança e o respeito
              à comunidade.
            </p>
          </div>

          {/* Sections List */}
          <div className="space-y-12">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="group relative p-8 sm:p-12 rounded-[2.5rem] bg-white border border-brand-black/5 shadow-sm hover:shadow-xl transition-all duration-300 scroll-mt-32"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-brand-black/5 group-hover:bg-brand-black transition-all duration-300 [&_svg]:group-hover:text-white [&_svg]:transition-colors">
                    {section.icon}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-brand-black uppercase tracking-tight">
                    {section.title}
                  </h2>
                </div>

                <div className="text-gray-500 leading-relaxed font-medium">{section.content}</div>
              </section>
            ))}
          </div>

          {/* Final Acceptance Footer */}
          <div className="mt-20 p-12 rounded-[3.5rem] bg-brand-black text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <ShieldAlert className="w-12 h-12 text-brand-orange mx-auto mb-6" />
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-4">
                18. Aceitação Final
              </h3>
              <p className="text-white/60 text-sm max-w-xl mx-auto mb-8 leading-relaxed font-medium">
                Ao participar dos grupos e utilizar a Meetoff, o utilizador declara que leu,
                compreendeu e aceitou todas as regras. Está ciente dos riscos de comunicação externa
                e assume responsabilidade pelas suas interações.
              </p>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-red">
                Meetoff Brasil • Desligue o app. Viva o encontro.
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
