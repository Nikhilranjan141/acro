import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRightLeft, Users, Search } from 'lucide-react';
import type { Transfer } from '../../types/dashboard';

interface TransfersTableProps {
  initialData: Transfer[];
}

export const TransfersTable: React.FC<TransfersTableProps> = ({ initialData }) => {
  const [data, setData] = useState<Transfer[]>(initialData);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | Transfer['status']>('ALL');

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const filteredData = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return data.filter((transfer) => {
      const queryMatch =
        !normalizedQuery ||
        transfer.patient_code.toLowerCase().includes(normalizedQuery) ||
        transfer.from_hospital.toLowerCase().includes(normalizedQuery) ||
        transfer.to_hospital.toLowerCase().includes(normalizedQuery);

      const statusMatch = statusFilter === 'ALL' || transfer.status === statusFilter;
      return queryMatch && statusMatch;
    });
  }, [data, query, statusFilter]);

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
      <div className="p-4 border-b border-[var(--theme-medlink-border)] bg-white/50">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[var(--theme-medlink-text-primary)] flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-[var(--theme-medlink-text-secondary)]" />
            Active Patient Transfers
          </h2>
          <div className="flex items-center gap-2 text-sm text-[var(--theme-medlink-text-secondary)] font-medium bg-[var(--theme-medlink-bg)] px-3 py-1 rounded-md border border-[var(--theme-medlink-border)]">
            <Users className="w-4 h-4" />
            {filteredData.length} Showing
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {['ALL', 'REQUESTED', 'ACCEPTED', 'IN_TRANSIT', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as 'ALL' | Transfer['status'])}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${statusFilter === status ? 'bg-[var(--theme-medlink-primary-blue)] text-white' : 'bg-[var(--theme-medlink-bg)] text-[var(--theme-medlink-text-secondary)] hover:bg-blue-50'}`}
            >
              {status === 'IN_TRANSIT' ? 'IN TRANSIT' : status}
            </button>
          ))}
        </div>

        <div className="mt-3 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-medlink-text-secondary)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search patient, origin, or destination..."
            className="w-full rounded-lg border border-[var(--theme-medlink-border)] bg-white py-2 pl-9 pr-3 text-sm text-[var(--theme-medlink-text-primary)] placeholder:text-[var(--theme-medlink-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-medlink-primary-blue)]/20"
          />
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
            {filteredData.length === 0 ? (
               <tr>
                 <td colSpan={4} className="px-4 py-8 text-center text-[var(--theme-medlink-text-secondary)]">No transfers found for current filters</td>
               </tr>
            ) : filteredData.map((transfer) => (
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
