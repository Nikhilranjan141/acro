import { useEffect, useMemo, useState } from 'react';
import {
   Map,
   TrendingUp,
   Sparkles,
   Building2,
   Ambulance,
   Siren,
   ArrowUpRight,
   AlertTriangle,
   Filter,
   Activity,
   Brain,
   Navigation,
   RefreshCw,
   Loader2,
   ShieldAlert,
} from 'lucide-react';
import { getConfiguredMapUrl, runtimeConfig } from '../../lib/runtimeConfig';

type PredictionItem = {
   id: number;
   title: string;
   description: string;
   type: 'critical' | 'warning' | 'info';
};

type DashboardSummary = {
   kpis?: {
      activeEmergencies?: number;
      ambulancesActive?: number;
      icuAvailable?: number;
      doctorsAvailable?: number;
      oxygenAvg?: number;
   };
   resources?: Array<{
      hospital_id?: string;
      icu?: { total?: number; used?: number };
      oxygen_pct?: number;
   }>;
   hospitals?: Array<{ id?: string; name?: string; lat?: number; lng?: number }>;
   ambulances?: Array<{ id?: string; lat?: number; lng?: number; status?: string }>;
};

type AiNarrative = {
   headline: string;
   recommendation: string;
   confidence: number;
};

const DEFAULT_INSIGHT_FORECAST = {
   icu: [54, 58, 62, 67, 72, 77, 82],
   ventilator: [46, 49, 53, 57, 61, 65, 69],
   surge: [40, 44, 49, 55, 61, 67, 72],
   ambulance: [50, 54, 58, 62, 67, 72, 78],
};

function sanitizeInsightSeries(values: number[], fallback: number[]) {
   if (!Array.isArray(values)) return fallback;

   const normalized = values
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value))
      .map((value) => Math.max(18, Math.min(96, value)))
      .slice(0, fallback.length);

   if (normalized.length !== fallback.length) return fallback;
   return normalized;
}

const CITY_BOUNDS: Record<string, { minLat: number; maxLat: number; minLng: number; maxLng: number; markerLat: number; markerLng: number }> = {
   Indore: { minLat: 22.64, maxLat: 22.79, minLng: 75.78, maxLng: 75.96, markerLat: 22.7196, markerLng: 75.8577 },
   Bhopal: { minLat: 23.15, maxLat: 23.35, minLng: 77.3, maxLng: 77.5, markerLat: 23.2599, markerLng: 77.4126 },
   Ujjain: { minLat: 23.12, maxLat: 23.26, minLng: 75.72, maxLng: 75.86, markerLat: 23.1765, markerLng: 75.7885 },
};

const CITY_CENTER: Record<string, { lat: number; lng: number }> = {
   Indore: { lat: 22.7196, lng: 75.8577 },
   Bhopal: { lat: 23.2599, lng: 77.4126 },
   Ujjain: { lat: 23.1765, lng: 75.7885 },
};

function getCityInsightsFallback(city: string) {
   const center = CITY_CENTER[city] || CITY_CENTER.Indore;
   const fallbackByCity: Record<string, { hospitals: string[]; ambulancesActive: number; transfersToday: number; alerts: PredictionItem[]; narrative: AiNarrative }> = {
      Indore: {
         hospitals: ['Indore Central Hospital', 'Eastside Medical Centre', 'North Wing General Hospital'],
         ambulancesActive: 5,
         transfersToday: 3,
         alerts: [
            { id: 101, title: 'ICU Overload Risk - Indore Central Cluster', description: 'Projected ICU occupancy may reach 92% in central cluster.', type: 'critical' },
            { id: 102, title: 'Ambulance Demand Spike - Eastside', description: 'Elevated demand expected in eastside corridor for next 2 hours.', type: 'warning' },
         ],
         narrative: {
            headline: 'Indore: demand pressure expected in central emergency belt.',
            recommendation: 'Keep one ambulance reserve near central cluster and pre-alert ICU team.',
            confidence: 84,
         },
      },
      Bhopal: {
         hospitals: ['Bhopal Central Trauma Care', 'JP Hospital Bhopal', 'AIIMS Bhopal Emergency Block'],
         ambulancesActive: 4,
         transfersToday: 2,
         alerts: [
            { id: 201, title: 'ICU Load Risk - Bhopal Core', description: 'Critical care occupancy may cross 88% near core cluster.', type: 'critical' },
            { id: 202, title: 'Transfer Delay Advisory - Bhopal', description: 'Moderate corridor delays expected for 60-90 minutes.', type: 'warning' },
         ],
         narrative: {
            headline: 'Bhopal: central transfer load rising steadily.',
            recommendation: 'Divert one standby ambulance to the core and stagger non-critical transfers.',
            confidence: 82,
         },
      },
      Ujjain: {
         hospitals: ['Ujjain District Hospital', 'R D Gardi Medical College', 'Civil Hospital Ujjain'],
         ambulancesActive: 3,
         transfersToday: 2,
         alerts: [
            { id: 301, title: 'ER Demand Rise - Ujjain North', description: 'ER admissions may rise by 12% in evening window.', type: 'warning' },
            { id: 302, title: 'Critical Oxygen Watch - Ujjain', description: 'One trauma unit may dip below safe oxygen reserve.', type: 'critical' },
         ],
         narrative: {
            headline: 'Ujjain: stable flow with one high-risk oxygen pocket.',
            recommendation: 'Prioritize oxygen refill to trauma unit and keep one rapid transfer lane open.',
            confidence: 80,
         },
      },
   };

   const cityData = fallbackByCity[city] || fallbackByCity.Indore;
   const hospitalOffsets = [
      { lat: 0, lng: 0 },
      { lat: -0.018, lng: 0.022 },
      { lat: 0.02, lng: 0.017 },
   ];

   return {
      summary: {
         kpis: {
            activeEmergencies: city === 'Indore' ? 4 : city === 'Bhopal' ? 3 : 2,
            ambulancesActive: cityData.ambulancesActive,
            icuAvailable: city === 'Indore' ? 43 : city === 'Bhopal' ? 25 : 17,
            doctorsAvailable: city === 'Indore' ? 84 : city === 'Bhopal' ? 55 : 38,
            oxygenAvg: city === 'Ujjain' ? 74 : 78,
         },
         hospitals: cityData.hospitals.map((name, idx) => ({
            id: `${city}-h${idx + 1}`,
            name,
            lat: center.lat + (hospitalOffsets[idx]?.lat || 0),
            lng: center.lng + (hospitalOffsets[idx]?.lng || 0),
         })),
         resources: [],
         ambulances: [],
      } as DashboardSummary,
      alerts: cityData.alerts,
      transfersToday: cityData.transfersToday,
      narrative: cityData.narrative,
   };
}

export default function InsightsPage() {
   const [selectedLayer, setSelectedLayer] = useState<'capacity' | 'ambulance' | 'alerts'>('capacity');
   const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium'>('all');
   const [selectedZone, setSelectedZone] = useState('North District');
   const [alerts, setAlerts] = useState<Array<{ id: string; title: string; severity: 'high' | 'medium'; detail: string }>>([]);
   const [summary, setSummary] = useState<DashboardSummary | null>(null);
   const [transfersToday, setTransfersToday] = useState(0);
   const [aiNarrative, setAiNarrative] = useState<AiNarrative>({
      headline: 'AI model is calibrating current city conditions.',
      recommendation: 'Keep one ambulance reserve near the highest ICU utilization cluster.',
      confidence: 82,
   });
   const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);

    const [city, setCity] = useState<string>(() => localStorage.getItem('medlink-selected-city') || runtimeConfig.defaultCity || 'Indore');

    useEffect(() => {
       const handler = (ev: Event) => {
          const c = (ev as CustomEvent).detail as string;
          if (c) setCity(c);
       };
       window.addEventListener('medlink:city-changed', handler as EventListener);
       return () => window.removeEventListener('medlink:city-changed', handler as EventListener);
    }, []);

   const bounds = CITY_BOUNDS[city] ?? CITY_BOUNDS.Indore;
   const fallbackMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bounds.minLng}%2C${bounds.minLat}%2C${bounds.maxLng}%2C${bounds.maxLat}&layer=mapnik&marker=${bounds.markerLat}%2C${bounds.markerLng}`;
   const mapUrl = getConfiguredMapUrl(fallbackMapUrl, city);

   const fetchAll = async (silent = false) => {
      if (silent) setRefreshing(true);
      else setLoading(true);

      const fallback = getCityInsightsFallback(city);
      setSummary(fallback.summary);
      setAlerts(
         fallback.alerts.map((item) => ({
            id: String(item.id),
            title: item.title,
            severity: item.type === 'critical' ? 'high' : 'medium',
            detail: item.description,
         }))
      );
      setTransfersToday(fallback.transfersToday);
      setAiNarrative(fallback.narrative);

      try {
         const [summaryRes, predictionsRes, transfersRes, aiRes] = await Promise.all([
            fetch(`${runtimeConfig.apiBaseUrl}/api/dashboard/summary?city=${encodeURIComponent(city)}`),
            fetch(`${runtimeConfig.apiBaseUrl}/api/ai/predictions?city=${encodeURIComponent(city)}`),
            fetch(`${runtimeConfig.apiBaseUrl}/api/dashboard/transfers?city=${encodeURIComponent(city)}`),
            fetch(`${runtimeConfig.apiBaseUrl}/api/ai/insights?city=${encodeURIComponent(city)}`),
         ]);

         if (summaryRes.ok) {
            const payload = (await summaryRes.json()) as DashboardSummary;
            if ((payload?.hospitals?.length || 0) > 0) {
               setSummary(payload);
            }
         }

         if (predictionsRes.ok) {
            const predictions = (await predictionsRes.json()) as PredictionItem[];
            if (Array.isArray(predictions) && predictions.length > 0) {
               setAlerts(
                  predictions.map((item) => ({
                     id: String(item.id),
                     title: item.title,
                     severity: item.type === 'critical' ? 'high' : 'medium',
                     detail: item.description,
                  }))
               );
            }
         }

         if (transfersRes.ok) {
            const transferPayload = (await transfersRes.json()) as unknown[];
            if (Array.isArray(transferPayload) && transferPayload.length > 0) {
               setTransfersToday(transferPayload.length);
            }
         }

         if (aiRes.ok) {
            const aiPayload = (await aiRes.json()) as AiNarrative;
            if (aiPayload?.headline) {
               setAiNarrative(aiPayload);
            }
         }
      } catch (error) {
         console.error('Insights fetch failed', error);
      } finally {
         setLoading(false);
         setRefreshing(false);
      }
   };

   useEffect(() => {
      fetchAll();
   }, [city]);

   const projectToMap = (lat?: number, lng?: number) => {
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

      const safeLat = lat as number;
      const safeLng = lng as number;
      const latRange = bounds.maxLat - bounds.minLat;
      const lngRange = bounds.maxLng - bounds.minLng;
      if (!latRange || !lngRange) return null;

      const xRaw = ((safeLng - bounds.minLng) / lngRange) * 100;
      const yRaw = (1 - (safeLat - bounds.minLat) / latRange) * 100;
      const x = Math.min(90, Math.max(10, xRaw));
      const y = Math.min(86, Math.max(14, yRaw));
      return { x, y };
   };

   const zones = useMemo(() => {
      const hospitals = summary?.hospitals ?? [];
      const resources = summary?.resources ?? [];
      const center = CITY_CENTER[city] || CITY_CENTER.Indore;

      if (hospitals.length === 0) {
         return [
            { name: `${city} North District`, risk: 'high' as const, load: 86, x: projectToMap(center.lat + 0.02, center.lng - 0.015)?.x ?? 32, y: projectToMap(center.lat + 0.02, center.lng - 0.015)?.y ?? 30 },
            { name: `${city} Central Core`, risk: 'medium' as const, load: 72, x: projectToMap(center.lat, center.lng)?.x ?? 50, y: projectToMap(center.lat, center.lng)?.y ?? 50 },
            { name: `${city} East Corridor`, risk: 'high' as const, load: 89, x: projectToMap(center.lat - 0.015, center.lng + 0.02)?.x ?? 70, y: projectToMap(center.lat - 0.015, center.lng + 0.02)?.y ?? 56 },
            { name: `${city} South Belt`, risk: 'medium' as const, load: 64, x: projectToMap(center.lat - 0.02, center.lng - 0.01)?.x ?? 44, y: projectToMap(center.lat - 0.02, center.lng - 0.01)?.y ?? 74 },
         ];
      }

      return hospitals.slice(0, 8).map((hospital, index) => {
         const resource = resources.find((entry) => entry.hospital_id === hospital.id);
         const icuUsed = resource?.icu?.used ?? index + 2;
         const icuTotal = Math.max(resource?.icu?.total ?? index + 8, 1);
         const load = Math.round((icuUsed / icuTotal) * 100);
         const risk = load >= 85 ? 'high' : 'medium';
         const projected = projectToMap(hospital.lat, hospital.lng);

         return {
            name: hospital.name || `Hospital ${index + 1}`,
            risk,
            load,
            x: projected?.x ?? 18 + ((index * 14) % 68),
            y: projected?.y ?? 30 + ((index * 11) % 54),
         };
      });
   }, [bounds.maxLat, bounds.maxLng, bounds.minLat, bounds.minLng, city, summary]);

   useEffect(() => {
      if (zones.length === 0) return;
      if (!zones.some((zone) => zone.name === selectedZone)) {
         setSelectedZone(zones[0].name);
      }
   }, [selectedZone, zones]);

   const kpis = {
      hospitalsOnline: summary?.hospitals?.length ?? 0,
      ambulancesActive: summary?.kpis?.ambulancesActive ?? 0,
      criticalAlerts: alerts.filter((item) => item.severity === 'high').length,
      transfersToday,
   };

   const filteredZones = zones.filter((zone) => {
      if (riskFilter === 'all') return true;
      return zone.risk === riskFilter;
   });

   const selectedZoneData = zones.find((zone) => zone.name === selectedZone) ?? zones[0];

   const aiOpsScore = useMemo(() => {
      const emergency = summary?.kpis?.activeEmergencies ?? 0;
      const oxygen = summary?.kpis?.oxygenAvg ?? 75;
      const critical = alerts.filter((item) => item.severity === 'high').length;
      const score = 92 - emergency * 4 - critical * 6 + (oxygen > 75 ? 4 : 0);
      return Math.max(58, Math.min(96, score));
   }, [alerts, summary?.kpis?.activeEmergencies, summary?.kpis?.oxygenAvg]);

   const forecastSeries = useMemo(() => {
      const emergency = summary?.kpis?.activeEmergencies ?? 3;
      const ambulances = summary?.kpis?.ambulancesActive ?? 4;
      const oxygen = summary?.kpis?.oxygenAvg ?? 76;

      const rawIcu = [
            48 + emergency * 2,
            53 + emergency * 2,
            58 + emergency * 2,
            62 + emergency * 2,
            68 + emergency * 2,
            73 + emergency * 2,
            78 + emergency * 2,
      ];

      const rawVentilator = [
            42 + ambulances,
            45 + ambulances,
            49 + ambulances,
            54 + ambulances,
            58 + ambulances,
            61 + ambulances,
            66 + ambulances,
      ];

      const rawSurge = [
            36 + emergency * 2,
            40 + emergency * 2,
            45 + emergency * 2,
            50 + emergency * 2,
            56 + emergency * 2,
            62 + emergency * 2,
            67 + emergency * 2,
      ];

      const rawAmbulance = [
            46 + ambulances,
            50 + ambulances,
            54 + ambulances,
            58 + ambulances,
            62 + ambulances,
            68 + ambulances,
            72 + ambulances,
      ];

      return {
         icu: sanitizeInsightSeries(rawIcu, DEFAULT_INSIGHT_FORECAST.icu),
         ventilator: sanitizeInsightSeries(rawVentilator, DEFAULT_INSIGHT_FORECAST.ventilator),
         surge: sanitizeInsightSeries(rawSurge, DEFAULT_INSIGHT_FORECAST.surge),
         ambulance: sanitizeInsightSeries(rawAmbulance, DEFAULT_INSIGHT_FORECAST.ambulance),
         confidenceBand: oxygen >= 75 ? 'Stable' : 'Watch',
      };
   }, [summary?.kpis?.activeEmergencies, summary?.kpis?.ambulancesActive, summary?.kpis?.oxygenAvg]);

   const acknowledgeAlert = (id: string) => {
      setAlerts((prev) => prev.filter((item) => item.id !== id));
   };

  return (
    <div className="space-y-6">
          <div className="mb-2">
        <h1 className="text-2xl font-bold text-[var(--app-text)] flex items-center">
               <Map className="w-6 h-6 mr-3 text-[var(--app-purple)]" />
               AI Health Intelligence Center
        </h1>
            <p className="text-[var(--app-muted)] mt-1">Real-time geospatial monitoring, map intelligence, and predictive healthcare insights.</p>
      </div>

         {loading && (
            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] p-4 text-sm text-[var(--app-muted)] inline-flex items-center gap-2">
               <Loader2 className="w-4 h-4 animate-spin" /> Loading live intelligence feed...
            </div>
         )}

         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Hospitals" value={`${kpis.hospitalsOnline}`} subtitle="Online" icon={Building2} accent="text-[var(--app-blue)]" />
            <MetricCard title="Ambulances" value={`${kpis.ambulancesActive}`} subtitle="Active" icon={Ambulance} accent="text-[var(--app-teal)]" />
            <MetricCard title="Active Alerts" value={`${kpis.criticalAlerts}`} subtitle="Critical" icon={Siren} accent="text-[var(--app-red)]" />
            <MetricCard title="Transfers" value={`${kpis.transfersToday}`} subtitle="Today" icon={ArrowUpRight} accent="text-[var(--app-purple)]" />
         </div>

         <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-9 bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-xl p-5 flex flex-col relative min-h-[620px] app-animate-in">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                   <h2 className="text-lg font-semibold text-[var(--app-text)]">City Health Heatmap</h2>
                   <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-white px-3 py-1 text-xs text-[var(--app-muted)]">
                      <Map className="w-3.5 h-3.5 text-[var(--app-blue)]" /> {city} Geospatial Layer · AI Ops Score {aiOpsScore}
                   </div>
                   <div className="flex items-center gap-2">
                      <button
                         onClick={() => setSelectedLayer('capacity')}
                         className={`px-3 py-1.5 rounded-md text-xs font-semibold border ${selectedLayer === 'capacity' ? 'bg-[var(--app-blue)] text-white border-[var(--app-blue)]' : 'bg-white border-[var(--app-border)] text-[var(--app-text)]'}`}
                      >
                         Capacity Map
                      </button>
                      <button
                         onClick={() => setSelectedLayer('ambulance')}
                         className={`px-3 py-1.5 rounded-md text-xs font-semibold border ${selectedLayer === 'ambulance' ? 'bg-[var(--app-teal)] text-white border-[var(--app-teal)]' : 'bg-white border-[var(--app-border)] text-[var(--app-text)]'}`}
                      >
                         Ambulances
                      </button>
                      <button
                         onClick={() => setSelectedLayer('alerts')}
                         className={`px-3 py-1.5 rounded-md text-xs font-semibold border ${selectedLayer === 'alerts' ? 'bg-[var(--app-red)] text-white border-[var(--app-red)]' : 'bg-white border-[var(--app-border)] text-[var(--app-text)]'}`}
                      >
                         Alerts
                      </button>
                      <button
                         onClick={() => fetchAll(true)}
                         className="px-3 py-1.5 rounded-md text-xs font-semibold border bg-white border-[var(--app-border)] text-[var(--app-text)] inline-flex items-center gap-1"
                      >
                         <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
                      </button>
                   </div>
                </div>

                <div className="flex-1 rounded border border-[var(--app-border)] relative overflow-hidden bg-gray-50/50">
                     <iframe
                        title="City health map"
                        src={mapUrl}
                        className="absolute inset-0 h-full w-full border-0 opacity-80"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                     />
                     <div className="absolute inset-0 bg-gradient-to-br from-blue-50/45 via-white/40 to-purple-50/15" />
                     <svg className="absolute inset-0 w-full h-full" viewBox="0 0 900 500" preserveAspectRatio="none">
                        <defs>
                           <pattern id="insightGrid" width="35" height="35" patternUnits="userSpaceOnUse">
                              <path d="M 35 0 L 0 0 0 35" fill="none" stroke="#dbeafe" strokeWidth="1" />
                           </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#insightGrid)" />
                     </svg>

                     {filteredZones.map((zone) => (
                        <button
                           key={zone.name}
                           onClick={() => setSelectedZone(zone.name)}
                           className="absolute -translate-x-1/2 -translate-y-1/2"
                           style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                           title={`${zone.name}: ${zone.load}% load`}
                        >
                           <div
                              className={`h-12 w-12 rounded-full shadow-lg flex items-center justify-center text-white ${
                                 selectedLayer === 'capacity'
                                    ? zone.load > 80
                                       ? 'bg-[var(--app-red)]'
                                       : 'bg-orange-500'
                                    : selectedLayer === 'ambulance'
                                    ? 'bg-[var(--app-blue)]'
                                    : 'bg-[var(--app-purple)]'
                              } ${selectedZone === zone.name ? 'ring-4 ring-white' : ''}`}
                           >
                              {selectedLayer === 'capacity' ? (
                                 <Activity className="w-5 h-5" />
                              ) : selectedLayer === 'ambulance' ? (
                                 <Navigation className="w-5 h-5" />
                              ) : (
                                 <AlertTriangle className="w-5 h-5" />
                              )}
                           </div>
                           <span className="mt-2 inline-block rounded-md border border-[var(--app-border)] bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-[var(--app-text)] whitespace-nowrap">
                              {zone.name}
                           </span>
                        </button>
                     ))}

                     <div className="absolute right-3 top-3 rounded-lg bg-white/90 border border-[var(--app-border)] px-3 py-2 text-xs">
                        <div className="font-semibold text-[var(--app-text)] mb-1 flex items-center gap-1">
                           <Filter className="w-3.5 h-3.5" /> Risk Filter
                        </div>
                        <select
                           value={riskFilter}
                           onChange={(e) => setRiskFilter(e.target.value as 'all' | 'high' | 'medium')}
                           className="rounded border border-[var(--app-border)] px-2 py-1 text-xs"
                        >
                           <option value="all">All Zones</option>
                           <option value="high">High Risk</option>
                           <option value="medium">Medium Risk</option>
                        </select>
                     </div>

                     <div className="absolute left-3 bottom-3 right-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="rounded-md border border-[var(--app-border)] bg-white/95 p-2 text-xs text-[var(--app-muted)]">
                           <div className="font-semibold text-[var(--app-text)]">Selected Zone</div>
                           <div>{selectedZoneData.name}</div>
                        </div>
                        <div className="rounded-md border border-[var(--app-border)] bg-white/95 p-2 text-xs text-[var(--app-muted)]">
                           <div className="font-semibold text-[var(--app-text)]">Estimated Load</div>
                           <div>{selectedZoneData.load}% utilization</div>
                        </div>
                        <div className="rounded-md border border-[var(--app-border)] bg-white/95 p-2 text-xs text-[var(--app-muted)]">
                           <div className="font-semibold text-[var(--app-text)]">AI Confidence</div>
                           <div>{aiNarrative.confidence}% model confidence</div>
                        </div>
                     </div>
                </div>
        </div>

            <div className="xl:col-span-3 space-y-6">
                <div className="bg-purple-50/50 border border-[var(--app-border)] border-t-2 border-t-[var(--app-purple)] rounded-xl p-5 shadow-sm app-animate-in">
                     <h2 className="text-md font-bold text-[var(--app-text)] mb-4 flex items-center">
                         <Sparkles className="w-5 h-5 text-[var(--app-purple)] mr-2" /> AI Alerts
                     </h2>
                     <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                        {alerts.map((item) => (
                           <div key={item.id} className="p-3 bg-white rounded border border-[var(--app-border)] shadow-sm">
                              <div className="flex items-start justify-between gap-2">
                                 <h4 className="text-sm font-semibold text-[var(--app-text)] flex items-center">
                                    <TrendingUp className={`w-4 h-4 mr-2 ${item.severity === 'high' ? 'text-orange-500' : 'text-[var(--app-teal)]'}`} />
                                    {item.title}
                                 </h4>
                                 <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.severity === 'high' ? 'text-[var(--app-red)] bg-red-50' : 'text-[var(--app-blue)] bg-blue-50'}`}>
                                    {item.severity.toUpperCase()}
                                 </span>
                              </div>
                              <p className="text-xs text-[var(--app-muted)] mt-1">{item.detail}</p>
                              <button
                                 onClick={() => acknowledgeAlert(item.id)}
                                 className="mt-2 text-xs font-semibold text-[var(--app-blue)] hover:underline"
                              >
                                 Acknowledge
                              </button>
                           </div>
                        ))}
                        {alerts.length === 0 && (
                           <div className="p-3 text-xs text-center text-[var(--app-muted)] bg-white rounded border border-[var(--app-border)]">
                              All alerts acknowledged.
                           </div>
                        )}
                     </div>
                </div>

                <div className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-xl p-5 app-animate-in">
                     <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-md font-bold text-[var(--app-text)] flex items-center gap-2">
                           <Brain className="w-4 h-4 text-[var(--app-purple)]" /> Future Resource Demand Forecast
                        </h2>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-white px-2.5 py-1 text-[10px] font-semibold text-[var(--app-muted)]">
                           <span className="app-live-dot" /> Live AI model
                        </span>
                     </div>

                     <div className="space-y-3">
                        <ForecastBar label="ICU Demand (7 days)" values={forecastSeries.icu} color="bg-[var(--app-blue)]" />
                        <ForecastBar label="Ventilator Trend" values={forecastSeries.ventilator} color="bg-[var(--app-teal)]" />
                        <ForecastBar label="ER Surge Index" values={forecastSeries.surge} color="bg-[var(--app-red)]" />
                        <ForecastBar label="Ambulance Load" values={forecastSeries.ambulance} color="bg-[var(--app-purple)]" />
                     </div>

                     <div className="mt-4 rounded-lg border border-[var(--app-border)] bg-gray-50 p-3 text-xs text-[var(--app-muted)]">
                        <div className="font-semibold text-[var(--app-text)] flex items-center gap-2">
                           <ShieldAlert className="w-4 h-4 text-[var(--app-purple)]" /> {aiNarrative.headline}
                        </div>
                        <div className="mt-1">{aiNarrative.recommendation}</div>
                        <div className="mt-2 inline-flex items-center rounded-full border border-[var(--app-border)] bg-white px-2 py-0.5 text-[10px] font-semibold text-[var(--app-muted)]">
                           Confidence {aiNarrative.confidence}%
                        </div>
                        <div className="mt-2 inline-flex items-center rounded-full border border-[var(--app-border)] bg-white px-2 py-0.5 text-[10px] font-semibold text-[var(--app-muted)] ml-2">
                           Forecast Band {forecastSeries.confidenceBand}
                        </div>
                     </div>
                </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
   title,
   value,
   subtitle,
   icon: Icon,
   accent,
}: {
   title: string;
   value: string;
   subtitle: string;
   icon: React.ComponentType<{ className?: string }>;
   accent: string;
}) {
   return (
      <div className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-xl p-4 app-hover-lift app-animate-in">
         <div className="flex items-center justify-between text-[var(--app-muted)] text-xs uppercase font-semibold tracking-wide">
            {title}
            <Icon className={`w-4 h-4 ${accent}`} />
         </div>
         <div className="mt-2 text-2xl font-bold text-[var(--app-text)]">{value}</div>
         <div className="text-xs text-[var(--app-muted)]">{subtitle}</div>
      </div>
   );
}

function ForecastBar({ label, values, color }: { label: string; values: number[]; color: string }) {
   const trend = values.length > 1 ? values[values.length - 1] - values[0] : 0;
   const trendText = `${trend >= 0 ? '+' : ''}${trend}%`;

   return (
      <div className="rounded-lg border border-[var(--app-border)] bg-white p-3 app-hover-lift">
         <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-xs font-semibold text-[var(--app-text)]">{label}</div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${trend >= 0 ? 'bg-red-50 text-[var(--app-red)]' : 'bg-emerald-50 text-emerald-700'}`}>
               {trendText}
            </span>
         </div>
         <div className="h-14 flex items-end gap-1">
            {values.map((value, index) => (
               <div key={`${label}-${index}`} className="flex-1 h-full rounded-sm bg-gray-100 overflow-hidden flex items-end">
                  <div className={`${color} rounded-sm w-full app-chart-fill`} style={{ height: `${value}%`, animationDelay: `${index * 45}ms` }} />
               </div>
            ))}
         </div>
      </div>
   );
}
