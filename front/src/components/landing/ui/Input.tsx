import { cn } from '../../../lib/cn';
import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-[#374151]"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] w-4 h-4 flex items-center">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF]',
                            'transition-all duration-150',
                            'focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB]',
                            error
                                ? 'border-[#EF4444] focus:ring-[#EF4444]/30 focus:border-[#EF4444]'
                                : 'border-[rgba(31,41,55,0.18)] hover:border-[rgba(31,41,55,0.35)]',
                            icon ? 'pl-9' : '',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs text-[#EF4444] flex items-center gap-1" role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;
