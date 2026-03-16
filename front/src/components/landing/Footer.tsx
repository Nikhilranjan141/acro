import { Activity, Github, Heart } from 'lucide-react';
import Container from './Container';

const footerLinks = [
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#home' },
    { label: 'Privacy', href: '#home' },
    { label: 'GitHub', href: 'https://github.com', icon: <Github className="w-3.5 h-3.5" /> },
    { label: 'Team', href: '#about' },
];

export default function Footer() {
    return (
        <footer
            className="bg-[#1F2937] text-gray-300"
            role="contentinfo"
            aria-label="Site footer"
        >
            {/* Top section */}
            <Container>
                <div className="py-12 grid sm:grid-cols-3 gap-8 border-b border-gray-700/60">
                    {/* Brand column */}
                    <div className="sm:col-span-1">
                        <a
                            href="#home"
                            className="inline-flex items-center gap-2 mb-3 focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-lg"
                            aria-label="MedLink home"
                        >
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2563EB]">
                                <Activity className="w-4 h-4 text-white" />
                            </span>
                            <span className="text-xl font-bold text-white">
                                Med<span className="text-[#60A5FA]">Link</span>
                            </span>
                        </a>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                            The smart emergency healthcare resource network, connecting hospitals
                            and saving lives in real time.
                        </p>
                    </div>

                    {/* Links columns */}
                    <div className="sm:col-span-2 grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                Platform
                            </h3>
                            <ul className="space-y-2.5" role="list">
                                {['Features', 'How It Works', 'Dashboard', 'Pricing'].map((item) => (
                                    <li key={item}>
                                        <a
                                            href="#features"
                                            className="text-sm text-gray-400 hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                Company
                            </h3>
                            <ul className="space-y-2.5" role="list">
                                {[
                                    { label: 'About', href: '#about' },
                                    { label: 'Team', href: '#about' },
                                    { label: 'Contact', href: '#home' },
                                    { label: 'Privacy Policy', href: '#home' },
                                ].map((item) => (
                                    <li key={item.label}>
                                        <a
                                            href={item.href}
                                            className="text-sm text-gray-400 hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded"
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 text-center sm:text-left">
                        © 2026 MedLink. All rights reserved.
                    </p>

                    <nav aria-label="Footer navigation">
                        <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-5" role="list">
                            {footerLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-200 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded"
                                        target={link.href.startsWith('http') ? '_blank' : undefined}
                                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    >
                                        {link.icon}
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <p className="text-xs text-gray-600 flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-[#EF4444]" aria-hidden="true" /> for better healthcare
                    </p>
                </div>
            </Container>
        </footer>
    );
}
