import { Heart, Users, Target } from 'lucide-react';
import Container from './Container';
import Section from './Section';

const mission = [
    {
        icon: <Heart className="w-5 h-5" />,
        title: 'Patient First',
        text: 'Every decision in MedLink is driven by one goal: getting patients the right care, faster.',
        color: '#EF4444',
        bg: '#FFF5F5',
    },
    {
        icon: <Users className="w-5 h-5" />,
        title: 'Built for Teams',
        text: 'Designed with hospitals, paramedics, and emergency coordinators as equal partners in the design process.',
        color: '#2563EB',
        bg: '#EFF6FF',
    },
    {
        icon: <Target className="w-5 h-5" />,
        title: 'Data-Driven',
        text: 'AI and real-time analytics guide every recommendation so that human decisions are always supported.',
        color: '#8B5CF6',
        bg: '#F5F3FF',
    },
];

export default function About() {
    return (
        <div className="bg-white border-y border-[rgba(31,41,55,0.08)]">
            <Container>
                <Section
                    id="about"
                    title="About MedLink"
                    subtitle="We believe emergency healthcare coordination should never be a bottleneck. MedLink was built to eliminate the information gaps that cost lives."
                >
                    <div className="grid sm:grid-cols-3 gap-5">
                        {mission.map((item) => (
                            <div
                                key={item.title}
                                className="group flex flex-col gap-3 p-5 rounded-2xl border border-[rgba(31,41,55,0.08)] bg-[#F6F9FC] hover:bg-white hover:shadow-md transition-all duration-300"
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
                            { value: '200+', label: 'Hospitals Onboarded', color: '#2563EB' },
                            { value: '50K+', label: 'Patients Served', color: '#14B8A6' },
                            { value: '38ms', label: 'Avg Response Time', color: '#8B5CF6' },
                            { value: '99.9%', label: 'Platform Uptime', color: '#EF4444' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="flex flex-col items-center text-center p-4 rounded-xl bg-white border border-[rgba(31,41,55,0.08)] shadow-sm"
                            >
                                <span className="text-2xl font-extrabold" style={{ color: stat.color }}>
                                    {stat.value}
                                </span>
                                <span className="text-xs text-[#6B7280] mt-1 leading-snug">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </Section>
            </Container>
        </div>
    );
}
