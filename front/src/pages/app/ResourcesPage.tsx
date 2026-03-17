import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Database,
  AlertTriangle,
  Activity,
  BedDouble,
  HeartPulse,
  Ambulance,
  Search,
  MapPin,
  Bell,
  TrendingUp,
} from 'lucide-react';
import { runtimeConfig } from '../../lib/runtimeConfig';

type FacilityStatus = 'Stable' | 'Warning' | 'Critical';

type Facility = {
  name: string;
  icuAvailable: number;
  icuTotal: number;
  ventilators: number;
  blood: 'Adequate' | 'Low' | 'Depleted';
  status: FacilityStatus;
  zone: 'Central' | 'East' | 'North' | 'South' | 'West';
};

type ResourceForecast = {
  horizonHours: 6 | 12;
  icuSeries: number[];
  ventSeries: number[];
  ambulanceSeries: number[];
  confidence: number;
  recommendation: string;
  doctorsOnDuty: number;
};

type ResourceIntelResponse = {
  city: string;
  source: 'supabase' | 'fallback';
  generatedAt: string;
  facilities: Facility[];
  alerts: {
    capacity: string;
    reallocation: string;
    oxygen: string;
  };
  totals: {
    doctorsOnDuty: number;
    ambulancesReady: number;
  };
  forecast: ResourceForecast;
};

const DEFAULT_FORECAST_SERIES = {
  sixHour: {
    icu: [42, 48, 53, 59, 64, 70],
    vent: [36, 40, 45, 49, 54, 58],
    ambulance: [39, 44, 49, 53, 58, 63],
  },
  twelveHour: {
    icu: [40, 44, 49, 54, 59, 65, 70, 75],
    vent: [34, 37, 41, 45, 49, 53, 57, 61],
    ambulance: [36, 40, 44, 48, 52, 56, 60, 64],
  },
};

function sanitizeSeries(series: unknown, horizon: 6 | 12, type: 'icu' | 'vent' | 'ambulance') {
  const fallback = horizon === 6 ? DEFAULT_FORECAST_SERIES.sixHour[type] : DEFAULT_FORECAST_SERIES.twelveHour[type];
  const expectedLength = fallback.length;

  if (!Array.isArray(series)) return fallback;

  const normalized = series
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))
    .map((value) => Math.max(18, Math.min(96, value)))
    .slice(0, expectedLength);

  if (normalized.length !== expectedLength) return fallback;
  return normalized;
}

export default function ResourcesPage() {
  const [selectedCity, setSelectedCity] = useState<string>(() => localStorage.getItem('medlink-selected-city') || 'Indore');

  useEffect(() => {
    const handler = (ev: Event) => {
      const city = (ev as CustomEvent).detail as string;
      if (city) setSelectedCity(city);
    };
    window.addEventListener('medlink:city-changed', handler as EventListener);
    return () => window.removeEventListener('medlink:city-changed', handler as EventListener);
  }, []);

  const facilitiesByCity = useMemo<Record<string, Facility[]>>(
    () => ({
      Indore: [
        { name: 'Indore Central Hospital', icuAvailable: 12, icuTotal: 32, ventilators: 6, blood: 'Adequate', status: 'Stable', zone: 'Central' },
        { name: 'Eastside Medical Centre', icuAvailable: 8, icuTotal: 24, ventilators: 4, blood: 'Low', status: 'Warning', zone: 'East' },
        { name: 'North Wing General Hospital', icuAvailable: 4, icuTotal: 20, ventilators: 2, blood: 'Low', status: 'Warning', zone: 'North' },
        { name: 'CHL Health Campus', icuAvailable: 5, icuTotal: 26, ventilators: 3, blood: 'Low', status: 'Warning', zone: 'South' },
      ],
      Bhopal: [
        { name: 'Bhopal Central Trauma Care', icuAvailable: 10, icuTotal: 28, ventilators: 5, blood: 'Adequate', status: 'Stable', zone: 'Central' },
        { name: 'JP Hospital Bhopal', icuAvailable: 5, icuTotal: 22, ventilators: 3, blood: 'Low', status: 'Warning', zone: 'East' },
        { name: 'AIIMS Bhopal Emergency Block', icuAvailable: 8, icuTotal: 24, ventilators: 4, blood: 'Adequate', status: 'Stable', zone: 'North' },
        { name: 'Hamidia Hospital Bhopal', icuAvailable: 2, icuTotal: 18, ventilators: 1, blood: 'Depleted', status: 'Critical', zone: 'West' },
      ],
      Ujjain: [
        { name: 'Ujjain District Hospital', icuAvailable: 7, icuTotal: 20, ventilators: 3, blood: 'Adequate', status: 'Stable', zone: 'Central' },
        { name: 'R D Gardi Medical College', icuAvailable: 4, icuTotal: 16, ventilators: 2, blood: 'Low', status: 'Warning', zone: 'North' },
        { name: 'Civil Hospital Ujjain', icuAvailable: 5, icuTotal: 18, ventilators: 3, blood: 'Low', status: 'Warning', zone: 'East' },
        { name: 'Mahakal Trauma Unit', icuAvailable: 1, icuTotal: 12, ventilators: 1, blood: 'Depleted', status: 'Critical', zone: 'West' },
      ],
    }),
    []
  );

  const facilities = facilitiesByCity[selectedCity as keyof typeof facilitiesByCity] || facilitiesByCity.Indore;

  const cityMeta = useMemo(
    () => ({
      Indore: {
        doctorsOnDuty: 46,
        ambulancesReady: 15,
        alerts: {
          capacity: 'Indore South District is operating at 95% total capacity.',
          reallocation: 'AI suggests moving 4 unused units from East Wing to ER.',
          oxygen: 'Eastside Clinic projected below safe threshold in 40 mins.',
        },
      },
      Bhopal: {
        doctorsOnDuty: 38,
        ambulancesReady: 12,
        alerts: {
          capacity: 'Bhopal central trauma lane is nearing 90% critical-care occupancy.',
          reallocation: 'Move 3 ventilators from JP block to Hamidia emergency lane.',
          oxygen: 'Hamidia reserve may fall below safe threshold in 55 mins.',
        },
      },
      Ujjain: {
        doctorsOnDuty: 29,
        ambulancesReady: 9,
        alerts: {
          capacity: 'Ujjain district intake rising during late-evening surge window.',
          reallocation: 'Shift 2 support units from Civil Hospital to trauma unit.',
          oxygen: 'Mahakal Trauma Unit reserve risk expected in 35 mins.',
        },
      },
    }),
    []
  );

  const selectedMeta = cityMeta[selectedCity as keyof typeof cityMeta] || cityMeta.Indore;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | FacilityStatus>('All');
  const [mapStatusFilter, setMapStatusFilter] = useState<'All' | FacilityStatus>('All');
  const [forecastHorizon, setForecastHorizon] = useState<6 | 12>(6);
  const [selectedMapZone, setSelectedMapZone] = useState<Facility['zone'] | 'All'>('All');
  const [serverIntel, setServerIntel] = useState<ResourceIntelResponse | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>('');

  const loadResourceIntel = useCallback(async () => {
    try {
      const city = encodeURIComponent(selectedCity);
      const horizon = String(forecastHorizon);
      const response = await fetch(`${runtimeConfig.apiBaseUrl}/api/dashboard/resources-intelligence?city=${city}&horizon=${horizon}`);
      if (!response.ok) throw new Error(`Resource intelligence API failed (${response.status})`);
      const payload = (await response.json()) as ResourceIntelResponse;
      if (Array.isArray(payload?.facilities) && payload.facilities.length > 0) {
        setServerIntel(payload);
      }
      setLastUpdatedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (error) {
      console.error('Failed to load resource intelligence from API', error);
    }
  }, [forecastHorizon, selectedCity]);

  useEffect(() => {
    loadResourceIntel();
    const interval = setInterval(loadResourceIntel, 25000);
    return () => clearInterval(interval);
  }, [loadResourceIntel]);

  const activeFacilities = (serverIntel?.facilities?.length ? serverIntel.facilities : facilities) as Facility[];

  const filteredFacilities = activeFacilities.filter((facility) => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || facility.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totals = useMemo(() => {
    const icuActive = activeFacilities.reduce((sum, item) => sum + item.icuAvailable, 0);
    const ventilators = activeFacilities.reduce((sum, item) => sum + item.ventilators, 0);
    const doctorsOnDuty = serverIntel?.totals?.doctorsOnDuty ?? selectedMeta.doctorsOnDuty;
    const ambulancesReady = serverIntel?.totals?.ambulancesReady ?? selectedMeta.ambulancesReady;
    return { icuActive, ventilators, doctorsOnDuty, ambulancesReady };
  }, [activeFacilities, selectedMeta, serverIntel?.totals?.ambulancesReady, serverIntel?.totals?.doctorsOnDuty]);

  const statusStyles: Record<'Stable' | 'Warning' | 'Critical', string> = {
    Stable: 'text-[var(--app-teal)] bg-teal-50',
    Warning: 'text-orange-700 bg-orange-100',
    Critical: 'text-[var(--app-red)] bg-red-50',
  };

  const zoneCoordinates: Record<Facility['zone'], { x: number; y: number }> = {
    North: { x: 30, y: 30 },
    Central: { x: 50, y: 48 },
    East: { x: 72, y: 54 },
    South: { x: 43, y: 74 },
    West: { x: 22, y: 58 },
  };

  const mapPoints = useMemo(() => {
    return activeFacilities.map((facility, index) => {
      const zonePosition = zoneCoordinates[facility.zone];
      const utilization = Math.round(((facility.icuTotal - facility.icuAvailable) / Math.max(1, facility.icuTotal)) * 100);
      const x = zonePosition.x + (index % 2 === 0 ? -2 : 2);
      const y = zonePosition.y + (index % 3 === 0 ? -2 : 1);

      return {
        ...facility,
        utilization,
        x: Math.min(88, Math.max(12, x)),
        y: Math.min(84, Math.max(16, y)),
      };
    });
  }, [activeFacilities]);

  const filteredMapPoints = useMemo(() => {
    return mapPoints.filter((item) => {
      const statusOk = mapStatusFilter === 'All' || item.status === mapStatusFilter;
      const zoneOk = selectedMapZone === 'All' || item.zone === selectedMapZone;
      return statusOk && zoneOk;
    });
  }, [mapPoints, mapStatusFilter, selectedMapZone]);

  const selectedMapPoint = filteredMapPoints[0] || mapPoints[0];

  const predictionData = useMemo(() => {
    if (serverIntel?.forecast && serverIntel.forecast.horizonHours === forecastHorizon) {
      return {
        icuSeries: sanitizeSeries(serverIntel.forecast.icuSeries, forecastHorizon, 'icu'),
        ventSeries: sanitizeSeries(serverIntel.forecast.ventSeries, forecastHorizon, 'vent'),
        ambulanceSeries: sanitizeSeries(serverIntel.forecast.ambulanceSeries, forecastHorizon, 'ambulance'),
        confidence: Math.max(55, Math.min(98, Number(serverIntel.forecast.confidence) || 79)),
        recommendation: serverIntel.forecast.recommendation,
      };
    }

    const avgUtilization = Math.round(
      activeFacilities.reduce((sum, item) => sum + (item.icuTotal - item.icuAvailable) / Math.max(1, item.icuTotal), 0) / Math.max(1, activeFacilities.length) * 100
    );
    const criticalCount = activeFacilities.filter((item) => item.status === 'Critical').length;
    const warningCount = activeFacilities.filter((item) => item.status === 'Warning').length;
    const demandPressure = criticalCount * 7 + warningCount * 4;
    const points = forecastHorizon === 6 ? 6 : 8;
    const growthStep = forecastHorizon === 6 ? 2 : 3;

    const createSeries = (base: number, modifier: number) =>
      Array.from({ length: points }, (_, index) => {
        const value = base + modifier + index * growthStep + (index % 2 === 0 ? 1 : 3);
        return Math.max(18, Math.min(96, value));
      });

    const icuSeries = createSeries(avgUtilization - 12, demandPressure);
    const ventSeries = createSeries(38 + criticalCount * 3, demandPressure - 6);
    const ambulanceSeries = createSeries(36 + Math.round((totals.ambulancesReady / 20) * 30), demandPressure - 4);

    const confidence = Math.max(68, Math.min(94, 90 - criticalCount * 8 - warningCount * 3));
    const recommendation =
      criticalCount > 0
        ? `Prioritize ${selectedCity} critical zones with rapid ventilator redistribution and reserve ambulance cover.`
        : `Maintain proactive staffing rotation and keep one standby transfer unit in ${selectedCity} core corridor.`;

    return {
      icuSeries: sanitizeSeries(icuSeries, forecastHorizon, 'icu'),
      ventSeries: sanitizeSeries(ventSeries, forecastHorizon, 'vent'),
      ambulanceSeries: sanitizeSeries(ambulanceSeries, forecastHorizon, 'ambulance'),
      confidence,
      recommendation,
    };
  }, [activeFacilities, forecastHorizon, selectedCity, serverIntel?.forecast, totals.ambulancesReady]);

  const predictionTrends = useMemo(() => {
    const delta = (series: number[]) => (series.length > 1 ? series[series.length - 1] - series[0] : 0);
    return {
      icu: delta(predictionData.icuSeries),
      vent: delta(predictionData.ventSeries),
      ambulance: delta(predictionData.ambulanceSeries),
    };
  }, [predictionData.ambulanceSeries, predictionData.icuSeries, predictionData.ventSeries]);

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-[var(--app-text)] flex items-center">
          <Database className="w-6 h-6 mr-3 text-[var(--app-teal)]" />
          Resource Intelligence
        </h1>
        <p className="text-[var(--app-muted)] mt-1">Network-wide tracking of critical medical assets.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 shadow-sm app-hover-lift app-animate-in">
          <div className="flex items-center justify-between text-[var(--app-muted)] text-xs uppercase font-semibold tracking-wide">
            ICU Beds
            <BedDouble className="w-4 h-4" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--app-text)]">{totals.icuActive}</div>
          <div className="text-xs text-[var(--app-muted)]">Active across network</div>
        </div>

        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 shadow-sm app-hover-lift app-animate-in">
          <div className="flex items-center justify-between text-[var(--app-muted)] text-xs uppercase font-semibold tracking-wide">
            Ventilators
            <Activity className="w-4 h-4" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--app-text)]">{totals.ventilators}</div>
          <div className="text-xs text-[var(--app-muted)]">Available now</div>
        </div>

        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 shadow-sm app-hover-lift app-animate-in">
          <div className="flex items-center justify-between text-[var(--app-muted)] text-xs uppercase font-semibold tracking-wide">
            Doctors
            <HeartPulse className="w-4 h-4" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--app-text)]">{totals.doctorsOnDuty}</div>
          <div className="text-xs text-[var(--app-muted)]">On duty</div>
        </div>

        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 shadow-sm app-hover-lift app-animate-in">
          <div className="flex items-center justify-between text-[var(--app-muted)] text-xs uppercase font-semibold tracking-wide">
            Ambulances
            <Ambulance className="w-4 h-4" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--app-text)]">{totals.ambulancesReady}</div>
          <div className="text-xs text-[var(--app-muted)]">Ready</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-xl p-5 app-animate-in">
             <h2 className="text-sm font-bold text-[var(--app-text)] uppercase mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" /> Action Needed
             </h2>
             <div className="space-y-3">
               <div className="bg-orange-50 border border-orange-200 p-3 rounded">
                 <div className="text-sm text-[var(--app-text)] font-medium">Beds Critically Low</div>
                 <div className="text-xs text-[var(--app-muted)] mt-1">{serverIntel?.alerts?.capacity || selectedMeta.alerts.capacity}</div>
               </div>
               <div className="bg-gray-50 border border-[var(--app-border)] p-3 rounded">
                 <div className="text-sm text-[var(--app-text)] font-medium">Ventilator Re-allocation</div>
                 <div className="text-xs text-[var(--app-muted)] mt-1">{serverIntel?.alerts?.reallocation || selectedMeta.alerts.reallocation}</div>
               </div>
               <div className="bg-red-50 border border-red-200 p-3 rounded">
                 <div className="text-sm text-[var(--app-text)] font-medium">Oxygen Shortage Risk</div>
                 <div className="text-xs text-[var(--app-muted)] mt-1">{serverIntel?.alerts?.oxygen || selectedMeta.alerts.oxygen}</div>
               </div>
             </div>
          </div>

          <div className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-xl overflow-hidden app-animate-in">
            <div className="px-5 py-4 border-b border-[var(--app-border)] bg-white flex items-center justify-between">
              <h3 className="font-semibold text-[var(--app-text)] text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--app-blue)]" /> Resource Map
              </h3>
              <span className="text-xs text-[var(--app-muted)]">{selectedCity} live zones</span>
            </div>
            <div className="px-5 py-3 border-b border-[var(--app-border)] bg-white flex flex-wrap gap-2">
              <select
                value={mapStatusFilter}
                onChange={(e) => setMapStatusFilter(e.target.value as 'All' | FacilityStatus)}
                className="px-2 py-1 bg-white border border-[var(--app-border)] rounded text-xs text-[var(--app-text)]"
              >
                <option value="All">All Status</option>
                <option value="Stable">Stable</option>
                <option value="Warning">Warning</option>
                <option value="Critical">Critical</option>
              </select>
              <select
                value={selectedMapZone}
                onChange={(e) => setSelectedMapZone(e.target.value as Facility['zone'] | 'All')}
                className="px-2 py-1 bg-white border border-[var(--app-border)] rounded text-xs text-[var(--app-text)]"
              >
                <option value="All">All Zones</option>
                <option value="North">North</option>
                <option value="Central">Central</option>
                <option value="East">East</option>
                <option value="South">South</option>
                <option value="West">West</option>
              </select>
            </div>
            <div className="h-56 relative bg-gradient-to-br from-blue-50 to-teal-50">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
                <defs>
                  <pattern id="resourceGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#dbeafe" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="500" height="220" fill="url(#resourceGrid)" />
              </svg>
              {filteredMapPoints.map((point) => (
                <button
                  key={point.name}
                  onClick={() => setSelectedMapZone(point.zone)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full shadow ${
                    point.status === 'Critical'
                      ? 'bg-[var(--app-red)]'
                      : point.status === 'Warning'
                      ? 'bg-orange-500'
                      : 'bg-[var(--app-teal)]'
                  }`}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  title={`${point.name} · ${point.utilization}% ICU load`}
                />
              ))}

              {selectedMapPoint && (
                <div className="absolute left-3 top-3 rounded-md border border-[var(--app-border)] bg-white/90 px-2 py-1 text-[11px] text-[var(--app-text)]">
                  <div className="font-semibold">{selectedMapPoint.name}</div>
                  <div className="text-[var(--app-muted)]">{selectedMapPoint.zone} · ICU load {selectedMapPoint.utilization}%</div>
                </div>
              )}

              {filteredMapPoints.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--app-muted)]">
                  No map points available for selected filters.
                </div>
              )}

              <div className="absolute right-3 bottom-3 text-[11px] text-[var(--app-muted)] bg-white/80 border border-[var(--app-border)] rounded px-2 py-1">
                Green: Stable · Orange: Warning · Red: Critical
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-xl overflow-hidden flex flex-col app-animate-in">
          <div className="p-5 border-b border-[var(--app-border)] bg-white flex justify-between items-center">
             <h2 className="font-semibold text-[var(--app-text)]">Facility Inventory Status</h2>
             <div className="flex items-center gap-2">
                <div className="relative hidden md:block">
                  <Search className="w-4 h-4 text-[var(--app-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search hospital"
                    className="pl-9 pr-3 py-1.5 rounded-md border border-[var(--app-border)] text-sm bg-white text-[var(--app-text)]"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Stable' | 'Warning' | 'Critical')}
                  className="px-3 py-1.5 bg-white border border-[var(--app-border)] rounded text-xs text-[var(--app-text)]"
                >
                  <option value="All">All Status</option>
                  <option value="Stable">Stable</option>
                  <option value="Warning">Warning</option>
                  <option value="Critical">Critical</option>
                </select>
                <button className="px-3 py-1 bg-white border border-[var(--app-border)] rounded text-xs text-[var(--app-text)] hover:bg-gray-50">Export</button>
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--app-muted)]">
              <thead className="bg-[#F9FAFB] text-xs uppercase text-[var(--app-text)]">
                <tr className="border-b border-[var(--app-border)]">
                  <th className="px-6 py-4 font-semibold text-[var(--app-text)]">Hospital</th>
                  <th className="px-6 py-4 font-semibold text-[var(--app-text)] text-center">ICU Beds</th>
                  <th className="px-6 py-4 font-semibold text-[var(--app-text)] text-center">Ventilators</th>
                  <th className="px-6 py-4 font-semibold text-[var(--app-text)] text-center">Blood Supply</th>
                  <th className="px-6 py-4 font-semibold text-[var(--app-text)] text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]">
                {filteredFacilities.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 font-medium text-[var(--app-text)] whitespace-nowrap">{row.name}</td>
                    <td className="px-6 py-4 text-center">{row.icuAvailable}/{row.icuTotal}</td>
                    <td className="px-6 py-4 text-center">{row.ventilators}</td>
                    <td className="px-6 py-4 text-center">{row.blood}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredFacilities.length === 0 && (
                  <tr>
                    <td className="px-6 py-6 text-center text-sm text-[var(--app-muted)]" colSpan={5}>
                      No facility found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

          <div className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-xl overflow-hidden app-animate-in">
            <div className="p-5 border-b border-[var(--app-border)] bg-white flex items-center justify-between">
              <h2 className="font-semibold text-[var(--app-text)] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--app-purple)]" /> Resource Demand Prediction
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={forecastHorizon}
                  onChange={(e) => setForecastHorizon(Number(e.target.value) as 6 | 12)}
                  className="px-2 py-1 bg-white border border-[var(--app-border)] rounded text-xs text-[var(--app-text)]"
                >
                  <option value={6}>Next 6h</option>
                  <option value={12}>Next 12h</option>
                </select>
                <span className="text-xs text-[var(--app-muted)]">Data-driven forecast</span>
                <span className="text-xs text-[var(--app-muted)]">Source: {serverIntel?.source || 'local'}</span>
                <span className="text-xs text-[var(--app-muted)] inline-flex items-center gap-1.5"><span className="app-live-dot" /> Auto refresh: 25s</span>
                {lastUpdatedAt && <span className="text-xs text-[var(--app-muted)]">Updated: {lastUpdatedAt}</span>}
              </div>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-[var(--app-border)] p-4 bg-white app-hover-lift">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="text-xs uppercase font-semibold text-[var(--app-muted)]">ICU Demand</div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${predictionTrends.icu >= 0 ? 'bg-red-50 text-[var(--app-red)]' : 'bg-emerald-50 text-emerald-700'}`}>
                    {predictionTrends.icu >= 0 ? '+' : ''}{predictionTrends.icu}%
                  </span>
                </div>
                <div className="mt-2 h-16 flex items-end gap-1">
                  {predictionData.icuSeries.map((value, index) => (
                    <div key={index} className="flex-1 h-full bg-[var(--app-blue)]/20 rounded-sm flex items-end overflow-hidden">
                      <div className="bg-[var(--app-blue)] rounded-sm w-full app-chart-fill" style={{ height: `${value}%`, animationDelay: `${index * 45}ms` }} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-[var(--app-border)] p-4 bg-white app-hover-lift">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="text-xs uppercase font-semibold text-[var(--app-muted)]">Ventilator Trend</div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${predictionTrends.vent >= 0 ? 'bg-red-50 text-[var(--app-red)]' : 'bg-emerald-50 text-emerald-700'}`}>
                    {predictionTrends.vent >= 0 ? '+' : ''}{predictionTrends.vent}%
                  </span>
                </div>
                <div className="mt-2 h-16 flex items-end gap-1">
                  {predictionData.ventSeries.map((value, index) => (
                    <div key={index} className="flex-1 h-full bg-[var(--app-teal)]/20 rounded-sm flex items-end overflow-hidden">
                      <div className="bg-[var(--app-teal)] rounded-sm w-full app-chart-fill" style={{ height: `${value}%`, animationDelay: `${index * 45}ms` }} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-[var(--app-border)] p-4 bg-white app-hover-lift">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="text-xs uppercase font-semibold text-[var(--app-muted)]">Ambulance Load</div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${predictionTrends.ambulance >= 0 ? 'bg-red-50 text-[var(--app-red)]' : 'bg-emerald-50 text-emerald-700'}`}>
                    {predictionTrends.ambulance >= 0 ? '+' : ''}{predictionTrends.ambulance}%
                  </span>
                </div>
                <div className="mt-2 h-16 flex items-end gap-1">
                  {predictionData.ambulanceSeries.map((value, index) => (
                    <div key={index} className="flex-1 h-full bg-[var(--app-purple)]/20 rounded-sm flex items-end overflow-hidden">
                      <div className="bg-[var(--app-purple)] rounded-sm w-full app-chart-fill" style={{ height: `${value}%`, animationDelay: `${index * 45}ms` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-5 pb-5 text-xs text-[var(--app-muted)] flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-[var(--app-border)] bg-white px-2 py-1">
                Forecast confidence {predictionData.confidence}%
              </span>
              <span>{predictionData.recommendation}</span>
            </div>
          </div>

          <div className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-xl p-4 flex items-center justify-between app-animate-in">
            <div className="flex items-center gap-2 text-sm text-[var(--app-text)] font-medium">
              <Bell className="w-4 h-4 text-[var(--app-blue)]" />
              3 live optimization suggestions available from AI routing engine.
            </div>
            <button className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--app-blue)] text-white hover:opacity-90">
              Review Suggestions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
