import { useCallback, useEffect, useState } from 'react';
import { TopNavbar } from '../../components/dashboard/TopNavbar';
import { KpiRow } from '../../components/dashboard/KpiRow';
import { ResourceStatusPanel } from '../../components/dashboard/ResourceStatusPanel';
import { CityMapPreview } from '../../components/dashboard/CityMapPreview';
import { AiPredictionPanel } from '../../components/dashboard/AiPredictionPanel';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { TransfersTable } from '../../components/dashboard/TransfersTable';

import { initSocket, getSocket } from '../../lib/socket';
import type { DashboardSummaryData, Transfer, AuditLog } from '../../types/dashboard';
import { runtimeConfig } from '../../lib/runtimeConfig';

import '../../components/dashboard/dashboardTheme.css';

const DEMO_SUMMARY: DashboardSummaryData = {
  kpis: {
    activeEmergencies: 3,
    ambulancesActive: 5,
    icuAvailable: 12,
    doctorsAvailable: 28,
    oxygenAvg: 76,
  },
  resources: [
    {
      hospital_id: 'h1',
      icu: { total: 24, used: 18 },
      ventilators: { total: 12, used: 7 },
      doctors: { total: 40, available: 11 },
      ambulances: { total: 8, available: 3 },
      oxygen_pct: 82,
      updated_at: '2026-03-17T06:15:00Z',
    },
    {
      hospital_id: 'h2',
      icu: { total: 18, used: 14 },
      ventilators: { total: 10, used: 6 },
      doctors: { total: 28, available: 9 },
      ambulances: { total: 5, available: 1 },
      oxygen_pct: 71,
      updated_at: '2026-03-17T06:17:00Z',
    },
    {
      hospital_id: 'h3',
      icu: { total: 12, used: 10 },
      ventilators: { total: 6, used: 5 },
      doctors: { total: 20, available: 8 },
      ambulances: { total: 4, available: 2 },
      oxygen_pct: 64,
      updated_at: '2026-03-17T06:18:00Z',
    },
  ],
  hospitals: [
    { id: 'h1', name: 'Central City General', lat: 22.7196, lng: 75.8577, status: 'Stable' },
    { id: 'h2', name: 'North Wing District', lat: 22.7432, lng: 75.8937, status: 'Warning' },
    { id: 'h3', name: 'Eastside Medical Clinics', lat: 22.7001, lng: 75.8814, status: 'Critical' },
  ],
  ambulances: [
    { id: 'a1', code: 'AMB-101', lat: 22.7104, lng: 75.8475, status: 'Available', updated_at: '2026-03-17T06:10:00Z' },
    { id: 'a2', code: 'AMB-205', lat: 22.7328, lng: 75.8712, status: 'In Transit', updated_at: '2026-03-17T06:12:00Z' },
    { id: 'a3', code: 'AMB-309', lat: 22.6958, lng: 75.9021, status: 'Responding', updated_at: '2026-03-17T06:13:00Z' },
    { id: 'a4', code: 'AMB-411', lat: 22.7461, lng: 75.8469, status: 'In Transit', updated_at: '2026-03-17T06:14:00Z' },
    { id: 'a5', code: 'AMB-512', lat: 22.7249, lng: 75.8895, status: 'Responding', updated_at: '2026-03-17T06:16:00Z' },
  ],
};

const DEMO_TRANSFERS: Transfer[] = [
  {
    id: 't1',
    patient_code: 'PT-1033',
    from_hospital: 'Eastside Medical',
    to_hospital: 'Central City',
    status: 'IN_TRANSIT',
    eta_min: 12,
    updated_at: '2026-03-17T06:10:00Z',
  },
  {
    id: 't2',
    patient_code: 'PT-1081',
    from_hospital: 'North Wing',
    to_hospital: 'Central City',
    status: 'ACCEPTED',
    eta_min: 18,
    updated_at: '2026-03-17T06:13:00Z',
  },
  {
    id: 't3',
    patient_code: 'PT-1094',
    from_hospital: 'Local Trauma Unit',
    to_hospital: 'North Wing',
    status: 'REQUESTED',
    eta_min: 25,
    updated_at: '2026-03-17T06:18:00Z',
  },
];

const DEMO_ACTIVITY: AuditLog[] = [
  {
    id: 'log1',
    type: 'SYSTEM',
    message: 'MedLink command center demo mode initialized successfully.',
    severity: 'info',
    created_at: '2026-03-17T06:00:00Z',
  },
  {
    id: 'log2',
    type: 'RESOURCE',
    message: 'North Wing oxygen reserve dropped below 75%.',
    severity: 'warning',
    created_at: '2026-03-17T06:08:00Z',
  },
  {
    id: 'log3',
    type: 'TRANSFER',
    message: 'Patient PT-1033 ambulance dispatch confirmed and en-route.',
    severity: 'teal',
    created_at: '2026-03-17T06:11:00Z',
  },
  {
    id: 'log4',
    type: 'ALERT',
    message: 'AI surge predictor flagged higher ER load in east zone.',
    severity: 'purple',
    created_at: '2026-03-17T06:14:00Z',
  },
];

const CITY_CENTER: Record<string, { lat: number; lng: number; label: string }> = {
  Indore: { lat: 22.7196, lng: 75.8577, label: 'Indore' },
  Bhopal: { lat: 23.2599, lng: 77.4126, label: 'Bhopal' },
  Ujjain: { lat: 23.1765, lng: 75.7885, label: 'Ujjain' },
};

function getCityDemoData(city: string) {
  const c = CITY_CENTER[city] || CITY_CENTER.Indore;
  const kpiByCity: Record<string, { activeEmergencies: number; ambulancesActive: number; icuAvailable: number; doctorsAvailable: number; oxygenAvg: number }> = {
    Indore: { activeEmergencies: 4, ambulancesActive: 5, icuAvailable: 43, doctorsAvailable: 84, oxygenAvg: 78 },
    Bhopal: { activeEmergencies: 3, ambulancesActive: 4, icuAvailable: 25, doctorsAvailable: 55, oxygenAvg: 78 },
    Ujjain: { activeEmergencies: 2, ambulancesActive: 3, icuAvailable: 17, doctorsAvailable: 38, oxygenAvg: 74 },
  };

  const summary: DashboardSummaryData = {
    ...DEMO_SUMMARY,
    kpis: kpiByCity[city] || kpiByCity.Indore,
    hospitals: [
      { id: `${city}-h1`, name: `${c.label} Central Hospital`, lat: c.lat, lng: c.lng, status: 'Stable' },
      { id: `${city}-h2`, name: `${c.label} North Wing`, lat: c.lat + 0.02, lng: c.lng + 0.03, status: 'Warning' },
      { id: `${city}-h3`, name: `${c.label} Eastside Medical`, lat: c.lat - 0.02, lng: c.lng + 0.02, status: 'Critical' },
    ],
    ambulances: [
      { id: `${city}-a1`, code: 'AMB-101', lat: c.lat - 0.01, lng: c.lng - 0.01, status: 'Available', updated_at: new Date().toISOString() },
      { id: `${city}-a2`, code: 'AMB-205', lat: c.lat + 0.01, lng: c.lng + 0.01, status: 'In Transit', updated_at: new Date().toISOString() },
      { id: `${city}-a3`, code: 'AMB-309', lat: c.lat - 0.015, lng: c.lng + 0.02, status: 'Responding', updated_at: new Date().toISOString() },
    ],
  };

  const transfers: Transfer[] = [
    {
      id: `${city}-t1`,
      patient_code: 'PT-1001',
      from_hospital: `${c.label} Eastside`,
      to_hospital: `${c.label} Central`,
      status: 'IN_TRANSIT',
      eta_min: 11,
      updated_at: new Date().toISOString(),
    },
    {
      id: `${city}-t2`,
      patient_code: 'PT-1002',
      from_hospital: `${c.label} North Wing`,
      to_hospital: `${c.label} Central`,
      status: 'ACCEPTED',
      eta_min: 17,
      updated_at: new Date().toISOString(),
    },
  ];

  const activity: AuditLog[] = [
    { id: `${city}-log1`, type: 'SYSTEM', message: `${c.label} command feed active in demo mode.`, severity: 'info', created_at: new Date().toISOString() },
    { id: `${city}-log2`, type: 'TRANSFER', message: `${c.label} transfer lane synced with city selection.`, severity: 'teal', created_at: new Date().toISOString() },
  ];

  return { summary, transfers, activity };
}



export default function DashboardPage() {
  const [summaryData, setSummaryData] = useState<DashboardSummaryData | null>(DEMO_SUMMARY);
  const [transfers, setTransfers] = useState<Transfer[]>(DEMO_TRANSFERS);
  const [activityLogs, setActivityLogs] = useState<AuditLog[]>(DEMO_ACTIVITY);
  const [selectedCity, setSelectedCity] = useState(() => localStorage.getItem('medlink-selected-city') || runtimeConfig.defaultCity);

  const fetchDashboardData = useCallback(async () => {
    const API_URL = runtimeConfig.apiBaseUrl;
    const cityQuery = encodeURIComponent(selectedCity);
    const cityDemo = getCityDemoData(selectedCity);

    setSummaryData(cityDemo.summary);
    setTransfers(cityDemo.transfers);
    setActivityLogs(cityDemo.activity);

    try {
      const [sumRes, transRes, actRes] = await Promise.all([
        fetch(`${API_URL}/api/dashboard/summary?city=${cityQuery}`),
        fetch(`${API_URL}/api/dashboard/transfers?city=${cityQuery}`),
        fetch(`${API_URL}/api/dashboard/activity?city=${cityQuery}`),
      ]);

      if (sumRes.ok) {
        const payload = await sumRes.json();
        const kpis = payload?.kpis;
        const hasUsefulKpi = kpis && Object.values(kpis).some((value) => Number(value) > 0);
        if (hasUsefulKpi) setSummaryData(payload);
      }
      if (transRes.ok) {
        const transferPayload = await transRes.json();
        if (Array.isArray(transferPayload) && transferPayload.length > 0) setTransfers(transferPayload);
      }
      if (actRes.ok) {
        const activityPayload = await actRes.json();
        if (Array.isArray(activityPayload) && activityPayload.length > 0) setActivityLogs(activityPayload);
      }
    } catch (err) {
      console.error('Failed to load initial dashboard data', err);
    }
  }, [selectedCity]);

  useEffect(() => {
    fetchDashboardData();

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
  }, [fetchDashboardData]);

  const headerAlerts = [
    {
      id: 'dashboard-a1',
      title: 'Critical resource watch',
      detail: `Active emergencies in ${selectedCity}: ${summaryData?.kpis.activeEmergencies ?? 0}`,
      time: 'Live',
      type: (summaryData?.kpis.activeEmergencies || 0) > 2 ? 'critical' as const : 'info' as const,
      read: false,
      route: '/app/resources',
      actionLabel: 'Open resources',
      owner: 'Dr. Neha Sharma',
    },
    {
      id: 'dashboard-a2',
      title: 'Transfer command queue',
      detail: `${transfers.filter((item) => item.status !== 'COMPLETED').length} active patient transfer(s) requiring monitoring.`,
      time: 'Live',
      type: 'info' as const,
      read: false,
      route: '/app/transfers',
      actionLabel: 'Track transfer',
      owner: 'Amit Verma',
    },
    {
      id: 'dashboard-a3',
      title: 'AI signal from event feed',
      detail: activityLogs[0]?.message || 'Recent system activity available for review.',
      time: 'Now',
      type: 'success' as const,
      read: false,
      route: '/app/insights',
      actionLabel: 'Review AI feed',
      owner: 'AI Control',
    },
    {
      id: 'dashboard-a4',
      title: 'Routing recommendation update',
      detail: `Best hospital routing refreshed for ${selectedCity} command center.`,
      time: 'Now',
      type: 'info' as const,
      read: false,
      route: '/app/finder',
      actionLabel: 'Open finder',
      owner: 'Priya Iyer',
    },
  ];

  const adminTeam = [
    { id: 'u1', name: 'Dr. Neha Sharma', role: 'ER Lead', status: 'online' as const },
    { id: 'u2', name: 'Amit Verma', role: 'Transfer Control', status: 'busy' as const },
    { id: 'u3', name: 'Priya Iyer', role: 'Resource Admin', status: 'online' as const },
    { id: 'u4', name: 'Rahul Tiwari', role: 'Dispatch Coordinator', status: 'online' as const },
  ];

  return (
    <div className="theme-medlink-dashboard flex min-h-full flex-col w-full overflow-hidden">
      <TopNavbar
        initialAlerts={headerAlerts}
        adminTeam={adminTeam}
        selectedCityValue={selectedCity}
        onCityChange={setSelectedCity}
        onRefreshData={fetchDashboardData}
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Top KPI Header Row */}
        <section className="app-animate-in">
          <KpiRow data={summaryData?.kpis || null} />
        </section>

          <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start app-animate-in">
            <div className="xl:col-span-3 h-[360px]">
              <ResourceStatusPanel data={summaryData} />
           </div>
           
            <div className="xl:col-span-6 h-[360px]">
              <CityMapPreview data={summaryData} city={selectedCity} />
           </div>

            <div className="xl:col-span-3 h-[360px]">
              <AiPredictionPanel city={selectedCity} />
            </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 app-animate-in">
            <div className="h-[340px]">
               <ActivityFeed initialLogs={activityLogs} />
           </div>
           
            <div className="h-[340px]">
               <TransfersTable initialData={transfers} />
           </div>
        </section>
        
      </main>
    </div>
  );
}
