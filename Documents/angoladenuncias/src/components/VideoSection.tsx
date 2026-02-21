import { useState } from "react";
import { Play, Clock, Eye } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  category: string;
  videoUrl?: string;
}

const mockVideos: VideoItem[] = [
  {
    id: "v1",
    title: "Debate parlamentar: Governo defende medidas habitacionais",
    description: "Os partidos da oposição contestam as novas medidas apresentadas pelo executivo.",
    thumbnail: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    duration: "12:34",
    views: "45.2K",
    category: "Política",
  },
  {
    id: "v2",
    title: "Análise económica: Portugal no contexto europeu",
    description: "Especialistas avaliam os indicadores económicos do primeiro trimestre.",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    duration: "8:15",
    views: "22.8K",
    category: "Economia",
  },
  {
    id: "v3",
    title: "Seleção Nacional: Conferência de imprensa pré-jogo",
    description: "Roberto Martínez fala sobre a convocatória e estratégia para os próximos jogos.",
    thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    duration: "6:42",
    views: "89.1K",
    category: "Desporto",
  },
  {
    id: "v4",
    title: "Reportagem: IA nos hospitais portugueses",
    description: "Como a inteligência artificial está a transformar o diagnóstico médico em Portugal.",
    thumbnail: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
    duration: "15:20",
    views: "31.5K",
    category: "Tecnologia",
  },
];

const VideoSection = () => {
  const [featuredVideo, setFeaturedVideo] = useState<VideoItem>(mockVideos[0]);
  const [playing, setPlaying] = useState(false);

  return (
    <section className="bg-secondary border-y border-border py-10">
      <div className="container">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <Play className="w-4 h-4 text-primary fill-primary" />
          </div>
          <h2 className="text-xl font-heading font-bold text-foreground">Noticiário em Vídeo</h2>
          <div className="flex-1 h-px bg-border" />
          <button className="text-xs font-semibold uppercase tracking-wider text-primary hover:opacity-80 transition-opacity">
            Ver todos
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured player */}
          <div className="lg:col-span-2">
            <div className="relative bg-background overflow-hidden group cursor-pointer aspect-video"
              onClick={() => setPlaying(!playing)}>
              <img
                src={featuredVideo.thumbnail}
                alt={featuredVideo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

              {/* Play button */}
              {!playing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-primary-foreground fill-primary-foreground ml-1" />
                  </div>
                </div>
              )}

              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <span className="news-category-badge text-[10px]">{featuredVideo.category}</span>
              </div>

              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="news-headline text-base sm:text-lg text-foreground line-clamp-2 mb-2">
                  {featuredVideo.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {featuredVideo.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {featuredVideo.views} visualizações
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
              {featuredVideo.description}
            </p>
          </div>

          {/* Video list */}
          <div className="flex flex-col gap-0">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 pb-2 border-b border-border">
              Mais vídeos
            </h4>
            {mockVideos.slice(1).map((video) => (
              <button
                key={video.id}
                onClick={() => { setFeaturedVideo(video); setPlaying(false); }}
                className={`flex gap-3 py-3 border-b border-border last:border-0 text-left group transition-colors hover:bg-background/50 -mx-2 px-2 ${
                  featuredVideo.id === video.id ? "opacity-60" : ""
                }`}
              >
                {/* Thumbnail */}
                <div className="relative flex-shrink-0 w-28 h-16 overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
                  </div>
                  <span className="absolute bottom-1 right-1 text-[10px] font-mono bg-background/80 text-foreground px-1">
                    {video.duration}
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">
                    {video.category}
                  </span>
                  <h4 className="text-sm font-heading font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {video.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                    <Eye className="w-3 h-3" />
                    <span>{video.views}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
