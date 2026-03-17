import React, { useEffect, useState } from 'react';
import { Sparkles, BrainCircuit, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { runtimeConfig } from '../../lib/runtimeConfig';

interface Prediction {
  id: number;
  title: string;
  description: string;
  type: 'critical' | 'warning' | 'info';
}

interface AiPredictionPanelProps {
  city?: string;
}

export const AiPredictionPanel: React.FC<AiPredictionPanelProps> = ({ city }) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [acknowledgedIds, setAcknowledgedIds] = useState<number[]>([]);

  const getCityFallbackPredictions = (selectedCity: string): Prediction[] => {
    const fallbackByCity: Record<string, Prediction[]> = {
      Indore: [
        {
          id: 101,
          title: 'ER Surge Risk - Indore East Zone',
          description: 'Projected patient inflow increase between 7:00 PM and 10:00 PM. Prepare triage teams.',
          type: 'critical',
        },
        {
          id: 102,
          title: 'Ambulance Allocation Suggestion - Indore',
          description: 'Shift AMB-I205 and AMB-I411 to central corridor for faster transfer response.',
          type: 'warning',
        },
        {
          id: 103,
          title: 'Resource Stability Update',
          description: 'Oxygen and ICU utilization remain within safe limits for the next 90 minutes.',
          type: 'info',
        },
      ],
      Bhopal: [
        {
          id: 201,
          title: 'Critical Care Load Warning - Bhopal Core',
          description: 'ICU occupancy is trending above baseline in central Bhopal clusters.',
          type: 'critical',
        },
        {
          id: 202,
          title: 'Route Congestion Advisory - Bhopal',
          description: 'Maintain one reserve ambulance for north-west transfer corridor.',
          type: 'warning',
        },
        {
          id: 203,
          title: 'Blood Reserve Stable',
          description: 'Blood inventory remains stable for the next cycle with current intake.',
          type: 'info',
        },
      ],
      Ujjain: [
        {
          id: 301,
          title: 'Oxygen Risk Watch - Ujjain',
          description: 'One trauma unit may cross low oxygen threshold in upcoming hour.',
          type: 'critical',
        },
        {
          id: 302,
          title: 'Transfer Prioritization - Ujjain',
          description: 'Prioritize respiratory cases to district center for faster stabilization.',
          type: 'warning',
        },
        {
          id: 303,
          title: 'Network Throughput Stable',
          description: 'Overall emergency transfer queue is within expected operating band.',
          type: 'info',
        },
      ],
    };

    return fallbackByCity[selectedCity] || fallbackByCity.Indore;
  };

  useEffect(() => {
    const fetchAi = async () => {
      const selectedCity = city || runtimeConfig.defaultCity || 'Indore';
      const fallbackPredictions = getCityFallbackPredictions(selectedCity);
      setLoading(true);
      setPredictions(fallbackPredictions);

      try {
        const cityQuery = selectedCity ? `?city=${encodeURIComponent(selectedCity)}` : '';
        const res = await fetch(`${runtimeConfig.apiBaseUrl}/api/ai/predictions${cityQuery}`, {
          headers: runtimeConfig.aiPublicKey
            ? {
                'x-ai-public-key': runtimeConfig.aiPublicKey,
              }
            : undefined,
        });
        if (!res.ok) {
          throw new Error('Failed to fetch predictions');
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPredictions(data);
        }
      } catch (e) {
        console.error(e);
        setPredictions(fallbackPredictions);
      } finally {
        setLoading(false);
      }
    };
    fetchAi();
    // Re-fetch every 30s as AI shifts
    const interval = setInterval(fetchAi, 30000);
    return () => clearInterval(interval);
  }, [city]);

  const acknowledge = (id: number) => {
    setAcknowledgedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <div className="flex flex-col h-full rounded-xl bg-gradient-to-b from-[var(--theme-medlink-card)] to-slate-50 border border-[var(--theme-medlink-border)] shadow-sm relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--theme-medlink-ai-purple)]/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="p-4 border-b border-[var(--theme-medlink-border)]/50 flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-[var(--theme-medlink-ai-purple)]/10">
           <BrainCircuit className="w-5 h-5 text-[var(--theme-medlink-ai-purple)]" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-[var(--theme-medlink-text-primary)]">AI Predictive Insights</h2>
          <div className="text-[11px] text-[var(--theme-medlink-text-secondary)]">Auto-refresh every 30 seconds</div>
        </div>
        <div className="rounded-full bg-[var(--theme-medlink-bg)] px-2 py-1 text-[10px] font-semibold text-[var(--theme-medlink-text-secondary)]">
          {predictions.length} Live
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--theme-medlink-text-secondary)]" />
          </div>
        ) : (
          <div className="space-y-4">
            {predictions.map((pred) => (
              <div key={pred.id} className="group flex gap-4 p-3 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-slate-200 shadow-sm">
                <div className="mt-0.5">
                  {pred.type === 'critical' && <Sparkles className="w-5 h-5 text-[var(--theme-medlink-emergency-red)]" />}
                  {pred.type === 'warning' && <Sparkles className="w-5 h-5 text-amber-500" />}
                  {pred.type === 'info' && <Sparkles className="w-5 h-5 text-[var(--theme-medlink-primary-blue)]" />}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-[var(--theme-medlink-text-primary)]">
                    {pred.title}
                    </h3>
                    {acknowledgedIds.includes(pred.id) ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" /> Acknowledged
                      </span>
                    ) : (
                      <button
                        onClick={() => acknowledge(pred.id)}
                        className="rounded-full bg-[var(--theme-medlink-bg)] px-2 py-0.5 text-[10px] font-semibold text-[var(--theme-medlink-primary-blue)] hover:bg-blue-50"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
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
