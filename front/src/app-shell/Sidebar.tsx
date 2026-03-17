import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Brain, Activity, ArrowLeftRight, Map, Settings, ChevronRight, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import MedLinkLogo from '../components/common/MedLinkLogo';

const navItems = [
  { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
  { name: 'AI Predict & Finder', path: '/app/finder', icon: Brain },
  { name: 'Resource Intel', path: '/app/resources', icon: Activity },
  { name: 'Patient Transfer', path: '/app/transfers', icon: ArrowLeftRight },
  { name: 'Health Map & Insights', path: '/app/insights', icon: Map },
  { name: 'Settings', path: '/app/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="relative w-64 bg-[var(--app-sidebar)] border-r border-[var(--app-border)] flex-shrink-0 flex flex-col h-full hidden md:flex z-10 transition-all duration-300 overflow-hidden">
      <div className="pointer-events-none absolute -top-20 -right-16 h-52 w-52 rounded-full bg-[var(--app-blue)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-[var(--app-teal)]/10 blur-3xl" />

      <div className="h-20 flex items-center px-5 border-b border-[var(--app-border)] backdrop-blur-sm">
        <MedLinkLogo
          animated
          iconClassName="h-8 w-8 rounded-lg"
          textClassName="text-[var(--app-text)] text-[18px]"
        />
      </div>

      <nav className="relative flex-1 overflow-y-auto py-5 px-3 space-y-1.5">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{ animationDelay: `${index * 45}ms` }}
              className={({ isActive }) =>
                clsx(
                  'group app-animate-in relative isolate flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-[var(--app-blue)]'
                    : 'text-[var(--app-muted)] hover:text-[var(--app-text)]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className={clsx('absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[var(--app-blue)] transition-opacity duration-200', isActive ? 'opacity-100' : 'opacity-0')} />
                  <span className={clsx('absolute inset-0 rounded-xl transition-all duration-200', isActive ? 'bg-[var(--app-blue)]/10 border border-[var(--app-blue)]/20 shadow-sm' : 'border border-transparent group-hover:bg-[var(--app-card)]/80 group-hover:border-[var(--app-border)]')} />
                  <span className={clsx('relative z-10 flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200', isActive ? 'border-[var(--app-blue)]/30 bg-[var(--app-blue)]/10' : 'border-[var(--app-border)] bg-white/75 group-hover:border-[var(--app-blue)]/25')}>
                <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="relative z-10 flex-1">{item.name}</span>
                  <ChevronRight className={clsx('relative z-10 h-4 w-4 transition-all duration-200', isActive ? 'opacity-100 translate-x-0 text-[var(--app-blue)]' : 'opacity-0 -translate-x-1 text-[var(--app-muted)] group-hover:opacity-100 group-hover:translate-x-0')} />
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--app-border)] bg-[var(--app-card)]/40 backdrop-blur-sm">
         <div className="px-3 py-2 bg-white/75 border border-[var(--app-border)] rounded-lg text-xs text-[var(--app-muted)] text-center shadow-sm inline-flex items-center justify-center gap-2 w-full">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Secure Network
            <span className="app-live-dot" />
         </div>
      </div>
    </aside>
  );
}
