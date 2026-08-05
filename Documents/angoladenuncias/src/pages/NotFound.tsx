import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOMetadata } from "@/components/SEOMetadata";
import { Home, Search, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { getCategorySlug } from "@/constants/categories";

const NotFound = () => {
  const navigate = useNavigate();
  const [recentArticles, setRecentArticles] = useState<any[]>([]);

  useEffect(() => {
    // Load recent articles to provide helpful links
    const load = async () => {
      const { data } = await supabase
        .from("news_articles")
        .select("id, slug, title, category")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(4);
      if (data) setRecentArticles(data);
    };
    load();
  }, []);

  const categories = [
    { name: "Política", slug: "politica" },
    { name: "Economia", slug: "economia" },
    { name: "Sociedade", slug: "sociedade" },
    { name: "Internacional", slug: "internacional" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOMetadata
        title="Página Não Encontrada (404) | Sem Filtros"
        description="A página que procura não existe ou foi removida. Navegue pelo Sem Filtros para encontrar as últimas notícias de Angola."
        url="https://www.semfiltros.com/404"
      />
      <Header />

      <main className="container py-20 max-w-3xl mx-auto text-center">
        <div className="animate-fade-in">
          {/* 404 visual */}
          <div className="relative mb-10 inline-block">
            <span className="text-[120px] font-black font-heading text-primary/10 leading-none select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-16 h-16 text-primary/40" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-black text-foreground mb-4">
            Página Não Encontrada
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            A página que procura não existe, foi movida ou o endereço foi escrito incorrectamente.
            Mas há muita informação importante por descobrir no Sem Filtros.
          </p>

          {/* Primary CTA */}
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors mb-14"
          >
            <Home className="w-4 h-4" />
            Voltar à Página Inicial
          </button>

          {/* Recent Articles */}
          {recentArticles.length > 0 && (
            <section className="mb-12 text-left">
              <h2 className="text-xl font-heading font-bold text-foreground mb-6 text-center">
                Últimas Notícias
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentArticles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => navigate(`/${getCategorySlug(article.category)}/${article.slug}`)}
                    className="p-4 bg-secondary border border-border rounded-xl text-left group hover:border-primary/50 transition-all"
                  >
                    <span className="news-category-badge mb-2 inline-block text-xs">{article.category}</span>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-2 text-xs text-primary font-medium">
                      Ler artigo <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Category Links */}
          <section>
            <h2 className="text-xl font-heading font-bold text-foreground mb-6">
              Navegar por Categoria
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => navigate(`/${cat.slug}`)}
                  className="px-5 py-2.5 border border-border rounded-full text-sm font-semibold hover:border-primary hover:text-primary transition-all"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
