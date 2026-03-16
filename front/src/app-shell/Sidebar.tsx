import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Brain, Activity, ArrowLeftRight, Map, Settings, Hospital } from 'lucide-react';
import clsx from 'clsx';

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
    <aside className="w-64 bg-[var(--app-sidebar)] border-r border-[var(--app-border)] flex-shrink-0 flex flex-col h-full hidden md:flex z-10 transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-[var(--app-border)]">
        <Hospital className="w-6 h-6 text-[var(--app-blue)] mr-3" />
        <span className="font-bold text-lg tracking-wide text-[var(--app-text)]">AeroCare App</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--app-blue)]/10 text-[var(--app-blue)] border-l-4 border-[var(--app-blue)]'
                    : 'text-[var(--app-muted)] hover:bg-[var(--app-card)] hover:text-[var(--app-text)]'
                )
              }
            >
              <Icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Optional User Info at bottom */}
      <div className="p-4 border-t border-[var(--app-border)]">
         <div className="px-3 py-2 bg-[var(--app-card)] rounded-lg text-xs text-[var(--app-muted)] text-center shadow-sm">
            Secured Network
         </div>
      </div>
    </aside>
  );
}
