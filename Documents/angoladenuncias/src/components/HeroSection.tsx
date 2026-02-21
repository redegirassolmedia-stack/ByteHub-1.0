import { heroArticle, topArticles } from "@/data/newsData";
import NewsCard from "./NewsCard";

const HeroSection = () => {
  return (
    <section className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main hero */}
        <div className="lg:col-span-2 group cursor-pointer">
          <div className="overflow-hidden">
            <img
              src={heroArticle.image}
              alt={heroArticle.title}
              className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="pt-4">
            <span className="news-category-badge mb-3 inline-block">{heroArticle.category}</span>
            <h2 className="news-headline news-headline-hover text-2xl sm:text-3xl md:text-4xl">
              {heroArticle.title}
            </h2>
            <p className="text-muted-foreground mt-3 text-sm sm:text-base leading-relaxed max-w-2xl">
              {heroArticle.summary}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground font-medium">{heroArticle.author}</span>
              <span className="text-muted-foreground">·</span>
              <span className="news-timestamp">{heroArticle.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Side articles */}
        <div className="border-t lg:border-t-0 lg:border-l border-border lg:pl-6 pt-4 lg:pt-0">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Últimas</h3>
          {topArticles.slice(0, 4).map((article) => (
            <NewsCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
