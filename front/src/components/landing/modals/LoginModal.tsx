import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, Activity, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../state/auth';
import Modal from './Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

const schema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1200));
        setLoading(false);
        setSubmitted(true);
        
        // Authenticate & Redirect
        login({ name: data.email.split('@')[0], email: data.email, role: 'user' });
        
        setTimeout(() => {
            setSubmitted(false);
            reset();
            onClose();
            navigate('/app/dashboard');
        }, 1500);
    };

    const handleClose = () => {
        reset();
        setSubmitted(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Login to MedLink" size="md">
            <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#2563EB]">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[#1F2937]">Welcome back</h2>
                        <p className="text-xs text-[#6B7280]">Sign in to MedLink Command Center</p>
                    </div>
                </div>

                {/* Success toast */}
                {submitted && (
                    <div className="mb-4 flex items-center gap-2.5 p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                        Login successful! Redirecting to command center…
                    </div>
                )}

                {/* Google SSO */}
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-[rgba(31,41,55,0.16)] bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-[#374151] mb-4 focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
                        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>

                <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-[rgba(31,41,55,0.08)]" />
                    <span className="text-xs text-[#9CA3AF]">or sign in with email</span>
                    <div className="flex-1 h-px bg-[rgba(31,41,55,0.08)]" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                    <Input
                        label="Email address"
                        type="email"
                        id="login-email"
                        placeholder="doctor@hospital.org"
                        icon={<Mail className="w-4 h-4" />}
                        error={errors.email?.message}
                        autoComplete="email"
                        {...register('email')}
                    />

                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label htmlFor="login-password" className="text-sm font-medium text-[#374151]">
                                Password
                            </label>
                            <button
                                type="button"
                                className="text-xs text-[#2563EB] hover:underline focus-visible:outline-none"
                            >
                                Forgot password?
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                className={`w-full rounded-xl border bg-white pl-9 pr-10 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] ${errors.password ? 'border-[#EF4444] focus:ring-[#EF4444]/30' : 'border-[rgba(31,41,55,0.18)] hover:border-[rgba(31,41,55,0.35)]'}`}
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] focus-visible:outline-none"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-[#EF4444]" role="alert">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="login-remember"
                            type="checkbox"
                            className="w-4 h-4 rounded border-[rgba(31,41,55,0.2)] text-[#2563EB] accent-[#2563EB] cursor-pointer"
                            {...register('rememberMe')}
                        />
                        <label htmlFor="login-remember" className="text-sm text-[#6B7280] cursor-pointer select-none">
                            Remember me for 30 days
                        </label>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={loading}
                        className="w-full mt-2"
                    >
                        {loading ? 'Signing in…' : 'Sign in to MedLink'}
                    </Button>
                </form>

                <p className="mt-5 text-center text-sm text-[#6B7280]">
                    Don't have an account?{' '}
                    <button
                        onClick={onSwitchToRegister}
                        className="text-[#2563EB] font-semibold hover:underline focus-visible:outline-none"
                    >
                        Create account
                    </button>
                </p>
            </div>
        </Modal>
    );
}
