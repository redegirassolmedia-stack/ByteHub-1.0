import { useState, useEffect, useRef } from "react";
import { Zap } from "lucide-react";

interface BreakingNewsItem {
  id: string;
  slug?: string;
  categorySlug?: string;
  title: string;
  category?: string;
}

interface BreakingNewsTickerProps {
  headlines?: BreakingNewsItem[];
  speed?: number;
  onHeadlineClick?: (item: BreakingNewsItem) => void;
}

const FADE_DURATION = 400;

const BreakingNewsTicker = ({
  headlines = [],
  speed = 30,
  onHeadlineClick
}: BreakingNewsTickerProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    if (headlines.length === 0) return;

    const displayMs = Math.max(3000, (speed * 1000) / headlines.length);

    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        const next = (activeIndexRef.current + 1) % headlines.length;
        activeIndexRef.current = next;
        setActiveIndex(next);
        setVisible(true);
      }, FADE_DURATION);
    }, displayMs + FADE_DURATION);

    return () => clearInterval(timer);
  }, [headlines, speed]);

  if (!headlines || headlines.length === 0) return null;

  const current = headlines[activeIndex];
  const label = current?.category || "Última Hora";

  return (
    <div className="border-b border-border bg-background">
      <div className="container flex items-center gap-3 py-2.5">

        {/* Badge de categoria */}
        <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm flex-shrink-0"
          style={{
            transition: `opacity ${FADE_DURATION}ms ease`,
            opacity: visible ? 1 : 0,
          }}
        >
          <Zap className="w-3 h-3" />
          {label}
        </span>

        {/* Divisor */}
        <div className="w-px h-4 bg-border flex-shrink-0" />

        {/* Headline */}
        <p
          className="text-sm font-semibold text-foreground cursor-pointer hover:text-primary transition-colors truncate"
          style={{
            transition: `opacity ${FADE_DURATION}ms ease, transform ${FADE_DURATION}ms ease`,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(5px)",
          }}
          onClick={() => current && onHeadlineClick?.(current)}
        >
          {current?.title}
        </p>
      </div>
    </div>
  );
};

export default BreakingNewsTicker;
