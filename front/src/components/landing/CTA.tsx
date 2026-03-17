import { ArrowRight, Zap } from 'lucide-react';
import Container from './Container';

export default function CTA({ onOpenGetStarted }: { onOpenGetStarted?: () => void }) {
    return (
        <section
            aria-labelledby="cta-heading"
            className="py-20 relative overflow-hidden bg-[#F6F9FC] border-y border-[#E5E7EB]"
        >
            <Container className="relative z-10">
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(139,92,246,0.12)] border border-[#E5E7EB] mb-6">
                        <Zap className="w-3.5 h-3.5 text-[#8B5CF6] animate-pulse" />
                        <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
                            Ready to Transform Your Network
                        </span>
                    </div>

                    <h2
                        id="cta-heading"
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2937] leading-tight"
                    >
                        Transform Emergency Coordination{' '}
                        <span className="text-[#2563EB] block mt-2">Across Your Region</span>
                    </h2>

                    <p className="mt-5 text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-xl font-medium">
                        Hospitals using MedLink report 40% faster patient placement, reduced ambulance idle time,
                        improved ICU utilization, and better emergency coordination outcomes.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                        <button
                            onClick={onOpenGetStarted}
                            id="cta-start-button"
                            className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-white bg-[#2563EB] rounded-xl hover:bg-[#1D4ED8] active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB]"
                        >
                            Start Using MedLink
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <a
                            href="#features"
                            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-[#1F2937] border border-[#E5E7EB] bg-white rounded-xl hover:bg-[#F9FAFB] active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB]"
                        >
                            Explore Features
                        </a>
                    </div>

                    <p className="mt-6 text-xs text-[#9CA3AF]">
                        Join hospitals and emergency services transforming emergency response coordination.
                    </p>
                </div>
            </Container>
        </section>
    );
}
