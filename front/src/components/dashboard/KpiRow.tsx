import React from 'react';
import { AlertCircle, Ambulance, ActivitySquare, UserCheck, Wind } from 'lucide-react';
import type { DashboardSummaryData } from '../../types/dashboard';

interface KpiRowProps {
  data: DashboardSummaryData['kpis'] | null;
}

export const KpiRow: React.FC<KpiRowProps> = ({ data }) => {
  const kpis = [
    {
      title: 'Active Emergencies',
      value: data?.activeEmergencies ?? '--',
      icon: <AlertCircle className="h-5 w-5 text-white" />,
      colorClass: 'bg-[var(--theme-medlink-emergency-red)]'
    },
    {
      title: 'Ambulances Active',
      value: data?.ambulancesActive ?? '--',
      icon: <Ambulance className="h-5 w-5 text-white" />,
      colorClass: 'bg-[var(--theme-medlink-primary-blue)]'
    },
    {
      title: 'ICU Beds Available',
      value: data?.icuAvailable ?? '--',
      icon: <ActivitySquare className="h-5 w-5 text-white" />,
      colorClass: 'bg-[var(--theme-medlink-medical-teal)]'
    },
    {
      title: 'Doctors Available',
      value: data?.doctorsAvailable ?? '--',
      icon: <UserCheck className="h-5 w-5 text-white" />,
      colorClass: 'bg-[var(--theme-medlink-ai-purple)]'
    },
    {
      title: 'Oxygen Avg %',
      value: data?.oxygenAvg ? `${data.oxygenAvg}%` : '--',
      icon: <Wind className="h-5 w-5 text-[var(--theme-medlink-text-primary)]" />,
      colorClass: 'bg-[var(--theme-medlink-border)]/50 border border-[var(--theme-medlink-border)]',
      textColor: 'text-[var(--theme-medlink-text-primary)]'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="flex flex-col rounded-xl bg-[var(--theme-medlink-card)] border border-[var(--theme-medlink-border)] p-4 shadow-sm transition-transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--theme-medlink-text-secondary)]">{kpi.title}</span>
            <div className={`p-1.5 rounded-lg ${kpi.colorClass} shadow-sm`}>
              {kpi.icon}
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className={`text-2xl font-bold ${kpi.textColor || 'text-[var(--theme-medlink-text-primary)]'}`}>
              {kpi.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};
