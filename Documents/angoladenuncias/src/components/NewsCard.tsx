import { useNavigate } from "react-router-dom";

export interface NewsArticle {
  id: string;
  slug?: string;
  title: string;
  summary: string;
  category: string;
  categorySlug?: string;
  image: string;
  timestamp: string;
  author: string;
}

interface NewsCardProps {
  article: NewsArticle;
  variant?: "default" | "compact" | "horizontal";
}

const NewsCard = ({ article, variant = "default" }: NewsCardProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (article.slug && article.categorySlug) {
      navigate(`/${article.categorySlug}/${article.slug}`);
    }
  };

  if (variant === "compact") {
    return (
      <article
        onClick={handleNavigate}
        className="group flex gap-3 py-3 border-b border-border last:border-0 cursor-pointer"
      >
        <img
          src={article.image}
          alt={article.title}
          width={80}
          height={80}
          className="w-20 h-20 object-cover flex-shrink-0"
          loading="lazy"
        />
        <div className="flex flex-col justify-center min-w-0">
          <span className="news-category-badge mb-1 self-start text-[10px]">{article.category}</span>
          <h4 className="news-headline news-headline-hover text-sm line-clamp-3 sm:line-clamp-2">
            {article.title}
          </h4>
          <span className="news-timestamp mt-1">{article.timestamp}</span>
        </div>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article
        onClick={handleNavigate}
        className="group flex gap-4 py-4 border-b border-border last:border-0 cursor-pointer"
      >
        <img
          src={article.image}
          alt={article.title}
          width={208}
          height={128}
          className="w-40 h-24 sm:w-52 sm:h-32 object-cover flex-shrink-0"
          loading="lazy"
        />
        <div className="flex flex-col justify-center min-w-0">
          <span className="news-category-badge mb-2 self-start">{article.category}</span>
          <h3 className="news-headline news-headline-hover text-base sm:text-lg line-clamp-3 sm:line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 hidden sm:block">
            {article.summary}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">{article.author}</span>
            <span className="text-muted-foreground">·</span>
            <span className="news-timestamp">{article.timestamp}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article onClick={handleNavigate} className="group cursor-pointer">
      <div className="overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          width={800}
          height={500}
          className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="pt-3">
        <span className="news-category-badge mb-2 inline-block">{article.category}</span>
        <h3 className="news-headline news-headline-hover text-base sm:text-lg leading-snug line-clamp-4">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {article.summary}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">{article.author}</span>
          <span className="text-muted-foreground">·</span>
          <span className="news-timestamp">{article.timestamp}</span>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
