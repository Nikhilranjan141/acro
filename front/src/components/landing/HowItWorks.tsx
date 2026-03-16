import { AlertTriangle, Search, CheckCircle2, Ambulance } from 'lucide-react';
import Container from './Container';
import Section from './Section';

const steps = [
    {
        number: '01',
        icon: <AlertTriangle className="w-5 h-5" />,
        title: 'Emergency Occurs',
        description:
            'An emergency is triggered — accident, cardiac event, or mass casualty incident. First responders immediately activate MedLink.',
        color: '#EF4444',
        bg: '#FFF5F5',
    },
    {
        number: '02',
        icon: <Search className="w-5 h-5" />,
        title: 'MedLink Scans Nearby Hospitals',
        description:
            'The system instantly queries all connected hospitals within range, pulling live data on ICU capacity, staff availability, and equipment.',
        color: '#2563EB',
        bg: '#EFF6FF',
    },
    {
        number: '03',
        icon: <CheckCircle2 className="w-5 h-5" />,
        title: 'System Verifies Available Resources',
        description:
            'AI validates real-time resource availability, filters by patient needs, and ranks hospitals by suitability and ETA.',
        color: '#8B5CF6',
        bg: '#F5F3FF',
    },
    {
        number: '04',
        icon: <Ambulance className="w-5 h-5" />,
        title: 'Ambulance Dispatched to Best Hospital',
        description:
            'The optimal hospital is confirmed, ambulance is routed automatically, and receiving hospital is alerted to prepare.',
        color: '#14B8A6',
        bg: '#F0FDFA',
    },
];

export default function HowItWorks() {
    return (
        <div className="bg-white border-y border-[rgba(31,41,55,0.08)]">
            <Container>
                <Section
                    id="how-it-works"
                    title="How It Works"
                    subtitle="Four simple steps that can save lives in minutes."
                >
                    <div className="relative">
                        {/* Vertical connector line (desktop) */}
                        <div
                            className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-[#EF4444]/30 via-[#8B5CF6]/30 to-[#14B8A6]/30 hidden sm:block"
                            aria-hidden="true"
                        />

                        <div className="space-y-4">
                            {steps.map((step, index) => (
                                <div
                                    key={step.number}
                                    className="group relative flex gap-5 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-[#F6F9FC] border border-[rgba(31,41,55,0.07)] hover:bg-white hover:shadow-md hover:border-[rgba(31,41,55,0.12)] transition-all duration-300"
                                    role="article"
                                    aria-label={`Step ${index + 1}: ${step.title}`}
                                >
                                    {/* Step badge */}
                                    <div className="relative z-10 shrink-0">
                                        <div
                                            className="flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm transition-transform group-hover:scale-110 duration-300 shadow-sm"
                                            style={{ background: step.bg, color: step.color, border: `1.5px solid ${step.color}25` }}
                                        >
                                            {step.icon}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-3 mb-2">
                                            <span
                                                className="text-xs font-bold tabular-nums"
                                                style={{ color: step.color }}
                                            >
                                                STEP {step.number}
                                            </span>
                                            <h3 className="text-base font-semibold text-[#1F2937]">{step.title}</h3>
                                        </div>
                                        <p className="text-sm text-[#6B7280] leading-relaxed">{step.description}</p>
                                    </div>

                                    {/* Hover accent line */}
                                    <div
                                        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ background: step.color }}
                                        aria-hidden="true"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>
            </Container>
        </div>
    );
}
