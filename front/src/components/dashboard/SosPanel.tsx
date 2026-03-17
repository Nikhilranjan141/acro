import React, { useState } from 'react';
import { AlertTriangle, Power, Loader2, ShieldAlert, CheckCircle } from 'lucide-react';
import { runtimeConfig } from '../../lib/runtimeConfig';

interface SOSResponse {
  success: boolean;
  audit?: { id: string; message: string };
  error?: string;
}

// Default Indore coordinates and city bounds
const CITY_BOUNDS: Record<string, { markerLat: number; markerLng: number }> = {
  Indore: { markerLat: 22.7196, markerLng: 75.8577 },
  Bhopal: { markerLat: 23.2599, markerLng: 77.4126 },
  Ujjain: { markerLat: 23.1765, markerLng: 75.7885 },
};

export const SosPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerSOS = async () => {
    setLoading(true);
    setError(null);
    
    const defaultCity = runtimeConfig.defaultCity || 'Indore';
    const coords = CITY_BOUNDS[defaultCity] || CITY_BOUNDS.Indore;

    // Add slight random offset to simulate patient location variation within city
    const lat = coords.markerLat + (Math.random() * 0.02 - 0.01);
    const lng = coords.markerLng + (Math.random() * 0.02 - 0.01);

    try {
      const response = await fetch(`${runtimeConfig.apiBaseUrl}/api/actions/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng }),
      });

      const data: SOSResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to trigger SOS');
      }

      setActive(true);
      setTimeout(() => {
        setActive(false);
        setError(null);
      }, 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to trigger SOS. Please try again.';
      setError(errorMessage);
      console.error('SOS Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl bg-[var(--theme-medlink-card)] border border-[var(--theme-medlink-border)] shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[var(--theme-medlink-border)] bg-slate-50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--theme-medlink-text-primary)] flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[var(--theme-medlink-emergency-red)]" />
          Emergency Response
        </h2>
      </div>
      
      <div className="p-6 flex-1 flex flex-col items-center justify-center relative">
        {/* Glow effect */}
        <div
          className={`absolute inset-0 bg-red-500/10 transition-opacity duration-1000 ${
            active ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {error && (
          <div className="relative z-20 mb-6 w-full max-w-xs bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {active && (
          <div className="relative z-20 mb-6 w-full max-w-xs bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700 font-medium">Emergency protocols activated. Dispatchers notified.</p>
          </div>
        )}
        
        <button
          onClick={triggerSOS}
          disabled={loading || active}
          className={`relative group flex flex-col items-center justify-center w-40 h-40 rounded-full border-4 transition-all duration-300 shadow-xl z-10 disabled:cursor-not-allowed
            ${active
              ? 'bg-red-600 border-red-200 scale-95'
              : error
              ? 'bg-gradient-to-br from-orange-500 to-orange-700 border-orange-100 hover:from-orange-600 hover:to-orange-800'
              : 'bg-gradient-to-br from-red-500 to-red-700 border-red-100 hover:scale-105 hover:from-red-600 hover:to-red-800'
            }
          `}
        >
          {loading ? (
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          ) : active ? (
            <>
              <Power className="w-12 h-12 text-white mb-2 animate-pulse" />
              <span className="text-white font-black tracking-widest text-xl">ACTIVE</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-14 h-14 text-white hover:animate-ping opacity-90" />
              <span className="text-white font-black tracking-widest text-xl mt-1">SOS</span>
            </>
          )}
        </button>

        <p className="relative z-10 mt-6 text-center text-sm font-medium text-[var(--theme-medlink-text-secondary)]">
          {active
            ? 'Emergency dispatch in progress...'
            : 'Press to trigger an emergency SOS alert. Nearby hospitals and ambulances will be immediately notified.'}
        </p>
      </div>
    </div>
  );
};
