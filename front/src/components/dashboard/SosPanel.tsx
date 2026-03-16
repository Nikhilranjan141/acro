import React, { useState } from 'react';
import { AlertTriangle, Power, Loader2, ShieldAlert } from 'lucide-react';

export const SosPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  const triggerSOS = async () => {
    setLoading(true);
    try {
      await fetch('http://localhost:3001/api/actions/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: 19.1 + (Math.random() * 0.05 - 0.025),
          lng: 72.85 + (Math.random() * 0.05 - 0.025)
        })
      });
      setActive(true);
      setTimeout(() => setActive(false), 3000);
    } catch (err) {
      console.error(err);
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
        <div className={`absolute inset-0 bg-red-500/10 transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0'}`} />
        
        <button 
          onClick={triggerSOS}
          disabled={loading || active}
          className={`relative group flex flex-col items-center justify-center w-40 h-40 rounded-full border-4 transition-all duration-300 shadow-xl z-10
            ${active 
              ? 'bg-red-600 border-red-200 scale-95' 
              : 'bg-gradient-to-br from-red-500 to-red-700 border-red-100 hover:scale-105 hover:from-red-600 hover:to-red-800'
            }
          `}
        >
          {loading ? (
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          ) : (
            <>
              {active ? <Power className="w-12 h-12 text-white mb-2 animate-pulse" /> : <AlertTriangle className="w-14 h-14 text-white hover:animate-ping opacity-90" />}
            </>
          )}
          
          <span className="text-white font-black tracking-widest text-xl mt-1">
            {active ? 'ACTIVE' : 'SOS'}
          </span>
        </button>

        <p className="mt-6 text-center text-sm font-medium text-[var(--theme-medlink-text-secondary)]">
          Press to simulate an incoming priority emergency dispatch manually.
        </p>

      </div>
    </div>
  );
};
