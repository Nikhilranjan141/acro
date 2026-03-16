import { cn } from '../../lib/cn';

interface SectionProps {
    id?: string;
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
    titleClassName?: string;
    centered?: boolean;
}

export default function Section({
    id,
    title,
    subtitle,
    children,
    className,
    titleClassName,
    centered = true,
}: SectionProps) {
    return (
        <section
            id={id}
            className={cn('py-20', className)}
            aria-labelledby={id ? `${id}-heading` : undefined}
        >
            {(title || subtitle) && (
                <div className={cn('mb-12', centered && 'text-center')}>
                    {title && (
                        <h2
                            id={id ? `${id}-heading` : undefined}
                            className={cn(
                                'text-3xl font-bold tracking-tight text-[#1F2937] sm:text-4xl',
                                titleClassName
                            )}
                        >
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p className="mt-3 text-lg text-[#6B7280] max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                    <div className="mt-4 h-1 w-16 rounded-full bg-[#2563EB] mx-auto opacity-80" />
                </div>
            )}
            {children}
        </section>
    );
}
