import { useState, useEffect } from 'react';
import { Menu, X, UserPlus } from 'lucide-react';
import Container from './Container';
import { cn } from '../../lib/cn';
import MedLinkLogo from '../common/MedLinkLogo';

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
                    ? 'bg-white/95 backdrop-blur-xl border-b border-[#E5E7EB] shadow-sm'
                    : 'bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]'
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
                        <MedLinkLogo
                            iconClassName="w-8 h-8 rounded-lg group-hover:opacity-95 transition-opacity"
                            textClassName="text-xl"
                        />
                    </a>

                    {/* Desktop links */}
                    <ul className="hidden md:flex items-center gap-1" role="list">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="px-3 py-2 text-sm font-medium text-[#1F2937] rounded-lg hover:text-[#2563EB] hover:bg-[#F9FAFB] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
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
                            className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg text-[#1F2937] hover:text-[#2563EB] hover:bg-[#F9FAFB] border border-[#E5E7EB] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
                            aria-label="Create an account"
                            title="Create an account"
                        >
                            <UserPlus className="w-4 h-4" />
                        </button>

                        {/* Login button */}
                        <button
                            id="navbar-login-btn"
                            onClick={onOpenLogin}
                            className="hidden md:inline-flex items-center px-5 py-2.5 text-sm font-semibold text-[#1F2937] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
                        >
                            Login
                        </button>

                        {/* Mobile toggle */}
                        <button
                            className="md:hidden p-2 rounded-lg text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#1F2937] transition-colors focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
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
                                    className="block px-3 py-2 text-sm font-medium text-[#1F2937] rounded-lg hover:text-[#2563EB] hover:bg-[#F9FAFB] transition-all"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={() => { handleNavClick(); onOpenLogin(); }}
                                className="w-full text-left px-3 py-2 text-sm font-semibold text-[#2563EB] rounded-lg hover:bg-[#F9FAFB] transition-all"
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
