import React from 'react';
import { MapPin, Truck, AlertTriangle, Navigation } from 'lucide-react';
import type { DashboardSummaryData } from '../../types/dashboard';

interface CityMapPreviewProps {
  data: DashboardSummaryData | null;
}

export const CityMapPreview: React.FC<CityMapPreviewProps> = ({ data }) => {
  // We represent the map as an interactive schematic placeholder, mapping relative coordinates
  // For a real app, this would be a react-leaflet or mapbox-gl component.

  return (
    <div className="flex flex-col h-full rounded-xl bg-[var(--theme-medlink-card)] border border-[var(--theme-medlink-border)] overflow-hidden shadow-sm relative">
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-lg font-bold text-slate-800 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-slate-200">Live City Overview</h2>
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

      {/* Map Background Layer - Abstract Grid for high-end "command center" feel */}
      <div className="w-full h-[400px] lg:h-full bg-slate-50 relative overflow-hidden"
           style={{
             backgroundImage: 'radial-gradient(circle at 50% 50%, #e2e8f0 1px, transparent 1px)',
             backgroundSize: '30px 30px'
           }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-100/50 pointer-events-none" />

        {/* Render Hospitals */}
        {data?.hospitals?.map(h => (
           <div key={h.id} 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                style={{ 
                  left: `${((h.lng - 72.8) / 0.15) * 100}%`, 
                  top: `${((19.2 - h.lat) / 0.15) * 100}%` 
                }}
            >
              <div className={`p-1.5 rounded-full shadow-md z-10 transition-transform group-hover:scale-110 ${h.status === 'Critical' ? 'bg-[var(--theme-medlink-emergency-red)]' : 'bg-[var(--theme-medlink-medical-teal)]'}`}>
                 <MapPin className="text-white w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 text-xs font-bold text-slate-800 px-2 py-0.5 rounded shadow-sm mt-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
                {h.name}
              </div>
           </div>
        ))}

        {/* Render Ambulances */}
        {data?.ambulances?.filter(a => a.status !== 'Available').map(a => (
           <div key={a.id} 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 transition-all duration-1000 ease-linear"
                style={{ 
                  left: `${((a.lng - 72.8) / 0.15) * 100}%`, 
                  top: `${((19.2 - a.lat) / 0.15) * 100}%` 
                }}
            >
              <div className="bg-[var(--theme-medlink-primary-blue)] p-1.5 rounded-full shadow-lg relative h-7 w-7 flex items-center justify-center">
                 <span className="absolute w-full h-full rounded-full bg-[var(--theme-medlink-primary-blue)] opacity-40 animate-ping" />
                 <Navigation className="text-white w-3 h-3 absolute" />
              </div>
           </div>
        ))}
        
        {/* Render Emergency Blips */}
        {data?.ambulances?.[0] && ( // just a mock ping near first ambulance
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2 z-0"
                  style={{ 
                    left: `${((data.ambulances[0].lng + 0.01 - 72.8) / 0.15) * 100}%`, 
                    top: `${((19.2 - data.ambulances[0].lat + 0.01) / 0.15) * 100}%` 
                  }}
            >
               <div className="relative flex h-12 w-12 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--theme-medlink-emergency-red)] opacity-30"></span>
                  <div className="relative bg-[var(--theme-medlink-emergency-red)] p-1.5 rounded-full shadow-lg">
                    <AlertTriangle className="text-white w-4 h-4" />
                  </div>
               </div>
            </div>
        )}

      </div>
    </div>
  );
};
