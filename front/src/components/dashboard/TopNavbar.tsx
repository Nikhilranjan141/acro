import React from 'react';
import { Search, Bell, MapPin, ChevronDown, Activity, UserCircle } from 'lucide-react';

export const TopNavbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[var(--theme-medlink-border)] bg-[var(--theme-medlink-topbar)] px-4 sm:px-6">
      {/* Left: Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center p-2 rounded-lg bg-[var(--theme-medlink-primary-blue)]/10 text-[var(--theme-medlink-primary-blue)]">
          <Activity className="h-6 w-6" />
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="font-bold tracking-tight text-[var(--theme-medlink-text-primary)] leading-tight">MedLink</span>
          <span className="text-[10px] font-medium tracking-widest text-[var(--theme-medlink-text-secondary)] uppercase">Command Center</span>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-lg mx-4 hidden md:flex">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-[var(--theme-medlink-text-secondary)]" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-[var(--theme-medlink-text-primary)] ring-1 ring-inset ring-[var(--theme-medlink-border)] placeholder:text-[var(--theme-medlink-text-secondary)] focus:ring-2 focus:ring-inset focus:ring-[var(--theme-medlink-primary-blue)] sm:text-sm sm:leading-6 bg-[var(--theme-medlink-bg)]/50"
            placeholder="Search hospitals, ambulances, or transfers..."
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* City Selector */}
        <button className="hidden sm:flex items-center gap-2 rounded-md hover:bg-[var(--theme-medlink-bg)] px-3 py-1.5 text-sm font-medium text-[var(--theme-medlink-text-primary)] transition-colors">
           <MapPin className="h-4 w-4 text-[var(--theme-medlink-text-secondary)]" />
           Mumbai
           <ChevronDown className="h-4 w-4 text-[var(--theme-medlink-text-secondary)]" />
        </button>

        {/* Alerts */}
        <button className="relative p-2 rounded-full hover:bg-[var(--theme-medlink-bg)] text-[var(--theme-medlink-text-secondary)] transition-colors">
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--theme-medlink-emergency-red)] ring-2 ring-[var(--theme-medlink-topbar)]" />
          <Bell className="h-5 w-5" />
        </button>

        <div className="h-6 w-px bg-[var(--theme-medlink-border)] mx-1" />

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-full hover:bg-[var(--theme-medlink-bg)] p-1 pr-2 transition-colors">
          <UserCircle className="h-7 w-7 text-[var(--theme-medlink-text-secondary)]" />
          <span className="text-sm font-medium text-[var(--theme-medlink-text-primary)] hidden lg:block">Admin</span>
        </button>
      </div>
    </header>
  );
};
