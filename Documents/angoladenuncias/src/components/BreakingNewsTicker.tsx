import { Zap } from "lucide-react";

const headlines = [
  "Governo anuncia novo pacote de medidas para combater a crise habitacional",
  "Inflação recua para 2,1% em fevereiro",
  "UE aprova novo pacto de defesa com investimento recorde",
  "Seleção Nacional prepara eliminatórias do Mundial",
];

const BreakingNewsTicker = () => {
  return (
    <div className="bg-primary text-primary-foreground overflow-hidden">
      <div className="container flex items-center">
        <div className="flex items-center gap-2 py-2 pr-4 flex-shrink-0 font-semibold text-xs uppercase tracking-wider bg-primary">
          <Zap className="w-3.5 h-3.5" />
          <span>Última Hora</span>
        </div>
        <div className="overflow-hidden relative flex-1">
          <div className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap gap-12 py-2">
            {[...headlines, ...headlines].map((h, i) => (
              <span key={i} className="text-sm font-medium cursor-pointer hover:underline">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default BreakingNewsTicker;
