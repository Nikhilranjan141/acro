import { Search, Bell, UserCircle, Menu } from 'lucide-react';
import { useAuthStore } from '../state/auth';

export default function Topbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 bg-[var(--app-topbar)] border-b border-[var(--app-border)] flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
      <div className="flex items-center flex-1">
        <button className="text-[var(--app-muted)] hover:text-[var(--app-text)] md:hidden mr-4">
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Search */}
        <div className="max-w-md w-full relative hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[var(--app-muted)]" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-[var(--app-border)] rounded-md leading-5 bg-[var(--app-bg)] text-[var(--app-text)] placeholder-[var(--app-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-blue)] focus:border-[var(--app-blue)] focus:shadow-sm sm:text-sm shadow-inner transition-shadow"
            placeholder="Search hospitals, resources..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-[var(--app-muted)] hover:text-[var(--app-text)] relative p-1">
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[var(--app-red)] ring-2 ring-[var(--app-topbar)]" />
          <Bell className="h-5 w-5" />
        </button>

        <div className="relative group">
          <button className="flex items-center space-x-2 text-sm focus:outline-none">
            <UserCircle className="h-8 w-8 text-[var(--app-blue)]" />
            <span className="hidden sm:inline font-medium text-[var(--app-text)]">
              {user?.name || 'User'}
            </span>
          </button>
          
          {/* Simple Dropdown mock */}
          <div className="absolute right-0 mt-2 w-48 bg-[var(--app-card)] rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 hidden group-hover:block border border-[var(--app-border)]">
            <div className="px-4 py-2 text-xs text-[var(--app-muted)] border-b border-[var(--app-border)]">
              {user?.email || 'user@example.com'}
            </div>
            <button 
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-sm text-[var(--app-text)] hover:bg-[var(--app-sidebar)]"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
