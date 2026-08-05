import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { categories, getCategorySlug } from "@/constants/categories";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import ArticleDetail from "./pages/ArticleDetail";
import OpinionDetail from "./pages/OpinionDetail";
import DigitalEditions from "./pages/DigitalEditions";
import DigitalNewspaperTemplate from "./pages/DigitalNewspaperTemplate";
import AdvertisingPage from "./pages/AdvertisingPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import VideosPage from "./pages/VideosPage";
import ServicesPage from "./pages/ServicesPage";
import EditorialLinePage from "./pages/EditorialLinePage";
import TechnicalSheetPage from "./pages/TechnicalSheetPage";
import AboutPage from "./pages/AboutPage";
import FactCheckingPage from "./pages/FactCheckingPage";
import CorrectionsPage from "./pages/CorrectionsPage";
import EditorialTeamPage from "./pages/EditorialTeamPage";
import { ThemeProvider } from "@/components/ThemeProvider";
import SecurityLayer from "@/components/SecurityLayer";
import CookieConsent from "@/components/CookieConsent";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import SiteValidation from "@/components/SiteValidation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme" attribute="class">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SecurityLayer>
              <Routes>
                <Route path="/" element={<Index defaultCategory="Destaque" />} />
                <Route path="/category/:id" element={<Index />} />
                {categories.map((cat) => {
                  if (cat === "Destaque" || cat === "Opinião") return null;
                  return (
                    <Route
                      key={cat}
                      path={`/${getCategorySlug(cat)}`}
                      element={<Index defaultCategory={cat} />}
                    />
                  );
                })}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/gerar-jornal" element={<DigitalNewspaperTemplate />} />
                <Route path="/opinioes" element={<Index defaultCategory="Opinião" />} />
                <Route path="/edicao-digital" element={<DigitalEditions />} />
                <Route path="/publicidade" element={<AdvertisingPage />} />
                <Route path="/videos" element={<VideosPage />} />
                <Route path="/servicos" element={<ServicesPage />} />
                <Route path="/linha-editorial" element={<EditorialLinePage />} />
                <Route path="/ficha-tecnica" element={<TechnicalSheetPage />} />
                <Route path="/termos" element={<TermsPage />} />
                <Route path="/privacidade" element={<PrivacyPage />} />
                <Route path="/sobre-nos" element={<AboutPage />} />
                <Route path="/fact-checking" element={<FactCheckingPage />} />
                <Route path="/correcoes" element={<CorrectionsPage />} />
                <Route path="/equipa-editorial" element={<EditorialTeamPage />} />
                <Route path="/article/:id" element={<ArticleDetail />} />
                <Route path="/opinion/:id" element={<OpinionDetail />} />
                <Route path="/:category/:slug" element={<ArticleDetail />} />
                <Route path="/opiniao/:slug" element={<OpinionDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CookieConsent />
              <AnalyticsTracker />
              <SiteValidation />
            </SecurityLayer>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
