import React, { useEffect, useState } from 'react';
import { Sparkles, BrainCircuit, ArrowRight, Loader2 } from 'lucide-react';

interface Prediction {
  id: number;
  title: string;
  description: string;
  type: 'critical' | 'warning' | 'info';
}

export const AiPredictionPanel: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAi = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/ai/predictions');
        const data = await res.json();
        setPredictions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAi();
    // Re-fetch every 30s as AI shifts
    const interval = setInterval(fetchAi, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full rounded-xl bg-gradient-to-b from-[var(--theme-medlink-card)] to-slate-50 border border-[var(--theme-medlink-border)] shadow-sm relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--theme-medlink-ai-purple)]/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="p-4 border-b border-[var(--theme-medlink-border)]/50 flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-[var(--theme-medlink-ai-purple)]/10">
           <BrainCircuit className="w-5 h-5 text-[var(--theme-medlink-ai-purple)]" />
        </div>
        <h2 className="text-lg font-bold text-[var(--theme-medlink-text-primary)]">AI Predictive Insights</h2>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--theme-medlink-text-secondary)]" />
          </div>
        ) : (
          <div className="space-y-4">
            {predictions.map((pred) => (
              <div key={pred.id} className="group flex gap-4 p-3 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-slate-200 cursor-pointer shadow-sm">
                <div className="mt-0.5">
                  {pred.type === 'critical' && <Sparkles className="w-5 h-5 text-[var(--theme-medlink-emergency-red)]" />}
                  {pred.type === 'warning' && <Sparkles className="w-5 h-5 text-amber-500" />}
                  {pred.type === 'info' && <Sparkles className="w-5 h-5 text-[var(--theme-medlink-primary-blue)]" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[var(--theme-medlink-text-primary)] mb-1">
                    {pred.title}
                  </h3>
                  <p className="text-xs font-medium text-[var(--theme-medlink-text-secondary)] leading-relaxed">
                    {pred.description}
                  </p>
                </div>
                <div className="flex items-center text-[var(--theme-medlink-ai-purple)] opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
            
            {predictions.length === 0 && (
                <div className="text-center py-4 text-sm text-slate-500 font-medium">All systems optimal. No active predictions.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
