import { useEffect, useMemo, useState } from 'react';
import {
   ArrowRight,
   UserPlus,
   Clock3,
   CheckCircle2,
   Search,
   Ambulance,
   MapPin,
   QrCode,
   PhoneCall,
   ClipboardCheck,
   ArrowLeft,
   Route,
   Plus,
   ShieldCheck,
   CircleDashed,
} from 'lucide-react';
import { getConfiguredMapUrl, runtimeConfig } from '../../lib/runtimeConfig';
import type { Transfer as DashboardTransfer } from '../../types/dashboard';

type Stage = 'requested' | 'accepted' | 'transit' | 'completed';

type TransferItem = {
   id: string;
   patientName: string;
   condition: string;
   fromHospital: string;
   toHospital: string;
   stage: Stage;
   etaMin: number;
   ambulanceId: string;
   priority: 'High' | 'Medium';
   qrCode: string;
   checklist: {
      stabilization: boolean;
      documents: boolean;
      bedConfirmed: boolean;
   };
   history: { time: string; text: string }[];
};

const STAGE_ORDER: Stage[] = ['requested', 'accepted', 'transit', 'completed'];

const STAGE_META = {
   requested: { title: 'Requested', icon: UserPlus, color: 'text-blue-500' },
   accepted: { title: 'Accepted / Prep', icon: Clock3, color: 'text-orange-500' },
   transit: { title: 'Ambulance En Route', icon: ArrowRight, color: 'text-yellow-500' },
   completed: { title: 'Completed', icon: CheckCircle2, color: 'text-green-500' },
};

const INITIAL_TRANSFERS: TransferItem[] = [
   {
      id: 'TR-901',
      patientName: 'Rajat Sharma',
      condition: 'Polytrauma + Hemorrhage',
      fromHospital: 'General Hospital',
      toHospital: 'Central Med',
      stage: 'transit',
      etaMin: 6,
      ambulanceId: 'AMB-104',
      priority: 'High',
      qrCode: 'ML-TR-901-QRCODE',
      checklist: {
         stabilization: true,
         documents: true,
         bedConfirmed: true,
      },
      history: [
         { time: '06:05', text: 'Transfer request created by ER physician.' },
         { time: '06:09', text: 'Receiving hospital accepted patient transfer.' },
         { time: '06:14', text: 'Ambulance AMB-104 dispatched from North Base.' },
         { time: '06:18', text: 'Patient pickup completed. Route to Central Med active.' },
      ],
   },
   {
      id: 'TR-902',
      patientName: 'Neha Verma',
      condition: 'Cardiac instability',
      fromHospital: 'City Medical',
      toHospital: 'North Wing Hospital',
      stage: 'accepted',
      etaMin: 14,
      ambulanceId: 'AMB-109',
      priority: 'Medium',
      qrCode: 'ML-TR-902-QRCODE',
      checklist: {
         stabilization: true,
         documents: false,
         bedConfirmed: true,
      },
      history: [
         { time: '06:11', text: 'Transfer request raised from ICU desk.' },
         { time: '06:13', text: 'Bed assigned by receiving coordinator.' },
         { time: '06:16', text: 'Medical packet verified and ambulance requested.' },
      ],
   },
   {
      id: 'TR-903',
      patientName: 'Arjun Singh',
      condition: 'Neuro observation',
      fromHospital: 'South District Care',
      toHospital: 'City Medical',
      stage: 'requested',
      etaMin: 22,
      ambulanceId: 'AMB-112',
      priority: 'Medium',
      qrCode: 'ML-TR-903-QRCODE',
      checklist: {
         stabilization: false,
         documents: false,
         bedConfirmed: false,
      },
      history: [
         { time: '06:21', text: 'Initial request submitted by duty doctor.' },
      ],
   },
   {
      id: 'TR-904',
      patientName: 'Sana Khan',
      condition: 'Respiratory emergency',
      fromHospital: 'Eastside Clinic',
      toHospital: 'General Hospital',
      stage: 'completed',
      etaMin: 0,
      ambulanceId: 'AMB-087',
      priority: 'High',
      qrCode: 'ML-TR-904-QRCODE',
      checklist: {
         stabilization: true,
         documents: true,
         bedConfirmed: true,
      },
      history: [
         { time: '05:42', text: 'Transfer initiated and accepted.' },
         { time: '05:56', text: 'Ambulance departed with oxygen support.' },
         { time: '06:07', text: 'Patient handed over at destination ICU.' },
         { time: '06:10', text: 'Case marked completed with digital signature.' },
      ],
   },
];

const STATUS_TO_STAGE: Record<DashboardTransfer['status'], Stage> = {
   REQUESTED: 'requested',
   ACCEPTED: 'accepted',
   IN_TRANSIT: 'transit',
   COMPLETED: 'completed',
};

const stageChecklistDefaults: Record<Stage, TransferItem['checklist']> = {
   requested: { stabilization: false, documents: false, bedConfirmed: false },
   accepted: { stabilization: true, documents: false, bedConfirmed: true },
   transit: { stabilization: true, documents: true, bedConfirmed: true },
   completed: { stabilization: true, documents: true, bedConfirmed: true },
};

const CITY_BOUNDS: Record<string, { minLat: number; maxLat: number; minLng: number; maxLng: number; markerLat: number; markerLng: number }> = {
   Indore: { minLat: 22.64, maxLat: 22.79, minLng: 75.78, maxLng: 75.96, markerLat: 22.7196, markerLng: 75.8577 },
   Bhopal: { minLat: 23.15, maxLat: 23.35, minLng: 77.3, maxLng: 77.5, markerLat: 23.2599, markerLng: 77.4126 },
   Ujjain: { minLat: 23.12, maxLat: 23.26, minLng: 75.72, maxLng: 75.86, markerLat: 23.1765, markerLng: 75.7885 },
};

function mapApiTransfer(transfer: DashboardTransfer, index: number): TransferItem {
   const stage = STATUS_TO_STAGE[transfer.status] ?? 'requested';
   const timestamp = transfer.updated_at ? new Date(transfer.updated_at) : new Date();
   const timeLabel = `${String(timestamp.getHours()).padStart(2, '0')}:${String(timestamp.getMinutes()).padStart(2, '0')}`;
   const patientId = transfer.patient_code || `PT-${String(index + 1).padStart(4, '0')}`;

   return {
      id: patientId,
      patientName: `Patient ${patientId}`,
      condition: stage === 'completed' ? 'Transfer completed' : 'Critical transfer case',
      fromHospital: transfer.from_hospital || 'Unknown hospital',
      toHospital: transfer.to_hospital || 'Unknown hospital',
      stage,
      etaMin: stage === 'completed' ? 0 : Math.max(2, Number(transfer.eta_min) || 12),
      ambulanceId: `AMB-${String(101 + index).padStart(3, '0')}`,
      priority: Number(transfer.eta_min) <= 10 ? 'High' : 'Medium',
      qrCode: `ML-${patientId}-QRCODE`,
      checklist: { ...stageChecklistDefaults[stage] },
      history: [{ time: timeLabel, text: `Transfer ${transfer.status.replace('_', ' ').toLowerCase()} from backend update.` }],
   };
}

function getCityLocalTransfers(city: string): TransferItem[] {
   const cityLabel = city || 'Indore';
   return INITIAL_TRANSFERS.map((transfer, index) => ({
      ...transfer,
      id: `${cityLabel.slice(0, 3).toUpperCase()}-${901 + index}`,
      fromHospital: `${cityLabel} ${index === 0 ? 'General Hospital' : index === 1 ? 'City Medical' : 'District Care'}`,
      toHospital: `${cityLabel} ${index === 0 ? 'Central Med' : index === 1 ? 'North Wing Hospital' : 'Medical Centre'}`,
      ambulanceId: `AMB-${cityLabel.slice(0, 1).toUpperCase()}${104 + index}`,
      qrCode: `ML-${cityLabel.slice(0, 3).toUpperCase()}-${901 + index}-QRCODE`,
   }));
}

export default function TransfersPage() {
   const [transfers, setTransfers] = useState<TransferItem[]>(INITIAL_TRANSFERS);
   const [selectedId, setSelectedId] = useState(INITIAL_TRANSFERS[0].id);
   const [searchText, setSearchText] = useState('');
   const [stageFilter, setStageFilter] = useState<Stage | 'all'>('all');
   const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium'>('All');
   const [routeMode, setRouteMode] = useState<'Fastest' | 'Balanced'>('Fastest');
   const [actionMessage, setActionMessage] = useState('');
   const [loadingApi, setLoadingApi] = useState(false);

   const selectedTransfer = transfers.find((item) => item.id === selectedId) ?? transfers[0] ?? INITIAL_TRANSFERS[0];

   const counts = useMemo(
      () => ({
         requested: transfers.filter((item) => item.stage === 'requested').length,
         accepted: transfers.filter((item) => item.stage === 'accepted').length,
         transit: transfers.filter((item) => item.stage === 'transit').length,
         completed: transfers.filter((item) => item.stage === 'completed').length,
      }),
      [transfers]
   );

   const activeTransfers = transfers.filter((item) => item.stage !== 'completed');
   const filteredActiveTransfers = activeTransfers.filter(
      (item) =>
         (item.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
            item.id.toLowerCase().includes(searchText.toLowerCase()) ||
            item.toHospital.toLowerCase().includes(searchText.toLowerCase())) &&
         (stageFilter === 'all' || item.stage === stageFilter) &&
         (priorityFilter === 'All' || item.priority === priorityFilter)
   );

   const selectedStageIndex = STAGE_ORDER.indexOf(selectedTransfer.stage);
   const [selectedCity, setSelectedCity] = useState<string>(() => localStorage.getItem('medlink-selected-city') || runtimeConfig.defaultCity || 'Indore');

   useEffect(() => {
      const handler = (ev: Event) => {
         const city = (ev as CustomEvent).detail as string;
         if (city) setSelectedCity(city);
      };
      window.addEventListener('medlink:city-changed', handler as EventListener);
      return () => window.removeEventListener('medlink:city-changed', handler as EventListener);
   }, []);
   const bounds = CITY_BOUNDS[selectedCity] ?? CITY_BOUNDS.Indore;
   const fallbackMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bounds.minLng}%2C${bounds.minLat}%2C${bounds.maxLng}%2C${bounds.maxLat}&layer=mapnik&marker=${bounds.markerLat}%2C${bounds.markerLng}`;
   const mapUrl = getConfiguredMapUrl(fallbackMapUrl, selectedCity);

   const highPriorityCount = transfers.filter((item) => item.priority === 'High' && item.stage !== 'completed').length;
   const avgEta =
      activeTransfers.length > 0
         ? Math.round(activeTransfers.reduce((sum, item) => sum + item.etaMin, 0) / activeTransfers.length)
         : 0;

   useEffect(() => {
      const interval = setInterval(() => {
         setTransfers((prev) => {
            const now = new Date();
            const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            return prev.map((item) => {
               if (item.stage !== 'transit' || item.etaMin <= 0) return item;

               const updatedEta = item.etaMin - 1;
               if (updatedEta > 0) {
                  return { ...item, etaMin: updatedEta };
               }

               return {
                  ...item,
                  etaMin: 0,
                  stage: 'completed',
                  history: [...item.history, { time: timeLabel, text: 'Patient reached destination. Case auto-marked completed.' }],
               };
            });
         });
      }, 30000);

      return () => clearInterval(interval);
   }, []);

   useEffect(() => {
      if (transfers.length > 0 && !transfers.some((item) => item.id === selectedId)) {
         setSelectedId(transfers[0].id);
      }
   }, [selectedId, transfers]);

   useEffect(() => {
      let active = true;

      const loadTransfers = async () => {
         setLoadingApi(true);
         setActionMessage('');
         const localCityTransfers = getCityLocalTransfers(selectedCity);
         setTransfers(localCityTransfers);
         setSelectedId(localCityTransfers[0]?.id || selectedId);
         try {
            const city = encodeURIComponent(selectedCity || runtimeConfig.defaultCity);
            const response = await fetch(`${runtimeConfig.apiBaseUrl}/api/dashboard/transfers?city=${city}`);

            if (!response.ok) {
               throw new Error(`Transfer API failed (${response.status})`);
            }

            const payload = (await response.json()) as DashboardTransfer[];
            if (!active || !Array.isArray(payload)) return;

            const mapped = payload.map(mapApiTransfer);
            if (mapped.length > 0) {
               setTransfers(mapped);
               setSelectedId(mapped[0].id);
            }
         } catch (error) {
            if (active) {
               console.error('Failed to fetch transfers from backend API', error);
            }
         } finally {
            if (active) {
               setLoadingApi(false);
            }
         }
      };

      loadTransfers();
      return () => {
         active = false;
      };
   }, [selectedCity]);

   const appendHistoryEvent = (message: string, etaUpdater?: (currentEta: number) => number) => {
      const now = new Date();
      const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      setTransfers((prev) =>
         prev.map((item) => {
            if (item.id !== selectedTransfer.id) return item;
            return {
               ...item,
               etaMin: etaUpdater ? etaUpdater(item.etaMin) : item.etaMin,
               history: [...item.history, { time: timeLabel, text: message }],
            };
         })
      );
   };

   const toggleChecklist = (key: 'stabilization' | 'documents' | 'bedConfirmed') => {
      setTransfers((prev) =>
         prev.map((item) => {
            if (item.id !== selectedTransfer.id) return item;
            return {
               ...item,
               checklist: {
                  ...item.checklist,
                  [key]: !item.checklist[key],
               },
            };
         })
      );
   };

   const createEmergencyTransfer = () => {
      const now = new Date();
      const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const randomId = `TR-${Math.floor(950 + Math.random() * 49)}`;

      const newTransfer: TransferItem = {
         id: randomId,
         patientName: 'Emergency Case',
         condition: 'Multi-organ critical support',
         fromHospital: 'South District Care',
         toHospital: 'Central Med',
         stage: 'requested',
         etaMin: 18,
         ambulanceId: 'AMB-120',
         priority: 'High',
         qrCode: `ML-${randomId}-QRCODE`,
         checklist: {
            stabilization: false,
            documents: false,
            bedConfirmed: false,
         },
         history: [{ time: timeLabel, text: 'Emergency transfer created from quick action panel.' }],
      };

      setTransfers((prev) => [newTransfer, ...prev]);
      setSelectedId(newTransfer.id);
      setActionMessage(`Emergency transfer ${randomId} created successfully.`);
   };

   const checklistCompleted = Object.values(selectedTransfer.checklist).filter(Boolean).length;
   const checklistPercent = Math.round((checklistCompleted / 3) * 100);

   const updateTransferStage = (direction: 'forward' | 'backward') => {
      setTransfers((prev) =>
         prev.map((item) => {
            if (item.id !== selectedTransfer.id) return item;
            const currentIndex = STAGE_ORDER.indexOf(item.stage);
            const targetIndex = direction === 'forward' ? Math.min(currentIndex + 1, STAGE_ORDER.length - 1) : Math.max(currentIndex - 1, 0);
            const nextStage = STAGE_ORDER[targetIndex];
            if (nextStage === item.stage) return item;

            const stageLabel = STAGE_META[nextStage].title;
            const now = new Date();
            const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            return {
               ...item,
               stage: nextStage,
               etaMin: nextStage === 'completed' ? 0 : Math.max(2, item.etaMin - (direction === 'forward' ? 4 : -4)),
               history: [...item.history, { time: timeLabel, text: `Status changed to ${stageLabel}.` }],
            };
         })
      );
   };

   return (
      <div className="min-h-full flex flex-col gap-5 pb-2">
         <div className="mb-1">
            <h1 className="text-2xl font-bold text-[var(--app-text)]">Patient Transfer Command Center</h1>
            <p className="text-[var(--app-muted)] mt-1">Manage and track inter-facility patient movements in real time.</p>
         </div>

         <section className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
               <div className="text-sm font-semibold text-[var(--app-text)]">Transfer Pipeline</div>
               <div className="text-xs text-[var(--app-muted)]">Requested → Accepted → Ambulance En Route → Completed</div>
            </div>

            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
               <div className="rounded-lg border border-[var(--app-border)] bg-white p-3">
                  <div className="text-[11px] uppercase font-semibold text-[var(--app-muted)]">Active Transfers</div>
                  <div className="text-xl font-bold text-[var(--app-text)] mt-1">{activeTransfers.length}</div>
               </div>
               <div className="rounded-lg border border-[var(--app-border)] bg-white p-3">
                  <div className="text-[11px] uppercase font-semibold text-[var(--app-muted)]">High Priority</div>
                  <div className="text-xl font-bold text-[var(--app-red)] mt-1">{highPriorityCount}</div>
               </div>
               <div className="rounded-lg border border-[var(--app-border)] bg-white p-3">
                  <div className="text-[11px] uppercase font-semibold text-[var(--app-muted)]">Average ETA</div>
                  <div className="text-xl font-bold text-[var(--app-blue)] mt-1">{avgEta} min</div>
               </div>
               <div className="rounded-lg border border-[var(--app-border)] bg-white p-3">
                  <div className="text-[11px] uppercase font-semibold text-[var(--app-muted)]">Handover Readiness</div>
                  <div className="text-xl font-bold text-emerald-600 mt-1">{checklistPercent}%</div>
               </div>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
               {STAGE_ORDER.map((stageKey) => {
                  const stage = STAGE_META[stageKey];
                  const Icon = stage.icon;
                  const count = counts[stageKey];
                  return (
                     <div key={stageKey} className="rounded-lg border border-[var(--app-border)] bg-white p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Icon className={`w-4 h-4 ${stage.color}`} />
                           <span className="text-sm font-medium text-[var(--app-text)]">{stage.title}</span>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-md bg-gray-100 text-[var(--app-muted)]">{count}</span>
                     </div>
                  );
               })}
            </div>
         </section>

         <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
            <div className="xl:col-span-3 bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-sm flex flex-col min-h-[360px] xl:h-[640px]">
               <div className="p-4 border-b border-[var(--app-border)]">
                  <h2 className="text-sm font-bold text-[var(--app-text)] uppercase">Active Transfer Cards</h2>
                  <div className="relative mt-3">
                     <Search className="w-4 h-4 text-[var(--app-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                     <input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search patient or transfer ID"
                        className="w-full rounded-md border border-[var(--app-border)] bg-white py-2 pl-9 pr-3 text-sm text-[var(--app-text)]"
                     />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                     <select
                        value={stageFilter}
                        onChange={(e) => setStageFilter(e.target.value as Stage | 'all')}
                        className="rounded-md border border-[var(--app-border)] bg-white px-2 py-1.5 text-xs text-[var(--app-text)]"
                     >
                        <option value="all">All Stages</option>
                        <option value="requested">Requested</option>
                        <option value="accepted">Accepted</option>
                        <option value="transit">Transit</option>
                     </select>
                     <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as 'All' | 'High' | 'Medium')}
                        className="rounded-md border border-[var(--app-border)] bg-white px-2 py-1.5 text-xs text-[var(--app-text)]"
                     >
                        <option value="All">All Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                     </select>
                  </div>

                  <button
                     onClick={createEmergencyTransfer}
                     className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-md bg-[var(--app-blue)] px-3 py-2 text-xs font-semibold text-white"
                  >
                     <Plus className="w-3.5 h-3.5" /> Create Emergency Transfer
                  </button>
               </div>

               <div className="p-3 space-y-3 overflow-y-auto flex-1">
                  {loadingApi && <div className="text-xs text-[var(--app-muted)] px-1">Syncing transfers from API...</div>}
                  {filteredActiveTransfers.map((transfer) => (
                     <button
                        key={transfer.id}
                        onClick={() => setSelectedId(transfer.id)}
                        className={`w-full text-left rounded-lg border p-3 transition-colors ${
                           selectedTransfer.id === transfer.id
                              ? 'border-[var(--app-blue)] bg-blue-50/50'
                              : 'border-[var(--app-border)] bg-white hover:bg-gray-50'
                        }`}
                     >
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-bold text-[var(--app-muted)]">#{transfer.id}</span>
                           <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${transfer.priority === 'High' ? 'text-[var(--app-red)] bg-red-50' : 'text-[var(--app-blue)] bg-blue-50'}`}>
                              {transfer.priority}
                           </span>
                        </div>
                        <div className="mt-2 text-sm font-semibold text-[var(--app-text)]">{transfer.patientName}</div>
                        <div className="mt-1 text-xs text-[var(--app-muted)]">{transfer.fromHospital} → {transfer.toHospital}</div>
                     </button>
                  ))}
                  {filteredActiveTransfers.length === 0 && (
                     <div className="text-sm text-center text-[var(--app-muted)] py-6">No active transfers found.</div>
                  )}
               </div>
            </div>

            <div className="xl:col-span-5 bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-sm overflow-hidden min-h-[360px] xl:h-[640px] flex flex-col">
               <div className="p-4 border-b border-[var(--app-border)] flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[var(--app-text)] uppercase flex items-center gap-2">
                     <Ambulance className="w-4 h-4 text-[var(--app-blue)]" /> Ambulance Map (Live Route)
                  </h2>
                  <div className="flex items-center gap-2">
                     <select
                        value={routeMode}
                        onChange={(e) => setRouteMode(e.target.value as 'Fastest' | 'Balanced')}
                        className="rounded-md border border-[var(--app-border)] bg-white px-2 py-1 text-xs text-[var(--app-text)]"
                     >
                        <option value="Fastest">Fastest</option>
                        <option value="Balanced">Balanced</option>
                     </select>
                     <span className="text-xs text-[var(--app-muted)]">ETA {selectedTransfer.etaMin} mins</span>
                  </div>
               </div>

               <div className="relative h-[420px] xl:h-auto xl:flex-1 bg-gradient-to-br from-blue-50 via-white to-teal-50">
                  <iframe
                     title="Live transfer map"
                     src={mapUrl}
                     className="absolute inset-0 h-full w-full border-0 opacity-65"
                     loading="lazy"
                     referrerPolicy="no-referrer-when-downgrade"
                  />
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 620 320" preserveAspectRatio="none">
                     <defs>
                        <pattern id="routeGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                           <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#dbeafe" strokeWidth="1" />
                        </pattern>
                     </defs>
                     <rect width="620" height="320" fill="url(#routeGrid)" />
                     <path d="M80 250 C170 220, 220 190, 310 170 S430 120, 540 80" fill="none" stroke="#2563EB" strokeWidth="8" strokeLinecap="round" strokeDasharray="14 10" />
                  </svg>

                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white/60 to-teal-50/60" />

                  <div className="absolute left-[12%] top-[76%] -translate-x-1/2 -translate-y-1/2">
                     <div className="h-10 w-10 rounded-full bg-[var(--app-red)] text-white flex items-center justify-center shadow-lg">
                        <MapPin className="w-4 h-4" />
                     </div>
                     <div className="mt-2 text-[11px] bg-white/90 border border-[var(--app-border)] rounded px-2 py-0.5">Pickup</div>
                  </div>

                  <div className="absolute left-[50%] top-[53%] -translate-x-1/2 -translate-y-1/2">
                     <div className="relative h-11 w-11 rounded-full bg-[var(--app-blue)] text-white flex items-center justify-center shadow-lg">
                        <span className="absolute h-full w-full rounded-full bg-[var(--app-blue)] opacity-30 animate-ping" />
                        <Ambulance className="w-4 h-4 relative" />
                     </div>
                     <div className="mt-2 text-[11px] bg-white/90 border border-[var(--app-border)] rounded px-2 py-0.5">{selectedTransfer.ambulanceId}</div>
                  </div>

                  <div className="absolute right-[8%] top-[24%] translate-x-1/2 -translate-y-1/2">
                     <div className="h-11 w-11 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                        <ClipboardCheck className="w-4 h-4" />
                     </div>
                     <div className="mt-2 text-[11px] bg-white/90 border border-[var(--app-border)] rounded px-2 py-0.5">Destination</div>
                  </div>

                  <div className="absolute bottom-4 left-3 right-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                     <div className="rounded-md bg-white/95 border border-[var(--app-border)] p-2 text-xs text-[var(--app-muted)]">
                        <div className="font-semibold text-[var(--app-text)]">Condition</div>
                        <div>{selectedTransfer.condition}</div>
                     </div>
                     <div className="rounded-md bg-white/95 border border-[var(--app-border)] p-2 text-xs text-[var(--app-muted)]">
                        <div className="font-semibold text-[var(--app-text)]">Route</div>
                        <div>{routeMode === 'Fastest' ? 'Fastest EMS corridor' : 'Balanced route (safer turns)'}</div>
                     </div>
                     <div className="rounded-md bg-white/95 border border-[var(--app-border)] p-2 text-xs text-[var(--app-muted)]">
                        <div className="font-semibold text-[var(--app-text)]">Traffic</div>
                        <div>Moderate</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="xl:col-span-4 bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-sm flex flex-col min-h-[360px] xl:h-[640px]">
               <div className="p-4 border-b border-[var(--app-border)]">
                  <h2 className="text-sm font-bold text-[var(--app-text)] uppercase">Transfer Details</h2>
               </div>

               <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                  {actionMessage && (
                     <div className="rounded-md border border-[var(--app-blue)]/20 bg-blue-50 px-3 py-2 text-xs font-medium text-[var(--app-blue)]">
                        {actionMessage}
                     </div>
                  )}

                  <div className="rounded-lg border border-[var(--app-border)] bg-white p-3">
                     <div className="text-xs text-[var(--app-muted)]">Transfer ID</div>
                     <div className="text-sm font-semibold text-[var(--app-text)] mt-1">#{selectedTransfer.id}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <InfoCard label="Patient" value={selectedTransfer.patientName} />
                     <InfoCard label="ETA" value={selectedTransfer.etaMin === 0 ? 'Arrived' : `${selectedTransfer.etaMin} mins`} />
                     <InfoCard label="Condition" value={selectedTransfer.condition} />
                     <InfoCard label="Ambulance" value={selectedTransfer.ambulanceId} />
                  </div>

                  <div className="rounded-lg border border-[var(--app-border)] bg-white p-3">
                     <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] uppercase font-semibold">
                        <QrCode className="w-4 h-4" /> QR Verification
                     </div>
                     <div className="mt-2 rounded-md border border-dashed border-[var(--app-border)] bg-gray-50 p-2 text-[11px] font-mono text-[var(--app-text)] break-all">
                        {selectedTransfer.qrCode}
                     </div>
                  </div>

                  <div className="flex gap-2">
                     <button
                        onClick={() => updateTransferStage('backward')}
                        disabled={selectedStageIndex === 0}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-[var(--app-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--app-text)] disabled:opacity-40"
                     >
                        <ArrowLeft className="w-4 h-4" /> Back
                     </button>
                     <button
                        onClick={() => updateTransferStage('forward')}
                        disabled={selectedStageIndex === STAGE_ORDER.length - 1}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-md bg-[var(--app-blue)] px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
                     >
                        Forward <ArrowRight className="w-4 h-4" />
                     </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                     <button
                        onClick={() => {
                           appendHistoryEvent(`Hospital coordinator contacted for ${selectedTransfer.toHospital}.`);
                           setActionMessage(`Call placed to ${selectedTransfer.toHospital}.`);
                        }}
                        className="rounded-md border border-[var(--app-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--app-text)] inline-flex items-center justify-center gap-1"
                     >
                        <PhoneCall className="w-3.5 h-3.5" /> Call Hospital
                     </button>
                     <button
                        onClick={() => {
                           appendHistoryEvent('Route recalculated by traffic engine.', (currentEta) => Math.max(2, currentEta - 2));
                           setActionMessage('Route refreshed. ETA improved by 2 minutes.');
                        }}
                        className="rounded-md border border-[var(--app-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--app-text)] inline-flex items-center justify-center gap-1"
                     >
                        <Route className="w-3.5 h-3.5" /> Refresh Route
                     </button>
                  </div>

                  <div className="rounded-lg border border-[var(--app-border)] bg-white p-3">
                     <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[var(--app-muted)]">
                        <ShieldCheck className="w-4 h-4" /> Handover Checklist
                     </div>
                     <div className="mt-3 space-y-2">
                        <ChecklistItem
                           label="Patient stabilized"
                           checked={selectedTransfer.checklist.stabilization}
                           onToggle={() => toggleChecklist('stabilization')}
                        />
                        <ChecklistItem
                           label="Documents verified"
                           checked={selectedTransfer.checklist.documents}
                           onToggle={() => toggleChecklist('documents')}
                        />
                        <ChecklistItem
                           label="Destination bed confirmed"
                           checked={selectedTransfer.checklist.bedConfirmed}
                           onToggle={() => toggleChecklist('bedConfirmed')}
                        />
                     </div>
                     <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${checklistPercent}%` }} />
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <section className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-sm">
            <div className="p-4 border-b border-[var(--app-border)]">
               <h2 className="text-sm font-bold text-[var(--app-text)] uppercase">Transfer History Timeline</h2>
            </div>

            <div className="p-4">
               <div className="space-y-3">
                  {selectedTransfer.history.map((event, index) => (
                     <div key={`${event.time}-${index}`} className="flex gap-3">
                        <div className="flex flex-col items-center">
                           <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--app-blue)]" />
                           {index !== selectedTransfer.history.length - 1 && <span className="mt-1 h-8 w-px bg-[var(--app-border)]" />}
                        </div>
                        <div className="flex-1 pb-1">
                           <div className="text-xs text-[var(--app-muted)]">{event.time}</div>
                           <div className="text-sm text-[var(--app-text)] mt-0.5">{event.text}</div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>
      </div>
   );
}

function InfoCard({ label, value }: { label: string; value: string }) {
   return (
      <div className="rounded-lg border border-[var(--app-border)] bg-white p-3">
         <div className="text-xs text-[var(--app-muted)]">{label}</div>
         <div className="mt-1 text-sm font-semibold text-[var(--app-text)]">{value}</div>
      </div>
   );
}

function ChecklistItem({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
   return (
      <button
         type="button"
         onClick={onToggle}
         className="w-full rounded-md border border-[var(--app-border)] px-3 py-2 text-left text-xs text-[var(--app-text)] flex items-center justify-between bg-gray-50 hover:bg-white transition-colors"
      >
         <span>{label}</span>
         {checked ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> : <CircleDashed className="w-3.5 h-3.5 text-[var(--app-muted)]" />}
      </button>
   );
}
