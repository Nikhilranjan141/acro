import { ArrowRight, Play, MapPin, BedDouble, Ambulance, Activity } from 'lucide-react';
import Container from './Container';
import Chip from './ui/Chip';

interface HeroProps {
    onOpenGetStarted: () => void;
    onOpenDemo: () => void;
}

export default function Hero({ onOpenGetStarted, onOpenDemo }: HeroProps) {
    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center pt-16 pb-20 overflow-hidden"
            aria-labelledby="hero-heading"
        >
            {/* Background gradient blobs */}
            <div
                className="hero-glow"
                style={{ background: '#2563EB', top: '-100px', left: '-200px' }}
                aria-hidden="true"
            />
            <div
                className="hero-glow"
                style={{ background: '#14B8A6', top: '100px', right: '-150px' }}
                aria-hidden="true"
            />
            <div
                className="hero-glow"
                style={{ background: '#8B5CF6', bottom: '0', left: '40%' }}
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
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

                    {/* Pill badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                        <span className="text-xs font-bold text-[#2563EB] tracking-widest uppercase">
                            Emergency Healthcare Network
                        </span>
                    </div>

                    {/* Heading with gradient emphasis */}
                    <h1
                        id="hero-heading"
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-[#1F2937]"
                    >
                        MedLink —{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #2563EB 0%, #14B8A6 50%, #8B5CF6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Smart Healthcare
                        </span>
                        <br />
                        Resource Network
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-6 text-lg sm:text-xl text-[#6B7280] leading-relaxed max-w-2xl">
                        Real-time visibility of ICU beds, ventilators, doctors, and ambulances
                        across hospitals during emergencies. Save lives with better coordination.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                        <button
                            id="hero-get-started"
                            onClick={onOpenGetStarted}
                            className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-[#2563EB] rounded-xl hover:bg-[#1d4ed8] active:scale-95 transition-all duration-200 shadow-lg shadow-blue-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
                            aria-label="Get started with MedLink"
                        >
                            Get Started
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            id="hero-view-demo"
                            onClick={onOpenDemo}
                            className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-[#1F2937] bg-white border border-[rgba(31,41,55,0.15)] rounded-xl hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
                            aria-label="View MedLink demo"
                        >
                            <Play className="w-4 h-4 text-[#2563EB]" />
                            View Demo
                        </button>
                    </div>

                    {/* Trust chips */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <Chip label="HIPAA Compliant" dotColor="#14B8A6" />
                        <Chip label="Real-time Updates" dotColor="#14B8A6" />
                        <Chip label="99.9% Uptime" dotColor="#14B8A6" />
                    </div>

                    {/* Dashboard preview card */}
                    <div className="mt-14 w-full max-w-3xl mx-auto">
                        <div className="relative bg-white rounded-2xl border border-[rgba(31,41,55,0.08)] shadow-xl overflow-hidden">
                            {/* Card chrome bar */}
                            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[rgba(31,41,55,0.06)] bg-gray-50/80">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6]" />
                                <span className="ml-auto text-xs font-medium text-[#6B7280] flex items-center gap-1">
                                    <Activity className="w-3 h-3 text-[#2563EB]" />
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
                                <div className="flex-1 relative rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-teal-50 border border-[rgba(31,41,55,0.06)] min-h-[160px]">
                                    <div className="absolute inset-0">
                                        <svg className="absolute inset-0 w-full h-full opacity-20">
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
                                            { x: '35%', y: '65%', color: '#2563EB' },
                                            { x: '80%', y: '60%', color: '#8B5CF6' },
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
