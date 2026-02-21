const footerSections = [
  { title: "Secções", links: ["Política", "Economia", "Mundo", "Desporto", "Cultura", "Tecnologia"] },
  { title: "Opinião", links: ["Editoriais", "Colunistas", "Cartas dos Leitores", "Debates"] },
  { title: "Multimédia", links: ["Vídeos", "Podcasts", "Fotogalerias", "Infografias"] },
  { title: "Sobre", links: ["Quem Somos", "Contactos", "Publicidade", "Termos de Uso", "Política de Privacidade"] },
];

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border mt-12">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="section-divider my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-heading font-black text-xl text-foreground uppercase tracking-tight">
            OBSERVADOR
          </span>
          <span className="text-xs text-muted-foreground">
            © 2026 Observador. Todos os direitos reservados.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
