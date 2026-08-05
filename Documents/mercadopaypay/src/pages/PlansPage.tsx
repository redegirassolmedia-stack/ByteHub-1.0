import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Check, CreditCard, MessageCircle, Zap } from "lucide-react";
import Footer from "@/components/Footer";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegion } from "@/hooks/useRegion";

const PlansPage = () => {
    const { startTrial } = useSubscription();
    const navigate = useNavigate();
    const { selectedCountry } = useRegion();

    const { user } = useSubscription() as any; // Need to check if user is available in useSubscription or useAuth

    const handleStartTrial = async () => {
        if (!user) {
            toast.error("Você precisa estar logado para ativar o teste.");
            navigate("/auth");
            return;
        }

        try {
            await startTrial();
            toast.success("Teste de 3 meses ativado com sucesso!");
            navigate("/");
        } catch (error: any) {
            toast.error("Erro ao ativar teste: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container py-16">
                <div className="text-center max-w-2xl mx-auto mb-16 px-4">
                    <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Impulsione suas Vendas</h1>
                    <p className="text-muted-foreground text-lg">
                        Escolha o plano ideal para expandir seu negócio no Mercado PayPay.
                        <br />
                        <span className="font-bold text-primary">Os primeiros 3 meses são inteiramente grátis!</span>
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
                    {/* Free Plan */}
                    <div className="rounded-3xl border p-8 bg-card flex flex-col hover:border-primary/50 transition-colors">
                        <h2 className="text-2xl font-bold mb-2">Plano Grátis</h2>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-extrabold">{selectedCountry.currency} 0</span>
                            <span className="text-muted-foreground">/mês</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1 text-sm">
                            <li className="flex gap-3 items-center text-muted-foreground">
                                <Check className="h-5 w-5 text-green-500" /> 1 Anúncio por dia
                            </li>
                            <li className="flex gap-3 items-center text-muted-foreground">
                                <Check className="h-5 w-5 text-green-500" /> Sem acesso ao Chat
                            </li>
                            <li className="flex gap-3 items-center text-muted-foreground">
                                <Check className="h-5 w-5 text-green-500" /> Contatos ocultos
                            </li>
                        </ul>
                        <Button variant="outline" className="w-full" disabled>Plano Atual</Button>
                    </div>

                    {/* Premium Plan */}
                    <div className="rounded-3xl border-2 border-primary p-8 bg-card flex flex-col relative overflow-hidden shadow-xl hover:shadow-primary/10 transition-shadow">
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold uppercase py-1 px-4 rounded-bl-xl tracking-widest">
                            Recomendado
                        </div>
                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary fill-current" /> Premium
                        </h2>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-extrabold text-primary">Consulte</span>
                            <span className="text-muted-foreground">/trimestre</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1 text-sm font-medium">
                            <li className="flex gap-3 items-center">
                                <Check className="h-5 w-5 text-primary" /> Anúncios ilimitados
                            </li>
                            <li className="flex gap-3 items-center">
                                <Check className="h-5 w-5 text-primary" /> Chat para interação com clientes
                            </li>
                            <li className="flex gap-3 items-center">
                                <Check className="h-5 w-5 text-primary" /> Contactos visíveis nas publicações
                            </li>
                            <li className="flex gap-3 items-center">
                                <Check className="h-5 w-5 text-primary" /> Destaque nas buscas
                            </li>
                        </ul>
                        <Button
                            className="w-full font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95"
                            onClick={handleStartTrial}
                        >
                            Começar Teste de 3 Meses
                        </Button>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-24 max-w-3xl mx-auto px-4">
                    <h3 className="text-2xl font-bold text-center mb-10">Métodos de Pagamento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-muted/40 p-6 rounded-2xl border flex flex-col items-center text-center">
                            <CreditCard className="h-8 w-8 text-primary mb-3" />
                            <h4 className="font-bold mb-2">Referência</h4>
                            <p className="text-xs text-muted-foreground">Instruções para pagamento via Multicaixa.</p>
                        </div>
                        <div className="bg-muted/40 p-6 rounded-2xl border flex flex-col items-center text-center">
                            <img src="/logo.png" alt="PayPay" className="h-8 w-auto mb-3 grayscale brightness-0" />
                            <h4 className="font-bold mb-2">PayPay</h4>
                            <p className="text-xs text-muted-foreground">Transferência direta e rápida.</p>
                        </div>
                        <div className="bg-muted/40 p-6 rounded-2xl border flex flex-col items-center text-center">
                            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-3">A</div>
                            <h4 className="font-bold mb-2">Airtm</h4>
                            <p className="text-xs text-muted-foreground">Pagamentos internacionais simples.</p>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-2xl text-center">
                        <p className="text-sm text-muted-foreground">
                            Para ativar seu plano, entre em contacto com o suporte após realizar o pagamento através de um dos métodos acima.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PlansPage;
