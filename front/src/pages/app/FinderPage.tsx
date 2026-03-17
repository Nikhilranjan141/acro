import { useCallback, useEffect, useState } from 'react';
import {
   Brain,
   Search,
   MapPin,
   Building2,
   Ambulance,
   BedDouble,
   Phone,
   Navigation,
   ShieldCheck,
   Clock3,
   Stethoscope,
   Route,
   Siren,
   Activity,
   Loader2,
   Droplets,
   Wind,
   Users,
} from 'lucide-react';
import { runtimeConfig } from '../../lib/runtimeConfig';

type HospitalMatch = {
   id: string;
   name: string;
   lat: number;
   lng: number;
   score: number;
   distanceKm: number;
   etaMin: number;
   routeStatus: string;
   workloadBadge: string;
   aiReason: string;
   resource: {
      icuAvailable: number;
      ventilatorAvailable: number;
      doctorAvailable: number;
      oxygenPct: number;
   };
};

type FinderApiResponse = {
   city: string;
   generatedAt: string;
   ai: {
      used: boolean;
      model: string;
      summary: string;
   };
   bestHospital: HospitalMatch;
   alternatives: HospitalMatch[];
   route: {
      distanceKm: number;
      etaMin: number;
      geometry: Array<[number, number]>;
   };
};

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
   Indore: { lat: 22.7196, lng: 75.8577 },
   Bhopal: { lat: 23.2599, lng: 77.4126 },
   Ujjain: { lat: 23.1765, lng: 75.7885 },
};

function extractLatLng(value: string): { lat: number; lng: number } | null {
   const match = value.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
   if (!match) return null;

   const lat = Number(match[1]);
   const lng = Number(match[2]);
   if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
   return { lat, lng };
}

function getFinderFallback(city: string): { hospital: HospitalMatch; alternatives: HospitalMatch[]; summary: string } {
   const fallbackByCity: Record<string, { name: string; lat: number; lng: number }> = {
      Indore: { name: 'Indore Central Hospital', lat: 22.7196, lng: 75.8577 },
      Bhopal: { name: 'Bhopal Central Trauma Care', lat: 23.2599, lng: 77.4126 },
      Ujjain: { name: 'Ujjain District Hospital', lat: 23.1765, lng: 75.7885 },
   };

   const selected = fallbackByCity[city] || fallbackByCity.Indore;
   const cityPrefix = (city || 'Indore').slice(0, 3).toUpperCase();

   return {
      hospital: {
         id: `${cityPrefix}-fallback-main`,
         name: selected.name,
         lat: selected.lat,
         lng: selected.lng,
         resource: {
            icuAvailable: city === 'Bhopal' ? 10 : city === 'Ujjain' ? 7 : 12,
            ventilatorAvailable: city === 'Bhopal' ? 5 : city === 'Ujjain' ? 3 : 6,
            doctorAvailable: city === 'Bhopal' ? 20 : city === 'Ujjain' ? 14 : 22,
            oxygenPct: city === 'Ujjain' ? 74 : 78,
         },
         distanceKm: 2.8,
         etaMin: 10,
         score: 92,
         aiReason: `Fallback routing selected for ${city}.`,
         workloadBadge: 'Balanced load',
         routeStatus: 'Moderate traffic',
      },
      alternatives: [
         {
            id: `${cityPrefix}-fallback-alt`,
            name: `${city} Medical Centre`,
            lat: selected.lat + 0.018,
            lng: selected.lng + 0.014,
            resource: {
               icuAvailable: city === 'Ujjain' ? 4 : 6,
               ventilatorAvailable: 3,
               doctorAvailable: city === 'Ujjain' ? 10 : 14,
               oxygenPct: city === 'Ujjain' ? 71 : 76,
            },
            distanceKm: 4.1,
            etaMin: 16,
            score: 86,
            aiReason: 'Alternative route with moderate load available.',
            workloadBadge: 'Moderate load',
            routeStatus: 'Smooth traffic',
         },
      ],
      summary: `Using ${city} fallback data.`,
   };
}

export default function FinderPage() {
   const [selectedHospital, setSelectedHospital] = useState<HospitalMatch | null>(null);
   const [alternatives, setAlternatives] = useState<HospitalMatch[]>([]);
   const [condition, setCondition] = useState('Cardiac Arrest');
   const [severity, setSeverity] = useState('Critical / Level 1');
   const [resource, setResource] = useState('ICU Bed + Ventilator');
   const [location, setLocation] = useState('Indore Junction, GPS Locked');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [actionMessage, setActionMessage] = useState('');
   const [aiSummary, setAiSummary] = useState('Waiting for AI triage...');
   const [generatedAt, setGeneratedAt] = useState('');

   const [currentCity, setCurrentCity] = useState<string>(() => localStorage.getItem('medlink-selected-city') || runtimeConfig.defaultCity || 'Indore');

   useEffect(() => {
      const handler = (ev: Event) => {
         const city = (ev as CustomEvent).detail as string;
         if (city) setCurrentCity(city);
      };
      window.addEventListener('medlink:city-changed', handler as EventListener);
      return () => window.removeEventListener('medlink:city-changed', handler as EventListener);
   }, []);

   const runMatch = useCallback(async () => {
      setLoading(true);
      setError(null);

      const fallback = getFinderFallback(currentCity);
      setSelectedHospital(fallback.hospital);
      setAlternatives(fallback.alternatives);
      setAiSummary(fallback.summary);
      setGeneratedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      try {
         const fallbackCityCoords = CITY_COORDS[currentCity] || CITY_COORDS.Indore;
         const parsedCoords = extractLatLng(location);
         const lat = parsedCoords?.lat ?? fallbackCityCoords.lat;
         const lng = parsedCoords?.lng ?? fallbackCityCoords.lng;

         const query = new URLSearchParams({
            city: currentCity,
            condition,
            severity,
            resource,
            lat: String(lat),
            lng: String(lng),
         });

         const response = await fetch(`${runtimeConfig.apiBaseUrl}/api/finder/match?${query.toString()}`);
         if (!response.ok) {
            throw new Error('AI match API failed');
         }

         const payload = (await response.json()) as FinderApiResponse;
         const isValidBestHospital = payload?.bestHospital && typeof payload.bestHospital.name === 'string';
         const validAlternatives = Array.isArray(payload?.alternatives) && payload.alternatives.length > 0 ? payload.alternatives : fallback.alternatives;

         if (isValidBestHospital) {
            setSelectedHospital(payload.bestHospital);
         }

         setAlternatives(validAlternatives);
         setAiSummary(payload?.ai?.summary || fallback.summary);
         setGeneratedAt(
            payload?.generatedAt
               ? new Date(payload.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
               : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
         );
      } catch (matchError) {
         console.error(matchError);
         setSelectedHospital(fallback.hospital);
         setAlternatives(fallback.alternatives);
         setAiSummary(fallback.summary);
         setGeneratedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
         setError(null);
      } finally {
         setLoading(false);
      }
   }, [condition, currentCity, location, resource, severity]);

   useEffect(() => {
      runMatch();
   }, [runMatch, currentCity]);

   const selectedDistance = selectedHospital ? `${selectedHospital.distanceKm.toFixed(1)} km` : '--';
   const selectedEta = selectedHospital ? `${selectedHospital.etaMin} min` : '--';
   const selectedIcu = selectedHospital?.resource.icuAvailable ?? 0;
   const selectedVent = selectedHospital?.resource.ventilatorAvailable ?? 0;
   const selectedDocs = selectedHospital?.resource.doctorAvailable ?? 0;
   const selectedOxygen = selectedHospital?.resource.oxygenPct ?? 0;

   const networkResources = [
      {
         key: 'icu',
         label: 'ICU Beds',
         current: selectedIcu,
         total: 200,
         icon: BedDouble,
         barClass: 'bg-[var(--app-blue)]',
      },
      {
         key: 'vent',
         label: 'Ventilators',
         current: selectedVent,
         total: 50,
         icon: Wind,
         barClass: 'bg-[var(--app-teal)]',
      },
      {
         key: 'docs',
         label: 'Doctors Available',
         current: selectedDocs,
         total: 120,
         icon: Users,
         barClass: 'bg-emerald-500',
      },
      {
         key: 'oxy',
         label: 'Oxygen Supply %',
         current: selectedOxygen,
         total: 100,
         icon: Droplets,
         barClass: selectedOxygen < 40 ? 'bg-red-500' : selectedOxygen < 70 ? 'bg-amber-500' : 'bg-emerald-500',
      },
   ];

  return (
      <div className="h-full flex flex-col gap-4">
         <div className="mb-1">
            <h1 className="text-2xl font-bold text-[var(--app-text)] flex items-center">
               <Brain className="w-6 h-6 mr-3 text-[var(--app-purple)]" />
          AI Predict & Hospital Finder
        </h1>
        <p className="text-[var(--app-muted)] mt-1">Intelligently match patient needs with available resources</p>
      </div>

         <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {networkResources.map((item) => {
               const Icon = item.icon;
               const ratio = Math.max(0, Math.min(100, (item.current / item.total) * 100));

               return (
                  <div key={item.key} className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 shadow-sm app-hover-lift app-animate-in">
                     <div className="flex items-center justify-between">
                        <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-[var(--app-sidebar)] text-[var(--app-blue)]">
                           <Icon className="w-5 h-5" />
                        </span>
                        <span className="text-xs font-semibold text-[var(--app-muted)]">{Math.round(ratio)}%</span>
                     </div>

                     <div className="mt-3 text-sm font-semibold text-[var(--app-muted)]">{item.label}</div>
                     <div className="mt-1 text-3xl font-bold text-[var(--app-text)] leading-none">
                        {item.current}
                        <span className="ml-1 text-xl text-[var(--app-muted)] font-medium">/ {item.total}</span>
                     </div>

                     <div className="mt-4 h-2 rounded-full bg-[var(--app-sidebar)] overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${item.barClass}`} style={{ width: `${ratio}%` }} />
                     </div>
                  </div>
               );
            })}
         </section>

         <div className="grid grid-cols-1 xl:grid-cols-[1.03fr_1.97fr] gap-6 flex-1 min-h-0">
        
            <div className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-2xl p-5 flex flex-col overflow-y-auto min-h-[640px] app-animate-in">
                <h2 className="text-lg font-semibold text-[var(--app-text)] mb-4 border-b border-[var(--app-border)] pb-3">Filter Parameters</h2>
                <div className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-[var(--app-text)] mb-1">Condition Keywords</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Search className="h-4 w-4 text-[var(--app-muted)]" />
                   </div>
                            <input value={condition} onChange={(e) => setCondition(e.target.value)} type="text" className="w-full bg-white border border-[var(--app-border)] rounded-xl pl-10 pr-3 py-2.5 text-[var(--app-text)] placeholder-[var(--app-muted)] focus:border-[var(--app-purple)] focus:ring-1 focus:ring-[var(--app-purple)] outline-none" placeholder="e.g. Cardiac Arrest, Trauma" />
                 </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-[var(--app-text)] mb-1">Severity Level</label>
                         <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-full bg-white border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-[var(--app-text)] focus:border-[var(--app-purple)] outline-none">
                              <option>Critical / Level 1</option>
                              <option>Urgent / Level 2</option>
                              <option>Non-Urgent / Level 3</option>
                 </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-[var(--app-text)] mb-1">Resource Required</label>
                         <select value={resource} onChange={(e) => setResource(e.target.value)} className="w-full bg-white border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-[var(--app-text)] focus:border-[var(--app-purple)] outline-none">
                    <option>ICU Bed + Ventilator</option>
                    <option>Surgical Suite</option>
                    <option>General Admission</option>
                 </select>
              </div>
                     <div>
                         <label className="block text-sm font-medium text-[var(--app-text)] mb-1">Location (GPS)</label>
                         <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                               <Navigation className="h-4 w-4 text-[var(--app-teal)]" />
                            </div>
                            <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" className="w-full bg-white border border-[var(--app-border)] rounded-xl pl-10 pr-3 py-2.5 text-[var(--app-text)] placeholder-[var(--app-muted)] focus:border-[var(--app-purple)] focus:ring-1 focus:ring-[var(--app-purple)] outline-none" />
                         </div>
                     </div>

                     <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="rounded-xl border border-[var(--app-border)] bg-gradient-to-br from-red-50 to-white p-3">
                           <div className="flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-wide">
                              <Siren className="w-4 h-4" /> Priority
                           </div>
                           <div className="mt-2 text-sm font-semibold text-[var(--app-text)]">{severity}</div>
                        </div>
                        <div className="rounded-xl border border-[var(--app-border)] bg-gradient-to-br from-emerald-50 to-white p-3">
                           <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                              <ShieldCheck className="w-4 h-4" /> AI Status
                           </div>
                           <div className="mt-2 text-sm font-semibold text-[var(--app-text)]">Ready to Match</div>
                        </div>
                     </div>

                     <button
                        onClick={runMatch}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[var(--app-purple)] to-purple-500 text-white font-semibold py-3 rounded-xl hover:opacity-95 transition-all mt-2 shadow-sm disabled:opacity-60"
                     >
                        {loading ? (
                           <span className="inline-flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" /> Matching...
                           </span>
                        ) : (
                           'Run AI Match'
                        )}
                     </button>

                     {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                           {error}
                        </div>
                     )}

                     <div className="rounded-2xl border border-dashed border-[var(--app-border)] bg-[var(--app-sidebar)]/35 p-4 mt-2">
                        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)] mb-2">Live Input Summary</div>
                        <div className="space-y-2 text-sm text-[var(--app-text)]">
                           <div><span className="text-[var(--app-muted)]">Condition:</span> {condition}</div>
                           <div><span className="text-[var(--app-muted)]">Severity:</span> {severity}</div>
                           <div><span className="text-[var(--app-muted)]">Resource:</span> {resource}</div>
                           <div><span className="text-[var(--app-muted)]">Location:</span> {location}</div>
                           <div><span className="text-[var(--app-muted)]">City:</span> {currentCity}</div>
                           <div><span className="text-[var(--app-muted)]">AI:</span> {aiSummary}</div>
                           {generatedAt && <div><span className="text-[var(--app-muted)]">Updated:</span> {generatedAt}</div>}
                        </div>
                     </div>
           </div>
        </div>

            <div className="space-y-6 flex flex-col min-h-0">
                  <div className="bg-gradient-to-br from-purple-50 via-white to-purple-50 border border-[var(--app-purple)]/50 rounded-2xl p-5 shadow-sm">
                      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                  <div>
                               <div className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[var(--app-purple)] text-white rounded-lg text-xs font-bold mb-3 tracking-wide uppercase shadow-sm">
                                     <Brain className="w-3 h-3" /> <span>{selectedHospital?.score ?? '--'}% Match Score</span>
                     </div>
                               <h3 className="text-2xl font-bold text-[var(--app-text)] flex items-center mt-1">
                         <Building2 className="w-5 h-5 mr-2 text-[var(--app-muted)]" />
                                     {selectedHospital?.name || 'No hospital selected'}
                     </h3>
                               <p className="text-sm text-[var(--app-muted)] mt-2 flex items-center">
                                    <MapPin className="w-4 h-4 mr-1 text-[var(--app-teal)]" /> {selectedDistance} away (Est. {selectedEta} via EMS)
                     </p>

                               {selectedHospital?.aiReason && (
                                  <p className="mt-2 text-xs text-[var(--app-muted)] bg-white border border-[var(--app-border)] rounded-lg px-2.5 py-1.5 inline-flex">
                                     {selectedHospital.aiReason}
                                  </p>
                               )}

                               <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                                    <div className="rounded-xl bg-white border border-[var(--app-border)] p-3">
                                       <div className="flex items-center gap-2 text-[11px] uppercase font-semibold text-[var(--app-muted)]"><BedDouble className="w-4 h-4 text-[var(--app-teal)]" /> ICU Beds</div>
                                       <div className="mt-1 text-lg font-bold text-[var(--app-text)]">{selectedIcu}</div>
                                    </div>
                                    <div className="rounded-xl bg-white border border-[var(--app-border)] p-3">
                                       <div className="flex items-center gap-2 text-[11px] uppercase font-semibold text-[var(--app-muted)]"><Activity className="w-4 h-4 text-[var(--app-blue)]" /> Ventilators</div>
                                       <div className="mt-1 text-lg font-bold text-[var(--app-text)]">{selectedVent}</div>
                                    </div>
                                    <div className="rounded-xl bg-white border border-[var(--app-border)] p-3">
                                       <div className="flex items-center gap-2 text-[11px] uppercase font-semibold text-[var(--app-muted)]"><Stethoscope className="w-4 h-4 text-emerald-500" /> Doctors</div>
                                       <div className="mt-1 text-lg font-bold text-[var(--app-text)]">{selectedDocs}</div>
                                    </div>
                                    <div className="rounded-xl bg-white border border-[var(--app-border)] p-3">
                                       <div className="flex items-center gap-2 text-[11px] uppercase font-semibold text-[var(--app-muted)]"><Clock3 className="w-4 h-4 text-amber-500" /> ETA</div>
                                       <div className="mt-1 text-lg font-bold text-[var(--app-text)]">{selectedEta}</div>
                                    </div>
                               </div>
                  </div>

                           <div className="xl:text-right min-w-[130px]">
                                 <div className="text-4xl font-black text-[var(--app-teal)]">{selectedIcu}</div>
                                 <div className="text-xs text-[var(--app-muted)] font-medium">ICU Beds Free</div>
                                 <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    <Route className="w-3.5 h-3.5" /> {selectedHospital?.routeStatus || 'Awaiting route'}
                                 </div>
                  </div>
               </div>

                      <div className="mt-5 pt-5 border-t border-purple-200 grid grid-cols-1 md:grid-cols-3 gap-3">
                           <button
                              onClick={() => setActionMessage(`Ambulance dispatched to ${selectedHospital?.name || 'selected hospital'}.`)}
                              className="flex items-center justify-center gap-2 py-3 bg-[var(--app-blue)] text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-colors"
                           >
                              <Ambulance className="w-4 h-4" /> Dispatch Ambulance
                           </button>
                           <button
                              onClick={() => setActionMessage(`Bed hold request submitted at ${selectedHospital?.name || 'selected hospital'}.`)}
                              className="flex items-center justify-center gap-2 py-3 bg-white border border-[var(--app-border)] text-[var(--app-text)] text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                           >
                              <BedDouble className="w-4 h-4" /> Reserve Bed
                           </button>
                           <button
                              onClick={() => setActionMessage(`Calling emergency desk of ${selectedHospital?.name || 'selected hospital'}...`)}
                              className="flex items-center justify-center gap-2 py-3 bg-white border border-[var(--app-border)] text-[var(--app-text)] text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                           >
                              <Phone className="w-4 h-4" /> Call Hospital
                           </button>
               </div>

                      {actionMessage && (
                         <div className="mt-3 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-xs px-3 py-2">
                            {actionMessage}
                         </div>
                      )}
            </div>

                  <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[320px]">
                      <div className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-2xl overflow-hidden">
                            <div className="p-4 border-b border-[var(--app-border)] bg-gray-50 flex items-center justify-between">
                                 <h4 className="font-semibold text-[var(--app-text)] text-sm">Alternative Hospitals</h4>
                                 <span className="text-xs font-medium text-[var(--app-muted)]">Live ranked by AI</span>
                   </div>
                   <div className="divide-y divide-[var(--app-border)]">
                                 {alternatives.map((hospital) => (
                                    <button
                                       key={hospital.id}
                                       onClick={() => setSelectedHospital(hospital)}
                                       className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <div className="flex justify-between items-start gap-3 mb-1">
                                             <div>
                                                <div className="font-medium text-[var(--app-text)] text-sm">{hospital.name}</div>
                                                <div className="text-xs text-[var(--app-muted)] mt-1">{hospital.distanceKm.toFixed(1)} km • ETA {hospital.etaMin} min</div>
                                             </div>
                                             <div className="text-xs font-bold text-[var(--app-blue)]">{hospital.score}%</div>
                           </div>
                                        <div className="grid grid-cols-3 gap-2 mt-3 text-[11px] text-[var(--app-muted)]">
                                             <span>{hospital.resource.icuAvailable} ICU beds</span>
                                             <span>{hospital.resource.ventilatorAvailable} ventilators</span>
                                             <span>{hospital.resource.doctorAvailable} doctors</span>
                                        </div>
                                    </button>
                      ))}
                   </div>
               </div>

                      <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl relative overflow-hidden">
                            <div className="p-4 border-b border-[var(--app-border)] bg-gray-50 flex items-center justify-between">
                                 <h4 className="font-semibold text-[var(--app-text)] text-sm">Live Route Map</h4>
                                 <span className="text-xs text-[var(--app-muted)]">User → Hospital → Ambulance</span>
                            </div>

                            <div className="relative h-full min-h-[320px] bg-gradient-to-br from-sky-50 via-white to-emerald-50">
                                 <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 360" preserveAspectRatio="none">
                                    <defs>
                                       <pattern id="finder-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#dbeafe" strokeWidth="1" />
                                       </pattern>
                                    </defs>
                                    <rect width="600" height="360" fill="url(#finder-grid)" />
                                    <path d="M90 260 C160 220, 190 180, 250 170 S360 170, 430 130 S500 90, 545 80" fill="none" stroke="#2563EB" strokeWidth="8" strokeLinecap="round" strokeDasharray="14 12" />
                                    <path d="M250 170 C310 150, 350 130, 405 115" fill="none" stroke="#8B5CF6" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
                                 </svg>

                                 <div className="absolute left-[12%] top-[69%] -translate-x-1/2 -translate-y-1/2">
                                    <div className="relative">
                                       <span className="absolute inset-0 rounded-full bg-red-400/30 animate-ping" />
                                       <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg">
                                          <MapPin className="w-5 h-5" />
                                       </div>
                                    </div>
                                    <div className="mt-2 rounded-lg bg-white/95 px-2 py-1 text-[11px] font-semibold text-[var(--app-text)] shadow border border-[var(--app-border)]">Patient</div>
                                 </div>

                                 <div className="absolute left-[46%] top-[46%] -translate-x-1/2 -translate-y-1/2">
                                    <div className="relative">
                                       <span className="absolute inset-0 rounded-full bg-blue-400/25 animate-ping" />
                                       <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[var(--app-blue)] text-white shadow-lg">
                                          <Ambulance className="w-5 h-5" />
                                       </div>
                                    </div>
                                    <div className="mt-2 rounded-lg bg-white/95 px-2 py-1 text-[11px] font-semibold text-[var(--app-text)] shadow border border-[var(--app-border)]">Ambulance</div>
                                 </div>

                                 <div className="absolute right-[10%] top-[20%] translate-x-1/2 -translate-y-1/2">
                                    <div className="relative">
                                       <span className="absolute inset-0 rounded-full bg-emerald-400/25 animate-ping" />
                                       <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                                          <Building2 className="w-6 h-6" />
                                       </div>
                                    </div>
                                    <div className="mt-2 rounded-lg bg-white/95 px-2 py-1 text-[11px] font-semibold text-[var(--app-text)] shadow border border-[var(--app-border)] whitespace-nowrap">{selectedHospital?.name || 'Hospital'}</div>
                                 </div>

                                 <div className="absolute left-4 right-4 bottom-4 grid grid-cols-3 gap-3">
                                    <div className="rounded-xl bg-white/95 border border-[var(--app-border)] p-3 shadow-sm">
                                       <div className="text-[10px] uppercase font-semibold text-[var(--app-muted)]">Live ETA</div>
                                       <div className="mt-1 text-sm font-bold text-[var(--app-text)]">{selectedEta}</div>
                                    </div>
                                    <div className="rounded-xl bg-white/95 border border-[var(--app-border)] p-3 shadow-sm">
                                       <div className="text-[10px] uppercase font-semibold text-[var(--app-muted)]">Distance</div>
                                       <div className="mt-1 text-sm font-bold text-[var(--app-text)]">{selectedDistance}</div>
                                    </div>
                                    <div className="rounded-xl bg-white/95 border border-[var(--app-border)] p-3 shadow-sm">
                                       <div className="text-[10px] uppercase font-semibold text-[var(--app-muted)]">Traffic</div>
                                       <div className="mt-1 text-sm font-bold text-[var(--app-text)]">{selectedHospital?.routeStatus || 'Moderate'}</div>
                                    </div>
                                 </div>
                            </div>
               </div>
            </div>
        </div>

      </div>
    </div>
  );
}
