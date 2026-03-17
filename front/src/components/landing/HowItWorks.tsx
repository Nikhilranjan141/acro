import { AlertTriangle, Search, CheckCircle2, Ambulance } from 'lucide-react';
import Container from './Container';
import Section from './Section';

const steps = [
    {
        number: '01',
        icon: <AlertTriangle className="w-5 h-5" />,
        title: 'Emergency Event Initiated',
        description:
            'An emergency occurs — accident, cardiac event, or mass casualty incident. First responders activate MedLink coordination.',
        color: '#2563EB',
        bg: 'rgba(37,99,235,0.12)',
    },
    {
        number: '02',
        icon: <Search className="w-5 h-5" />,
        title: 'System Scans Connected Hospitals',
        description:
            'Platform instantly gathers live resource data from nearby hospitals — ICU availability, staff, equipment, and ambulance status.',
        color: '#2563EB',
        bg: 'rgba(37,99,235,0.12)',
    },
    {
        number: '03',
        icon: <CheckCircle2 className="w-5 h-5" />,
        title: 'AI Verifies Hospital Readiness',
        description:
            'MedLink validates resource availability, ranks hospitals by suitability based on patient needs, distance, and ETA.',
        color: '#2563EB',
        bg: 'rgba(37,99,235,0.12)',
    },
    {
        number: '04',
        icon: <Ambulance className="w-5 h-5" />,
        title: 'Optimal Routing Executed',
        description:
            'Patient and ambulance are directed to the most capable hospital immediately. Receiving hospital prepares resources.',
        color: '#2563EB',
        bg: 'rgba(37,99,235,0.12)',
    },
];

export default function HowItWorks() {
    return (
        <div className="bg-[#F9FAFB] border-y border-[#E5E7EB]">
            <Container>
                <Section
                    id="how-it-works"
                    title="How MedLink Works"
                    subtitle="Four steps that can save lives in critical minutes."
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
                                    className="group relative flex gap-5 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB] hover:shadow-md transition-all duration-300"
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
                                        <p className="text-sm text-[#6B7280] leading-relaxed font-medium">{step.description}</p>
                                    </div>

                                    {/* Hover accent line */}
                                    <div
                                        className="absolute left-0 top-0 bottom-0 w-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ background: `linear-gradient(180deg, ${step.color}, transparent)` }}
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
