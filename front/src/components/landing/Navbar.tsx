import { useState, useEffect } from 'react';
import { Activity, Menu, X, UserPlus } from 'lucide-react';
import Container from './Container';
import { cn } from '../../lib/cn';

const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
];

interface NavbarProps {
    onOpenLogin: () => void;
    onOpenRegister: () => void;
}

export default function Navbar({ onOpenLogin, onOpenRegister }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = () => setMobileOpen(false);

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled
                    ? 'bg-white/92 backdrop-blur-md border-b border-[rgba(31,41,55,0.10)] shadow-sm'
                    : 'bg-white/70 backdrop-blur-sm border-b border-transparent'
            )}
            role="banner"
        >
            <Container>
                <nav
                    className="flex items-center justify-between h-16"
                    aria-label="Main navigation"
                >
                    {/* Brand */}
                    <a
                        href="#home"
                        className="flex items-center gap-2 group focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-lg px-1"
                        aria-label="MedLink home"
                    >
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2563EB] shadow-sm group-hover:bg-[#1d4ed8] transition-colors">
                            <Activity className="w-4 h-4 text-white" />
                        </span>
                        <span className="text-xl font-bold text-[#1F2937] tracking-tight">
                            Med<span className="text-[#2563EB]">Link</span>
                        </span>
                    </a>

                    {/* Desktop links */}
                    <ul className="hidden md:flex items-center gap-1" role="list">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="px-3 py-2 text-sm font-medium text-[#6B7280] rounded-lg hover:text-[#1F2937] hover:bg-gray-100 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Right actions */}
                    <div className="flex items-center gap-2">
                        {/* Register icon button */}
                        <button
                            id="navbar-register-btn"
                            onClick={onOpenRegister}
                            className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg text-[#6B7280] hover:text-[#2563EB] hover:bg-blue-50 border border-transparent hover:border-[#2563EB]/20 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
                            aria-label="Create an account"
                            title="Create an account"
                        >
                            <UserPlus className="w-4 h-4" />
                        </button>

                        {/* Login button */}
                        <button
                            id="navbar-login-btn"
                            onClick={onOpenLogin}
                            className="hidden md:inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1d4ed8] transition-colors duration-200 shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
                        >
                            Login
                        </button>

                        {/* Mobile toggle */}
                        <button
                            className="md:hidden p-2 rounded-lg text-[#6B7280] hover:bg-gray-100 hover:text-[#1F2937] transition-colors focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileOpen}
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </nav>

                {/* Mobile menu */}
                <div
                    className={cn(
                        'md:hidden overflow-hidden transition-all duration-300',
                        mobileOpen ? 'max-h-72 pb-4' : 'max-h-0'
                    )}
                    aria-hidden={!mobileOpen}
                >
                    <ul className="flex flex-col gap-1" role="list">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    onClick={handleNavClick}
                                    className="block px-3 py-2 text-sm font-medium text-[#6B7280] rounded-lg hover:text-[#1F2937] hover:bg-gray-100 transition-all"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={() => { handleNavClick(); onOpenLogin(); }}
                                className="w-full text-left px-3 py-2 text-sm font-semibold text-[#2563EB] rounded-lg hover:bg-blue-50 transition-all"
                            >
                                Login
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => { handleNavClick(); onOpenRegister(); }}
                                className="w-full text-left px-3 py-2 text-sm font-medium text-[#6B7280] rounded-lg hover:bg-gray-100 transition-all flex items-center gap-2"
                            >
                                <UserPlus className="w-4 h-4" />
                                Create Account
                            </button>
                        </li>
                    </ul>
                </div>
            </Container>
        </header>
    );
}
