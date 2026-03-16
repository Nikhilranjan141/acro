import { ArrowRight, Zap } from 'lucide-react';
import Container from './Container';

export default function CTA({ onOpenGetStarted }: { onOpenGetStarted?: () => void }) {
    return (
        <section
            aria-labelledby="cta-heading"
            className="py-20 relative overflow-hidden"
        >
            {/* Background gradient */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-[#2563EB] via-[#1d4ed8] to-[#3730a3]"
                aria-hidden="true"
            />

            {/* Subtle pattern */}
            <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage:
                        'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
                aria-hidden="true"
            />

            {/* Glowing orbs */}
            <div
                className="absolute w-96 h-96 rounded-full bg-[#14B8A6] opacity-10 blur-3xl -top-20 -right-20 pointer-events-none"
                aria-hidden="true"
            />
            <div
                className="absolute w-64 h-64 rounded-full bg-[#8B5CF6] opacity-10 blur-3xl -bottom-10 -left-10 pointer-events-none"
                aria-hidden="true"
            />

            <Container className="relative z-10">
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/25 mb-6">
                        <Zap className="w-3.5 h-3.5 text-yellow-300" />
                        <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                            Ready to Deploy
                        </span>
                    </div>

                    <h2
                        id="cta-heading"
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight"
                    >
                        Join the future of emergency{' '}
                        <span className="text-[#5EEAD4]">healthcare coordination</span>
                    </h2>

                    <p className="mt-4 text-base sm:text-lg text-white/75 leading-relaxed max-w-xl">
                        Hospitals and emergency services using MedLink report up to 40% faster
                        patient placement and significantly reduced ambulance idle times.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                        <button
                            onClick={onOpenGetStarted}
                            id="cta-start-button"
                            className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-bold text-[#1d4ed8] bg-white rounded-xl hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
                        >
                            Start Using MedLink
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <a
                            href="#features"
                            className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white border border-white/30 rounded-xl hover:bg-white/10 active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
                        >
                            Explore Features
                        </a>
                    </div>

                    <p className="mt-6 text-xs text-white/50">
                        No credit card required. Free for public hospitals.
                    </p>
                </div>
            </Container>
        </section>
    );
}
