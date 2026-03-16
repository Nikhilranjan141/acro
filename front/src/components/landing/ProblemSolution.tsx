import { CheckCircle2, XCircle } from 'lucide-react';
import Container from './Container';
import Section from './Section';

const problems = [
    'ICU beds unknown across hospitals',
    'Ambulance dispatch delays',
    'Hospital overload during emergencies',
    'No unified emergency coordination',
];

const solutions = [
    'Live resource tracking across all hospitals',
    'Smart hospital finder with AI routing',
    'Emergency coordination in real-time',
    'Faster patient transfer & reduced wait times',
];

export default function ProblemSolution() {
    return (
        <div className="bg-white border-y border-[rgba(31,41,55,0.08)]">
            <Container>
                <Section
                    centered={true}
                    title="The Problem & Our Solution"
                    subtitle="Emergency healthcare suffers from fragmented information. MedLink fixes that."
                >
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Problem Card */}
                        <div
                            className="group relative bg-[#FFF5F5] border border-[#EF4444]/15 rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all duration-300"
                            aria-label="Problem statement"
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#EF4444]/10">
                                    <XCircle className="w-5 h-5 text-[#EF4444]" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#EF4444]/70">
                                        Current Reality
                                    </span>
                                    <h3 className="text-xl font-bold text-[#1F2937]">The Problem</h3>
                                </div>
                            </div>

                            <p className="text-[#6B7280] mb-5 leading-relaxed">
                                Hospitals operate in silos, lacking real-time visibility into available
                                resources. During emergencies, every second of delayed information
                                can be the difference between life and death.
                            </p>

                            <ul className="space-y-3" role="list">
                                {problems.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[rgba(239,68,68,0.10)] hover:border-[rgba(239,68,68,0.20)] transition-colors"
                                    >
                                        <XCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" aria-hidden="true" />
                                        <span className="text-sm text-[#374151] leading-snug">{item}</span>
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
                            className="group relative bg-[#F0FDFA] border border-[#14B8A6]/15 rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all duration-300"
                            aria-label="MedLink solution"
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#14B8A6]/10">
                                    <CheckCircle2 className="w-5 h-5 text-[#14B8A6]" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]/70">
                                        MedLink Approach
                                    </span>
                                    <h3 className="text-xl font-bold text-[#1F2937]">The Solution</h3>
                                </div>
                            </div>

                            <p className="text-[#6B7280] mb-5 leading-relaxed">
                                MedLink connects hospitals, ambulances, and emergency teams into one
                                unified live network — giving every stakeholder real-time situational
                                awareness and AI-assisted decision support.
                            </p>

                            <ul className="space-y-3" role="list">
                                {solutions.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[rgba(20,184,166,0.10)] hover:border-[rgba(20,184,166,0.25)] transition-colors"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" aria-hidden="true" />
                                        <span className="text-sm text-[#374151] leading-snug">{item}</span>
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
