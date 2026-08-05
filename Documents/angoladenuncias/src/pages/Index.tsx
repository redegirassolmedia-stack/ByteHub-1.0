import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "@/components/Header";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";
import HeroSection from "@/components/HeroSection";
import NewsGrid from "@/components/NewsGrid";
import VideoSection, { VideoItem } from "@/components/VideoSection";
import Footer from "@/components/Footer";
import RadioPlayer from "@/components/RadioPlayer";
import AdBanner from "@/components/AdBanner";

import { SEOMetadata } from "@/components/SEOMetadata";
import { supabase } from "@/integrations/supabase/client";
import { formatRelativeDate, withTimeout } from "@/lib/utils";
import { NewsArticle } from "@/components/NewsCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import HighlightsModal from "@/components/HighlightsModal";

import { categories, getCategorySlug } from "@/constants/categories";

interface IndexProps {
  defaultCategory?: string;
}

const Index = ({ defaultCategory }: IndexProps) => {
  const { id: categoryParam } = useParams();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("Destaque");

  useEffect(() => {
    // Priority 1: URL param (e.g. /category/política)
    if (categoryParam) {
      const decoded = decodeURIComponent(categoryParam);
      const found = categories.find(c => c.toLowerCase() === decoded.toLowerCase());
      if (found) { setSelectedCategory(found); return; }
    }
    // Priority 2: Navigation state from footer/header link (e.g. navigate("/", { state: { category: "Economia" } }))
    const stateCategory = (location.state as any)?.category;
    if (stateCategory) {
      const found = categories.find(c => c.toLowerCase() === stateCategory.toLowerCase());
      if (found) { setSelectedCategory(found); return; }
    }
    // Priority 3: defaultCategory prop
    if (defaultCategory) {
      setSelectedCategory(defaultCategory);
    }
  }, [categoryParam, defaultCategory, location.state]);

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [opinions, setOpinions] = useState<any[]>([]);
  const [breakingHeadlines, setBreakingHeadlines] = useState<{ id: string; title: string }[]>([]);
  const [tickerSpeed, setTickerSpeed] = useState(30);
  const [loading, setLoading] = useState(true);

  // Carregamento de dados estáticos (apenas uma vez)
  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const { data: breakingRes } = await supabase
          .from("breaking_news")
          .select("id, text, active")
          .eq("active", true)
          .order("created_at", { ascending: false });

        if (breakingRes && breakingRes.length > 0) {
          setBreakingHeadlines(breakingRes.map((b: any) => ({
            id: b.id,
            title: b.text,
            category: "Última Hora",
            // Note: breaking_news table might not have slugs, 
            // but we add fields to stay consistent with the interface
          })));
        } else {
          // Fallback: buscar as 10 últimas notícias publicadas
          const now = new Date().toISOString();
          const { data: latestNews } = await supabase
            .from("news_articles")
            .select("id, title, category, slug")
            .eq("published", true)
            .or(`scheduled_at.is.null,scheduled_at.lte.${now}`)
            .order("created_at", { ascending: false })
            .limit(10);

          if (latestNews) {
            setBreakingHeadlines(latestNews.map((n: any) => ({
              id: n.id,
              title: n.title,
              category: n.category,
              slug: n.slug,
              categorySlug: getCategorySlug(n.category)
            })));
          }
        }

        const { data: tickerSettings } = await supabase.from("system_settings").select("value").eq("key", "ticker").single();
        if (tickerSettings?.value && typeof tickerSettings.value === 'object') {
          const value = tickerSettings.value as any;
          if (value.speed) setTickerSpeed(Number(value.speed));
        }
      } catch (err) {
        console.error("Erro ao carregar dados estáticos:", err);
      }
    };
    fetchStaticData();
  }, []);

  // Carregamento de artigos dinâmico (sempre que a categoria mudar)
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        console.log(`Buscando artigos para: ${selectedCategory}`);

        // Criar as promessas para execução paralela
        const now = new Date().toISOString();
        let newsQuery = supabase
          .from("news_articles")
          .select("id, slug, title, summary, category, image_url, created_at, author, published, scheduled_at")
          .eq("published", true)
          .or(`scheduled_at.is.null,scheduled_at.lte.${now}`)
          .order("created_at", { ascending: false });

        if (selectedCategory !== "Destaque") {
          newsQuery = newsQuery.eq("category", selectedCategory);
        }

        const newsPromise = withTimeout(newsQuery.limit(60), 15000);

        const opinionsPromise = (selectedCategory === "Destaque" || selectedCategory === "Opinião")
          ? withTimeout(
            supabase.from("opinion_articles")
              .select("id, slug, title, author, created_at, scheduled_at")
              .eq("published", true)
              .or(`scheduled_at.is.null,scheduled_at.lte.${now}`)
              .order("created_at", { ascending: false })
              .limit(selectedCategory === "Opinião" ? 40 : 5),
            15000
          )
          : Promise.resolve({ data: [] });

        const videosPromise = (selectedCategory === "Destaque")
          ? withTimeout(
            supabase.from("video_news")
              .select("id, title, description, thumbnail_url, video_url, duration, views, category")
              .order("created_at", { ascending: false })
              .limit(16),
            15000
          )
          : Promise.resolve({ data: [] });

        // Executar todas em paralelo
        const [newsRes, opinionsRes, videosRes] = await Promise.all([
          newsPromise,
          opinionsPromise,
          videosPromise
        ]) as any[];

        // 1. Processar Notícias
        if (newsRes.data) {
          setArticles(newsRes.data.map((a: any) => ({
            id: a.id,
            slug: a.slug,
            title: a.title,
            summary: a.summary,
            category: a.category,
            categorySlug: getCategorySlug(a.category),
            image: a.image_url || "https://images.unsplash.com/photo-1585829365234-781fcd04c8ef?w=800&q=80",
            timestamp: formatRelativeDate(a.scheduled_at || a.created_at),
            author: a.author || "Redacção"
          })));
        }

        // 2. Processar Opiniões
        if (opinionsRes.data) {
          const mappedOpinions = opinionsRes.data.map((o: any) => ({
            id: o.id,
            slug: o.slug,
            title: o.title,
            author: o.author,
            timestamp: formatRelativeDate(o.scheduled_at || o.created_at)
          }));
          setOpinions(mappedOpinions);
        }

        // 3. Processar Vídeos
        if (videosRes.data) {
          setVideos(videosRes.data.map((v: any) => ({
            id: v.id,
            title: v.title,
            description: v.description || "",
            thumbnail: v.thumbnail_url || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
            duration: v.duration || "0:00",
            views: String(v.views || 0),
            category: v.category || "Geral",
            video_url: v.video_url
          })));
        }

      } catch (err) {
        console.error("Erro ao carregar artigos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategory, formatRelativeDate]);

  // Filtrar artigos com base na categoria e/ou pesquisa
  const isFiltering = selectedCategory !== "Destaque" || searchQuery.trim() !== "";

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "Destaque" || article.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  // Artigos para o slideshow hero (os 5 mais recentes)
  const heroArticles = articles.slice(0, 5);
  const sideArticles = articles.slice(5, 9);
  const gridTopArticles = articles.slice(9, 13);
  const gridLatestArticles = articles.slice(13);

  return (
    <div className="min-h-screen bg-background">
      <SEOMetadata
        title="Sem Filtros | Análise Contributiva e Notícias de Angola"
        description="Portal de notícias dedicado à análise contributiva, construtiva e informação sobre o desenvolvimento de Angola e o mundo."
      />
      <Header
        selectedCategory={selectedCategory}
        onSearch={setSearchQuery}
      />
      <BreakingNewsTicker
        headlines={breakingHeadlines}
        speed={tickerSpeed}
        onHeadlineClick={(item) => {
          if (item.slug && item.categorySlug) {
            navigate(`/${item.categorySlug}/${item.slug}`);
          }
        }}
      />
      <AdBanner slot="banner_top" />

      <main>
        <h1 className="sr-only">Sem Filtros Notícias e Análise Contributiva</h1>
        {loading ? (
          <LoadingSpinner fullScreen />
        ) : isFiltering ? (
          <div className="container py-8">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-heading font-bold text-foreground">
                {searchQuery.trim()
                  ? `Resultados para "${searchQuery}"`
                  : selectedCategory}
              </h2>
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground">
                {filteredArticles.length} artigo{filteredArticles.length !== 1 ? "s" : ""}
              </span>
            </div>
            {(filteredArticles.length > 0 || (selectedCategory === "Opinião" && opinions.length > 0)) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Renderizar artigos de notícias filtrados */}
                {filteredArticles.map((article, i) => (
                  <article
                    key={article.id}
                    onClick={() => {
                      if (article.slug) {
                        navigate(`/${article.categorySlug || 'geral'}/${article.slug}`);
                      }
                    }}
                    className="group cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {article.image && (
                      <div className="overflow-hidden mb-3">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <span className="news-category-badge mb-2 inline-block">
                      {article.category}
                    </span>
                    <h3 className="news-headline news-headline-hover text-lg">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground font-medium">
                        {article.author}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="news-timestamp">{article.timestamp}</span>
                    </div>
                  </article>
                ))}

                {/* Renderizar artigos de opinião se a categoria for Opinião */}
                {selectedCategory === "Opinião" && opinions.map((opinion, i) => (
                  <article
                    key={opinion.id}
                    onClick={() => {
                      if (opinion.slug) {
                        navigate(`/opiniao/${opinion.slug}`);
                      }
                    }}
                    className="group cursor-pointer animate-fade-in bg-secondary/30 p-4 border-l-4 border-primary"
                    style={{ animationDelay: `${(filteredArticles.length + i) * 80}ms` }}
                  >
                    <span className="news-category-badge mb-2 inline-block bg-primary text-primary-foreground">
                      Opinião
                    </span>
                    <h3 className="news-headline news-headline-hover text-lg italic">
                      "{opinion.title}"
                    </h3>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold">{opinion.author.charAt(0)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-foreground font-bold">
                          {opinion.author}
                        </span>
                        <span className="news-timestamp">{opinion.timestamp}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Nenhum artigo encontrado.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("Destaque");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-sm text-primary hover:underline"
                >
                  Voltar aos destaques
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <HeroSection heroArticles={heroArticles} sideArticles={sideArticles} />
            <VideoSection videos={videos} />
            <NewsGrid
              topArticles={gridTopArticles}
              latestArticles={gridLatestArticles}
              opinionArticles={opinions}
            />
          </>
        )}
      </main>
      <AdBanner slot="banner_bottom" />
      <Footer />
      <RadioPlayer />
      <HighlightsModal />
    </div>
  );
};

export default Index;
