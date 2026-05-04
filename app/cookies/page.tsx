import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Cookie,
  ShieldCheck,
  Lock,
  MousePointer2,
  BarChart3,
  Settings2,
  Megaphone,
  Clock,
  ShieldAlert,
  UserCheck,
  Info,
  Globe,
  CheckCircle2,
  Ban,
  Phone,
  RefreshCw,
  FileEdit,
} from "lucide-react";

export default function CookiesPage() {
  const sections = [
    {
      id: "introducao",
      title: "1. Introdução",
      icon: <Info className="w-5 h-5 text-brand-orange" />,
      content: (
        <div className="space-y-4">
          <p>
            Esta Política de Cookies explica como a Meetoff Brasil usa cookies e tecnologias
            parecidas no seu site e aplicativos. Este documento está de acordo com a LGPD, Marco
            Civil da Internet e Código de Defesa do Consumidor.
          </p>
          <p className="text-sm font-bold text-brand-black/70 italic">
            Ao usar a plataforma, o usuário pode controlar os cookies de forma livre, clara e
            aberta.
          </p>
        </div>
      ),
    },
    {
      id: "o-que-sao",
      title: "2. O Que São Cookies",
      icon: <Cookie className="w-5 h-5 text-brand-green" />,
      content: (
        <div className="space-y-4">
          <p>
            Cookies são pequenos arquivos de texto que ficam guardados no seu dispositivo (celular,
            computador ou tablet). Esses arquivos ajudam a:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
            <li className="flex items-center gap-2">• Reconhecer você quando retorna</li>
            <li className="flex items-center gap-2">• Salvar suas preferências</li>
            <li className="flex items-center gap-2">• Melhorar a sua experiência</li>
            <li className="flex items-center gap-2">• Garantir a segurança e o funcionamento</li>
          </ul>
        </div>
      ),
    },
    {
      id: "tipos",
      title: "3. Tipos de Cookies Utilizados",
      icon: <Settings2 className="w-5 h-5 text-brand-black" />,
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-brand-black/5 border border-brand-black/5">
              <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-black mb-4">
                <Lock className="w-3 h-3" /> 3.1 Cookies Estritamente Necessários
              </h4>
              <p className="text-xs text-gray-500 mb-4">
                Essenciais para que a plataforma funcione corretamente.
              </p>
              <ul className="text-[10px] font-bold text-gray-400 space-y-1 uppercase">
                <li>• Fazer login e confirmar identidade</li>
                <li>• Proteger a sessão do usuário</li>
                <li>• Controlar acessos autorizados</li>
              </ul>
              <div className="mt-4 text-[9px] font-black text-brand-green uppercase tracking-tighter">
                Base Legal: Interesse Legítimo (Art. 7º, IX LGPD)
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-brand-green/5 border border-brand-green/10">
              <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-green mb-4">
                <BarChart3 className="w-3 h-3" /> 3.2 Cookies de Desempenho e Estatística
              </h4>
              <p className="text-xs text-gray-500 mb-4">
                Ajudam a entender como a plataforma é utilizada.
              </p>
              <ul className="text-[10px] font-bold text-gray-400 space-y-1 uppercase">
                <li>• Número de visitas</li>
                <li>• Páginas mais acessadas</li>
                <li>• Tempo que os usuários passam navegando</li>
              </ul>
              <div className="mt-4 text-[9px] font-black text-brand-orange uppercase tracking-tighter">
                Base Legal: Consentimento (Art. 7º, I LGPD)
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-brand-orange/5 border border-brand-orange/10">
              <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-orange mb-4">
                <MousePointer2 className="w-3 h-3" /> 3.3 Cookies Funcionais
              </h4>
              <p className="text-xs text-gray-500 mb-4">
                Tornam sua experiência mais personalizada.
              </p>
              <ul className="text-[10px] font-bold text-gray-400 space-y-1 uppercase">
                <li>• Idioma que você prefere usar</li>
                <li>• Configurações da sua conta</li>
                <li>• Ajustes personalizados de navegação</li>
              </ul>
              <div className="mt-4 text-[9px] font-black text-brand-green uppercase tracking-tighter">
                Base Legal: Consentimento
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-brand-red/5 border border-brand-red/10">
              <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-red mb-4">
                <Megaphone className="w-3 h-3" /> 3.4 Cookies de Marketing e Publicidade
              </h4>
              <p className="text-xs text-gray-500 mb-4">
                Usados para mostrar anúncios e conteúdos relevantes.
              </p>
              <ul className="text-[10px] font-bold text-gray-400 space-y-1 uppercase">
                <li>• Ajustar campanhas publicitárias</li>
                <li>• Estudar interação com conteúdos</li>
                <li>• Personalização de anúncios</li>
              </ul>
              <div className="mt-4 text-[9px] font-black text-brand-red uppercase tracking-tighter">
                Base Legal: Consentimento
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "consentimento",
      title: "4. Consentimento do Utilizador",
      icon: <UserCheck className="w-5 h-5 text-brand-green" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            A Meetoff disponibiliza um sistema de consentimento que permite:
          </p>
          <div className="flex flex-wrap gap-2">
            {["Aceitar todos os cookies", "Rejeitar não essenciais", "Configurar preferências"].map(
              (item, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-xl bg-brand-black text-white text-[9px] font-black uppercase tracking-widest"
                >
                  {item}
                </span>
              ),
            )}
          </div>
          <p className="text-xs text-gray-400 italic">
            O utilizador pode gerir isso no banner inicial, nas configurações ou no navegador.
          </p>
        </div>
      ),
    },
    {
      id: "gestao-retirada",
      title: "5. Gestão e Retirada do Consentimento",
      icon: <RefreshCw className="w-5 h-5 text-brand-orange" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">O utilizador pode, a qualquer momento:</p>
          <ul className="text-sm text-gray-500 space-y-2">
            <li className="flex items-center gap-2">• Mudar as suas preferências</li>
            <li className="flex items-center gap-2">• Cancelar o seu consentimento</li>
          </ul>
          <p className="text-xs text-gray-400 font-medium">
            Nota: Cancelar o consentimento não afeta as ações que já foram feitas antes.
          </p>
        </div>
      ),
    },
    {
      id: "terceiros",
      title: "6. Cookies de Terceiros",
      icon: <Globe className="w-5 h-5 text-brand-black" />,
      content: (
        <div className="p-6 rounded-[2rem] bg-white border border-brand-black/5 space-y-4">
          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            A Meetoff pode usar serviços de outras empresas que também colocam cookies, como
            plataformas de análise, serviços de comunicação e ferramentas tecnológicas. Estes
            serviços têm suas próprias políticas de privacidade.
          </p>
        </div>
      ),
    },
    {
      id: "duracao",
      title: "7. Duração dos Cookies",
      icon: <Clock className="w-5 h-5 text-brand-orange" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-brand-black/5 bg-white shadow-sm">
            <h5 className="text-[9px] font-black uppercase text-brand-black mb-1">
              Cookies de Sessão
            </h5>
            <p className="text-[10px] text-gray-400 font-medium">
              São apagados assim que você fecha o navegador.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-brand-black/5 bg-white shadow-sm">
            <h5 className="text-[9px] font-black uppercase text-brand-black mb-1">
              Cookies Persistentes
            </h5>
            <p className="text-[10px] text-gray-400 font-medium">
              Permanecem no seu dispositivo por um período específico.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "seguranca",
      title: "8. Segurança e Proteção de Dados",
      icon: <ShieldCheck className="w-5 h-5 text-brand-green" />,
      content: (
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex gap-2 items-start">
            <CheckCircle2 className="w-4 h-4 text-brand-green mt-0.5 shrink-0" /> Não coletamos
            informações pessoais sensíveis sem a sua autorização.
          </li>
          <li className="flex gap-2 items-start">
            <CheckCircle2 className="w-4 h-4 text-brand-green mt-0.5 shrink-0" /> Utilizamos métodos
            adequados para proteger as suas informações.
          </li>
          <li className="flex gap-2 items-start">
            <CheckCircle2 className="w-4 h-4 text-brand-green mt-0.5 shrink-0" /> Dados seguros
            contra acessos não autorizados.
          </li>
        </ul>
      ),
    },
    {
      id: "direitos",
      title: "9. Direitos do Utilizador (LGPD)",
      icon: <ShieldAlert className="w-5 h-5 text-brand-red" />,
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            "Ver seus dados",
            "Pedir correção",
            "Pedir exclusão",
            "Retirar autorização",
            "Informações de uso",
          ].map((item, i) => (
            <div
              key={i}
              className="p-3 text-center border border-brand-red/10 bg-brand-red/5 rounded-xl text-[9px] font-black uppercase text-brand-red"
            >
              {item}
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "alteracoes",
      title: "10. Alterações à Política",
      icon: <FileEdit className="w-5 h-5 text-brand-black" />,
      content: (
        <p className="text-sm text-gray-500 font-medium">
          A Meetoff pode mudar esta Política quando necessário. As mudanças serão informadas na
          nossa plataforma para garantir total transparência.
        </p>
      ),
    },
    {
      id: "contatos",
      title: "11. Contatos Oficiais",
      icon: <Phone className="w-5 h-5 text-brand-black" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-gray-500 font-medium">
          <div className="space-y-2">
            <p>
              <strong>E-mail:</strong> suporte@meetoff.com.br
            </p>
            <p>
              <strong>Brasil:</strong> +55 67 99223-6484
            </p>
          </div>
          <div className="space-y-2">
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
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-[140px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20 space-y-6">
            <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Tecnologia
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-brand-black tracking-tighter uppercase leading-[0.9] mt-4">
              Política de <br />
              <span className="text-brand-green">Cookies</span> <br />
              <span className="text-brand-red">& Navegação</span>
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-8">
              CONEXÕES TRANSPARENTES • MEETOFF BRASIL
            </p>
          </div>

          {/* Intro Section */}
          <div className="glass rounded-[3rem] p-10 mb-16 border-brand-green/10 text-center">
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto font-medium">
              Utilizamos cookies para melhorar sua experiência, garantir a segurança da plataforma e
              personalizar conteúdos de acordo com suas preferências. Você tem total liberdade para
              gerir suas escolhas a qualquer momento.
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

          {/* Final Statement Card */}
          <div className="mt-20 p-12 rounded-[3.5rem] bg-brand-black text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <CheckCircle2 className="w-12 h-12 text-brand-green mx-auto mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">
                Declaração Final
              </h3>
              <p className="text-white/60 text-sm max-w-xl mx-auto mb-8 leading-relaxed font-medium text-pretty">
                Ao continuar a utilizar a Meetoff, o utilizador declara que compreende que usamos
                cookies para melhorar sua experiência, concorda em seguir esta política e tem a
                liberdade de alterar suas escolhas quando quiser.
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
