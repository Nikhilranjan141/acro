import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../lib/cn';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
};

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    className,
    size = 'md',
}: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<Element | null>(null);

    // Store the element that triggered the modal
    useEffect(() => {
        if (isOpen) {
            triggerRef.current = document.activeElement;
        }
    }, [isOpen]);

    // ESC closes modal; restore focus on close
    useEffect(() => {
        if (!isOpen) {
            if (triggerRef.current && triggerRef.current instanceof HTMLElement) {
                triggerRef.current.focus();
            }
            return;
        }

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();

            // Basic focus trap
            if (e.key === 'Tab' && panelRef.current) {
                const focusable = panelRef.current.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first?.focus();
                } else if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last?.focus();
                }
            }
        };
        document.addEventListener('keydown', handleKey);

        // Focus first focusable element
        setTimeout(() => {
            panelRef.current?.querySelector<HTMLElement>(
                'button, [href], input, select, textarea'
            )?.focus();
        }, 60);

        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className={cn(
                'fixed inset-0 z-[100] flex items-center justify-center p-4',
                'bg-black/40 backdrop-blur-sm',
                'animate-in fade-in duration-200'
            )}
            role="presentation"
            onClick={(e) => {
                if (e.target === overlayRef.current) onClose();
            }}
            aria-hidden="false"
        >
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className={cn(
                    'relative w-full bg-white rounded-2xl shadow-2xl',
                    'border border-[rgba(31,41,55,0.09)]',
                    'animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-200',
                    sizes[size],
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#374151] hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
                >
                    <X className="w-4 h-4" />
                </button>

                {children}
            </div>
        </div>
    );
}
