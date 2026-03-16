import React, { useEffect, useState } from 'react';
import { Building2, Navigation, Clock, Activity, Loader2 } from 'lucide-react';

interface RecHospital {
  id: string;
  name: string;
  distance_km: string;
  icu_available: number;
  eta_mins: number;
  workload_badge: string;
}

export const SmartHospitalCard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [hospital, setHospital] = useState<RecHospital | null>(null);

  useEffect(() => {
    const fetchRec = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/recommendation');
        const data = await res.json();
        if (!data.error) setHospital(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRec();
    const interval = setInterval(fetchRec, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full rounded-xl bg-[var(--theme-medlink-card)] border border-[var(--theme-medlink-border)] shadow-sm relative overflow-hidden">
      <div className="p-4 border-b border-[var(--theme-medlink-border)] flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--theme-medlink-text-primary)] flex items-center gap-2">
          <Activity className="w-5 h-5 text-[var(--theme-medlink-medical-teal)]" />
          Best Hospital Routing
        </h2>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--theme-medlink-bg)] text-[var(--theme-medlink-text-secondary)] border border-[var(--theme-medlink-border)]">Auto-Match</span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-center">
        {loading ? (
          <div className="flex h-full items-center justify-center">
             <Loader2 className="w-6 h-6 animate-spin text-[var(--theme-medlink-text-secondary)]" />
          </div>
        ) : !hospital ? (
          <div className="text-sm text-center text-[var(--theme-medlink-text-secondary)]">No recommendation available based on current data.</div>
        ) : (
          <div className="space-y-4">
             <div className="flex justify-between items-start">
                <div>
                   <h3 className="text-xl font-bold text-[var(--theme-medlink-primary-blue)] flex items-center gap-2">
                      <Building2 className="flex-shrink-0 w-6 h-6" />
                      {hospital.name}
                   </h3>
                   <span className="text-xs font-semibold px-2 py-0.5 bg-[var(--theme-medlink-bg)] text-[var(--theme-medlink-text-secondary)] rounded-md border border-[var(--theme-medlink-border)] mt-2 inline-block">
                      {hospital.workload_badge}
                   </span>
                </div>
                
                <div className="text-right">
                   <div className="flex items-center gap-1.5 text-2xl font-black text-[var(--theme-medlink-text-primary)]">
                       {hospital.eta_mins} <span className="text-sm font-semibold text-[var(--theme-medlink-text-secondary)]">min</span>
                   </div>
                   <div className="flex items-center justify-end gap-1 text-sm font-medium text-[var(--theme-medlink-text-secondary)]">
                      <Clock className="w-3.5 h-3.5" />
                      ETA
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-[var(--theme-medlink-border)]">
                   <div className="flex items-center gap-2 text-[var(--theme-medlink-text-secondary)] mb-1">
                      <Navigation className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">Distance</span>
                   </div>
                   <span className="text-lg font-bold text-[var(--theme-medlink-text-primary)]">{hospital.distance_km} km</span>
                </div>
                <div className="bg-[var(--theme-medlink-medical-teal)]/10 p-3 rounded-lg border border-[var(--theme-medlink-medical-teal)]/20">
                   <div className="flex items-center gap-2 text-[var(--theme-medlink-medical-teal)] mb-1">
                      <Activity className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wide">ICU Avail</span>
                   </div>
                   <span className="text-lg font-bold text-[var(--theme-medlink-medical-teal)]">{hospital.icu_available} beds</span>
                </div>
             </div>

          </div>
        )}
      </div>
    </div>
  );
};
