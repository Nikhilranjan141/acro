import { cn } from '../../../lib/cn';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
        const base =
            'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none';

        const variants: Record<string, string> = {
            primary:
                'bg-[#2563EB] text-white hover:bg-[#1d4ed8] shadow-md shadow-blue-200 focus-visible:ring-[#2563EB]',
            secondary:
                'bg-white text-[#1F2937] border border-[rgba(31,41,55,0.15)] hover:bg-gray-50 shadow-sm focus-visible:ring-[#2563EB]',
            ghost:
                'bg-transparent text-[#6B7280] hover:bg-gray-100 hover:text-[#1F2937] focus-visible:ring-[#2563EB]',
            outline:
                'border border-[#2563EB] text-[#2563EB] hover:bg-blue-50 focus-visible:ring-[#2563EB]',
            danger:
                'bg-[#EF4444] text-white hover:bg-red-600 shadow-sm focus-visible:ring-[#EF4444]',
        };

        const sizes: Record<string, string> = {
            sm: 'text-xs px-3 py-1.5',
            md: 'text-sm px-4 py-2.5',
            lg: 'text-base px-6 py-3',
        };

        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(base, variants[variant], sizes[size], className)}
                {...props}
            >
                {loading ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : null}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
export default Button;
