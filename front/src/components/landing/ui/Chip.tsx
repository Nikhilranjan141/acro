import { cn } from '../../../lib/cn';

interface ChipProps {
    label: string;
    dotColor?: string;
    className?: string;
}

export default function Chip({ label, dotColor = '#14B8A6', className }: ChipProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[rgba(31,41,55,0.09)] shadow-sm text-xs font-medium text-[#374151]',
                'transition-colors hover:border-[rgba(31,41,55,0.18)]',
                className
            )}
        >
            <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: dotColor }}
                aria-hidden="true"
            />
            {label}
        </span>
    );
}
