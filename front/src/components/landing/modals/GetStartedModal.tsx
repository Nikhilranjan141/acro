import { LogIn, UserPlus, Activity, Shield } from 'lucide-react';
import Modal from './Modal';

interface GetStartedModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenLogin: () => void;
    onOpenRegister: () => void;
}

const options = [
    {
        id: 'login',
        icon: <LogIn className="w-6 h-6" />,
        label: 'Login to Command Center',
        description: 'Access your existing MedLink account and get real-time hospital resource data.',
        color: '#2563EB',
        bg: '#EFF6FF',
        border: '#2563EB20',
    },
    {
        id: 'register',
        icon: <UserPlus className="w-6 h-6" />,
        label: 'Create an Account',
        description: 'Onboard your hospital, EMS unit, or admin team in under 2 minutes.',
        color: '#14B8A6',
        bg: '#F0FDFA',
        border: '#14B8A620',
    },
];

export default function GetStartedModal({
    isOpen,
    onClose,
    onOpenLogin,
    onOpenRegister,
}: GetStartedModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Get Started with MedLink" size="md">
            <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="text-center mb-7">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#14B8A6] shadow-md mb-3">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1F2937]">Get Started</h2>
                    <p className="text-sm text-[#6B7280] mt-1">
                        Join the smart emergency healthcare network
                    </p>
                </div>

                {/* Option cards */}
                <div className="flex flex-col gap-3">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={opt.id === 'login' ? onOpenLogin : onOpenRegister}
                            className="group flex items-center gap-4 w-full text-left p-4 rounded-2xl border transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                            style={{
                                background: opt.bg,
                                borderColor: opt.border,
                            }}
                            aria-label={opt.label}
                        >
                            <div
                                className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0 transition-transform group-hover:scale-110 duration-200"
                                style={{ background: `${opt.color}18`, color: opt.color }}
                            >
                                {opt.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div
                                    className="font-semibold text-[#1F2937] mb-0.5"
                                    style={{ color: opt.color }}
                                >
                                    {opt.label}
                                </div>
                                <div className="text-xs text-[#6B7280] leading-snug">{opt.description}</div>
                            </div>
                            <div
                                className="shrink-0 opacity-30 group-hover:opacity-70 transition-opacity duration-150"
                                style={{ color: opt.color }}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Trust footnote */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#9CA3AF]">
                    <Shield className="w-3.5 h-3.5 text-[#14B8A6]" />
                    HIPAA compliant · 99.9% uptime · Free for public hospitals
                </div>
            </div>
        </Modal>
    );
}
