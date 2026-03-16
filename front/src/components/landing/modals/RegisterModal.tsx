import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock, Eye, EyeOff, Activity, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../state/auth';
import Modal from './Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

const schema = z
    .object({
        fullName: z.string().min(2, 'Full name must be at least 2 characters'),
        email: z.string().email('Please enter a valid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
            .regex(/[0-9]/, 'Must contain at least one number'),
        confirmPassword: z.string(),
        role: z.enum(['admin', 'hospital_operator', 'ems_dispatch'], {
            message: 'Please select a role',
        }),
        terms: z.boolean().refine(val => val === true, 'You must accept the Terms & Privacy Policy'),
    })
    .refine((d) => d.password === d.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });

type FormData = z.infer<typeof schema>;

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

const roles = [
    { value: 'admin', label: 'Administrator' },
    { value: 'hospital_operator', label: 'Hospital Operator' },
    { value: 'ems_dispatch', label: 'EMS Dispatch' },
];

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
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
        await new Promise((r) => setTimeout(r, 1300));
        setLoading(false);
        setSubmitted(true);

        login({ name: data.fullName, email: data.email, role: data.role });

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
        <Modal isOpen={isOpen} onClose={handleClose} title="Create MedLink Account" size="md">
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#14B8A6]">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[#1F2937]">Join MedLink</h2>
                        <p className="text-xs text-[#6B7280]">Connect your hospital to the live network</p>
                    </div>
                </div>

                {/* Success toast */}
                {submitted && (
                    <div className="mb-4 flex items-center gap-2.5 p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                        Account created! Welcome to MedLink.
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                    <Input
                        label="Full name"
                        type="text"
                        id="reg-name"
                        placeholder="Dr. Sarah Johnson"
                        icon={<User className="w-4 h-4" />}
                        error={errors.fullName?.message}
                        autoComplete="name"
                        {...register('fullName')}
                    />

                    <Input
                        label="Work email"
                        type="email"
                        id="reg-email"
                        placeholder="doctor@hospital.org"
                        icon={<Mail className="w-4 h-4" />}
                        error={errors.email?.message}
                        autoComplete="email"
                        {...register('email')}
                    />

                    {/* Password field */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="reg-password" className="text-sm font-medium text-[#374151]">Password</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                id="reg-password"
                                type={showPw ? 'text' : 'password'}
                                placeholder="Min 8 chars, 1 uppercase, 1 number"
                                autoComplete="new-password"
                                className={`w-full rounded-xl border bg-white pl-9 pr-10 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] ${errors.password ? 'border-[#EF4444]' : 'border-[rgba(31,41,55,0.18)] hover:border-[rgba(31,41,55,0.35)]'}`}
                                {...register('password')}
                            />
                            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] focus-visible:outline-none" aria-label="Toggle password">
                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-[#EF4444]" role="alert">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="reg-confirm" className="text-sm font-medium text-[#374151]">Confirm password</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                id="reg-confirm"
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="Repeat your password"
                                autoComplete="new-password"
                                className={`w-full rounded-xl border bg-white pl-9 pr-10 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] ${errors.confirmPassword ? 'border-[#EF4444]' : 'border-[rgba(31,41,55,0.18)] hover:border-[rgba(31,41,55,0.35)]'}`}
                                {...register('confirmPassword')}
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] focus-visible:outline-none" aria-label="Toggle confirm password">
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-xs text-[#EF4444]" role="alert">{errors.confirmPassword.message}</p>}
                    </div>

                    {/* Role select */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="reg-role" className="text-sm font-medium text-[#374151]">Role</label>
                        <select
                            id="reg-role"
                            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#1F2937] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] ${errors.role ? 'border-[#EF4444]' : 'border-[rgba(31,41,55,0.18)] hover:border-[rgba(31,41,55,0.35)]'}`}
                            {...register('role')}
                            defaultValue=""
                        >
                            <option value="" disabled>Select your role…</option>
                            {roles.map((r) => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                        {errors.role && <p className="text-xs text-[#EF4444]" role="alert">{errors.role.message}</p>}
                    </div>

                    {/* Terms */}
                    <div className="flex flex-col gap-1">
                        <div className="flex items-start gap-2.5">
                            <input
                                id="reg-terms"
                                type="checkbox"
                                className="w-4 h-4 mt-0.5 rounded border-[rgba(31,41,55,0.2)] accent-[#2563EB] cursor-pointer"
                                {...register('terms')}
                            />
                            <label htmlFor="reg-terms" className="text-sm text-[#6B7280] cursor-pointer select-none leading-snug">
                                I agree to MedLink's{' '}
                                <button type="button" className="text-[#2563EB] hover:underline font-medium focus-visible:outline-none">Terms of Service</button>
                                {' '}and{' '}
                                <button type="button" className="text-[#2563EB] hover:underline font-medium focus-visible:outline-none">Privacy Policy</button>
                            </label>
                        </div>
                        {errors.terms && <p className="text-xs text-[#EF4444] ml-6" role="alert">{errors.terms.message}</p>}
                    </div>

                    <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
                        {loading ? 'Creating account…' : 'Create account'}
                    </Button>
                </form>

                <p className="mt-4 text-center text-sm text-[#6B7280]">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} className="text-[#2563EB] font-semibold hover:underline focus-visible:outline-none">
                        Sign in
                    </button>
                </p>
            </div>
        </Modal>
    );
}
