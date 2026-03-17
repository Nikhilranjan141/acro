import React, { useEffect, useState } from 'react';
import { RadioTower, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { getSocket } from '../../lib/socket';
import type { AuditLog } from '../../types/dashboard';

interface ActivityFeedProps {
  initialLogs: AuditLog[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ initialLogs }) => {
  const [logs, setLogs] = useState<AuditLog[]>(initialLogs);

  useEffect(() => {
    setLogs(initialLogs);
  }, [initialLogs]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    
    // Listen for new activity entries triggered by SOS, Dispatch, or Simulator
    const handler = (newLog: AuditLog) => {
       setLogs(prev => [newLog, ...prev].slice(0, 20)); // keep last 20
    };
    
    socket.on('activity:new', handler);
    return () => {
      socket.off('activity:new', handler);
    };
  }, []);

  const getIconForType = (type: string, severity: string) => {
     if (type === 'SOS' || severity === 'red') return <AlertTriangle className="w-4 h-4 text-white" />;
     if (type === 'DISPATCH' || severity === 'teal') return <CheckCircle2 className="w-4 h-4 text-[var(--theme-medlink-medical-teal)]" />;
     return <Info className="w-4 h-4 text-[var(--theme-medlink-primary-blue)]" />;
  };

  const getColorForSeverity = (severity: string) => {
     if (severity === 'red') return 'bg-[var(--theme-medlink-emergency-red)] border-[var(--theme-medlink-emergency-red)] text-white';
     if (severity === 'teal') return 'bg-[var(--theme-medlink-medical-teal)]/10 border-[var(--theme-medlink-medical-teal)]/30 text-[var(--theme-medlink-text-primary)]';
     if (severity === 'warning') return 'bg-amber-100 border-amber-300 text-amber-900';
     return 'bg-[var(--theme-medlink-bg)] border-[var(--theme-medlink-border)] text-[var(--theme-medlink-text-primary)]';
  };

  return (
    <div className="flex flex-col h-full rounded-xl bg-[var(--theme-medlink-card)] border border-[var(--theme-medlink-border)] shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[var(--theme-medlink-border)] flex items-center justify-between sticky top-0 bg-[var(--theme-medlink-card)]/90 backdrop-blur-sm z-10">
        <h2 className="text-lg font-bold text-[var(--theme-medlink-text-primary)] flex items-center gap-2">
          <RadioTower className="w-5 h-5 text-[var(--theme-medlink-text-secondary)]" />
          Live Event Monitor
        </h2>
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--theme-medlink-emergency-red)] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--theme-medlink-emergency-red)]"></span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
         {logs.length === 0 ? (
            <div className="text-center text-sm text-[var(--theme-medlink-text-secondary)] pt-4">No events recorded.</div>
         ) : logs.map((log) => (
             <div key={log.id} className={`p-3 rounded-lg border text-sm animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm flex gap-3 ${getColorForSeverity(log.severity)}`}>
                 <div className="mt-0.5 flex-shrink-0">
                    {getIconForType(log.type, log.severity)}
                 </div>
                 <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                       <span className="font-bold tracking-tight opacity-90 text-[11px] uppercase">{log.type}</span>
                       <span className="text-[10px] font-medium opacity-70">
                          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                       </span>
                    </div>
                    <p className="font-medium leading-snug">{log.message}</p>
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
};
