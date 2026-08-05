import { useNavigate } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, MessageSquare } from "lucide-react";
import { useSiteConfig } from "@/hooks/useSiteConfig";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const { facebookUrl, instagramUrl, youtubeUrl, contactEmail, whatsappNumber, copyrightText } = useSiteConfig();

  return (
    <footer className="bg-black text-white py-12 px-4 border-t border-white/10">
      <div className="container max-w-4xl mx-auto flex flex-col items-center">

        {/* Social Icons */}
        <div className="flex items-center gap-4 mb-8">
          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300 group"
            >
              <Facebook className="w-5 h-5 text-white" />
            </a>
          )}
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>
          )}
          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300"
            >
              <Youtube className="w-5 h-5 text-white" />
            </a>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10">
          <button
            onClick={() => navigate("/")}
            className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors"
          >
            Página Inicial
          </button>
          <button
            onClick={() => navigate("/sobre-nos")}
            className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors"
          >
            Sobre Nós
          </button>
          <button
            onClick={() => navigate("/equipa-editorial")}
            className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors"
          >
            Equipa Editorial
          </button>
          <button
            onClick={() => navigate("/linha-editorial")}
            className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors"
          >
            Linha Editorial
          </button>
          <button
            onClick={() => navigate("/fact-checking")}
            className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors"
          >
            Fact-Checking
          </button>
          <button
            onClick={() => navigate("/correcoes")}
            className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors"
          >
            Correções
          </button>
          <button
            onClick={() => navigate("/ficha-tecnica")}
            className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors"
          >
            Ficha Técnica e Contactos
          </button>
        </nav>

        {/* Secondary Links & Contacts */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-8 text-white/60 text-xs">
          {contactEmail && (
            <a href={`mailto:${contactEmail}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5" />
              {contactEmail}
            </a>
          )}
          {whatsappNumber && (
            <a href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <MessageSquare className="w-3.5 h-3.5" />
              {whatsappNumber}
            </a>
          )}
          <button onClick={() => navigate("/termos")} className="hover:text-white transition-colors">
            Termos de Uso
          </button>
          <button onClick={() => navigate("/privacidade")} className="hover:text-white transition-colors">
            Política de Privacidade
          </button>
        </div>

        {/* Copyright */}
        <div className="text-center text-white/40 text-[11px] select-none">
          <p>© {currentYear} Todos os Direitos Reservados. <span className="font-bold text-white/60">{copyrightText}</span></p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
