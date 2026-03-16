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
        label: 'ICU Beds',
        description: 'Live count of available ICU beds across all connected hospitals with instant alerts.',
        icon: <BedDouble className="w-5 h-5" />,
        accent: '#2563EB',
        bg: '#EFF6FF',
    },
    {
        label: 'Ventilators',
        description: 'Real-time ventilator availability tracking with predictive demand forecasting.',
        icon: <Activity className="w-5 h-5" />,
        accent: '#14B8A6',
        bg: '#F0FDFA',
    },
    {
        label: 'Emergency Doctors',
        description: 'Track on-call emergency physicians and specialist availability across facilities.',
        icon: <ShieldAlert className="w-5 h-5" />,
        accent: '#EF4444',
        bg: '#FFF5F5',
    },
    {
        label: 'Ambulance Tracking',
        description: 'GPS-enabled ambulance fleet management with optimal route assignment.',
        icon: <Ambulance className="w-5 h-5" />,
        accent: '#2563EB',
        bg: '#EFF6FF',
    },
    {
        label: 'Blood Bank Status',
        description: 'Monitor blood type inventory in real-time across regional blood banks.',
        icon: <Droplets className="w-5 h-5" />,
        accent: '#14B8A6',
        bg: '#F0FDFA',
    },
    {
        label: 'AI Demand Prediction',
        description: 'ML-powered forecasting of resource demand helps hospitals prepare proactively.',
        icon: <Brain className="w-5 h-5" />,
        accent: '#8B5CF6',
        bg: '#F5F3FF',
    },
];

export default function Features() {
    return (
        <Container>
            <Section
                id="features"
                title="Platform Features"
                subtitle="Everything you need to coordinate emergency healthcare resources in real time."
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((feature) => (
                        <FeatureCard key={feature.label} feature={feature} />
                    ))}
                </div>
            </Section>
        </Container>
    );
}

function FeatureCard({ feature }: { feature: Feature }) {
    return (
        <div
            className="group relative flex flex-col gap-3 p-5 rounded-2xl bg-white border border-[rgba(31,41,55,0.08)] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default focus-within:ring-2 focus-within:ring-[#2563EB]"
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
            <p className="text-sm text-[#6B7280] leading-relaxed">{feature.description}</p>

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
