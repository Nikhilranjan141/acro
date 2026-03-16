import React, { useEffect, useState } from 'react';
import { ArrowRightLeft, Users, Loader2 } from 'lucide-react';
import type { Transfer } from '../../types/dashboard';

interface TransfersTableProps {
  initialData: Transfer[];
}

export const TransfersTable: React.FC<TransfersTableProps> = ({ initialData }) => {
  const [data, setData] = useState<Transfer[]>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // If we had a socket event for 'transfers:update' we could listen to it here similar to ActivityFeed

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REQUESTED':
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-amber-100 text-amber-800 border border-amber-200">Pending</span>;
      case 'ACCEPTED':
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 border border-blue-200">Accepted</span>;
      case 'IN_TRANSIT':
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-[var(--theme-medlink-ai-purple)]/10 text-[var(--theme-medlink-ai-purple)] border border-[var(--theme-medlink-ai-purple)]/20 shadow-[0_0_10px_rgba(124,58,237,0.2)]">In Transit</span>;
      case 'COMPLETED':
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-[var(--theme-medlink-medical-teal)]/10 text-[var(--theme-medlink-medical-teal)] border border-[var(--theme-medlink-medical-teal)]/20">Completed</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-800 border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl bg-[var(--theme-medlink-card)] border border-[var(--theme-medlink-border)] shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[var(--theme-medlink-border)] bg-white/50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--theme-medlink-text-primary)] flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-[var(--theme-medlink-text-secondary)]" />
          Active Patient Transfers
        </h2>
        <div className="flex items-center gap-2 text-sm text-[var(--theme-medlink-text-secondary)] font-medium bg-[var(--theme-medlink-bg)] px-3 py-1 rounded-md border border-[var(--theme-medlink-border)]">
           <Users className="w-4 h-4" />
           {data.length} Total
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--theme-medlink-bg)]/50 text-[11px] uppercase tracking-wider text-[var(--theme-medlink-text-secondary)] font-bold border-b border-[var(--theme-medlink-border)]">
              <th className="px-4 py-3 font-semibold">Patient ID</th>
              <th className="px-4 py-3 font-semibold">Route</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">ETA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--theme-medlink-border)] text-sm">
            {data.length === 0 ? (
               <tr>
                 <td colSpan={4} className="px-4 py-8 text-center text-[var(--theme-medlink-text-secondary)]">No active transfers</td>
               </tr>
            ) : data.map((transfer) => (
              <tr key={transfer.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3 font-mono font-medium text-[var(--theme-medlink-text-primary)]">{transfer.patient_code}</td>
                <td className="px-4 py-3">
                   <div className="flex flex-col">
                      <span className="text-[var(--theme-medlink-text-secondary)] text-xs font-medium">Origin: <span className="text-[var(--theme-medlink-text-primary)]">{transfer.from_hospital}</span></span>
                      <span className="text-[var(--theme-medlink-text-secondary)] text-xs font-medium">Dest: <span className="text-[var(--theme-medlink-text-primary)]">{transfer.to_hospital}</span></span>
                   </div>
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(transfer.status)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-[var(--theme-medlink-text-primary)]">
                  {transfer.eta_min > 0 ? `${transfer.eta_min}m` : '--'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
