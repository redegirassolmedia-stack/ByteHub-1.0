import React, { useState, useEffect } from "react";
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
  ExternalLink,
  GraduationCap,
  Hotel,
  UtensilsCrossed,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ByteKwanza — Soluções Digitais que Transformam o Seu Negócio" },
      {
        name: "description",
        content:
          "Desenvolvimento web, e-commerce, portais e sistemas personalizados em Angola. Peça já o seu orçamento gratuito à ByteKwanza.",
      },
      {
        property: "og:title",
        content: "ByteKwanza — Soluções Digitais que Transformam o Seu Negócio",
      },
      {
        property: "og:description",
        content:
          "Desenvolvimento web, e-commerce, portais e sistemas personalizados em Angola. Peça já o seu orçamento gratuito à ByteKwanza.",
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
  "Olá ByteKwanza! Gostaria de um orçamento.",
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
  {
    icon: GraduationCap,
    name: "Sistema Escolar",
    tag: "Educação",
    price: "1.500.000 – 4.000.000+",
    desc: "Plataforma completa de gestão escolar: matrículas, notas, turmas e comunicação com encarregados.",
    features: [
      "Matrículas e gestão de alunos",
      "Lançamento de notas e pautas",
      "Controlo de presenças e faltas",
      "Portal do encarregado de educação",
      "Emissão de declarações e boletins",
      "Gestão de turmas e horários",
    ],
    deadline: "45 a 90 dias úteis",
    ideal: "Escolas primárias, colégios privados e institutos.",
  },
  {
    icon: Hotel,
    name: "Sistema de Hospedaria",
    tag: "Hotelaria",
    price: "1.800.000 – 5.000.000+",
    desc: "Gestão completa de reservas, check-in/out, quartos e facturação para hotéis e residenciais.",
    features: [
      "Reservas online e gestão de quartos",
      "Check-in / check-out digital",
      "Controlo de ocupação em tempo real",
      "Facturação e relatórios financeiros",
      "Gestão de funcionários e turnos",
      "Integração com canais de reserva",
    ],
    deadline: "45 a 90 dias úteis",
    ideal: "Hotéis, residenciais, pensões e apart-hotéis.",
  },
  {
    icon: UtensilsCrossed,
    name: "Sistema de Restaurante",
    tag: "F&B",
    price: "800.000 – 2.500.000+",
    desc: "PDV, gestão de mesas, pedidos em tempo real, stock e relatórios de vendas para restaurantes.",
    features: [
      "Ponto de venda (PDV) táctil",
      "Gestão de mesas e reservas",
      "Pedidos em tempo real para cozinha",
      "Controlo de stock e ingredientes",
      "Relatórios de vendas e facturação",
      "Gestão de colaboradores e turnos",
    ],
    deadline: "30 a 60 dias úteis",
    ideal: "Restaurantes, cafés, snacks e bares.",
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
  {
    icon: Sparkles,
    title: "Preços competitivos",
    desc: "Qualidade a preços justos para o mercado angolano.",
  },
  {
    icon: Users,
    title: "Equipa dedicada",
    desc: "Profissionais focados no sucesso do seu projecto.",
  },
  {
    icon: Zap,
    title: "Tecnologia actualizada",
    desc: "Stacks modernas, seguras e de alta performance.",
  },
  { icon: Wrench, title: "Suporte pós-lançamento", desc: "Acompanhamento contínuo e manutenção." },
  { icon: Clock, title: "Prazos cumpridos", desc: "Compromisso rigoroso com as datas acordadas." },
  { icon: Shield, title: "Soluções à medida", desc: "Cada projecto personalizado ao seu negócio." },
];

const portfolio = [
  {
    name: "+Kumbú",
    url: "https://makemoney.social.br/",
    display: "makemoney.social.br",
    screenshot: "/makemoney-preview.png",
    desc: "Plataforma angolana onde trabalhadores ganham dinheiro ao completar tarefas de marketing, e clientes promovem as suas redes sociais e negócios através de uma comunidade activa.",
    tags: ["Plataforma", "Marketing Social", "Angola"],
    accent: "oklch(0.65_0.18_150)",
  },
  {
    name: "Sem Filtros",
    url: "https://www.semfiltros.com",
    display: "semfiltros.com",
    screenshot: "/semfiltros-preview.png",
    desc: "Portal de notícias angolano independente com cobertura jornalística sem censura e conteúdos de actualidade.",
    tags: ["Portal de Notícias", "Editorial", "Angola"],
    accent: "oklch(0.65_0.18_25)",
  },
];

type Token = { cls: string; text: string };
type CodeLine = Token[];

const C = {
  kw: "oklch(0.72 0.18 295)", // purple  – keywords
  tag: "oklch(0.65 0.15 220)", // blue    – tags / imports
  str: "oklch(0.72 0.18 148)", // green   – strings
  fn: "oklch(0.85 0.15 90)", // yellow  – function names
  attr: "oklch(0.75 0.14 185)", // teal    – attributes / props
  val: "oklch(0.78 0.18 45)", // orange  – values / numbers
  cmt: "oklch(0.45 0.02 258)", // gray    – comments
  txt: "oklch(0.88 0.02 258)", // white   – plain text
  acc: "oklch(0.72 0.13 78)", // gold    – brand accent
};

const codeSnippets: {
  lang: string;
  file: string;
  badge: string;
  badgeColor: string;
  lines: CodeLine[];
}[] = [
  {
    lang: "TSX",
    file: "Hero.tsx",
    badge: "React",
    badgeColor: C.tag,
    lines: [
      [
        { cls: C.kw, text: "import" },
        { cls: C.txt, text: " { " },
        { cls: C.attr, text: "useState" },
        { cls: C.txt, text: " } " },
        { cls: C.kw, text: "from" },
        { cls: C.str, text: " 'react'" },
        { cls: C.txt, text: ";" },
      ],
      [],
      [{ cls: C.cmt, text: "// ByteKwanza — Hero Section" }],
      [
        { cls: C.kw, text: "export function" },
        { cls: C.txt, text: " " },
        { cls: C.fn, text: "Hero" },
        { cls: C.txt, text: "() {" },
      ],
      [
        { cls: C.txt, text: "  " },
        { cls: C.kw, text: "return" },
        { cls: C.txt, text: " (" },
      ],
      [
        { cls: C.txt, text: "    " },
        { cls: C.tag, text: "<section" },
        { cls: C.txt, text: " " },
        { cls: C.attr, text: "className" },
        { cls: C.txt, text: "=" },
        { cls: C.str, text: '"hero-gradient"' },
        { cls: C.tag, text: ">" },
      ],
      [
        { cls: C.txt, text: "      " },
        { cls: C.tag, text: "<h1" },
        { cls: C.txt, text: " " },
        { cls: C.attr, text: "className" },
        { cls: C.txt, text: "=" },
        { cls: C.str, text: '"title"' },
        { cls: C.tag, text: ">" },
      ],
      [{ cls: C.txt, text: "        Soluções Digitais 🇦🇴" }],
      [
        { cls: C.txt, text: "      " },
        { cls: C.tag, text: "</h1>" },
      ],
      [
        { cls: C.txt, text: "      " },
        { cls: C.tag, text: "<button" },
        { cls: C.txt, text: " " },
        { cls: C.attr, text: "onClick" },
        { cls: C.txt, text: "={" },
        { cls: C.fn, text: "handleCTA" },
        { cls: C.txt, text: "}" },
      ],
      [
        { cls: C.txt, text: "        className=" },
        { cls: C.str, text: '"cta-btn"' },
        { cls: C.tag, text: ">" },
      ],
      [{ cls: C.txt, text: "        Orçamento Gratuito ✨" }],
      [
        { cls: C.txt, text: "      " },
        { cls: C.tag, text: "</button>" },
      ],
      [
        { cls: C.txt, text: "    " },
        { cls: C.tag, text: "</section>" },
      ],
      [{ cls: C.txt, text: "  );" }],
      [{ cls: C.txt, text: "}" }],
    ],
  },
  {
    lang: "CSS",
    file: "styles.css",
    badge: "Design",
    badgeColor: C.str,
    lines: [
      [{ cls: C.cmt, text: "/* ByteKwanza — Design System */" }],
      [],
      [
        { cls: C.fn, text: ".hero-gradient" },
        { cls: C.txt, text: " {" },
      ],
      [
        { cls: C.txt, text: "  " },
        { cls: C.attr, text: "background" },
        { cls: C.txt, text: ": " },
        { cls: C.fn, text: "linear-gradient" },
        { cls: C.txt, text: "(" },
      ],
      [
        { cls: C.txt, text: "    " },
        { cls: C.val, text: "135deg" },
        { cls: C.txt, text: ", " },
        { cls: C.str, text: "#0a0e1a" },
        { cls: C.txt, text: ", " },
        { cls: C.str, text: "#1a2040" },
      ],
      [{ cls: C.txt, text: "  );" }],
      [
        { cls: C.txt, text: "  " },
        { cls: C.attr, text: "display" },
        { cls: C.txt, text: ": " },
        { cls: C.val, text: "grid" },
        { cls: C.txt, text: ";" },
      ],
      [
        { cls: C.txt, text: "  " },
        { cls: C.attr, text: "place-items" },
        { cls: C.txt, text: ": " },
        { cls: C.val, text: "center" },
        { cls: C.txt, text: ";" },
      ],
      [{ cls: C.txt, text: "}" }],
      [],
      [
        { cls: C.fn, text: ".cta-btn" },
        { cls: C.txt, text: " {" },
      ],
      [
        { cls: C.txt, text: "  " },
        { cls: C.attr, text: "background" },
        { cls: C.txt, text: ": " },
        { cls: C.str, text: "oklch(0.72 0.13 78)" },
        { cls: C.txt, text: ";" },
      ],
      [
        { cls: C.txt, text: "  " },
        { cls: C.attr, text: "border-radius" },
        { cls: C.txt, text: ": " },
        { cls: C.val, text: "9999px" },
        { cls: C.txt, text: ";" },
      ],
      [
        { cls: C.txt, text: "  " },
        { cls: C.attr, text: "font-weight" },
        { cls: C.txt, text: ": " },
        { cls: C.val, text: "700" },
        { cls: C.txt, text: ";" },
      ],
      [
        { cls: C.txt, text: "  " },
        { cls: C.attr, text: "transition" },
        { cls: C.txt, text: ": " },
        { cls: C.val, text: "all 0.2s ease" },
        { cls: C.txt, text: ";" },
      ],
      [{ cls: C.txt, text: "}" }],
    ],
  },
  {
    lang: "JSON",
    file: "package.json",
    badge: "Config",
    badgeColor: C.val,
    lines: [
      [{ cls: C.txt, text: "{" }],
      [
        { cls: C.txt, text: "  " },
        { cls: C.str, text: '"name"' },
        { cls: C.txt, text: ": " },
        { cls: C.val, text: '"bytekwanza-ao"' },
        { cls: C.txt, text: "," },
      ],
      [
        { cls: C.txt, text: "  " },
        { cls: C.str, text: '"version"' },
        { cls: C.txt, text: ": " },
        { cls: C.val, text: '"2.0.0"' },
        { cls: C.txt, text: "," },
      ],
      [
        { cls: C.txt, text: "  " },
        { cls: C.str, text: '"author"' },
        { cls: C.txt, text: ": " },
        { cls: C.val, text: '"ByteKwanza 🇦🇴"' },
        { cls: C.txt, text: "," },
      ],
      [
        { cls: C.txt, text: "  " },
        { cls: C.str, text: '"license"' },
        { cls: C.txt, text: ": " },
        { cls: C.val, text: '"MIT"' },
        { cls: C.txt, text: "," },
      ],
      [
        { cls: C.txt, text: "  " },
        { cls: C.str, text: '"scripts"' },
        { cls: C.txt, text: ": {" },
      ],
      [
        { cls: C.txt, text: "    " },
        { cls: C.str, text: '"dev"' },
        { cls: C.txt, text: ": " },
        { cls: C.val, text: '"vite"' },
        { cls: C.txt, text: "," },
      ],
      [
        { cls: C.txt, text: "    " },
        { cls: C.str, text: '"build"' },
        { cls: C.txt, text: ": " },
        { cls: C.val, text: '"vite build"' },
        { cls: C.txt, text: "," },
      ],
      [
        { cls: C.txt, text: "    " },
        { cls: C.str, text: '"deploy"' },
        { cls: C.txt, text: ": " },
        { cls: C.val, text: '"gh-pages -d dist"' },
      ],
      [{ cls: C.txt, text: "  }," }],
      [
        { cls: C.txt, text: "  " },
        { cls: C.str, text: '"dependencies"' },
        { cls: C.txt, text: ": {" },
      ],
      [
        { cls: C.txt, text: "    " },
        { cls: C.str, text: '"react"' },
        { cls: C.txt, text: ": " },
        { cls: C.val, text: '"^18.3.0"' },
        { cls: C.txt, text: "," },
      ],
      [
        { cls: C.txt, text: "    " },
        { cls: C.str, text: '"typescript"' },
        { cls: C.txt, text: ": " },
        { cls: C.val, text: '"^5.5.0"' },
      ],
      [{ cls: C.txt, text: "  }" }],
      [{ cls: C.txt, text: "}" }],
    ],
  },
];

function CodeTerminal() {
  const [sIdx, setSIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pause" | "fading">("typing");
  const [opacity, setOpacity] = useState(1);
  const [blink, setBlink] = useState(true);

  const snippet = codeSnippets[sIdx];

  // cursor blink
  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(t);
  }, []);

  // typing engine
  useEffect(() => {
    if (phase === "pause") {
      const t = setTimeout(() => setPhase("fading"), 2200);
      return () => clearTimeout(t);
    }
    if (phase === "fading") {
      setOpacity(0);
      const t = setTimeout(() => {
        setSIdx((p) => (p + 1) % codeSnippets.length);
        setLineIdx(0);
        setCharIdx(0);
        setOpacity(1);
        setPhase("typing");
      }, 600);
      return () => clearTimeout(t);
    }

    const currentLine = snippet.lines[lineIdx];
    if (!currentLine) {
      // advance to next line
      const t = setTimeout(() => {
        if (lineIdx + 1 >= snippet.lines.length) {
          setPhase("pause");
        } else {
          setLineIdx((l) => l + 1);
          setCharIdx(0);
        }
      }, 55);
      return () => clearTimeout(t);
    }
    const lineText = currentLine.map((tk) => tk.text).join("");
    if (charIdx >= lineText.length) {
      const t = setTimeout(() => {
        if (lineIdx + 1 >= snippet.lines.length) {
          setPhase("pause");
        } else {
          setLineIdx((l) => l + 1);
          setCharIdx(0);
        }
      }, 60);
      return () => clearTimeout(t);
    }
    // type next char – vary speed for realism
    const speed = lineText[charIdx] === " " ? 18 : Math.random() < 0.08 ? 90 : 28;
    const t = setTimeout(() => setCharIdx((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [phase, lineIdx, charIdx, snippet, sIdx]);

  // render a fully visible line
  const renderFull = (line: CodeLine, li: number) => (
    <div key={li} className="flex">
      <span
        style={{
          color: C.cmt,
          minWidth: "2rem",
          textAlign: "right",
          paddingRight: "1rem",
          userSelect: "none",
          opacity: 0.35,
        }}
      >
        {li + 1}
      </span>
      <span>
        {line.map((tk, ti) => (
          <span key={ti} style={{ color: tk.cls }}>
            {tk.text}
          </span>
        ))}
      </span>
    </div>
  );

  // render the current (partial) line
  const renderPartial = (line: CodeLine, li: number, chars: number) => {
    let remaining = chars;
    const spans: React.ReactNode[] = [];
    for (let ti = 0; ti < line.length; ti++) {
      if (remaining <= 0) break;
      const t = line[ti];
      const visible = t.text.slice(0, remaining);
      remaining -= t.text.length;
      spans.push(
        <span key={ti} style={{ color: t.cls }}>
          {visible}
        </span>,
      );
    }
    return (
      <div key={li} className="flex">
        <span
          style={{
            color: C.cmt,
            minWidth: "2rem",
            textAlign: "right",
            paddingRight: "1rem",
            userSelect: "none",
            opacity: 0.35,
          }}
        >
          {li + 1}
        </span>
        <span>
          {spans}
          <span
            style={{
              display: "inline-block",
              width: "2px",
              height: "1em",
              background: C.acc,
              verticalAlign: "text-bottom",
              opacity: blink ? 1 : 0,
              transition: "opacity 0.1s",
            }}
          />
        </span>
      </div>
    );
  };

  return (
    <div className="relative select-none">
      {/* ambient glow */}
      <div
        className="absolute inset-0 -m-10 rounded-[3rem] blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 60% 40%, ${snippet.badgeColor}25 0%, transparent 65%)`,
          transition: "background 0.6s",
        }}
      />

      {/* floating badges */}
      {[
        { text: "🇦🇴 Made in Angola", pos: "-top-5 right-4", delay: "0s" },
        { text: "✓ Entregue a tempo", pos: "-bottom-5 left-4", delay: "0.5s" },
        { text: "⚡ Alta performance", pos: "-left-5 top-1/3", delay: "1s" },
      ].map((b) => (
        <div
          key={b.text}
          className={`absolute ${b.pos} z-20 rounded-full border border-white/20 bg-white/8 backdrop-blur-md px-3 py-1.5 text-[11px] font-semibold text-white/80 shadow-lg whitespace-nowrap`}
          style={{ animation: "tkBadge 3.2s ease-in-out infinite", animationDelay: b.delay }}
        >
          {b.text}
        </div>
      ))}

      {/* editor window */}
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)]"
        style={{ background: "oklch(0.11 0.02 258)", transition: "opacity 0.55s", opacity }}
      >
        {/* title bar */}
        <div
          className="flex items-center gap-3 px-4 py-2.5 border-b border-white/8"
          style={{ background: "oklch(0.14 0.02 258)" }}
        >
          <div className="flex gap-1.5">
            {["#f87171", "#fbbf24", "#4ade80"].map((c) => (
              <div
                key={c}
                className="h-3 w-3 rounded-full"
                style={{ background: c, opacity: 0.75 }}
              />
            ))}
          </div>
          {/* tabs */}
          {codeSnippets.map((s, i) => (
            <div
              key={s.file}
              className="px-3 py-1 rounded-md text-[11px] font-mono transition-all duration-300"
              style={{
                background: i === sIdx ? "oklch(0.18 0.03 258)" : "transparent",
                color: i === sIdx ? C.txt : C.cmt,
                borderBottom: i === sIdx ? `1px solid ${s.badgeColor}` : "1px solid transparent",
              }}
            >
              {s.file}
            </div>
          ))}
          <div
            className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{
              background: `${snippet.badgeColor}25`,
              color: snippet.badgeColor,
              border: `1px solid ${snippet.badgeColor}40`,
            }}
          >
            {snippet.badge}
          </div>
        </div>

        {/* code area */}
        <div
          className="p-4 font-mono text-[12px] leading-[1.75] overflow-hidden"
          style={{ minHeight: "280px" }}
        >
          {snippet.lines.map((line, li) => {
            if (li < lineIdx) return renderFull(line, li);
            if (li === lineIdx) return renderPartial(line, li, charIdx);
            return null;
          })}
        </div>

        {/* status bar */}
        <div
          className="flex items-center gap-4 px-4 py-1.5 border-t border-white/8 text-[10px] font-mono"
          style={{ background: snippet.badgeColor, color: "oklch(0.1 0.02 258)" }}
        >
          <span className="font-bold">{snippet.lang}</span>
          <span className="opacity-70">UTF-8</span>
          <span className="opacity-70">
            Ln {lineIdx + 1}, Col {charIdx + 1}
          </span>
          <span className="ml-auto font-bold">ByteKwanza © 2026</span>
        </div>
      </div>

      <style>{`
        @keyframes tkBadge {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <img src="/logo.png" alt="ByteKwanza" className="h-9 w-9 object-contain" />
            <span className="font-display font-bold text-lg tracking-tight">
              Byte<span className="text-[oklch(0.6_0.15_78)]">Kwanza</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#servicos" className="hover:text-foreground transition-colors">
              Serviços
            </a>
            <a href="#extras" className="hover:text-foreground transition-colors">
              Extras
            </a>
            <a href="#portfolio" className="hover:text-foreground transition-colors">
              Portfólio
            </a>
            <a href="#porque" className="hover:text-foreground transition-colors">
              Porquê nós
            </a>
            <a href="#contacto" className="hover:text-foreground transition-colors">
              Contacto
            </a>
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
              Soluções digitais que <span className="text-gradient-brand">transformam</span> o seu
              negócio.
            </h1>
            <p className="mt-5 text-base md:text-lg text-white/70 max-w-xl">
              Desenvolvimento web, e-commerce, portais e sistemas personalizados. Uma equipa
              angolana com conhecimento local e tecnologia de ponta.
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
                  <dt className="text-2xl font-display font-bold text-[oklch(0.85_0.1_78)]">
                    {s.k}
                  </dt>
                  <dd className="text-xs uppercase tracking-wider text-white/60 mt-1">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <CodeTerminal />
        </div>
      </section>

      {/* Services */}
      <section id="servicos" className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.55_0.15_258)]">
            Os nossos serviços
          </p>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold">
            Da ideia ao lançamento — cuidamos de tudo.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Escolha o plano que melhor se adapta ao seu projecto. Todos os preços em Kwanzas (AOA) e
            são indicativos.
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
                    <span className="font-semibold text-foreground/80">Ideal para: </span>
                    {s.ideal}
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
              <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.55_0.15_258)]">
                Serviços adicionais
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold">
                Complemente a sua presença digital.
              </h2>
              <p className="mt-4 text-muted-foreground max-w-md">
                Serviços essenciais para manter a sua plataforma no ar, encontrável e alinhada à sua
                marca.
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

      {/* Portfolio */}
      <section id="portfolio" className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.55_0.15_258)]">
            Trabalhos realizados
          </p>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold">Sites que já lançámos.</h2>
          <p className="mt-4 text-muted-foreground">
            Projectos reais desenvolvidos pela ByteKwanza — clique para visitar.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {portfolio.map((p) => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:-translate-y-1 hover:shadow-brand transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden bg-muted" style={{ aspectRatio: "16/9" }}>
                <img
                  src={p.screenshot}
                  alt={`Pré-visualização de ${p.name}`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                    (e.currentTarget.parentElement as HTMLElement).style.background =
                      `linear-gradient(135deg, ${p.accent}22 0%, oklch(0.15 0.02 258) 100%)`;
                  }}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900">
                    Visitar site <ExternalLink className="h-3.5 w-3.5" />
                  </span>
                </div>
                {/* Colour bar top */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: p.accent }}
                />
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold">{p.name}</h3>
                    <p className="text-sm text-muted-foreground font-mono mt-0.5">{p.display}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-none mt-1 group-hover:text-foreground transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section id="porque" className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.55_0.15_258)]">
            Porquê a ByteKwanza
          </p>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold">Parceiros do seu sucesso digital.</h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <div
                key={r.title}
                className="rounded-2xl border border-border bg-card p-7 hover:border-[oklch(0.72_0.13_78)]/50 transition"
              >
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
              <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.85_0.1_78)]">
                Contacte-nos
              </p>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold leading-tight">
                Vamos transformar a sua ideia numa realidade digital.
              </h2>
              <p className="mt-5 text-white/70 max-w-lg">
                Peça já o seu orçamento gratuito. A nossa equipa está pronta para analisar o seu
                projecto e propor a melhor solução tecnológica.
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
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block text-lg font-semibold hover:text-[oklch(0.85_0.1_78)]"
                    >
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
                    <a
                      href={`mailto:${EMAIL}`}
                      className="mt-1 block text-lg font-semibold break-all hover:text-[oklch(0.85_0.1_78)]"
                    >
                      {EMAIL}
                    </a>
                  </div>
                </li>
              </ul>
              <p className="mt-8 text-xs text-white/50">
                Todos os preços são expressos em Kwanzas (AOA) e podem ser negociados mediante o
                detalhe do projecto.
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
            <span className="font-display font-bold">ByteKwanza</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ByteKwanza — Soluções digitais feitas em Angola.
          </p>
          <p className="text-xs text-muted-foreground/60">NIF: 5003198294</p>
        </div>
      </footer>
    </div>
  );
}
