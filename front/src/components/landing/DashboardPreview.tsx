import { useState } from 'react';
import { MapPin, LayoutDashboard, ShieldAlert, Activity } from 'lucide-react';
import Container from './Container';
import Section from './Section';
import { cn } from '../../lib/cn';

const views = [
    {
        id: 'map',
        icon: <MapPin className="w-4 h-4" />,
        label: 'Hospital Map View',
        description: 'Visualize all hospitals on an interactive map with live resource overlays.',
    },
    {
        id: 'admin',
        icon: <LayoutDashboard className="w-4 h-4" />,
        label: 'Admin Dashboard',
        description: 'Manage hospital resources, staff, and system configurations from one panel.',
    },
    {
        id: 'emergency',
        icon: <ShieldAlert className="w-4 h-4" />,
        label: 'Emergency Mode',
        description: 'Activate during a mass casualty event to prioritize and coordinate all responses.',
    },
];

const resourceRows = [
    { label: 'ICU Beds', value: '142 / 180', pct: 79, color: '#2563EB' },
    { label: 'Ventilators', value: '38 / 52', pct: 73, color: '#14B8A6' },
    { label: 'Emergency Doctors', value: '24 active', pct: 60, color: '#EF4444' },
    { label: 'Ambulances', value: '15 / 20', pct: 75, color: '#8B5CF6' },
];

const activityFeed = [
    { msg: 'City General: 2 ICU beds freed', time: '1m ago', dot: '#14B8A6' },
    { msg: 'Ambulance #7 dispatched to Mercy', time: '3m ago', dot: '#2563EB' },
    { msg: 'Blood Bank: O- stock low', time: '5m ago', dot: '#EF4444' },
    { msg: 'AI alert: surge predicted in NE zone', time: '9m ago', dot: '#8B5CF6' },
];

export default function DashboardPreview() {
    const [active, setActive] = useState('map');

    return (
        <Container>
            <Section
                title="Dashboard Preview"
                subtitle="A glimpse into the MedLink command center — designed for speed and clarity."
            >
                <div className="grid md:grid-cols-5 gap-6">
                    {/* Left: view list */}
                    <div className="md:col-span-2 flex flex-col gap-3" role="list" aria-label="Dashboard views">
                        {views.map((view) => (
                            <button
                                key={view.id}
                                id={`dash-view-${view.id}`}
                                onClick={() => setActive(view.id)}
                                className={cn(
                                    'group flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#2563EB]',
                                    active === view.id
                                        ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-md shadow-blue-200'
                                        : 'bg-white border-[rgba(31,41,55,0.08)] text-[#1F2937] hover:border-[#2563EB]/30 hover:bg-blue-50/30'
                                )}
                                aria-pressed={active === view.id}
                            >
                                <div
                                    className={cn(
                                        'flex items-center justify-center w-8 h-8 rounded-lg shrink-0 mt-0.5 transition-colors',
                                        active === view.id ? 'bg-white/20' : 'bg-[#2563EB]/10 text-[#2563EB]'
                                    )}
                                >
                                    {view.icon}
                                </div>
                                <div>
                                    <div
                                        className={cn(
                                            'text-sm font-semibold',
                                            active === view.id ? 'text-white' : 'text-[#1F2937]'
                                        )}
                                    >
                                        {view.label}
                                    </div>
                                    <div
                                        className={cn(
                                            'text-xs mt-0.5 leading-snug',
                                            active === view.id ? 'text-white/70' : 'text-[#6B7280]'
                                        )}
                                    >
                                        {view.description}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Right: preview frame */}
                    <div className="md:col-span-3 bg-white rounded-2xl border border-[rgba(31,41,55,0.08)] shadow-sm overflow-hidden">
                        {/* Frame header */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(31,41,55,0.06)] bg-gray-50">
                            <div className="flex gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6]" />
                            </div>
                            <span className="ml-2 text-xs font-medium text-[#6B7280] flex items-center gap-1.5">
                                <Activity className="w-3 h-3 text-[#2563EB]" />
                                MedLink —{' '}
                                {active === 'map'
                                    ? 'Hospital Map View'
                                    : active === 'admin'
                                        ? 'Admin Dashboard'
                                        : 'Emergency Mode'}
                            </span>
                            <span className="ml-auto flex items-center gap-1 text-[10px] text-[#14B8A6] font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
                                LIVE
                            </span>
                        </div>

                        <div className="p-4 flex flex-col gap-4">
                            {/* Map block skeleton */}
                            <div className="relative h-32 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 border border-[rgba(31,41,55,0.06)] overflow-hidden">
                                <svg className="absolute inset-0 w-full h-full opacity-15">
                                    <defs>
                                        <pattern id="dashgrid" width="20" height="20" patternUnits="userSpaceOnUse">
                                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2563EB" strokeWidth="0.5" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#dashgrid)" />
                                </svg>
                                {[
                                    { x: '15%', y: '40%', c: '#2563EB' },
                                    { x: '42%', y: '55%', c: '#14B8A6' },
                                    { x: '65%', y: '30%', c: '#EF4444' },
                                    { x: '80%', y: '65%', c: '#8B5CF6' },
                                ].map((p, i) => (
                                    <div
                                        key={i}
                                        className="absolute"
                                        style={{ left: p.x, top: p.y, transform: 'translate(-50%,-50%)' }}
                                    >
                                        <MapPin className="w-4 h-4 drop-shadow" style={{ color: p.c }} />
                                    </div>
                                ))}
                                <div className="absolute bottom-2 left-2 text-[10px] text-[#6B7280] bg-white/80 px-2 py-0.5 rounded-md border border-[rgba(31,41,55,0.08)]">
                                    27 hospitals connected
                                </div>
                            </div>

                            {/* Resource table rows */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                                        Resource Status
                                    </span>
                                    <span className="text-[10px] text-[#6B7280]">Real-time</span>
                                </div>
                                {resourceRows.map((row) => (
                                    <div key={row.label} className="flex items-center gap-3">
                                        <div className="w-28 shrink-0">
                                            <span className="text-xs text-[#374151] font-medium">{row.label}</span>
                                        </div>
                                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${row.pct}%`, background: row.color }}
                                            />
                                        </div>
                                        <span className="text-[11px] text-[#6B7280] w-20 text-right shrink-0">
                                            {row.value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Activity feed */}
                            <div>
                                <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                                    Activity Feed
                                </div>
                                <div className="space-y-1.5">
                                    {activityFeed.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg bg-gray-50 border border-[rgba(31,41,55,0.05)]"
                                        >
                                            <span
                                                className="w-2 h-2 rounded-full shrink-0"
                                                style={{ background: item.dot }}
                                            />
                                            <span className="text-xs text-[#374151] flex-1 leading-snug">{item.msg}</span>
                                            <span className="text-[10px] text-[#9CA3AF] shrink-0">{item.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </Container>
    );
}
