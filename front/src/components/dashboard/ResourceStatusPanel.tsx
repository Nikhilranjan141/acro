import React from 'react';
import { Pickaxe, Stethoscope, Wind, BedDouble, Truck } from 'lucide-react';
import type { DashboardSummaryData } from '../../types/dashboard';

interface ResourceStatusPanelProps {
  data: DashboardSummaryData | null;
}

export const ResourceStatusPanel: React.FC<ResourceStatusPanelProps> = ({ data }) => {
  // Aggregate data broadly
  let totalICU = 0, usedICU = 0;
  let totalVent = 0, usedVent = 0;
  let totalDocs = 0, availDocs = 0;
  let totalAmbs = 0, availAmbs = 0;
  let oxySum = 0;

  if (data?.resources) {
    data.resources.forEach(r => {
      totalICU += r.icu.total; usedICU += r.icu.used || 0;
      totalVent += r.ventilators.total; usedVent += r.ventilators.used || 0;
      totalDocs += r.doctors.total; availDocs += r.doctors.available || 0;
      totalAmbs += r.ambulances.total; availAmbs += r.ambulances.available || 0;
      oxySum += Number(r.oxygen_pct);
    });
  }

  const oxyAvg = data?.resources?.length ? Math.round(oxySum / data.resources.length) : 0;

  const statsList = [
    { label: 'ICU Beds', used: usedICU, total: totalICU, icon: <BedDouble className="w-4 h-4" /> },
    { label: 'Ventilators', used: usedVent, total: totalVent, icon: <Wind className="w-4 h-4" /> },
    { label: 'Doctors', used: totalDocs - availDocs, total: totalDocs, icon: <Stethoscope className="w-4 h-4" />, suffix: 'busy' },
    { label: 'Ambulances', used: totalAmbs - availAmbs, total: totalAmbs, icon: <Truck className="w-4 h-4" />, suffix: 'dispatched' },
    { label: 'Avg Oxygen Level', percent: oxyAvg, icon: <Pickaxe className="w-4 h-4" /> }
  ];

  return (
    <div className="flex flex-col h-full rounded-xl bg-[var(--theme-medlink-card)] border border-[var(--theme-medlink-border)] p-5 shadow-sm">
      <h2 className="text-lg font-bold text-[var(--theme-medlink-text-primary)] mb-4">Resource Status</h2>
      
      <div className="flex flex-col gap-5 flex-1 justify-center">
        {statsList.map((stat, idx) => {
          let pct = 0;
          let labelText = '';
          
          if ('percent' in stat) {
             pct = stat.percent as number;
             labelText = `${pct}% Stable`;
          } else {
             pct = stat.total > 0 ? (stat.used / stat.total) * 100 : 0;
             labelText = `${stat.used} / ${stat.total} ${stat.suffix || 'used'}`;
          }

          const isCritical = stat.label === 'Avg Oxygen Level' ? pct < 30 : pct > 90;
          const isWarning = stat.label === 'Avg Oxygen Level' ? (pct >= 30 && pct <= 60) : (pct > 70 && pct <= 90);
          
          let barColor = 'bg-[var(--theme-medlink-medical-teal)]';
          if (isCritical) barColor = 'bg-[var(--theme-medlink-emergency-red)]';
          else if (isWarning) barColor = 'bg-amber-500';

          return (
            <div key={idx} className="group">
              <div className="flex justify-between items-end mb-1.5">
                <span className="flex items-center gap-2 text-sm font-medium text-[var(--theme-medlink-text-primary)]">
                  <span className="text-[var(--theme-medlink-text-secondary)]">{stat.icon}</span>
                  {stat.label}
                </span>
                <span className={`text-xs font-semibold ${isCritical ? 'text-[var(--theme-medlink-emergency-red)]' : 'text-[var(--theme-medlink-text-secondary)]'}`}>
                  {labelText}
                </span>
              </div>
              <div className="h-2 w-full bg-[var(--theme-medlink-border)]/40 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${barColor} transition-all duration-1000 ease-in-out`}
                  style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-[var(--theme-medlink-border)] flex items-center justify-between text-xs text-[var(--theme-medlink-text-secondary)]">
         <span>Real-time sync active</span>
         <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--theme-medlink-medical-teal)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--theme-medlink-medical-teal)]"></span>
            </span>
            Live
         </span>
      </div>
    </div>
  );
};
