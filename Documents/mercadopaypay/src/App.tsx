import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import CreateListingPage from "./pages/CreateListingPage.tsx";
import ListingDetailPage from "./pages/ListingDetailPage.tsx";
import MyListingsPage from "./pages/MyListingsPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import FavoritesPage from "./pages/FavoritesPage.tsx";
import ConversationsPage from "./pages/ConversationsPage.tsx";
import ChatPage from "./pages/ChatPage.tsx";
import PlansPage from "./pages/PlansPage.tsx";
import InfoPage from "./pages/InfoPage.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminUsers from "./pages/AdminUsers.tsx";
import AdminListings from "./pages/AdminListings.tsx";
import AdminCategories from "./pages/AdminCategories.tsx";
import AdminSettings from "./pages/AdminSettings.tsx";
import AdminRoute from "@/components/AdminRoute";
import SupportWidget from "./components/SupportWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/buscar" element={<SearchPage />} />
            <Route path="/anuncio/:id" element={<ListingDetailPage />} />
            <Route path="/planos" element={<PlansPage />} />
            <Route path="/sobre" element={<InfoPage title="Quem Somos" content={
              <div className="space-y-4">
                <p>O <strong>Mercado PayPay</strong> é a principal plataforma de compra e venda conectando a comunidade lusófona global.</p>
                <p>Nossa missão é facilitar o comércio entre <strong>Angola, Brasil, Portugal, Moçambique, Cabo Verde</strong> e todos os países de Língua Oficial Portuguesa, oferecendo uma plataforma segura, rápida e intuitiva.</p>
              </div>
            } />} />
            <Route path="/termos" element={<InfoPage title="Termos de Uso" content={
              <div className="space-y-4">
                <p>Ao utilizar o Mercado PayPay, você concorda com nossos termos de serviço. Somos uma plataforma de classificados e não nos responsabilizamos pelas transações diretas entre usuários.</p>
                <p>Recomendamos sempre realizar negócios em locais públicos e verificar o produto antes do pagamento.</p>
              </div>
            } />} />
            <Route path="/privacidade" element={<InfoPage title="Privacidade" content={
              <div className="space-y-4">
                <p>Valorizamos sua privacidade. Seus dados pessoais são utilizados exclusivamente para o funcionamento da plataforma e nunca são compartilhados com terceiros sem seu consentimento.</p>
              </div>
            } />} />
            <Route path="/ajuda" element={<InfoPage title="Central de Ajuda" content={
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">Como vender?</h3>
                <p>Basta clicar em "Anunciar", preencher os dados do seu produto e publicar. Novos usuários desfrutam de 3 meses grátis!</p>
                <h3 className="text-lg font-bold text-foreground">Filtro Regional</h3>
                <p>Use o seletor de países no cabeçalho para ver anúncios específicos da sua região ou de outros países lusófonos.</p>
                <h3 className="text-lg font-bold text-foreground">Segurança</h3>
                <p>Nunca envie dinheiro adiantado sem ver o produto pessoalmente.</p>
              </div>
            } />} />
            <Route path="/contato" element={<InfoPage title="Contato" content={
              <div className="space-y-4">
                <p>Precisa de ajuda? Entre em contato com nosso suporte global:</p>
                <p className="font-bold text-primary">Email: suporte@mercadopaypay.com</p>
                <p className="font-bold text-primary">Atendimento multi-regional disponível.</p>
              </div>
            } />} />
            <Route path="/anunciar" element={<ProtectedRoute><CreateListingPage /></ProtectedRoute>} />
            <Route path="/meus-anuncios" element={<ProtectedRoute><MyListingsPage /></ProtectedRoute>} />
            <Route path="/favoritos" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
            <Route path="/mensagens" element={<ProtectedRoute><ConversationsPage /></ProtectedRoute>} />
            <Route path="/mensagens/:id" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/usuarios" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/anuncios" element={<AdminRoute><AdminListings /></AdminRoute>} />
            <Route path="/admin/categorias" element={<AdminRoute><AdminCategories /></AdminRoute>} />
            <Route path="/admin/configuracoes" element={<AdminRoute><AdminSettings /></AdminRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <SupportWidget />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
