import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  ShieldCheck,
  Lock,
  Search,
  Users,
  Phone,
  MapPin,
  CreditCard,
  Heart,
  AlertCircle,
  LifeBuoy,
  Info,
  Shield,
  Globe,
  MessageSquare,
  Fingerprint,
  Map,
} from "lucide-react";

export default function SecurityPage() {
  const sections = [
    {
      id: "conta",
      title: "1. Criação de uma Conta Segura",
      icon: <Lock className="w-5 h-5 text-brand-orange" />,
      content: (
        <div className="space-y-4">
          <p>Para começar com segurança na nossa comunidade:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
            <li>• Utilize uma senha forte e única</li>
            <li>• Não partilhe os seus dados de acesso</li>
            <li>• Nunca forneça sua senha a terceiros</li>
            <li>• Utilize apenas os canais oficiais da Meetoff</li>
            <li>• Desconfie de mensagens ou links suspeitos</li>
          </ul>
          <div className="p-4 rounded-xl bg-brand-red/5 border border-brand-red/10 text-[10px] font-black uppercase tracking-widest text-brand-red">
            ⚠ A Meetoff nunca solicita senhas por e-mail, WhatsApp ou mensagens privadas.
          </div>
        </div>
      ),
    },
    {
      id: "perfis",
      title: "2. Identificação de Perfis Suspeitos",
      icon: <Search className="w-5 h-5 text-brand-green" />,
      content: (
        <div className="space-y-4">
          <p>Fique atento a comportamentos fora do padrão que podem indicar riscos:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
            <li>• Perfis incompletos ou inconsistentes</li>
            <li>• Informações contraditórias</li>
            <li>• Excesso de confiança muito rápido</li>
            <li>• Pedidos financeiros ou propostas incomuns</li>
            <li>• Evitam encontros reais, chamadas ou eventos</li>
          </ul>
          <p className="text-xs text-brand-orange font-bold uppercase tracking-tight">
            Sempre utilize as ferramentas de denúncia da Meetoff.
          </p>
        </div>
      ),
    },
    {
      id: "grupos",
      title: "3. Segurança em Grupos e Comunidades",
      icon: <MessageSquare className="w-5 h-5 text-brand-orange" />,
      content: (
        <div className="space-y-4">
          <p>
            A Meetoff oferece comunidades temáticas, grupos (incluindo WhatsApp) e fóruns. Boas
            práticas:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-brand-black/5 bg-white/50">
              <ul className="text-xs text-gray-500 space-y-2">
                <li>• Respeite as regras do grupo</li>
                <li>• Evite partilhar dados sensíveis</li>
                <li>• Não divulgue informações de terceiros</li>
                <li>• Mantenha uma comunicação ética</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "comunicacao",
      title: "4. Comunicação Segura",
      icon: <Phone className="w-5 h-5 text-brand-red" />,
      content: (
        <div className="space-y-4">
          <p>
            Antes de confiar plenamente, prefira os canais internos da Meetoff. Evite partilhar:
          </p>
          <div className="flex flex-wrap gap-2">
            {["Endereço Residencial", "Documentos Pessoais", "Informações Financeiras"].map(
              (text, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-xl bg-brand-black text-white text-[9px] font-black uppercase tracking-widest"
                >
                  {text}
                </span>
              ),
            )}
          </div>
          <p className="text-sm font-bold text-brand-black/70 italic mt-2">
            Sua privacidade deve ser sempre prioridade.
          </p>
        </div>
      ),
    },
    {
      id: "eventos",
      title: "5. Segurança em Eventos",
      icon: <Users className="w-5 h-5 text-brand-black" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-green">
              Eventos Online
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Utilize plataformas oficiais</li>
              <li>• Não partilhe links privados</li>
              <li>• Verifique sempre a origem</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-red">
              Eventos Presenciais
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Prefira locais públicos</li>
              <li>• Informe alguém de confiança</li>
              <li>• Controle seus pertences</li>
              <li>• Organize seu transporte</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "pef-prf",
      title: "6. PEF e PRF (Encontros Seguros)",
      icon: <MapPin className="w-5 h-5 text-brand-orange" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-brand-orange/5 border border-brand-orange/10">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-2">
              Ponto de Encontro (PEF)
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              • Locais cadastrados para encontros <br /> • Ambientes estruturados e seguros
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-brand-green/5 border border-brand-green/10">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-green mb-2">
              Ponto de Referência (PRF)
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              • Locais seguros definidos <br /> • Registro de horário, data e local
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "networking",
      title: "7. Relacionamentos, Networking e Negócios",
      icon: <CreditCard className="w-5 h-5 text-brand-green" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Construa confiança gradualmente em todas as interações:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
            <li>• Evite decisões impulsivas</li>
            <li>• Formalize acordos com cautela</li>
            <li>• Nunca faça transferências sem verificação</li>
            <li>• Construa confiança gradualmente</li>
          </ul>
        </div>
      ),
    },
    {
      id: "cartao",
      title: "8. Cartão de Identificação Meetoff",
      icon: <Fingerprint className="w-5 h-5 text-brand-red" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Oferecemos cartões com QR Code e NFC. Fique atento:
          </p>
          <div className="p-4 rounded-xl border border-brand-red/10 bg-brand-red/5">
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Informações podem ser acessadas por terceiros</li>
              <li>• Use com responsabilidade</li>
              <li>• Controle quem pode visualizar seus dados</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "lgpd",
      title: "9. Proteção de Dados (LGPD)",
      icon: <Shield className="w-5 h-5 text-brand-black" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            A Meetoff atua conforme a Lei nº 13.709/2018. O utilizador deve:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              "Evitar exposição excessiva",
              "Controlar o que partilha",
              "Gerir sua privacidade",
            ].map((item, i) => (
              <div
                key={i}
                className="p-3 text-center border border-brand-black/5 rounded-xl text-[9px] font-black uppercase text-brand-black"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "viagens",
      title: "10. Segurança em Viagens e Interações",
      icon: <Map className="w-5 h-5 text-brand-orange" />,
      content: (
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Evite partilhar localização exata com desconhecidos</li>
          <li>• Informe-se sobre o local do encontro</li>
          <li>• Tenha atenção ao ambiente</li>
          <li>• Respeite diferenças culturais</li>
        </ul>
      ),
    },
    {
      id: "suporte",
      title: "11. Denúncia e Suporte",
      icon: <LifeBuoy className="w-5 h-5 text-brand-red" />,
      content: (
        <div className="p-6 rounded-2xl bg-brand-black text-white">
          <p className="text-sm text-white/70 mb-4">
            Se algo parecer errado ou presenciar comportamentos suspeitos:
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 p-4 rounded-xl bg-white/10 border border-white/10">
              <h5 className="text-[9px] font-black uppercase mb-1">Ferramentas App</h5>
              <p className="text-[10px] text-white/50">
                Utilize as ferramentas de denúncia da plataforma.
              </p>
            </div>
            <div className="flex-1 p-4 rounded-xl bg-white/10 border border-white/10">
              <h5 className="text-[9px] font-black uppercase mb-1">Suporte Oficial</h5>
              <p className="text-[10px] text-white/50">suporte@meetoff.com.br</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "boas-praticas",
      title: "12. Boas Práticas Essenciais",
      icon: <Heart className="w-5 h-5 text-brand-red" />,
      content: (
        <div className="flex flex-wrap gap-2">
          {[
            "Vá com calma",
            "Confie na sua intuição",
            "Defina limites",
            "Mantenha controlo",
            "Priorize sua segurança",
          ].map((item, i) => (
            <span
              key={i}
              className="px-5 py-3 rounded-2xl bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest"
            >
              {item}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: "resumo",
      title: "13. Resumo",
      icon: <ShieldCheck className="w-5 h-5 text-brand-green" />,
      content: (
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Conexões reais e comunidades fortes</li>
          <li>• Relacionamentos saudáveis</li>
          <li>• Networking seguro</li>
          <li className="font-bold text-brand-black mt-2">
            A segurança começa sempre com cada utilizador.
          </li>
        </ul>
      ),
    },
    {
      id: "institucional",
      title: "14. Contactos Oficiais",
      icon: <Globe className="w-5 h-5 text-brand-black" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-gray-500 font-medium">
          <div className="space-y-2">
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
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <SiteHeader />

      <main className="relative py-20 px-4 sm:px-8 lg:px-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20 space-y-6">
            <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Central de Segurança
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-brand-black tracking-tighter uppercase leading-[0.9] mt-4">
              Guia de <br />
              <span className="text-brand-red">Segurança</span> <br />
              <span className="text-brand-orange">& Proteção</span>
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-8 max-w-2xl mx-auto">
              CONEXÕES REAIS, SEGURAS E RESPONSÁVEIS • DESLIGUE O APP, VIVA O ENCONTRO.
            </p>
          </div>

          {/* Intro Section */}
          <div className="glass rounded-[3rem] p-10 mb-16 border-brand-green/10 text-center">
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              A Meetoff Brasil foi criada com o propósito de promover encontros reais e experiências
              presenciais. Tal como em qualquer ambiente online, a segurança depende tanto da
              plataforma quanto das atitudes do utilizador.
            </p>
          </div>

          {/* All 14 Sections */}
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

          {/* Final Message */}
          <div className="mt-20 p-12 rounded-[3.5rem] bg-brand-black text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="relative z-10">
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">
                Viva o Encontro
              </h3>
              <p className="text-white/80 text-sm max-w-xl mx-auto mb-8 leading-relaxed font-medium text-pretty">
                Na Meetoff, acreditamos que cada encontro pode transformar vidas. Com
                responsabilidade, consciência e atenção, você poderá viver experiências reais,
                seguras e positivas.
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
