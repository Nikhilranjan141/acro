import { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard, MapPin, ArrowRightLeft, Brain,
    Activity, BedDouble, Ambulance, Play, Square,
    TrendingUp, AlertTriangle, CheckCircle2, Clock,
} from 'lucide-react';
import Modal from './Modal';
import { cn } from '../../../lib/cn';

type Tab = 'dashboard' | 'map' | 'transfers' | 'ai';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'map', label: 'Map', icon: <MapPin className="w-4 h-4" /> },
    { id: 'transfers', label: 'Transfers', icon: <ArrowRightLeft className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Insights', icon: <Brain className="w-4 h-4" /> },
];

interface DemoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/* ─── Dashboard Tab ─── */
function DashboardTab({ simulating }: { simulating: boolean }) {
    const [kpis, setKpis] = useState({ icu: 142, ventilators: 38, hospitals: 27, ambulances: 15 });
    const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

    useEffect(() => {
        if (simulating) {
            intervalRef.current = setInterval(() => {
                setKpis((p) => ({
                    icu: Math.max(80, p.icu + Math.floor(Math.random() * 7) - 3),
                    ventilators: Math.max(20, p.ventilators + Math.floor(Math.random() * 5) - 2),
                    hospitals: Math.max(20, p.hospitals + (Math.random() > 0.8 ? 1 : 0)),
                    ambulances: Math.max(8, p.ambulances + Math.floor(Math.random() * 4) - 2),
                }));
            }, 2000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [simulating]);

    const kpiData = [
        { label: 'ICU Beds', value: kpis.icu, icon: <BedDouble className="w-4 h-4" />, color: '#2563EB', max: 180 },
        { label: 'Ventilators', value: kpis.ventilators, icon: <Activity className="w-4 h-4" />, color: '#14B8A6', max: 52 },
        { label: 'Hospitals Online', value: kpis.hospitals, icon: <Activity className="w-4 h-4" />, color: '#8B5CF6', max: 32 },
        { label: 'Ambulances Active', value: kpis.ambulances, icon: <Ambulance className="w-4 h-4" />, color: '#EF4444', max: 20 },
    ];

    const feed = [
        { dot: '#14B8A6', text: 'City General: 3 ICU beds available' },
        { dot: '#2563EB', text: 'Ambulance #12 en-route to St. Mary' },
        { dot: '#EF4444', text: 'Blood Bank: A+ supply critically low' },
        { dot: '#8B5CF6', text: 'AI: East sector surge predicted +18%' },
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                {kpiData.map((k) => (
                    <div key={k.label} className="p-3.5 rounded-xl bg-gray-50 border border-[rgba(31,41,55,0.07)]">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${k.color}18`, color: k.color }}>
                                {k.icon}
                            </div>
                            <span className="text-xs text-[#6B7280]">{k.label}</span>
                        </div>
                        <div className="text-2xl font-bold transition-all duration-500" style={{ color: k.color }}>
                            {k.value}
                        </div>
                        <div className="mt-1.5 h-1 rounded-full bg-gray-200">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${(k.value / k.max) * 100}%`, background: k.color }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">Live Activity Feed</p>
                <div className="space-y-1.5">
                    {feed.map((f, i) => (
                        <div key={i} className={cn('flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-50 border border-[rgba(31,41,55,0.05)]', simulating && i === 0 ? 'animate-pulse' : '')}>
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: f.dot }} />
                            <span className="text-xs text-[#374151]">{f.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Map Tab ─── */
function MapTab() {
    const hospitals = [
        { name: 'City General Hospital', icu: 42, status: 'Available', color: '#14B8A6' },
        { name: 'St. Mary Medical Center', icu: 8, status: 'Limited', color: '#F59E0B' },
        { name: 'Metro Emergency Clinic', icu: 0, status: 'Full', color: '#EF4444' },
        { name: 'Riverside Regional', icu: 27, status: 'Available', color: '#14B8A6' },
        { name: 'Northside Trauma Center', icu: 5, status: 'Limited', color: '#F59E0B' },
    ];

    const pins = [
        { x: '18%', y: '38%', c: '#14B8A6' },
        { x: '44%', y: '52%', c: '#F59E0B' },
        { x: '67%', y: '28%', c: '#EF4444' },
        { x: '78%', y: '62%', c: '#14B8A6' },
        { x: '32%', y: '70%', c: '#F59E0B' },
    ];

    return (
        <div className="space-y-4">
            {/* Mini map */}
            <div className="relative h-36 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-teal-50 border border-[rgba(31,41,55,0.07)]">
                <svg className="absolute inset-0 w-full h-full opacity-15">
                    <defs><pattern id="dm" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2563EB" strokeWidth="0.5" /></pattern></defs>
                    <rect width="100%" height="100%" fill="url(#dm)" />
                </svg>
                {pins.map((p, i) => (
                    <div key={i} className="absolute" style={{ left: p.x, top: p.y, transform: 'translate(-50%,-50%)' }}>
                        <MapPin className="w-5 h-5 drop-shadow" style={{ color: p.c }} />
                    </div>
                ))}
                <div className="absolute bottom-2 right-2 text-[10px] bg-white/80 px-2 py-1 rounded-md border border-[rgba(31,41,55,0.08)] text-[#6B7280]">
                    {hospitals.length} hospitals connected
                </div>
            </div>
            {/* List */}
            <div className="space-y-2">
                {hospitals.map((h) => (
                    <div key={h.name} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 border border-[rgba(31,41,55,0.07)]">
                        <div>
                            <div className="text-sm font-medium text-[#1F2937]">{h.name}</div>
                            <div className="text-xs text-[#6B7280]">{h.icu} ICU beds free</div>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${h.color}18`, color: h.color }}>
                            {h.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Transfers Tab ─── */
function TransfersTab({ simulating }: { simulating: boolean }) {
    const [transfers, setTransfers] = useState([
        { id: 'T-1041', from: 'Metro Emergency', to: 'City General', status: 'In Transit', eta: '4 min', color: '#2563EB' },
        { id: 'T-1040', from: 'Northside Trauma', to: 'Riverside Regional', status: 'Completed', eta: '—', color: '#14B8A6' },
        { id: 'T-1039', from: 'St. Mary', to: 'City General', status: 'Pending Approval', eta: '12 min', color: '#F59E0B' },
        { id: 'T-1038', from: 'City General', to: 'Northside Trauma', status: 'Completed', eta: '—', color: '#14B8A6' },
    ]);

    useEffect(() => {
        if (!simulating) return;
        const id = setInterval(() => {
            setTransfers((prev) =>
                prev.map((t) =>
                    t.status === 'In Transit'
                        ? { ...t, eta: `${Math.max(1, parseInt(t.eta) - 1)} min` }
                        : t
                )
            );
        }, 2000);
        return () => clearInterval(id);
    }, [simulating]);

    const statusIcon = (s: string) => {
        if (s === 'Completed') return <CheckCircle2 className="w-3.5 h-3.5" />;
        if (s === 'In Transit') return <Ambulance className="w-3.5 h-3.5" />;
        return <Clock className="w-3.5 h-3.5" />;
    };

    return (
        <div className="space-y-2.5">
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Active Transfer Pipeline</p>
            {transfers.map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl bg-gray-50 border border-[rgba(31,41,55,0.07)] transition-all duration-300">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#9CA3AF]">{t.id}</span>
                        <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${t.color}18`, color: t.color }}>
                            {statusIcon(t.status)} {t.status}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#374151]">
                        <span className="font-medium truncate">{t.from}</span>
                        <ArrowRightLeft className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                        <span className="font-medium truncate">{t.to}</span>
                    </div>
                    {t.eta !== '—' && (
                        <p className="text-xs text-[#6B7280] mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> ETA: {t.eta}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}

/* ─── AI Tab ─── */
function AITab({ simulating }: { simulating: boolean }) {
    const [predictions, setPredictions] = useState([
        { title: 'ICU Surge Predicted', msg: 'East sector ICU capacity may reach 90% within 2 hours.', risk: 'High', pct: 90, color: '#EF4444' },
        { title: 'Ambulance Demand', msg: 'Northside area projected to need 3 more units by 22:00.', risk: 'Medium', pct: 62, color: '#F59E0B' },
        { title: 'Blood Bank Restock', msg: 'O- blood type supply optimal for next 6 hours.', risk: 'Low', pct: 24, color: '#14B8A6' },
        { title: 'Staff Allocation', msg: 'City General ER may be under-staffed during shift change.', risk: 'Medium', pct: 55, color: '#8B5CF6' },
    ]);

    useEffect(() => {
        if (!simulating) return;
        const id = setInterval(() => {
            setPredictions((prev) =>
                prev.map((p) => ({
                    ...p,
                    pct: Math.min(98, Math.max(10, p.pct + Math.floor(Math.random() * 6) - 3)),
                }))
            );
        }, 2000);
        return () => clearInterval(id);
    }, [simulating]);

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F5F3FF] border border-purple-100">
                <Brain className="w-4 h-4 text-[#8B5CF6]" />
                <p className="text-xs text-[#6B7280]">
                    <span className="font-semibold text-[#8B5CF6]">MedLink AI</span> — predictions update every 90 seconds based on live data.
                </p>
            </div>
            {predictions.map((p) => (
                <div key={p.title} className="p-3.5 rounded-xl bg-gray-50 border border-[rgba(31,41,55,0.07)]">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5" style={{ color: p.color }} />
                            <span className="text-sm font-semibold text-[#1F2937]">{p.title}</span>
                        </div>
                        <span className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${p.color}18`, color: p.color }}>
                            {p.risk} Risk
                        </span>
                    </div>
                    <p className="text-xs text-[#6B7280] mb-2 leading-relaxed">{p.msg}</p>
                    <div className="h-1.5 rounded-full bg-gray-200">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p.pct}%`, background: p.color }} />
                    </div>
                    <div className="text-[11px] text-right mt-0.5" style={{ color: p.color }}>{p.pct}% confidence</div>
                </div>
            ))}
        </div>
    );
}

/* ─── Main Demo Modal ─── */
export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [simulating, setSimulating] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setSimulating(false);
            setActiveTab('dashboard');
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="MedLink Demo" size="xl">
            <div className="flex flex-col" style={{ maxHeight: '85vh' }}>
                {/* Demo header */}
                <div className="px-6 pt-6 pb-4 border-b border-[rgba(31,41,55,0.08)] shrink-0">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2563EB]">
                            <Activity className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#1F2937]">Interactive Demo Preview</h2>
                            <p className="text-xs text-[#6B7280]">Client-side simulation — no backend required</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mt-4 bg-gray-100 rounded-xl p-1" role="tablist">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]',
                                    activeTab === tab.id
                                        ? 'bg-white text-[#2563EB] shadow-sm'
                                        : 'text-[#6B7280] hover:text-[#374151]'
                                )}
                            >
                                {tab.icon}
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab content — scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {activeTab === 'dashboard' && <DashboardTab simulating={simulating} />}
                    {activeTab === 'map' && <MapTab />}
                    {activeTab === 'transfers' && <TransfersTab simulating={simulating} />}
                    {activeTab === 'ai' && <AITab simulating={simulating} />}
                </div>

                {/* Simulation toggle footer */}
                <div className="px-6 py-4 border-t border-[rgba(31,41,55,0.08)] bg-gray-50/60 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        {simulating ? (
                            <span className="flex items-center gap-1.5 text-xs text-[#14B8A6] font-semibold">
                                <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
                                Live Simulation Running
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                Simulation paused
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setSimulating(!simulating)}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]',
                            simulating
                                ? 'bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20'
                                : 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] shadow-sm'
                        )}
                        aria-pressed={simulating}
                    >
                        {simulating ? (
                            <><Square className="w-3.5 h-3.5" /> Stop simulation</>
                        ) : (
                            <><Play className="w-3.5 h-3.5" /> Play live simulation</>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
