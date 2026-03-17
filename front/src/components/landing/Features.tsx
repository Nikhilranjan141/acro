import { BedDouble, Activity, Ambulance, Brain, ShieldAlert, Droplets } from 'lucide-react';
import Container from './Container';
import Section from './Section';

interface Feature {
    label: string;
    description: string;
    icon: React.ReactNode;
    accent: string;
    bg: string;
}

const features: Feature[] = [
    {
        label: 'Real-Time Resource Dashboard',
        description: 'Monitor live ICU beds, ventilators, doctors, ambulances, and blood bank inventory across your entire network.',
        icon: <BedDouble className="w-5 h-5" />,
        accent: '#2563EB',
        bg: 'rgba(37,99,235,0.12)',
    },
    {
        label: 'Smart Hospital Recommendation',
        description: 'AI identifies the best hospital based on availability, specializations, equipment readiness, and distance.',
        icon: <Brain className="w-5 h-5" />,
        accent: '#8B5CF6',
        bg: 'rgba(139,92,246,0.12)',
    },
    {
        label: 'Ambulance Coordination',
        description: 'GPS tracking with optimal routing, emergency priority dispatch, and pre-arrival hospital notifications.',
        icon: <Ambulance className="w-5 h-5" />,
        accent: '#EF4444',
        bg: 'rgba(239,68,68,0.12)',
    },
    {
        label: 'Patient Transfer System',
        description: 'Request system with destination confirmation, live resource verification, and transfer documentation tracking.',
        icon: <Activity className="w-5 h-5" />,
        accent: '#14B8A6',
        bg: 'rgba(20,184,166,0.12)',
    },
    {
        label: 'AI Demand Prediction',
        description: 'Forecast ICU surges, emergency admissions, equipment shortages, and resource trends before they occur.',
        icon: <ShieldAlert className="w-5 h-5" />,
        accent: '#8B5CF6',
        bg: 'rgba(139,92,246,0.12)',
    },
    {
        label: 'Emergency Coordination Mode',
        description: 'Activate during disasters or mass casualty incidents for unified emergency response across all hospitals.',
        icon: <Droplets className="w-5 h-5" />,
        accent: '#EF4444',
        bg: 'rgba(239,68,68,0.12)',
    },
];

export default function Features() {
    return (
        <div className="bg-[#F9FAFB] border-y border-[#E5E7EB]">
            <Container>
            <Section
                id="features"
                title="Core Platform Features"
                subtitle="Hospital-centered features designed for emergency coordinators and administrators."
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((feature) => (
                        <FeatureCard key={feature.label} feature={feature} />
                    ))}
                </div>
            </Section>
            </Container>
        </div>
    );
}

function FeatureCard({ feature }: { feature: Feature }) {
    return (
        <div
            className="group relative flex flex-col gap-3 p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB] shadow-sm hover:shadow-md hover:bg-[#F9FAFB] transition-all duration-300 cursor-default focus-within:ring-2 focus-within:ring-[#2563EB]"
            tabIndex={0}
            aria-label={feature.label}
        >
            {/* Icon pill */}
            <div
                className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl w-fit transition-transform group-hover:scale-105 duration-200"
                style={{ background: feature.bg, color: feature.accent }}
            >
                {feature.icon}
                <span className="text-sm font-semibold">{feature.label}</span>
            </div>

            {/* Description */}
            <p className="text-sm text-[#6B7280] leading-relaxed font-medium">{feature.description}</p>

            {/* Bottom accent line */}
            <div
                className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, ${feature.accent}40, ${feature.accent}10)` }}
                aria-hidden="true"
            />

            {/* Hover glow */}
            <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse at top left, ${feature.accent}08 0%, transparent 60%)`,
                }}
                aria-hidden="true"
            />
        </div>
    );
}
