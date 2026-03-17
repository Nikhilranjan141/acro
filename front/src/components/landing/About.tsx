import { Heart, Users, Target } from 'lucide-react';
import Container from './Container';
import Section from './Section';

const mission = [
    {
        icon: <Heart className="w-5 h-5" />,
        title: 'Better Patient Outcomes',
        text: 'Faster emergency response and optimized hospital capacity lead to improved patient survival rates and recovery.',
        color: '#2563EB',
        bg: 'rgba(37,99,235,0.12)',
    },
    {
        icon: <Users className="w-5 h-5" />,
        title: 'Hospital-Centric Design',
        text: 'Built in partnership with hospital administrators, emergency departments, and ambulance services for real-world operations.',
        color: '#14B8A6',
        bg: 'rgba(20,184,166,0.12)',
    },
    {
        icon: <Target className="w-5 h-5" />,
        title: 'Data-Driven Coordination',
        text: 'AI-powered recommendations combined with real-time analytics ensure every decision is informed and optimized.',
        color: '#8B5CF6',
        bg: 'rgba(139,92,246,0.12)',
    },
];

export default function About() {
    return (
        <div className="bg-[#F6F9FC] border-y border-[#E5E7EB]">
            <Container>
                <Section
                    id="about"
                    title="About MedLink"
                    subtitle="Hospitals deserve a unified coordination platform. MedLink eliminates information silos and connects your region into one collaborative emergency response ecosystem."
                >
                    <div className="grid sm:grid-cols-3 gap-5">
                        {mission.map((item) => (
                            <div
                                key={item.title}
                                className="group flex flex-col gap-3 p-5 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] hover:bg-[#F9FAFB] hover:shadow-md transition-all duration-300"
                            >
                                <div
                                    className="flex items-center justify-center w-10 h-10 rounded-xl transition-transform group-hover:scale-110 duration-300"
                                    style={{ background: item.bg, color: item.color }}
                                >
                                    {item.icon}
                                </div>
                                <h3 className="font-semibold text-[#1F2937]">{item.title}</h3>
                                <p className="text-sm text-[#6B7280] leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Stats row */}
                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { value: '27', label: 'Hospitals Connected', color: '#14B8A6' },
                            { value: '4.2 min', label: 'Avg Emergency Routing', color: '#2563EB' },
                            { value: '40%', label: 'Faster Patient Placement', color: '#8B5CF6' },
                            { value: '99.9%', label: 'Platform Uptime', color: '#10B981' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="flex flex-col items-center text-center p-5 rounded-xl bg-[#FFFFFF] border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all"
                            >
                                <span className="text-3xl font-extrabold" style={{ color: stat.color }}>
                                    {stat.value}
                                </span>
                                <span className="text-xs text-[#6B7280] mt-2 leading-snug font-semibold">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </Section>
            </Container>
        </div>
    );
}
