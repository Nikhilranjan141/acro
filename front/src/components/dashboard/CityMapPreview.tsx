import React from 'react';
import type { DashboardSummaryData } from '../../types/dashboard';
import { getConfiguredMapUrl } from '../../lib/runtimeConfig';

interface CityMapPreviewProps {
  data: DashboardSummaryData | null;
  city: string;
}

const CITY_BOUNDS: Record<string, { minLat: number; maxLat: number; minLng: number; maxLng: number; markerLat: number; markerLng: number }> = {
  Indore: { minLat: 22.64, maxLat: 22.79, minLng: 75.78, maxLng: 75.96, markerLat: 22.7196, markerLng: 75.8577 },
  Bhopal: { minLat: 23.15, maxLat: 23.35, minLng: 77.30, maxLng: 77.50, markerLat: 23.2599, markerLng: 77.4126 },
  Ujjain: { minLat: 23.12, maxLat: 23.26, minLng: 75.72, maxLng: 75.86, markerLat: 23.1765, markerLng: 75.7885 },
};

export const CityMapPreview: React.FC<CityMapPreviewProps> = ({ data, city }) => {
  const bounds = CITY_BOUNDS[city] ?? CITY_BOUNDS.Indore;

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bounds.minLng}%2C${bounds.minLat}%2C${bounds.maxLng}%2C${bounds.maxLat}&layer=mapnik&marker=${bounds.markerLat}%2C${bounds.markerLng}`;
  const configuredMapUrl = getConfiguredMapUrl(mapUrl, city);

  return (
    <div className="flex flex-col h-full rounded-xl bg-[var(--theme-medlink-card)] border border-[var(--theme-medlink-border)] overflow-hidden shadow-sm relative">
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-lg font-bold text-slate-800 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-slate-200">Live {city} Overview</h2>
      </div>

      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
         <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg text-xs font-semibold text-slate-700 shadow-sm border border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--theme-medlink-emergency-red)] animate-pulse" />
            Emergencies ({data?.kpis.activeEmergencies || 0})
         </div>
         <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg text-xs font-semibold text-slate-700 shadow-sm border border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--theme-medlink-primary-blue)]" />
            Ambulances ({data?.ambulances?.filter(a => a.status !== 'Available').length || 0})
         </div>
      </div>

      <div className="w-full h-[360px] lg:h-full bg-slate-50 relative overflow-hidden">
        <iframe
          title="MedLink live city map"
          src={configuredMapUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-slate-900/10 pointer-events-none" />

      </div>
    </div>
  );
};
