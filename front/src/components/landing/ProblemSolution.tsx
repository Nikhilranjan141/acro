import { CheckCircle2, XCircle } from 'lucide-react';
import Container from './Container';
import Section from './Section';

const problems = [
    'Critical resource data fragmented across systems',
    'Manual updates delay ICU bed discovery',
    'Ambulances routed to overcrowded hospitals',
    'Resource underutilization in nearby facilities',
    'Slow inter-hospital patient transfers',
    'Lack of centralized emergency coordination',
];

const solutions = [
    'Live resource visibility across entire region',
    'Intelligent hospital recommendation engine',
    'Coordinated ambulance routing with AI optimization',
    'Faster patient transfers with real-time verification',
    'AI-based demand forecasting',
    'Unified emergency response ecosystem',
];

export default function ProblemSolution() {
    return (
        <div className="bg-[#F6F9FC] border-y border-[#E5E7EB]">
            <Container>
                <Section
                    centered={true}
                    title="The Hospital Challenge"
                    subtitle="Hospitals operate in information silos. Every minute lost to bad coordination costs lives. MedLink connects your region into one unified network."
                >
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Problem Card */}
                        <div
                            className="group relative bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all duration-300 border-l-4 border-l-[#EF4444]"
                            aria-label="Problem statement"
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[rgba(239,68,68,0.12)]">
                                    <XCircle className="w-5 h-5 text-[#EF4444]" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#EF4444]">
                                        Current Reality
                                    </span>
                                    <h3 className="text-xl font-bold text-[#1F2937]">The Problem</h3>
                                </div>
                            </div>

                            <p className="text-[#6B7280] mb-5 leading-relaxed">
                                Hospitals operate in information silos with fragmented resource data across systems.
                                During emergencies, critical decisions are made with incomplete information, leading to
                                delayed ICU placement, ambulance routing errors, and resource waste.
                            </p>

                            <ul className="space-y-3" role="list">
                                {problems.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-3 p-3 rounded-xl bg-[#FFFFFF] border border-[#E5E7EB] transition-colors"
                                    >
                                        <XCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" aria-hidden="true" />
                                        <span className="text-sm text-[#1F2937] leading-snug font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Decorative accent */}
                            <div
                                className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#EF4444] opacity-[0.04] blur-2xl -translate-y-6 translate-x-6"
                                aria-hidden="true"
                            />
                        </div>

                        {/* Solution Card */}
                        <div
                            className="group relative bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all duration-300 border-l-4 border-l-[#14B8A6]"
                            aria-label="MedLink solution"
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[rgba(20,184,166,0.12)]">
                                    <CheckCircle2 className="w-5 h-5 text-[#14B8A6]" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
                                        MedLink Approach
                                    </span>
                                    <h3 className="text-xl font-bold text-[#1F2937]">The Solution</h3>
                                </div>
                            </div>

                            <p className="text-[#6B7280] mb-5 leading-relaxed">
                                MedLink creates a real-time healthcare coordination network connecting hospitals, emergency responders,
                                and administrators into one unified platform. Hospital administrators gain live resource visibility,
                                AI-assisted patient placement, and coordinated ambulance routing.
                            </p>

                            <ul className="space-y-3" role="list">
                                {solutions.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-3 p-3 rounded-xl bg-[#FFFFFF] border border-[#E5E7EB] transition-colors"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" aria-hidden="true" />
                                        <span className="text-sm text-[#1F2937] leading-snug">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Decorative accent */}
                            <div
                                className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#14B8A6] opacity-[0.06] blur-2xl -translate-y-6 translate-x-6"
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                </Section>
            </Container>
        </div>
    );
}
