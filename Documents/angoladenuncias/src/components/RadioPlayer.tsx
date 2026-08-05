import { useState, useRef, useEffect } from "react";
import { Radio, Play, Pause, Volume2, VolumeX, X, Loader2, ChevronDown, Square } from "lucide-react";
import { toast } from "sonner";

// Lista de URLs possíveis para a Rádio
const RADIO_ID = 890006;

const RADIOS = [
    { name: "Sem Filtros FM", url: "https://listen.radioking.com/radio/890006/stream/960421" }
];

const RadioPlayer = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [activeRadioIndex, setActiveRadioIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [currentTrack, setCurrentTrack] = useState<{ title: string; artist: string | null; cover: string | null } | null>(null);

    useEffect(() => {
        const audio = new Audio();
        audio.preload = "none";
        audioRef.current = audio;

        const handleWaiting = () => setIsLoading(true);
        const handlePlaying = () => { setIsLoading(false); setIsPlaying(true); };
        const handlePause = () => setIsPlaying(false);
        const handleError = () => {
            console.error("Radio Error: Falha ao carregar stream", RADIOS[activeRadioIndex].url);
            setIsLoading(false);
            setIsPlaying(false);
        };

        audio.addEventListener("waiting", handleWaiting);
        audio.addEventListener("playing", handlePlaying);
        audio.addEventListener("pause", handlePause);
        audio.addEventListener("error", handleError);

        return () => {
            audio.pause();
            audio.src = "";
            audio.removeEventListener("waiting", handleWaiting);
            audio.removeEventListener("playing", handlePlaying);
            audio.removeEventListener("pause", handlePause);
            audio.removeEventListener("error", handleError);
        };
    }, [activeRadioIndex]);

    useEffect(() => {
        const fetchCurrentTrack = async () => {
            try {
                const response = await fetch(`https://www.radioking.com/widgets/currenttrack.php?radio=${RADIO_ID}&format=json`);
                if (response.ok) {
                    const data = await response.json();
                    setCurrentTrack({
                        title: data.title,
                        artist: data.artist,
                        cover: data.cover
                    });
                }
            } catch (err) {
                console.error("Error fetching current track:", err);
            }
        };

        if (isPlaying && activeRadioIndex === 0) { // Only for Sem Filtros FM
            fetchCurrentTrack();
            const interval = setInterval(fetchCurrentTrack, 30000); // 30s
            return () => clearInterval(interval);
        } else {
            setCurrentTrack(null);
        }
    }, [isPlaying, activeRadioIndex]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            audio.src = ""; // Reset source on pause to avoid background data usage
        } else {
            setIsLoading(true);

            audio.src = RADIOS[activeRadioIndex].url;
            audio.volume = volume;
            audio.muted = isMuted;
            audio.play().catch((err) => {
                console.error("Playback error:", err);
                setIsLoading(false);
                setIsPlaying(false);
            });
        }
    };

    const switchRadio = (index: number) => {
        if (index === activeRadioIndex) return;

        const wasPlaying = isPlaying;
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }

        setActiveRadioIndex(index);
        setIsPlaying(false);
        setIsLoading(false);

        // Auto-play next radio if it was playing
        if (wasPlaying) {
            setTimeout(() => {
                const audio = audioRef.current;
                if (!audio) return;
                setIsLoading(true);
                audio.src = RADIOS[index].url;
                audio.volume = volume;
                audio.muted = isMuted;
                audio.play().catch(() => {
                    setIsLoading(false);
                    setIsPlaying(false);
                });
            }, 100);
        }
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (audioRef.current) {
            audioRef.current.volume = val;
        }
        if (val === 0) setIsMuted(true);
        else if (isMuted) setIsMuted(false);
    };

    // Collapsed: small floating button
    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:shadow-red-500/25 hover:scale-105 transition-all duration-300 group"
                title="Abrir Rádio"
            >
                <div className="relative">
                    <Radio className={`w-4 h-4 sm:w-5 sm:h-5 ${isPlaying ? "animate-pulse" : ""}`} />
                    {isPlaying && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                    )}
                </div>
                <span className="text-xs sm:text-sm font-semibold tracking-wide">
                    {isPlaying ? "AO VIVO" : "Rádio"}
                </span>
            </button>
        );
    }

    // Expanded: full player
    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[85vw] sm:w-72 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-700 via-red-600 to-orange-600 p-4 relative">
                <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        title="Minimizar"
                    >
                        <ChevronDown className="w-5 h-5" />
                    </button>
                    {isPlaying && (
                        <button
                            onClick={() => { togglePlay(); setIsExpanded(false); }}
                            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            title="Parar Rádio"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group/cover">
                        <div className={`w-12 h-12 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm overflow-hidden ${isPlaying ? "ring-2 ring-white/40 ring-offset-2 ring-offset-transparent" : ""}`}>
                            {currentTrack?.cover ? (
                                <img src={currentTrack.cover} alt="Cover" className="w-full h-full object-cover animate-fade-in" />
                            ) : (
                                <Radio className={`w-6 h-6 text-white ${isPlaying ? "animate-pulse" : ""}`} />
                            )}
                        </div>
                        {isPlaying && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-red-600 animate-pulse" />
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <h3 className="text-white font-bold text-[11px] uppercase tracking-wider opacity-70 mb-0.5">
                            {RADIOS[activeRadioIndex].name}
                        </h3>
                        <div className="flex flex-col">
                            <h4 className="text-white font-black text-[14px] tracking-tight leading-tight line-clamp-1">
                                {currentTrack?.title || (isPlaying ? "Emissão em directo" : "Sintonizar")}
                            </h4>
                            {currentTrack?.artist && (
                                <p className="text-white/80 text-[11px] line-clamp-1 font-medium mt-0.5">
                                    {currentTrack.artist}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Animated equalizer bars when playing */}
                {isPlaying && (
                    <div className="flex items-end gap-0.5 absolute bottom-2 right-14 h-4">
                        <div className="w-1 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "0ms", height: "60%" }} />
                        <div className="w-1 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "150ms", height: "100%" }} />
                        <div className="w-1 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "300ms", height: "40%" }} />
                        <div className="w-1 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "100ms", height: "80%" }} />
                    </div>
                )}
            </div>

            {/* Station Selector - Only show if there's more than one station */}
            {RADIOS.length > 1 && (
                <div className="bg-zinc-800/50 p-2 grid grid-cols-4 gap-1 border-b border-white/5">
                    {RADIOS.map((radio, idx) => (
                        <button
                            key={radio.name}
                            onClick={() => switchRadio(idx)}
                            className={`py-1.5 px-1 rounded-lg text-[9px] font-bold uppercase tracking-tight transition-all leading-tight text-center flex flex-col items-center justify-center min-h-[40px] ${activeRadioIndex === idx
                                ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                                : "bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                                }`}
                        >
                            {radio.name.split(' ').map((word, i) => (
                                <span key={i} className="block">{word}</span>
                            ))}
                        </button>
                    ))}
                </div>
            )}

            {/* Controls */}
            <div className="bg-zinc-900 p-4">
                <div className="flex items-center justify-between">
                    {/* Play/Pause */}
                    <button
                        onClick={togglePlay}
                        disabled={isLoading}
                        className="w-11 h-11 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-60 shadow-lg shadow-red-500/30"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : isPlaying ? (
                            <Pause className="w-5 h-5" />
                        ) : (
                            <Play className="w-5 h-5 ml-0.5" />
                        )}
                    </button>

                    {/* Volume */}
                    <div className="flex items-center gap-2 flex-1 ml-4">
                        <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition-colors">
                            {isMuted || volume === 0 ? (
                                <VolumeX className="w-4 h-4" />
                            ) : (
                                <Volume2 className="w-4 h-4" />
                            )}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="flex-1 h-1 rounded-full appearance-none bg-zinc-700 cursor-pointer accent-red-500"
                            style={{
                                background: `linear-gradient(to right, #ef4444 ${(isMuted ? 0 : volume) * 100}%, #3f3f46 ${(isMuted ? 0 : volume) * 100}%)`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RadioPlayer;
