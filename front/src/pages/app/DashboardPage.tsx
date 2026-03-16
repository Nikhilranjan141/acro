import React, { useEffect, useState } from 'react';
import { TopNavbar } from '../../components/dashboard/TopNavbar';
import { KpiRow } from '../../components/dashboard/KpiRow';
import { ResourceStatusPanel } from '../../components/dashboard/ResourceStatusPanel';
import { CityMapPreview } from '../../components/dashboard/CityMapPreview';
import { SosPanel } from '../../components/dashboard/SosPanel';
import { AiPredictionPanel } from '../../components/dashboard/AiPredictionPanel';
import { SmartHospitalCard } from '../../components/dashboard/SmartHospitalCard';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { TransfersTable } from '../../components/dashboard/TransfersTable';

import { initSocket, getSocket } from '../../lib/socket';
import type { DashboardSummaryData, Transfer, AuditLog } from '../../types/dashboard';

import '../../components/dashboard/dashboardTheme.css';

const INITIAL_SUMMARY: DashboardSummaryData = {
  kpis: {
    activeEmergencies: 0,
    ambulancesActive: 0,
    icuAvailable: 0,
    doctorsAvailable: 0,
    oxygenAvg: 0,
  },
  resources: [],
  hospitals: [],
  ambulances: [],
};

export default function DashboardPage() {
  const [summaryData, setSummaryData] = useState<DashboardSummaryData | null>(null);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [activityLogs, setActivityLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    // Determine API origin based on environment; hardcoded to the local Next.js server for now
    const API_URL = 'http://localhost:3001';

    const fetchInitialData = async () => {
      try {
        const [sumRes, transRes, actRes] = await Promise.all([
          fetch(`${API_URL}/api/dashboard/summary`),
          fetch(`${API_URL}/api/dashboard/transfers`),
          fetch(`${API_URL}/api/dashboard/activity`),
        ]);

        if (sumRes.ok) setSummaryData(await sumRes.json());
        if (transRes.ok) setTransfers(await transRes.json());
        if (actRes.ok) setActivityLogs(await actRes.json());

      } catch (err) {
        console.error('Failed to load initial dashboard data', err);
      }
    };

    fetchInitialData();

    // Initialize Real-time Socket Connection
    initSocket().then((socket) => {
      if (!socket) return;
      
      // Setup live listeners
      socket.on('resources:update', (update) => {
        setSummaryData(prev => {
          if (!prev) return prev;
          const newResources = prev.resources.map(r => 
            r.hospital_id === update.hospital_id ? { ...r, oxygen_pct: update.oxygen_pct } : r
          );
          // Recalculate oxygen avg
          const avg = Math.round(newResources.reduce((sum, r) => sum + Number(r.oxygen_pct), 0) / newResources.length);
          return {
             ...prev, 
             resources: newResources,
             kpis: { ...prev.kpis, oxygenAvg: avg }
          };
        });
      });

      socket.on('ambulances:update', (updatedAmbs) => {
          setSummaryData(prev => {
              if (!prev) return prev;
              return { ...prev, ambulances: updatedAmbs };
          });
      });
    });

    return () => {
       const socket = getSocket();
       if (socket) {
           socket.off('resources:update');
           socket.off('ambulances:update');
       }
    };
  }, []);

  return (
    <div className="theme-medlink-dashboard flex flex-col w-full h-full overflow-hidden">
      <TopNavbar />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        
        {/* Top KPI Header Row */}
        <section>
          <KpiRow data={summaryData?.kpis || null} />
        </section>

        {/* Main 3-Column Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[800px] lg:h-[450px]">
           {/* Left Sidebar: Resources (1 col) */}
           <div className="lg:col-span-1 h-full">
              <ResourceStatusPanel data={summaryData} />
           </div>
           
           {/* Center Map (2 cols) */}
           <div className="lg:col-span-2 h-full">
              <CityMapPreview data={summaryData} />
           </div>

           {/* Right Actions & AI (1 col) */}
           <div className="lg:col-span-1 flex flex-col gap-6 h-full">
              <div className="flex-shrink-0 h-[220px]">
                 <SosPanel />
              </div>
              <div className="flex-1 min-h-0">
                 <AiPredictionPanel />
              </div>
           </div>
        </section>

        {/* Bottom Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-1 h-[350px]">
               <ActivityFeed initialLogs={activityLogs} />
           </div>
           
           <div className="lg:col-span-1 h-[350px]">
               <SmartHospitalCard />
           </div>
           
           <div className="lg:col-span-1 h-[350px]">
               <TransfersTable initialData={transfers} />
           </div>
        </section>
        
      </main>
    </div>
  );
}
