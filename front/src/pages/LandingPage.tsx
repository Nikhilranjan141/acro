// npm install react-hook-form zod @hookform/resolvers --legacy-peer-deps
import { useState, useCallback } from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import ProblemSolution from '../components/landing/ProblemSolution';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import DashboardPreview from '../components/landing/DashboardPreview';
import About from '../components/landing/About';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

import LoginModal from '../components/landing/modals/LoginModal';
import RegisterModal from '../components/landing/modals/RegisterModal';
import GetStartedModal from '../components/landing/modals/GetStartedModal';
import DemoModal from '../components/landing/modals/DemoModal';

type ActiveModal = 'none' | 'login' | 'register' | 'getStarted' | 'demo';

export default function LandingPage() {
    const [activeModal, setActiveModal] = useState<ActiveModal>('none');

    const closeModal = useCallback(() => setActiveModal('none'), []);
    const openLogin = useCallback(() => setActiveModal('login'), []);
    const openRegister = useCallback(() => setActiveModal('register'), []);
    const openGetStarted = useCallback(() => setActiveModal('getStarted'), []);
    const openDemo = useCallback(() => setActiveModal('demo'), []);

    return (
        <>
            <Navbar onOpenLogin={openLogin} onOpenRegister={openRegister} />

            <main className="bg-[#F6F9FC] text-[#1F2937]">
                <Hero onOpenGetStarted={openGetStarted} onOpenDemo={openDemo} />
                <ProblemSolution />
                <Features />
                <HowItWorks />
                <DashboardPreview />
                <About />
                <CTA onOpenGetStarted={openGetStarted} />
            </main>

            <Footer />

            {/* ── Modal Layer ── */}
            <LoginModal
                isOpen={activeModal === 'login'}
                onClose={closeModal}
                onSwitchToRegister={() => setActiveModal('register')}
            />
            <RegisterModal
                isOpen={activeModal === 'register'}
                onClose={closeModal}
                onSwitchToLogin={() => setActiveModal('login')}
            />
            <GetStartedModal
                isOpen={activeModal === 'getStarted'}
                onClose={closeModal}
                onOpenLogin={() => setActiveModal('login')}
                onOpenRegister={() => setActiveModal('register')}
            />
            <DemoModal
                isOpen={activeModal === 'demo'}
                onClose={closeModal}
            />
        </>
    );
}
