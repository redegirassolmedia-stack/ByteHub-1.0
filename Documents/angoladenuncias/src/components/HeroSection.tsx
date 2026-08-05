import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NewsCard from "./NewsCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Article {
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

interface HeroSectionProps {
  heroArticles?: Article[];
  sideArticles?: Article[];
}

const HeroSection = ({ heroArticles = [], sideArticles = [] }: HeroSectionProps) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [speed, setSpeed] = useState(5);

  const count = heroArticles.length;

  useEffect(() => {
    const fetchSpeed = async () => {
      const { data } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", "hero_speed")
        .single();

      if (data?.value && typeof data.value === 'object') {
        const val = data.value as any;
        if (val.speed) setSpeed(Number(val.speed));
      }
    };
    fetchSpeed();
  }, []);

  // Auto-slide every dynamic speed seconds, pause on hover
  useEffect(() => {
    if (count <= 1 || isHovering) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % count);
    }, speed * 1000);
    return () => clearInterval(interval);
  }, [count, isHovering, speed]);

  const goTo = useCallback((dir: number) => {
    setCurrent((prev) => (prev + dir + count) % count);
  }, [count]);

  if (count === 0) return null;

  const article = heroArticles[current];

  return (
    <section className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main hero slideshow */}
        <div
          className="lg:col-span-2 relative group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            className="cursor-pointer"
            onClick={() => {
              if (article.slug && article.categorySlug) {
                navigate(`/${article.categorySlug}/${article.slug}`);
              }
            }}
          >
            <div className="overflow-hidden relative">
              <img
                key={article.id}
                src={article.image}
                alt={article.title}
                width={1200}
                height={675}
                fetchPriority="high"
                className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-500 animate-fade-in"
              />
              {/* Gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Text overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <span className="news-category-badge mb-1.5 inline-block text-[10px] sm:text-xs">{article.category}</span>
                <h2 className="text-white font-heading font-black text-lg sm:text-2xl md:text-3xl leading-[1.1] drop-shadow-xl line-clamp-3 sm:line-clamp-none">
                  {article.title}
                </h2>
                <p className="text-white/90 mt-2 text-sm leading-relaxed max-w-2xl line-clamp-2 drop-shadow hidden sm:block">
                  {article.summary}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] sm:text-xs text-white/80 font-medium">{article.author}</span>
                  <span className="text-white/50">·</span>
                  <span className="text-[10px] sm:text-xs text-white/70">{article.timestamp}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          {count > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goTo(-1); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 backdrop-blur-sm text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goTo(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 backdrop-blur-sm text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              {/* Slide indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {heroArticles.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                    className={`h-1 rounded-full transition-all duration-300 ${i === current
                      ? "w-6 bg-primary"
                      : "w-2 bg-white/50 hover:bg-white/80"
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Side articles */}
        <div className="border-t lg:border-t-0 lg:border-l border-border lg:pl-6 pt-4 lg:pt-0">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Últimas do Sem Filtros</h3>
          {sideArticles.slice(0, 4).map((article) => (
            <NewsCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
