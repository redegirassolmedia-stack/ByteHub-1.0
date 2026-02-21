import { topArticles, latestArticles, opinionArticles } from "@/data/newsData";
import NewsCard from "./NewsCard";
import { MessageSquare } from "lucide-react";

const NewsGrid = () => {
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

      {/* Two column: Latest + Opinion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest news */}
        <section className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-heading font-bold text-foreground">Últimas Notícias</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          {latestArticles.map((article) => (
            <NewsCard key={article.id} article={article} variant="horizontal" />
          ))}
        </section>

        {/* Opinion */}
        <aside className="border-t lg:border-t-0 lg:border-l border-border lg:pl-6 pt-6 lg:pt-0">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h2 className="text-xl font-heading font-bold text-foreground">Opinião</h2>
          </div>
          <div className="space-y-0">
            {opinionArticles.map((article, i) => (
              <article
                key={article.id}
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
        </aside>
      </div>
    </div>
  );
};

export default NewsGrid;
