import React, { useEffect, useState } from 'react';
import { ArrowRight, Play, MapPin, BedDouble, Ambulance, Activity, Clock3, Building2, ShieldCheck } from 'lucide-react';
import Container from './Container';
import Chip from './ui/Chip';
import MedLinkLogo from '../common/MedLinkLogo';

interface HeroProps {
    onOpenGetStarted: () => void;
    onOpenDemo: () => void;
}

export default function Hero({ onOpenGetStarted, onOpenDemo }: HeroProps) {
    const hospitalsMarquee = [
        { name: 'Indore Central Hospital', beds: 12, icu: 8 },
        { name: 'Eastside Medical Centre', beds: 8, icu: 5 },
        { name: 'CHL Health Campus', beds: 5, icu: 3 },
        { name: 'Apollo Sage Indore', beds: 6, icu: 4 },
        { name: 'Bombay Hospital Indore', beds: 6, icu: 4 },
    ];

    function HorizontalRotator({ items, speed = 28, className = '' }: { items: string[]; speed?: number; className?: string }) {
        // speed = seconds for full loop; duplicate items for smooth continuous scroll
        return (
            <div className={`${className} overflow-hidden w-full`} style={{ height: 36 }}>
                <div className="hero-feature-marquee">
                    <div className="hero-feature-track" style={{ animationDuration: `${speed}s` }}>
                        {[...items, ...items].map((it, i) => (
                            <div key={i} className="hero-feature-item px-6 text-sm text-[#374151] font-medium">
                                {it}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center pt-16 pb-20 overflow-hidden bg-[#F6F9FC]"
            aria-labelledby="hero-heading"
        >
            {/* Background gradient blobs */}
            <div
                className="hero-glow"
                style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.16) 0%, rgba(139,92,246,0.14) 100%)', top: '-100px', left: '-200px' }}
                aria-hidden="true"
            />
            <div
                className="hero-glow"
                style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.16) 0%, rgba(37,99,235,0.12) 100%)', top: '100px', right: '-150px' }}
                aria-hidden="true"
            />
            <div
                className="hero-glow"
                style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', bottom: '0', left: '40%' }}
                aria-hidden="true"
            />

            {/* Subtle dot grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage: 'radial-gradient(#1F2937 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
                aria-hidden="true"
            />

            <Container className="relative z-10">
                <div className="flex flex-col items-center text-center max-w-5xl mx-auto">

                    {/* Pill badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(37,99,235,0.12)] border border-[#E5E7EB] mb-6 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                        <span className="text-xs font-bold text-[#2563EB] tracking-widest uppercase">
                            Hospital Administrator System
                        </span>
                    </div>

                    {/* Heading with gradient emphasis */}
                    <h1
                        id="hero-heading"
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight text-[#1F2937]"
                    >
                        Connected{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #2563EB 0%, #8B5CF6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Hospital Networks
                        </span>
                        <br />
                        <span className="text-[#1F2937]">Emergency Coordination Platform</span>
                    </h1>

                    {/* Feature rotator subtitle (refined fade) */}
                    <HorizontalRotator className="mt-6" items={[
                        'Real-time ICU bed tracking & availability',
                        'AI-powered ambulance routing optimization',
                        'Live doctor & ventilator resource management',
                        'Emergency coordination across regions',
                        'Smart hospital recommendations',
                    ]} speed={36} />

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl">
                        <AnimatedKpi icon={<Clock3 className="w-4 h-4" />} label="Avg Response" value={4.2} suffix=" min" duration={900} />
                        <AnimatedKpi icon={<Building2 className="w-4 h-4" />} label="Connected Hospitals" value={27} duration={1200} />
                        <AnimatedKpi icon={<ShieldCheck className="w-4 h-4" />} label="Critical Routing" value={0} suffix="AI Optimized" duration={800} staticText />
                    </div>

                    {/* CTA Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                        <button
                            id="hero-get-started"
                            onClick={onOpenGetStarted}
                            className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-bold text-white bg-[#2563EB] rounded-xl hover:bg-[#1D4ED8] active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
                            style={{ boxShadow: '0 10px 20px rgba(37, 99, 235, 0.18)' }}
                            aria-label="Get started with MedLink"
                        >
                            Get Started
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            id="hero-view-demo"
                            onClick={onOpenDemo}
                            className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-[#1F2937] bg-white border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
                            aria-label="View MedLink demo"
                        >
                            <Play className="w-4 h-4 text-[#2563EB]" />
                            View Demo
                        </button>
                    </div>

                    {/* Trust chips */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Chip label="HIPAA Compliant" dotColor="#8B5CF6" />
                        <Chip label="Real-time Updates" dotColor="#14B8A6" />
                        <Chip label="99.9% Uptime" dotColor="#2563EB" />
                    </div>

                    {/* Dashboard preview card */}
                    <div className="mt-14 w-full max-w-3xl mx-auto">
                        <div className="relative bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden" style={{ boxShadow: '0 10px 25px rgba(17, 24, 39, 0.06)' }}>
                            {/* Card chrome bar */}
                            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[rgba(31,41,55,0.06)] bg-gray-50/80">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6]" />
                                <span className="ml-auto text-xs font-medium text-[#6B7280] flex items-center gap-1">
                                    <MedLinkLogo iconOnly iconClassName="w-5 h-5 rounded-md" />
                                    MedLink Live Dashboard
                                </span>
                            </div>

                            <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                                {/* KPI chips */}
                                <div className="flex flex-col gap-3 sm:w-48 shrink-0">
                                    <KpiChip label="ICU Beds Available" value="142" color="#2563EB" icon={<BedDouble className="w-4 h-4" />} />
                                    <KpiChip label="Ambulances Active" value="38" color="#14B8A6" icon={<Ambulance className="w-4 h-4" />} />
                                    <KpiChip label="Hospitals Online" value="27" color="#8B5CF6" icon={<Activity className="w-4 h-4" />} />
                                </div>

                                {/* Mini map placeholder */}
                                <div className="flex-1 relative rounded-xl overflow-hidden bg-[#F9FAFB] border border-[#E5E7EB] min-h-[160px] shadow-sm">
                                    <div className="absolute inset-0">
                                        <svg className="absolute inset-0 w-full h-full opacity-30">
                                            <defs>
                                                <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                                                    <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#2563EB" strokeWidth="0.5" />
                                                </pattern>
                                            </defs>
                                            <rect width="100%" height="100%" fill="url(#grid)" />
                                        </svg>
                                        {[
                                            { x: '20%', y: '30%', color: '#2563EB' },
                                            { x: '50%', y: '45%', color: '#14B8A6' },
                                            { x: '70%', y: '25%', color: '#EF4444' },
                                            { x: '35%', y: '65%', color: '#8B5CF6' },
                                            { x: '80%', y: '60%', color: '#F59E0B' },
                                        ].map((pin, i) => (
                                            <div
                                                key={i}
                                                className="absolute flex flex-col items-center"
                                                style={{ left: pin.x, top: pin.y, transform: 'translate(-50%, -50%)' }}
                                            >
                                                <MapPin className="w-5 h-5 drop-shadow-sm" style={{ color: pin.color }} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="absolute bottom-2 right-2 text-[10px] font-medium text-[#6B7280] bg-white/80 px-2 py-1 rounded-md border border-[rgba(31,41,55,0.08)]">
                                        Live Map View
                                    </div>
                                </div>

                                {/* Static hospital preview row (polished, hover animation) */}
                                <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {hospitalsMarquee.map((h, idx) => (
                                        <div key={idx} className="bg-white rounded-xl p-3 border border-[rgba(31,41,55,0.06)] shadow-sm transform transition-transform hover:-translate-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm font-semibold truncate">{h.name}</div>
                                                <div className="text-xs text-[#6B7280]">ICU {h.icu}</div>
                                            </div>
                                            <div className="text-xs text-[#6B7280] mt-2">Beds Free: {h.beds}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Status bar */}
                            <div className="px-4 sm:px-6 py-3 border-t border-[rgba(31,41,55,0.06)] bg-gray-50/50 flex items-center gap-4">
                                <span className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                                    <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
                                    All systems operational
                                </span>
                                <span className="text-xs text-[#6B7280] ml-auto">Last updated: just now</span>
                            </div>
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
}



function AnimatedKpi({ icon, label, value, suffix = '', duration = 1000, staticText = false }: { icon: React.ReactNode; label: string; value: number; suffix?: string; duration?: number; staticText?: boolean }) {
    const [current, setCurrent] = useState<number>(0);
    useEffect(() => {
        if (staticText) return;
        let start = 0;
        const end = value;
        const stepTime = Math.max(16, Math.floor(duration / Math.max(1, end)));
        const timer = setInterval(() => {
            start += Math.max(1, Math.ceil(end / (duration / stepTime)));
            if (start >= end) {
                setCurrent(end);
                clearInterval(timer);
            } else {
                setCurrent(start);
            }
        }, stepTime);
        return () => clearInterval(timer);
    }, [value, duration, staticText]);

    return (
        <div className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 shadow-sm kpi-animated">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(37,99,235,0.12)] text-[#2563EB]">{icon}</span>
            <span className="min-w-0 text-left">
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-[#6B7280]">{label}</span>
                <span className="block text-sm font-bold text-[#1F2937] truncate">{staticText ? suffix : `${current}${suffix}`}</span>
            </span>
        </div>
    );
}

function KpiChip({ label, value, color, icon }: { label: string; value: string; color: string; icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 border border-[rgba(31,41,55,0.07)] hover:bg-gray-100/80 transition-colors">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0" style={{ background: `${color}1A`, color }}>
                {icon}
            </div>
            <div className="min-w-0">
                <div className="text-lg font-bold leading-none" style={{ color }}>{value}</div>
                <div className="text-[10px] text-[#6B7280] mt-0.5 leading-tight truncate">{label}</div>
            </div>
        </div>
    );
}
