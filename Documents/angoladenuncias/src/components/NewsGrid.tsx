import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewsCard from "./NewsCard";
import AdCarousel from "./AdCarousel";
import AdVerticalVideo from "./AdVerticalVideo";
import { MessageSquare } from "lucide-react";
import { NewsArticle } from "./NewsCard";

interface Opinion {
  id: string;
  slug?: string;
  title: string;
  author: string;
  timestamp: string;
}

interface NewsGridProps {
  topArticles?: NewsArticle[];
  latestArticles?: NewsArticle[];
  opinionArticles?: Opinion[];
}

const NewsGrid = ({
  topArticles = [],
  latestArticles = [],
  opinionArticles = []
}: NewsGridProps) => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(8);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="container py-8">
      {/* Destaques Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground">Destaques</h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topArticles.map((article, i) => (
            <div key={article.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <NewsCard article={article} />
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider my-10" />

      {/* Two column: Latest + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest news */}
        <section className="lg:col-span-2 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-heading font-bold text-foreground">Últimas Notícias</h2>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex-1">
            {latestArticles.slice(0, visibleCount).map((article) => (
              <NewsCard key={article.id} article={article} variant="horizontal" />
            ))}
          </div>

          {visibleCount < latestArticles.length && (
            <div className="mt-6 pt-4 border-t border-border flex justify-center">
              <button
                onClick={handleLoadMore}
                className="px-8 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-semibold tracking-wide uppercase rounded-sm transition-all shadow-sm border border-border"
              >
                Ler Mais Notícias
              </button>
            </div>
          )}
        </section>

        {/* Sidebar: Carousel + Opinion + Vertical Video */}
        <aside className="border-t lg:border-t-0 lg:border-l border-border lg:pl-6 pt-6 lg:pt-0">
          {/* Ad Carousel */}
          <AdCarousel />

          {/* Opinion */}
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h2 className="text-xl font-heading font-bold text-foreground">Opinião</h2>
          </div>
          <div className="space-y-0">
            {opinionArticles.map((article, i) => (
              <article
                key={article.id}
                onClick={() => navigate(`/opiniao/${article.slug || article.id}`)}
                className="py-4 border-b border-border last:border-0 group cursor-pointer"
              >
                <h4 className="news-headline news-headline-hover text-base">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-medium text-primary">{article.author}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="news-timestamp">{article.timestamp}</span>
                </div>
              </article>
            ))}
          </div>

          {/* Ad Vertical Video */}
          <div className="mt-6">
            <AdVerticalVideo />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NewsGrid;
