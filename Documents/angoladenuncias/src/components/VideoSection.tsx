import { useState, useEffect, useRef } from "react";
import { Play, Clock, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getYoutubeId } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import Hls from "hls.js";
import AdSquare from "./AdSquare";
import ReactPlayer from "react-player";

const ReactPlayerComponent = ReactPlayer as any;

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  category: string;
  videoUrl?: string;
  video_url?: string;
}

interface VideoSectionProps {
  videos?: any[];
}

/** Detecta o tipo de URL do vídeo */
const getVideoType = (url: string): "youtube" | "hls" | "direct" | "unknown" => {
  if (!url) return "unknown";
  if (getYoutubeId(url)) return "youtube";
  if (url.includes(".m3u8")) return "hls";
  if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) return "direct";
  return "unknown";
};

/** Componente interno para reproduzir HLS */
const HlsPlayer = ({ src, title }: { src: string; title: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => { });
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari suporta HLS nativamente
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => { });
      });
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      className="w-full h-full object-contain bg-black"
      title={title}
    />
  );
};

const VideoSection = ({ videos = [] }: VideoSectionProps) => {
  const [featuredVideo, setFeaturedVideo] = useState<any>(null);
  const [playing, setPlaying] = useState(false);
  const navigate = useNavigate();

  const handlePlay = async () => {
    if (!featuredVideo) return;

    setPlaying(true);

    // Incrementar visualizações na base de dados
    try {
      const { error } = await (supabase.rpc as any)('increment_video_views', { video_id: featuredVideo.id });
      if (error) throw error;

      // Actualizar estado local para reflectir o incremento imediato
      setFeaturedVideo((prev: any) => ({
        ...prev,
        views: String(Number(prev.views || 0) + 1)
      }));
    } catch (err) {
      console.error("Erro ao incrementar visualizações:", err);
    }
  };

  // Sincronizar vídeo em destaque quando a lista de vídeos mudar
  useEffect(() => {
    if (videos.length > 0 && !featuredVideo) {
      setFeaturedVideo(videos[0]);
    }
  }, [videos, featuredVideo]);

  // Autoplay para directos (live streams)
  const rawUrl = featuredVideo?.video_url || featuredVideo?.videoUrl || "";
  const isLive = rawUrl.includes('/live/') || rawUrl.includes('youtube.com/live/') || featuredVideo?.category?.toLowerCase() === 'directo';

  useEffect(() => {
    if (isLive && featuredVideo && !playing) {
      setPlaying(true);
    }
  }, [isLive, featuredVideo?.id]);

  if (videos.length === 0 || !featuredVideo) return null;

  // Extrair ID do vídeo se for YouTube
  const youtubeId = getYoutubeId(rawUrl);
  const videoType = getVideoType(rawUrl);

  /** Renderiza o player correto com base no tipo de URL */
  const renderPlayer = () => {
    // 1. Se for YouTube, usamos o Iframe oficial (mais compatível com lives)
    if (youtubeId) {
      return (
        <div className="w-full h-full bg-black flex items-center justify-center relative">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${isLive ? 1 : 0}&rel=0&modestbranding=1`}
            title={featuredVideo.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    // 2. Se for HLS (m3u8), usamos o componente customizado com hls.js
    if (videoType === "hls") {
      return <HlsPlayer src={rawUrl} title={featuredVideo.title} />;
    }

    // 3. Para outros formatos suportados, usamos ReactPlayer
    return (
      <div className="w-full h-full bg-black flex items-center justify-center relative">
        <ReactPlayerComponent
          url={rawUrl}
          playing={true}
          controls={true}
          muted={isLive}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          onError={() => {
            console.error("Falha ao carregar vídeo:", rawUrl);
          }}
        />
      </div>
    );
  };

  return (
    <section id="video-section" className="bg-secondary border-y border-border py-10">
      <div className="container">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <Play className="w-4 h-4 text-primary fill-primary" />
          </div>
          <h2 className="text-xl font-heading font-bold text-foreground">Noticiário em Vídeo Sem Filtros</h2>
          <div className="flex-1 h-px bg-border" />
          <button
            onClick={() => navigate("/videos")}
            className="text-xs font-semibold uppercase tracking-wider text-primary hover:opacity-80 transition-opacity"
          >
            Ver todos
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured player */}
          <div className="lg:col-span-2">
            <div className="relative bg-background overflow-hidden group cursor-pointer aspect-video shadow-2xl">
              {playing ? (
                renderPlayer()
              ) : (
                <div onClick={handlePlay} className="relative w-full h-full">
                  <img
                    src={featuredVideo.thumbnail_url || featuredVideo.thumbnail}
                    alt={featuredVideo.title}
                    width={800}
                    height={450}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 text-primary-foreground fill-primary-foreground ml-1" />
                    </div>
                  </div>
                </div>
              )}

              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <span className="news-category-badge text-[10px]">{featuredVideo.category}</span>
              </div>

              {/* Info overlay */}
              {!playing && (
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
              )}
            </div>

            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
              {featuredVideo.description}
            </p>

            {/* NEW: 2x2 Grid of additional videos below featured */}
            {videos.slice(1, 5).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {videos.slice(1, 5).map((video) => (
                  <div
                    key={video.id}
                    onClick={() => {
                      setFeaturedVideo(video);
                      setPlaying(true);
                      window.scrollTo({ top: document.getElementById('video-section')?.offsetTop || 0, behavior: 'smooth' });
                    }}
                    className="group cursor-pointer bg-background/30 p-2 rounded-sm border border-transparent hover:border-primary/20 hover:bg-background/60 transition-all"
                  >
                    <div className="relative aspect-video overflow-hidden mb-2">
                      <img
                        src={video.thumbnail_url || video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                      <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/80 text-white px-1">
                        {video.duration}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-primary mb-1 block">
                      {video.category}
                    </span>
                    <h5 className="text-xs font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {video.title}
                    </h5>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video list */}
          <div className="flex flex-col gap-0">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 pb-2 border-b border-border">
              Mais vídeos
            </h4>

            {videos.slice(5, 13).map((video) => (
              <button
                key={video.id}
                onClick={() => {
                  setFeaturedVideo(video);
                  setPlaying(true);
                  window.scrollTo({ top: document.getElementById('video-section')?.offsetTop || 0, behavior: 'smooth' });
                }}
                className={`flex gap-3 py-3 border-b border-border last:border-0 text-left group transition-colors hover:bg-background/50 -mx-2 px-2 ${featuredVideo.id === video.id ? "opacity-60" : ""
                  }`}
              >
                {/* Thumbnail */}
                <div className="relative flex-shrink-0 w-28 h-16 overflow-hidden">
                  <img
                    src={video.thumbnail_url || video.thumbnail}
                    alt={video.title}
                    width={200}
                    height={112}
                    loading="lazy"
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

            {/* Ad Space moved to the bottom */}
            <div className="pt-6">
              <AdSquare slot="video_section_sidebar" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
