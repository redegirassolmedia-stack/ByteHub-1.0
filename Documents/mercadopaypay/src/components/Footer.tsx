import { usePWAInstall } from "@/hooks/usePWAInstall";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Footer = () => {
  const { isInstallable, install } = usePWAInstall();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleDownload = () => {
    if (isInstallable) {
      install();
    } else {
      toast.info("Para baixar o app, use a opção 'Adicionar à tela de início' no menu do seu navegador.", {
        duration: 5000,
      });
    }
  };

  return (
    <footer className="border-t bg-card mt-12">
      <div className="container py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h4 className="font-bold text-foreground mb-3">Sobre</h4>
          <ul className="space-y-2 text-muted-foreground whitespace-nowrap">
            <li><a href="/sobre" className="hover:text-foreground transition-colors">Quem somos</a></li>
            <li><a href="/ajuda" className="hover:text-foreground transition-colors">Central de ajuda</a></li>
            <li><a href="/termos" className="hover:text-foreground transition-colors">Termos de uso</a></li>
            <li><a href="/privacidade" className="hover:text-foreground transition-colors">Privacidade</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-3">Expansão Lusófona</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li className="text-[11px]">🌍 Angola, Brasil, Portugal</li>
            <li className="text-[11px]">🌍 Moçambique e Cabo Verde</li>
            <li className="text-[11px]">🌍 Guiné-Bissau e São Tomé</li>
            <li className="text-[11px]">🌍 Timor-Leste</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-3">Categorias</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href="/buscar?categoria=autos" className="hover:text-foreground transition-colors">Autos e peças</a></li>
            <li><a href="/buscar?categoria=imoveis" className="hover:text-foreground transition-colors">Imóveis</a></li>
            <li><a href="/buscar?categoria=eletronicos" className="hover:text-foreground transition-colors">Eletrônicos</a></li>
            <li><a href="/buscar?categoria=servicos" className="hover:text-foreground transition-colors">Serviços</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-3">Baixe o app</h4>
          <p className="text-muted-foreground mb-3">Compre e venda de qualquer lugar.</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleDownload}
              className="rounded-lg bg-foreground px-4 py-2 text-xs font-bold text-background hover:opacity-90 transition-opacity"
            >
              Google Play
            </button>
            <button
              onClick={handleDownload}
              className="rounded-lg bg-foreground px-4 py-2 text-xs font-bold text-background hover:opacity-90 transition-opacity"
            >
              App Store
            </button>
          </div>
        </div>
      </div>
      <div className="border-t py-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo.png" alt="Mercado PayPay" className="h-12 w-auto transition-transform hover:scale-105" />
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <span
                className="cursor-default hover:text-primary transition-colors select-none opacity-50"
                onClick={() => navigate("/admin")}
                title="Acesso Restrito"
              >
                ©
              </span>
              2026 Mercado PayPay. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2 mt-2 hover:scale-105 transition-transform">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Desenvolvido por</span>
              <img src="/bytekwanza-logo.png" alt="Bytekwanza" className="h-8 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
