import { Activity } from 'lucide-react';
import { cn } from '../../lib/cn';

interface MedLinkLogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  subtitleClassName?: string;
  iconOnly?: boolean;
  showSubtitle?: boolean;
  animated?: boolean;
}

export default function MedLinkLogo({
  className,
  iconClassName,
  textClassName,
  subtitleClassName,
  iconOnly = false,
  showSubtitle = false,
  animated = true,
}: MedLinkLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'brand-logo-shell inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--app-blue,#2563EB)] to-[var(--app-teal,#14B8A6)] shadow-sm',
          animated && 'brand-logo-orb',
          iconClassName,
        )}
      >
        <Activity className="h-4 w-4 text-white" />
        {animated && <span className="brand-logo-shine" aria-hidden="true" />}
      </span>

      {!iconOnly && (
        <span className="flex min-w-0 flex-col">
          <span className={cn('brand-text-glow truncate text-lg font-extrabold leading-tight tracking-tight text-[var(--app-text,#1F2937)]', textClassName)}>
            Med<span className="bg-gradient-to-r from-[var(--app-blue,#2563EB)] to-[var(--app-teal,#14B8A6)] bg-clip-text text-transparent">Link</span>
          </span>
          {showSubtitle && (
            <span className={cn('inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--app-muted,#6B7280)]', subtitleClassName)}>
              {animated && <span className="app-live-dot" />}
              Command Center
            </span>
          )}
        </span>
      )}
    </span>
  );
}
