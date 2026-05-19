import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Shield,
  FileText,
  Lock,
  Users,
  Scale,
  CreditCard,
  Ban,
  Globe,
  MousePointer2,
  Copyright,
  Zap,
  UserX,
  Gavel,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      id: "introducao",
      title: "1. Introdução",
      icon: <Globe className="w-5 h-5 text-brand-orange" />,
      content: (
        <div className="space-y-4">
          <p>
            A Meetoff Brasil é uma plataforma digital inovadora criada para promover conexões reais,
            encontros presenciais, networking, comunidades e experiências autênticas, valorizando a
            interação humana além do ambiente digital.
          </p>
          <div className="bg-brand-black/5 p-6 rounded-2xl border border-brand-black/5">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-black mb-4">
              Legislação Aplicável
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-medium text-gray-600">
              <li className="flex items-center gap-2">• Lei Geral de Proteção de Dados (LGPD)</li>
              <li className="flex items-center gap-2">• Marco Civil da Internet</li>
              <li className="flex items-center gap-2">• Código de Defesa do Consumidor (CDC)</li>
              <li className="flex items-center gap-2">• Lei de Direitos Autorais</li>
            </ul>
          </div>
          <p className="text-sm font-bold text-brand-black/70 italic">
            Ao utilizar a plataforma, o usuário concorda integralmente com estes termos.
          </p>
        </div>
      ),
    },
    {
      id: "definicoes",
      title: "2. Definições",
      icon: <FileText className="w-5 h-5 text-brand-green" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Plataforma", desc: "Aplicativo e website da Meetoff" },
            { label: "Usuário", desc: "Pessoa física ou jurídica cadastrada" },
            { label: "Dados Pessoais", desc: "Informações que identificam o usuário" },
            { label: "Serviços", desc: "Funcionalidades oferecidas pela Meetoff" },
            { label: "Parceiros", desc: "Empresas e profissionais vinculados" },
            { label: "Segurança", desc: "Medidas adotadas para proteger informações" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 p-4 rounded-xl bg-white/50 border border-brand-black/5"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-black">
                {item.label}
              </span>
              <span className="text-sm text-gray-500">{item.desc}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "coleta",
      title: "3. Coleta e Proteção de Dados",
      icon: <Lock className="w-5 h-5 text-brand-red" />,
      content: (
        <div className="space-y-8">
          <p>
            A Meetoff realiza a coleta de dados de forma transparente, segura e conforme a LGPD.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-red">
                Dados Coletados
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Nome, e-mail, telefone</li>
                <li>• Localização (consentimento)</li>
                <li>• Preferências e interesses</li>
                <li>• Dados de uso da plataforma</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-green">
                Finalidades
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Personalização da experiência</li>
                <li>• Segurança e antifraude</li>
                <li>• Comunicação com usuário</li>
                <li>• Conformidade legal</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-orange">
                Medidas
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Criptografia de dados</li>
                <li>• Controle de acesso</li>
                <li>• Monitoramento contínuo</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "direitos",
      title: "4. Direitos dos Usuários",
      icon: <Users className="w-5 h-5 text-brand-black" />,
      content: (
        <div className="flex flex-wrap gap-2">
          {[
            "Acessar Dados",
            "Corrigir/Atualizar",
            "Solicitar Exclusão",
            "Revogar Consentimento",
          ].map((text, i) => (
            <span
              key={i}
              className="px-4 py-2 rounded-xl bg-brand-black text-white text-[9px] font-black uppercase tracking-widest shadow-lg"
            >
              {text}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: "cookies",
      title: "5. Cookies",
      icon: <MousePointer2 className="w-5 h-5 text-brand-orange" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Cookies são utilizados para garantir segurança, autenticação e melhorar a experiência do
            usuário. Você pode:
          </p>
          <div className="flex gap-3">
            <div className="px-4 py-2 border border-brand-black/5 rounded-lg text-[9px] font-bold uppercase">
              Aceitar
            </div>
            <div className="px-4 py-2 border border-brand-black/5 rounded-lg text-[9px] font-bold uppercase">
              Rejeitar
            </div>
            <div className="px-4 py-2 border border-brand-black/5 rounded-lg text-[9px] font-bold uppercase">
              Configurar
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "funcionalidades",
      title: "6. Funcionalidades da Meetoff",
      icon: <Zap className="w-5 h-5 text-brand-green" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-black/40">
              Perfis e Comunidades
            </h4>
            <p className="text-xs text-gray-500">
              • Perfis personalizados <br /> • Comunidades e eventos
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-black/40">
              Pontos de Encontro
            </h4>
            <p className="text-xs text-gray-500">
              • PEF (Encontro) <br /> • PRF (Referência)
            </p>
          </div>
          <div className="sm:col-span-2 space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-black/40">
              Serviços e Produtos
            </h4>
            <p className="text-xs text-gray-500">
              Cartões NFC/QR Code, Networking, Consultorias, Produtos Digitais e Eventos.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "responsabilidades",
      title: "7. Responsabilidades da Meetoff",
      icon: <Scale className="w-5 h-5 text-brand-red" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            A Meetoff compromete-se com a proteção de dados, transparência e segurança da
            plataforma.
          </p>
          <div className="p-4 rounded-xl bg-brand-red/5 border border-brand-red/10">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-red mb-2">
              Limitações
            </h4>
            <p className="text-xs text-gray-500">
              Não nos responsabilizamos por ações de terceiros, conteúdos de usuários ou danos
              indiretos.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "obrigacoes",
      title: "8. Obrigações dos Usuários",
      icon: <CheckCircle2 className="w-5 h-5 text-brand-green" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-green">
              Deveres
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Fornecer dados verdadeiros</li>
              <li>• Respeitar outros usuários</li>
              <li>• Utilizar a plataforma legalmente</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-red">
              Proibições
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Prática de fraudes</li>
              <li>• Assédio ou desrespeito</li>
              <li>• Violação de direitos</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "propriedade",
      title: "9. Propriedade Intelectual",
      icon: <Copyright className="w-5 h-5 text-brand-black" />,
      content: (
        <p className="text-sm text-gray-600 leading-relaxed">
          Todo o sistema, marca e conteúdos da Meetoff são protegidos por lei. É expressamente
          proibida a reprodução sem autorização prévia.
        </p>
      ),
    },
    {
      id: "terceiros",
      title: "10. Serviços de Terceiros",
      icon: <Globe className="w-5 h-5 text-brand-orange" />,
      content: (
        <p className="text-sm text-gray-600 leading-relaxed">
          A Meetoff pode integrar serviços externos (pagamentos, vídeo, localização). Não somos
          responsáveis pelas políticas de privacidade de tais terceiros.
        </p>
      ),
    },
    {
      id: "financeiro",
      title: "11. Aspectos Financeiros",
      icon: <CreditCard className="w-5 h-5 text-brand-green" />,
      content: (
        <p className="text-sm text-gray-600">
          Serviços pagos podem incluir assinaturas, inscrições em eventos, compra de produtos ou
          serviços de parceiros.
        </p>
      ),
    },
    {
      id: "cancelamento",
      title: "12. Cancelamento de Conta",
      icon: <UserX className="w-5 h-5 text-brand-red" />,
      content: (
        <p className="text-sm text-gray-600">
          O usuário possui o direito de solicitar a exclusão de sua conta e dados pessoais a
          qualquer momento.
        </p>
      ),
    },
    {
      id: "seguranca-digital",
      title: "13. Segurança Digital",
      icon: <Ban className="w-5 h-5 text-brand-red" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Violações às práticas rigorosas de segurança podem gerar:
          </p>
          <div className="flex gap-2">
            {["Suspensão", "Banimento", "Ações Legais"].map((item, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-xl bg-brand-red text-white text-[9px] font-black uppercase tracking-widest"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "conformidade",
      title: "14. Conformidade Legal",
      icon: <Shield className="w-5 h-5 text-brand-black" />,
      content: (
        <p className="text-sm text-gray-600">
          A Meetoff opera estritamente conforme a LGPD, Marco Civil, CDC e Leis de Direitos
          Autorais.
        </p>
      ),
    },
    {
      id: "foro",
      title: "15. Foro",
      icon: <Gavel className="w-5 h-5 text-brand-black" />,
      content: (
        <p className="text-sm text-gray-600">
          Fica eleito o foro brasileiro para a resolução de quaisquer conflitos decorrentes destes
          termos.
        </p>
      ),
    },
    {
      id: "gerais",
      title: "16. Disposições Gerais",
      icon: <HelpCircle className="w-5 h-5 text-brand-black" />,
      content: (
        <p className="text-sm text-gray-600">
          A Meetoff reserva-se o direito de atualizar estes termos a qualquer momento para refletir
          mudanças legais ou operacionais.
        </p>
      ),
    },
    {
      id: "institucional",
      title: "17. Dados Institucionais",
      icon: <AlertCircle className="w-5 h-5 text-brand-orange" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-gray-500 font-medium">
          <div className="space-y-2">
            <p>
              <strong>Fundadores:</strong> João Carlos, Alesca de Labernarde
            </p>
            <p>
              <strong>Web:</strong> www.meetoff.com.br <br /> www.desligueoappvivaoencontro.com
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <strong>E-mail:</strong> suporte@meetoff.com.br
            </p>
            <p>
              <strong>Endereço:</strong> Rua das Amapolas, nº 554, Campo Grande - MS
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <SiteHeader />

      <main className="relative py-20 px-4 sm:px-8 lg:px-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20 space-y-4">
            <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Jurídico
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-brand-black tracking-tighter uppercase leading-none mt-4">
              Privacidade <br />
              <span className="text-brand-red">& Termos</span> <br />
              <span className="text-brand-green">de Uso</span>
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-8">
              ÚLTIMA ATUALIZAÇÃO: MAIO DE 2026 • MEETOFF BRASIL
            </p>
          </div>

          {/* Sumário */}
          <div className="glass rounded-[3rem] p-8 mb-16 border-brand-black/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black mb-6">
              Estrutura do Documento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
              {sections.map((section, i) => (
                <a
                  key={i}
                  href={`#${section.id}`}
                  className="text-[11px] font-bold text-gray-400 hover:text-brand-red transition-colors flex items-center gap-2 uppercase tracking-tight"
                >
                  <div className="w-1 h-1 rounded-full bg-brand-black/10" />
                  {section.title}
                </a>
              ))}
            </div>
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

          {/* Footer Card - Point 18 */}
          <div className="mt-20 p-12 rounded-[3.5rem] bg-brand-black text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="relative z-10">
              <Shield className="w-12 h-12 text-brand-red mx-auto mb-6" />
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">
                18. Aceitação dos Termos
              </h3>
              <p className="text-white/60 text-sm max-w-xl mx-auto mb-8 leading-relaxed font-medium text-pretty">
                Ao utilizar a Meetoff, o usuário declara que leu e concorda integralmente com estes
                termos, autoriza o uso de dados conforme a LGPD e compromete-se com um uso
                responsável e ético da plataforma.
              </p>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange">
                Meetoff Brasil • Conexões com Propósito
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
