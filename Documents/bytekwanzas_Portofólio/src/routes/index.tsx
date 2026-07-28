import { createFileRoute } from "@tanstack/react-router";

import {
  ArrowRight,
  Check,
  Globe,
  Layout,
  Building2,
  ShoppingCart,
  Newspaper,
  Cog,
  Mail,
  MessageCircle,
  Shield,
  Zap,
  Users,
  Clock,
  Sparkles,
  Wrench,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ByteKwanzas — Soluções Digitais que Transformam o Seu Negócio" },
      {
        name: "description",
        content:
          "Desenvolvimento web, e-commerce, portais e sistemas personalizados em Angola. Peça já o seu orçamento gratuito à ByteKwanzas.",
      },
      { property: "og:title", content: "ByteKwanzas — Soluções Digitais que Transformam o Seu Negócio" },
      {
        property: "og:description",
        content:
          "Desenvolvimento web, e-commerce, portais e sistemas personalizados em Angola. Peça já o seu orçamento gratuito à ByteKwanzas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap",
      },
    ],
  }),
  component: Landing,
});

const WHATSAPP = "937998152";
const WHATSAPP_URL = `https://wa.me/244${WHATSAPP}?text=${encodeURIComponent(
  "Olá ByteKwanzas! Gostaria de um orçamento.",
)}`;
const EMAIL = "redaccao.semfiltros.com";

const services = [
  {
    icon: Layout,
    name: "Landing Page",
    tag: "1 página",
    price: "120.000 – 180.000",
    desc: "Página única de alto impacto para captar leads e converter visitantes.",
    features: [
      "Design responsivo e moderno",
      "Formulário de captura de contactos",
      "Optimização mobile e tablet",
      "Integração com redes sociais",
    ],
    deadline: "5 a 10 dias úteis",
    ideal: "Campanhas, lançamentos de produtos e eventos.",
  },
  {
    icon: Globe,
    name: "Site Institucional",
    tag: "até 5 páginas",
    price: "250.000 – 450.000",
    desc: "Presença profissional online sólida e credível.",
    features: [
      "Até 5 páginas personalizadas",
      "Design profissional e responsivo",
      "Painel de gestão de conteúdo",
      "Formulários integrados",
    ],
    deadline: "10 a 20 dias úteis",
    ideal: "PMEs, consultores, profissionais liberais e ONGs.",
  },
  {
    icon: Building2,
    name: "Site Empresarial",
    tag: "6 a 10 páginas",
    price: "450.000 – 800.000",
    desc: "Plataforma completa para empresas em crescimento.",
    features: [
      "Até 10 páginas com conteúdo à medida",
      "Blog integrado",
      "Área de clientes / membros",
      "Galeria de portefólio",
    ],
    deadline: "15 a 30 dias úteis",
    ideal: "Escritórios de advocacia, clínicas e consultorias.",
  },
  {
    icon: ShoppingCart,
    name: "Loja Online",
    tag: "E-commerce",
    price: "900.000 – 2.000.000+",
    desc: "Venda 24/7 com gestão completa e pagamentos integrados.",
    features: [
      "Catálogo completo de produtos",
      "Carrinho e sistema de encomendas",
      "Multicaixa Express e transferências",
      "Gestão de stock e painel admin",
    ],
    deadline: "20 a 45 dias úteis",
    ideal: "Lojas físicas, marcas, artesãos e empreendedores.",
    featured: true,
  },
  {
    icon: Newspaper,
    name: "Portal de Notícias",
    tag: "Editorial",
    price: "1.200.000 – 3.000.000+",
    desc: "Plataforma editorial robusta preparada para tráfego elevado.",
    features: [
      "Publicação e gestão editorial",
      "Categorias, tags e comentários",
      "Painel multi-editor com permissões",
      "Optimização para escala",
    ],
    deadline: "30 a 60 dias úteis",
    ideal: "Media, associações e portais temáticos.",
  },
  {
    icon: Cog,
    name: "Sistema Web Personalizado",
    tag: "Sob medida",
    price: "A partir de 2.500.000",
    desc: "Solução à medida para automatizar processos do seu negócio.",
    features: [
      "Análise de requisitos e arquitectura",
      "Funcionalidades sob medida",
      "Base de dados segura e optimizada",
      "Documentação técnica completa",
    ],
    deadline: "45 a 90+ dias úteis",
    ideal: "Gestão interna, plataformas B2B e automação.",
  },
];

const addons = [
  { name: "Registo de Domínio", price: "Conforme fornecedor" },
  { name: "Hospedagem Web (anual)", price: "80.000 – 250.000" },
  { name: "Manutenção Mensal", price: "30.000 – 150.000" },
  { name: "SEO Básico", price: "80.000 – 250.000" },
  { name: "Criação de Logótipo", price: "80.000 – 300.000" },
];

const reasons = [
  { icon: Sparkles, title: "Preços competitivos", desc: "Qualidade a preços justos para o mercado angolano." },
  { icon: Users, title: "Equipa dedicada", desc: "Profissionais focados no sucesso do seu projecto." },
  { icon: Zap, title: "Tecnologia actualizada", desc: "Stacks modernas, seguras e de alta performance." },
  { icon: Wrench, title: "Suporte pós-lançamento", desc: "Acompanhamento contínuo e manutenção." },
  { icon: Clock, title: "Prazos cumpridos", desc: "Compromisso rigoroso com as datas acordadas." },
  { icon: Shield, title: "Soluções à medida", desc: "Cada projecto personalizado ao seu negócio." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <img src="/logo.png" alt="ByteKwanzas" className="h-9 w-9 object-contain" />
            <span className="font-display font-bold text-lg tracking-tight">
              Byte<span className="text-[oklch(0.6_0.15_78)]">Kwanzas</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#servicos" className="hover:text-foreground transition-colors">Serviços</a>
            <a href="#extras" className="hover:text-foreground transition-colors">Extras</a>
            <a href="#porque" className="hover:text-foreground transition-colors">Porquê nós</a>
            <a href="#contacto" className="hover:text-foreground transition-colors">Contacto</a>
          </nav>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-brand hover:opacity-95 transition"
          >
            Orçamento
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-28 md:pt-28 md:pb-36 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.13_78)]" />
              Catálogo de Serviços 2026
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Soluções digitais que <span className="text-gradient-brand">transformam</span> o seu negócio.
            </h1>
            <p className="mt-5 text-base md:text-lg text-white/70 max-w-xl">
              Desenvolvimento web, e-commerce, portais e sistemas personalizados. Uma
              equipa angolana com conhecimento local e tecnologia de ponta.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.72_0.13_78)] px-6 py-3 text-sm font-semibold text-[oklch(0.2_0.04_258)] shadow-gold hover:brightness-105 transition"
              >
                <MessageCircle className="h-4 w-4" />
                Falar no WhatsApp
              </a>
              <a
                href="#servicos"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                Ver serviços
              </a>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { k: "6+", v: "Serviços" },
                { k: "100%", v: "Sob medida" },
                { k: "AO", v: "Made in Angola" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="text-2xl font-display font-bold text-[oklch(0.85_0.1_78)]">{s.k}</dt>
                  <dd className="text-xs uppercase tracking-wider text-white/60 mt-1">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -m-8 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent blur-2xl" />
            <div className="relative rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-md p-10 md:p-14 shadow-brand">
              <img src="/logo.png" alt="ByteKwanzas logotipo" className="mx-auto w-full max-w-xs drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicos" className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.55_0.15_258)]">Os nossos serviços</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold">Da ideia ao lançamento — cuidamos de tudo.</h2>
          <p className="mt-4 text-muted-foreground">
            Escolha o plano que melhor se adapta ao seu projecto. Todos os preços em Kwanzas (AOA) e são indicativos.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.name}
                className={`group relative flex flex-col rounded-2xl border p-7 transition hover:-translate-y-1 hover:shadow-brand ${
                  s.featured
                    ? "border-[oklch(0.72_0.13_78)]/50 bg-gradient-to-br from-white to-[oklch(0.72_0.13_78)]/5"
                    : "border-border bg-card"
                }`}
              >
                {s.featured && (
                  <span className="absolute -top-3 right-6 rounded-full bg-[oklch(0.72_0.13_78)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[oklch(0.2_0.04_258)]">
                    Popular
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {s.tag}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold">{s.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>

                <div className="mt-5 border-t border-border pt-5">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-2xl font-bold">{s.price}</span>
                    <span className="text-xs font-medium text-muted-foreground">AOA</span>
                  </div>
                </div>

                <ul className="mt-5 space-y-2 text-sm">
                  {s.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 flex-none text-[oklch(0.6_0.15_78)]" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 space-y-2 text-xs">
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {s.deadline}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground/80">Ideal para: </span>{s.ideal}
                  </p>
                </div>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-secondary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition"
                >
                  Solicitar orçamento
                  <ArrowRight className="h-4 w-4" />
                </a>
              </article>
            );
          })}
        </div>
      </section>

      {/* Add-ons */}
      <section id="extras" className="bg-secondary/50 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.55_0.15_258)]">Serviços adicionais</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold">Complemente a sua presença digital.</h2>
              <p className="mt-4 text-muted-foreground max-w-md">
                Serviços essenciais para manter a sua plataforma no ar, encontrável e alinhada à sua marca.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
              {addons.map((a) => (
                <div key={a.name} className="flex items-center justify-between p-5">
                  <span className="font-medium">{a.name}</span>
                  <span className="text-sm text-muted-foreground font-mono">{a.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section id="porque" className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.55_0.15_258)]">Porquê a ByteKwanzas</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold">Parceiros do seu sucesso digital.</h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={r.title} className="rounded-2xl border border-border bg-card p-7 hover:border-[oklch(0.72_0.13_78)]/50 transition">
                <div className="flex items-center gap-4">
                  <span className="font-display text-3xl font-bold text-[oklch(0.72_0.13_78)]/70">
                    0{i + 1}
                  </span>
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="mt-5 text-lg font-bold">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA / Contact */}
      <section id="contacto" className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.85_0.1_78)]">Contacte-nos</p>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold leading-tight">
                Vamos transformar a sua ideia numa realidade digital.
              </h2>
              <p className="mt-5 text-white/70 max-w-lg">
                Peça já o seu orçamento gratuito. A nossa equipa está pronta para analisar
                o seu projecto e propor a melhor solução tecnológica.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.72_0.13_78)] px-6 py-3 text-sm font-semibold text-[oklch(0.2_0.04_258)] shadow-gold hover:brightness-105 transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold hover:bg-white/10 transition"
                >
                  <Mail className="h-4 w-4" />
                  Enviar email
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-10 shadow-brand">
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-[oklch(0.72_0.13_78)] text-[oklch(0.2_0.04_258)]">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/50">WhatsApp</p>
                    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-1 block text-lg font-semibold hover:text-[oklch(0.85_0.1_78)]">
                      +244 937 998 152
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-white/10 text-white">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-widest text-white/50">Email</p>
                    <a href={`mailto:${EMAIL}`} className="mt-1 block text-lg font-semibold break-all hover:text-[oklch(0.85_0.1_78)]">
                      {EMAIL}
                    </a>
                  </div>
                </li>
              </ul>
              <p className="mt-8 text-xs text-white/50">
                Todos os preços são expressos em Kwanzas (AOA) e podem ser negociados
                mediante o detalhe do projecto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="h-7 w-7 object-contain" />
            <span className="font-display font-bold">ByteKwanzas</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ByteKwanzas — Soluções digitais feitas em Angola.
          </p>
        </div>
      </footer>
    </div>
  );
}
