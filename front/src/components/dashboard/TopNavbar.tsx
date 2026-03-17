import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  MapPin,
  ChevronDown,
  Activity,
  CheckCheck,
  ShieldCheck,
  Clock3,
  Ambulance,
  AlertTriangle,
  Settings,
  LogOut,
  ChevronRight,
  RefreshCw,
  Building2,
  Siren,
  ScanSearch,
  X,
  Route,
  Shield,
  BadgeCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { useAuthStore } from '../../state/auth';
import MedLinkLogo from '../common/MedLinkLogo';
import { runtimeConfig } from '../../lib/runtimeConfig';

type AlertItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: 'critical' | 'info' | 'success';
  read: boolean;
  route: string;
  actionLabel: string;
  owner?: string;
};

type AdminMember = {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'busy';
};

interface TopNavbarProps {
  initialAlerts?: AlertItem[];
  adminTeam?: AdminMember[];
  selectedCityValue?: string;
  onCityChange?: (city: string) => void;
  onRefreshData?: () => Promise<void> | void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  initialAlerts,
  adminTeam = [],
  selectedCityValue,
  onCityChange,
  onRefreshData,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const rootRef = useRef<HTMLDivElement | null>(null);

  const [selectedCity, setSelectedCity] = useState(() => selectedCityValue || localStorage.getItem('medlink-selected-city') || runtimeConfig.defaultCity);
  const [isCityTransitioning, setIsCityTransitioning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [alertFilter, setAlertFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [lastAction, setLastAction] = useState('Live monitoring active');
  const [lastRefreshAt, setLastRefreshAt] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: '1',
      title: 'ICU capacity alert',
      detail: 'North Wing ICU has reached 92% occupancy.',
      time: '2 min ago',
      type: 'critical',
      read: false,
      route: '/app/resources',
      actionLabel: 'Open resources',
      owner: 'Dr. Neha Sharma',
    },
    {
      id: '2',
      title: 'Ambulance en route',
      detail: 'AMB-104 is 6 minutes away from Central Med.',
      time: '5 min ago',
      type: 'info',
      read: false,
      route: '/app/transfers',
      actionLabel: 'Track transfer',
      owner: 'Amit Verma',
    },
    {
      id: '3',
      title: 'Oxygen supply updated',
      detail: 'City General oxygen refill completed successfully.',
      time: '18 min ago',
      type: 'success',
      read: true,
      route: '/app/resources',
      actionLabel: 'View inventory',
      owner: 'Priya Iyer',
    },
    {
      id: '4',
      title: 'AI surge prediction',
      detail: 'Emergency admissions expected to rise 14% in the next 2 hours.',
      time: 'Just now',
      type: 'critical',
      read: false,
      route: '/app/insights',
      actionLabel: 'Review forecast',
      owner: 'Control AI',
    },
  ]);

  useEffect(() => {
    if (!initialAlerts?.length) {
      return;
    }

    setAlerts(initialAlerts);
  }, [initialAlerts]);

  useEffect(() => {
    if (selectedCityValue) {
      setSelectedCity(selectedCityValue);
    }
  }, [selectedCityValue]);

  const adminName = user?.name || 'Admin';
  const adminEmail = user?.email || 'admin@medlink.ai';

  const adminInitials = useMemo(
    () =>
      adminName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') || 'AD',
    [adminName],
  );

  const cityOptions = useMemo(
    () => [
      { name: 'Indore', meta: 'Primary command region' },
      { name: 'Bhopal', meta: 'State-level escalation hub' },
      { name: 'Ujjain', meta: 'Regional emergency cluster' },
    ],
    [],
  );

  const quickActions = useMemo(
    () => [
      { label: 'Open dashboard overview', meta: 'Live hospital command center', route: '/app/dashboard', icon: Activity },
      { label: 'Find best hospital', meta: 'Smart routing and recommendations', route: '/app/finder', icon: ScanSearch },
      { label: 'Track active transfers', meta: 'Ambulances, ETA, handover', route: '/app/transfers', icon: Route },
      { label: 'Check resources', meta: 'Beds, oxygen, ICU, staff', route: '/app/resources', icon: Building2 },
      { label: 'Open AI insights', meta: 'Forecasts, risk patterns, and smart actions', route: '/app/insights', icon: Sparkles },
      { label: 'Manage settings', meta: 'Access, system, preferences', route: '/app/settings', icon: Settings },
    ],
    [],
  );

  const unreadCount = useMemo(() => alerts.filter((item) => !item.read).length, [alerts]);

  const filteredAlerts = useMemo(() => {
    if (alertFilter === 'unread') {
      return alerts.filter((item) => !item.read);
    }

    if (alertFilter === 'critical') {
      return alerts.filter((item) => item.type === 'critical');
    }

    return alerts;
  }, [alertFilter, alerts]);

  const searchResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return quickActions;
    }

    return quickActions.filter(
      (item) => item.label.toLowerCase().includes(normalizedQuery) || item.meta.toLowerCase().includes(normalizedQuery),
    );
  }, [quickActions, searchQuery]);

  useEffect(() => {
    localStorage.setItem('medlink-selected-city', selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setIsCityOpen(false);
        setIsAlertsOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((item) => ({ ...item, read: true })));
    setLastAction('All notifications marked as reviewed');
  };

  const toggleAlertRead = (id: string) => {
    setAlerts((prev) => prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item)));
  };

  const openAlert = (id: string, route: string, title: string) => {
    setAlerts((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
    setIsAlertsOpen(false);
    setLastAction(`${title} opened`);
    navigate(route);
  };

  const triggerRefresh = async () => {
    if (onRefreshData) {
      await onRefreshData();
    }
    const refreshedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastRefreshAt(refreshedAt);
    setLastAction(`Live feed refreshed at ${refreshedAt}`);
  };

  const handleCitySelect = (city: string) => {
    if (city === selectedCity) return;
    
    setIsCityTransitioning(true);
    
    setTimeout(() => {
      setSelectedCity(city);
      onCityChange?.(city);
      try {
        window.dispatchEvent(new CustomEvent('medlink:city-changed', { detail: city }));
      } catch {}
      setIsCityOpen(false);
      setLastAction(`${city} monitoring workspace selected`);
    }, 300);

    setTimeout(() => {
      setIsCityTransitioning(false);
    }, 600);
  };

  const handleQuickAction = (route: string, label: string) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    setLastAction(`${label} opened`);
    navigate(route);
  };

  const handleAdminAction = (route: string, label: string) => {
    setIsProfileOpen(false);
    setLastAction(label);
    navigate(route);
  };

  const handleSignOut = () => {
    logout();
    setIsProfileOpen(false);
    setLastAction('Secure sign out completed');
    navigate('/');
  };

  return (
    <header
      ref={rootRef}
      className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[var(--theme-medlink-border)] bg-[var(--theme-medlink-topbar)]/95 px-4 sm:px-6 backdrop-blur-xl shadow-sm"
    >
      <div className="flex items-center gap-3">
        <MedLinkLogo
          showSubtitle
          iconClassName="h-10 w-10 rounded-xl from-[var(--theme-medlink-primary-blue)] to-[var(--theme-medlink-medical-teal)]"
          textClassName="text-[var(--theme-medlink-text-primary)] text-[19px]"
          subtitleClassName="text-[var(--theme-medlink-text-secondary)] tracking-[0.2em]"
        />
      </div>

      <div className="mx-4 hidden max-w-lg flex-1 md:flex">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-[var(--theme-medlink-text-secondary)]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onFocus={() => {
              setIsSearchOpen(true);
              setIsCityOpen(false);
              setIsAlertsOpen(false);
              setIsProfileOpen(false);
            }}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setIsSearchOpen(true);
            }}
            className="block w-full rounded-xl border-0 bg-white/80 py-2 pl-10 pr-10 text-[var(--theme-medlink-text-primary)] shadow-sm ring-1 ring-inset ring-[var(--theme-medlink-border)] placeholder:text-[var(--theme-medlink-text-secondary)] focus:ring-2 focus:ring-inset focus:ring-[var(--theme-medlink-primary-blue)] sm:text-sm sm:leading-6"
            placeholder="Search hospitals, ambulances, transfers, or settings..."
          />

          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute inset-y-0 right-3 flex items-center text-[var(--theme-medlink-text-secondary)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {isSearchOpen && (
            <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-[var(--theme-medlink-border)] bg-white shadow-2xl">
              <div className="border-b border-[var(--theme-medlink-border)] bg-gradient-to-r from-blue-50/80 to-white px-4 py-3">
                <div className="text-sm font-semibold text-[var(--theme-medlink-text-primary)]">Quick command search</div>
                <div className="text-xs text-[var(--theme-medlink-text-secondary)]">Jump to live hospital actions instantly</div>
              </div>

              <div className="max-h-[300px] overflow-y-auto p-2">
                {searchResults.length > 0 ? (
                  searchResults.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.label}
                        onClick={() => handleQuickAction(item.route, item.label)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors hover:bg-[var(--theme-medlink-bg)] ${location.pathname === item.route ? 'bg-blue-50/70' : ''}`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--theme-medlink-bg)] text-[var(--theme-medlink-primary-blue)]">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-[var(--theme-medlink-text-primary)]">{item.label}</span>
                            <span className="block text-[11px] text-[var(--theme-medlink-text-secondary)]">{item.meta}</span>
                          </span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-[var(--theme-medlink-text-secondary)]" />
                      </button>
                    );
                  })
                ) : (
                  <div className="px-3 py-8 text-center">
                    <div className="text-sm font-semibold text-[var(--theme-medlink-text-primary)]">No matches found</div>
                    <div className="mt-1 text-xs text-[var(--theme-medlink-text-secondary)]">Try dashboard, transfers, resources, insights, or settings</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex items-center gap-2 sm:gap-4">
        <div className="relative hidden sm:block">
          <style>{`
            @keyframes cityFade {
              0% { opacity: 1; transform: translateY(0); }
              50% { opacity: 0; transform: translateY(-8px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes citySlide {
              0% { opacity: 0.5; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1); }
            }
            
            .city-transition {
              animation: cityFade 0.6s ease-in-out;
            }
            
            .city-loading {
              animation: citySlide 0.3s ease-out;
            }
          `}
          </style>
          
          <button
            onClick={() => {
              setIsCityOpen((prev) => !prev);
              setIsSearchOpen(false);
              setIsAlertsOpen(false);
              setIsProfileOpen(false);
            }}
            className={`flex items-center gap-2 rounded-xl border border-[var(--theme-medlink-border)] bg-gradient-to-br from-white to-blue-50/30 px-4 py-2.5 text-sm font-semibold text-[var(--theme-medlink-text-primary)] shadow-sm transition-all duration-300 hover:shadow-md hover:border-[var(--theme-medlink-primary-blue)] hover:bg-blue-50/50 ${isCityTransitioning ? 'city-transition' : 'city-loading'}`}
          >
            <MapPin className="h-4 w-4 text-[var(--theme-medlink-primary-blue)]" />
            <span className={isCityTransitioning ? 'city-transition' : 'city-loading'}>{selectedCity}</span>
            <ChevronDown className={`h-4 w-4 text-[var(--theme-medlink-text-secondary)] transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCityOpen && (
            <div className="absolute right-0 top-14 z-50 w-[270px] overflow-hidden rounded-2xl border border-[var(--theme-medlink-border)] bg-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="border-b border-[var(--theme-medlink-border)] bg-gradient-to-r from-blue-50 to-white px-4 py-3">
                <div className="text-sm font-semibold text-[var(--theme-medlink-text-primary)]">Monitoring region</div>
                <div className="text-xs text-[var(--theme-medlink-text-secondary)]">Switch the command center city focus</div>
              </div>
              <div className="p-2">
                {cityOptions.map((city, index) => (
                  <button
                    key={city.name}
                    onClick={() => handleCitySelect(city.name)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-all duration-200 hover:bg-blue-50 hover:shadow-sm ${selectedCity === city.name ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-100' : 'border border-transparent'}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span>
                      <span className="block text-sm font-semibold text-[var(--theme-medlink-text-primary)]">{city.name}</span>
                      <span className="block text-[11px] text-[var(--theme-medlink-text-secondary)]">{city.meta}</span>
                    </span>
                    {selectedCity === city.name ? (
                      <BadgeCheck className="h-4 w-4 text-[var(--theme-medlink-primary-blue)] animate-pulse" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-[var(--theme-medlink-text-secondary)] transition-transform group-hover:translate-x-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={triggerRefresh}
          className="hidden items-center gap-2 rounded-xl border border-[var(--theme-medlink-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--theme-medlink-text-primary)] shadow-sm transition-colors hover:bg-[var(--theme-medlink-bg)] lg:inline-flex"
        >
          <RefreshCw className="h-4 w-4 text-[var(--theme-medlink-text-secondary)]" />
          Refresh
        </button>

        <button
          onClick={() => {
            setIsAlertsOpen((prev) => !prev);
            setIsSearchOpen(false);
            setIsCityOpen(false);
            setIsProfileOpen(false);
          }}
          className="relative rounded-xl border border-[var(--theme-medlink-border)] bg-white p-2.5 text-[var(--theme-medlink-text-secondary)] shadow-sm transition-colors hover:bg-[var(--theme-medlink-bg)]"
        >
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--theme-medlink-emergency-red)] px-1 text-[10px] font-bold text-white ring-2 ring-white">
              {unreadCount}
            </span>
          )}
          <Bell className="h-5 w-5" />
        </button>

        {isAlertsOpen && (
          <div className="absolute right-20 top-14 z-50 w-[390px] overflow-hidden rounded-2xl border border-[var(--theme-medlink-border)] bg-white shadow-2xl">
            <div className="border-b border-[var(--theme-medlink-border)] bg-gradient-to-r from-red-50 via-white to-blue-50 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-[var(--theme-medlink-text-primary)]">Alert Center</div>
                  <div className="text-xs text-[var(--theme-medlink-text-secondary)]">Hospital operations and emergency updates</div>
                </div>
                <button
                  onClick={markAllAsRead}
                  className="inline-flex items-center gap-1 rounded-lg bg-[var(--theme-medlink-bg)] px-2.5 py-1.5 text-xs font-semibold text-[var(--theme-medlink-primary-blue)] hover:bg-blue-50"
                >
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'unread', label: 'Unread' },
                  { key: 'critical', label: 'Critical' },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setAlertFilter(filter.key as 'all' | 'unread' | 'critical')}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${alertFilter === filter.key ? 'bg-[var(--theme-medlink-primary-blue)] text-white' : 'bg-white text-[var(--theme-medlink-text-secondary)] hover:bg-[var(--theme-medlink-bg)]'}`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-b border-[var(--theme-medlink-border)] bg-[var(--theme-medlink-bg)]/70 px-4 py-2 text-[11px] text-[var(--theme-medlink-text-secondary)]">
              {lastAction}
            </div>

            <div className="max-h-[360px] overflow-y-auto">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`border-b border-[var(--theme-medlink-border)] px-4 py-3 transition-colors ${alert.read ? 'bg-white' : 'bg-blue-50/30'}`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${
                          alert.type === 'critical'
                            ? 'bg-red-100 text-red-600'
                            : alert.type === 'success'
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {alert.type === 'critical' ? <Siren className="h-4 w-4" /> : alert.type === 'success' ? <ShieldCheck className="h-4 w-4" /> : <Ambulance className="h-4 w-4" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-semibold text-[var(--theme-medlink-text-primary)]">{alert.title}</div>
                          {!alert.read && <span className="h-2.5 w-2.5 rounded-full bg-[var(--theme-medlink-primary-blue)]" />}
                        </div>
                        <div className="mt-1 text-xs leading-5 text-[var(--theme-medlink-text-secondary)]">{alert.detail}</div>
                        <div className="mt-2 flex items-center gap-1 text-[11px] text-[var(--theme-medlink-text-secondary)]">
                          <Clock3 className="h-3.5 w-3.5" /> {alert.time}
                        </div>
                        {alert.owner && (
                          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[var(--theme-medlink-bg)] px-2 py-0.5 text-[10px] font-semibold text-[var(--theme-medlink-text-secondary)]">
                            <User className="h-3 w-3" /> {alert.owner}
                          </div>
                        )}
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => openAlert(alert.id, alert.route, alert.title)}
                            className="inline-flex items-center gap-1 rounded-lg bg-[var(--theme-medlink-primary-blue)] px-2.5 py-1.5 text-[11px] font-semibold text-white hover:opacity-95"
                          >
                            {alert.actionLabel}
                          </button>
                          <button
                            onClick={() => toggleAlertRead(alert.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-[var(--theme-medlink-bg)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--theme-medlink-text-primary)] hover:bg-blue-50"
                          >
                            {alert.read ? 'Mark unread' : 'Acknowledge'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-10 text-center">
                  <div className="text-sm font-semibold text-[var(--theme-medlink-text-primary)]">No alerts in this view</div>
                  <div className="mt-1 text-xs text-[var(--theme-medlink-text-secondary)]">Your command center is currently clear for this filter</div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between bg-white px-4 py-3 text-[11px] text-[var(--theme-medlink-text-secondary)]">
              <span>Last live refresh: {lastRefreshAt}</span>
              <button
                onClick={() => handleQuickAction('/app/insights', 'AI insights board')}
                className="font-semibold text-[var(--theme-medlink-primary-blue)]"
              >
                Open AI board
              </button>
            </div>
          </div>
        )}

        <div className="mx-1 h-6 w-px bg-[var(--theme-medlink-border)]" />

        <button
          onClick={() => {
            setIsProfileOpen((prev) => !prev);
            setIsSearchOpen(false);
            setIsCityOpen(false);
            setIsAlertsOpen(false);
          }}
          className="flex items-center gap-3 rounded-xl border border-[var(--theme-medlink-border)] bg-white p-1.5 pr-3 shadow-sm transition-all hover:bg-[var(--theme-medlink-bg)] hover:shadow-md lg:min-w-[230px] lg:justify-between"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--theme-medlink-primary-blue)] to-[var(--theme-medlink-medical-teal)] text-sm font-bold text-white shadow-sm">
            {adminInitials}
          </div>
          <div className="hidden text-left lg:block">
            <div className="text-sm font-semibold leading-tight text-[var(--theme-medlink-text-primary)]">{adminName}</div>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-[var(--theme-medlink-text-secondary)] lg:block" />
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 top-14 z-50 w-[340px] overflow-hidden rounded-2xl border border-[var(--theme-medlink-border)] bg-white shadow-2xl">
            <div className="border-b border-[var(--theme-medlink-border)] bg-gradient-to-r from-blue-50 via-white to-purple-50 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--theme-medlink-primary-blue)] to-[var(--theme-medlink-medical-teal)] font-bold text-white shadow-sm">
                  {adminInitials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[var(--theme-medlink-text-primary)]">{adminName}</div>
                  <div className="text-xs text-[var(--theme-medlink-text-secondary)]">{adminEmail}</div>
                  <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    <ShieldCheck className="h-3 w-3" /> Verified session
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-[var(--theme-medlink-border)] bg-[var(--theme-medlink-bg)]/70 px-4 py-2 text-[11px] text-[var(--theme-medlink-text-secondary)]">
              Last action: {lastAction}
            </div>

            <div className="space-y-2 p-3">
              <MenuItem icon={Building2} label="Open admin console" meta="System settings, controls, and preferences" onClick={() => handleAdminAction('/app/settings', 'Admin console opened')} />
              <MenuItem
                icon={AlertTriangle}
                label="Review critical alerts"
                meta="Jump to high-priority notification handling"
                onClick={() => {
                  setIsProfileOpen(false);
                  setAlertFilter('critical');
                  setIsAlertsOpen(true);
                  setLastAction('Critical alert queue opened');
                }}
              />
              <MenuItem icon={Shield} label="Security review" meta="Access sessions and security controls" onClick={() => handleAdminAction('/app/settings', 'Security review opened')} />
              <MenuItem
                icon={RefreshCw}
                label="Refresh live board"
                meta="Sync the latest command center status"
                onClick={() => {
                  setIsProfileOpen(false);
                  triggerRefresh();
                }}
              />
              <MenuItem icon={Sparkles} label="Open AI command insights" meta="Forecasts, risk patterns, and smart actions" onClick={() => handleAdminAction('/app/insights', 'AI insights opened')} />

              {adminTeam.length > 0 && (
                <div className="rounded-xl border border-[var(--theme-medlink-border)] bg-[var(--theme-medlink-bg)]/70 p-2">
                  <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wide text-[var(--theme-medlink-text-secondary)]">On-duty team</div>
                  <div className="space-y-1">
                    {adminTeam.slice(0, 4).map((member) => (
                      <div key={member.id} className="flex items-center justify-between rounded-lg bg-white px-2.5 py-2">
                        <span className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--theme-medlink-primary-blue)]/10 text-[11px] font-bold text-[var(--theme-medlink-primary-blue)]">
                            {member.name
                              .split(' ')
                              .slice(0, 2)
                              .map((part) => part[0])
                              .join('')
                              .toUpperCase()}
                          </span>
                          <span>
                            <span className="block text-[12px] font-semibold text-[var(--theme-medlink-text-primary)]">{member.name}</span>
                            <span className="block text-[10px] text-[var(--theme-medlink-text-secondary)]">{member.role}</span>
                          </span>
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${member.status === 'online' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${member.status === 'online' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                          {member.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={handleSignOut} className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm text-red-600 transition-colors hover:bg-red-50">
                <span className="inline-flex items-center gap-2 font-semibold">
                  <LogOut className="h-4 w-4" /> Sign out securely
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

function MenuItem({
  icon: Icon,
  label,
  meta,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  meta: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors hover:bg-[var(--theme-medlink-bg)]">
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--theme-medlink-bg)] text-[var(--theme-medlink-primary-blue)]">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-[var(--theme-medlink-text-primary)]">{label}</span>
          <span className="block truncate text-[11px] text-[var(--theme-medlink-text-secondary)]">{meta}</span>
        </span>
      </span>
      <ChevronRight className="h-4 w-4 text-[var(--theme-medlink-text-secondary)]" />
    </button>
  );
}
