import { useEffect, useMemo, useState } from 'react';
import {
   Settings,
   Shield,
   Bell,
   Key,
   Building2,
   User,
   Save,
   Smartphone,
   Globe,
   Moon,
   Sun,
   Monitor,
   LogOut,
   ShieldCheck,
   CircleAlert,
   CheckCircle2,
   RefreshCw,
   Sparkles,
   Lock,
} from 'lucide-react';
import { useAuthStore } from '../../state/auth';

type TabKey = 'profile' | 'hospital' | 'notifications' | 'prefs' | 'security';

type SessionItem = {
   id: string;
   device: string;
   location: string;
   lastActive: string;
   current?: boolean;
};

const SETTINGS_STORAGE_KEY = 'medlink-settings-v1';

export default function SettingsPage() {
   const { user, login } = useAuthStore();

   const [activeTab, setActiveTab] = useState<TabKey>('profile');
   const [saveMessage, setSaveMessage] = useState('');

   const [profile, setProfile] = useState({
      name: user?.name || 'Dr. Rahul Sharma',
      email: user?.email || 'rahul@hospital.com',
      role: user?.role || 'Hospital Admin',
   });

   const [hospital, setHospital] = useState({
      hospitalName: 'City General Hospital',
      location: 'Indore, Madhya Pradesh',
      contactNumber: '+91 731 555 1100',
   });

   const [notifications, setNotifications] = useState({
      emailAlerts: true,
      smsAlerts: false,
      emergencyAlerts: true,
   });

   const [prefs, setPrefs] = useState({
      theme: 'light' as 'light' | 'dark' | 'system',
      language: 'English',
      autoRefreshSeconds: 30,
   });

   const [securityForm, setSecurityForm] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: false,
   });

   const [sessions, setSessions] = useState<SessionItem[]>([
      { id: 's1', device: 'Windows Desktop - Chrome', location: 'Indore', lastActive: 'Now', current: true },
      { id: 's2', device: 'Android Device - Chrome', location: 'Bhopal', lastActive: '14 min ago' },
      { id: 's3', device: 'iPad - Safari', location: 'Mumbai', lastActive: '2 hrs ago' },
   ]);

   const [isLoaded, setIsLoaded] = useState(false);

   const tabItems = useMemo(
      () => [
         { key: 'profile' as const, label: 'Profile & Account', icon: User },
         { key: 'hospital' as const, label: 'Hospital Information', icon: Building2 },
         { key: 'notifications' as const, label: 'Notification Settings', icon: Bell },
         { key: 'prefs' as const, label: 'System Preferences', icon: Settings },
         { key: 'security' as const, label: 'Security', icon: Shield },
      ],
      []
   );

   useEffect(() => {
      if (typeof window === 'undefined') return;

      const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) {
         setIsLoaded(true);
         return;
      }

      try {
         const saved = JSON.parse(raw);
         if (saved.profile) setProfile(saved.profile);
         if (saved.hospital) setHospital(saved.hospital);
         if (saved.notifications) setNotifications(saved.notifications);
         if (saved.prefs) setPrefs(saved.prefs);
         if (saved.securityForm) {
            setSecurityForm((prev) => ({
               ...prev,
               twoFactorEnabled: Boolean(saved.securityForm.twoFactorEnabled),
            }));
         }
         if (saved.sessions) setSessions(saved.sessions);
      } catch {
         window.localStorage.removeItem(SETTINGS_STORAGE_KEY);
      } finally {
         setIsLoaded(true);
      }
   }, []);

   useEffect(() => {
      if (!isLoaded || typeof window === 'undefined') return;

      window.localStorage.setItem(
         SETTINGS_STORAGE_KEY,
         JSON.stringify({
            profile,
            hospital,
            notifications,
            prefs,
            securityForm: { twoFactorEnabled: securityForm.twoFactorEnabled },
            sessions,
         })
      );
   }, [profile, hospital, notifications, prefs, securityForm.twoFactorEnabled, sessions, isLoaded]);

   const showSaved = (message: string) => {
      setSaveMessage(message);
      setTimeout(() => setSaveMessage(''), 2500);
   };

   const saveProfile = () => {
      if (!profile.name.trim() || !profile.email.includes('@')) {
         showSaved('Please enter a valid profile name and email.');
         return;
      }
      login({ name: profile.name, email: profile.email, role: profile.role });
      showSaved('Profile updated successfully.');
   };

   const saveHospital = () => {
      if (!hospital.hospitalName.trim() || !hospital.location.trim()) {
         showSaved('Hospital name and location are required.');
         return;
      }
      showSaved('Hospital configuration saved.');
   };

   const saveNotifications = () => {
      showSaved('Notification settings saved.');
   };

   const savePreferences = () => {
      showSaved('System preferences saved.');
   };

   const updatePassword = () => {
      if (!securityForm.currentPassword || securityForm.newPassword.length < 8) {
         showSaved('New password must be at least 8 characters.');
         return;
      }
      if (securityForm.newPassword !== securityForm.confirmPassword) {
         showSaved('New password and confirm password do not match.');
         return;
      }
      setSecurityForm((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      showSaved('Password updated successfully.');
   };

   const removeSession = (id: string) => {
      setSessions((prev) => prev.filter((item) => item.id !== id));
      showSaved('Session logged out.');
   };

   const logoutAllOtherSessions = () => {
      setSessions((prev) => prev.filter((item) => item.current));
      showSaved('Logged out from all other devices.');
   };

   const enabledNotificationCount = Object.values(notifications).filter(Boolean).length;
   const currentSessionsCount = sessions.length;

   return (
      <div className="max-w-7xl mx-auto space-y-6">
         <section className="relative overflow-hidden rounded-2xl border border-[var(--app-border)] bg-gradient-to-r from-[#eff6ff] via-white to-[#f5f3ff] p-6 shadow-sm">
            <div className="absolute -top-10 left-20 h-28 w-28 rounded-full bg-[#2563EB]/10 blur-2xl" />
            <div className="absolute -bottom-10 right-16 h-28 w-28 rounded-full bg-[#8B5CF6]/10 blur-2xl" />
            <div className="relative flex items-center justify-between gap-4 flex-wrap">
               <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/20 bg-white/80 px-3 py-1 text-xs font-semibold text-[#2563EB] mb-3">
                     <Sparkles className="w-3.5 h-3.5" /> System Control Center
                  </div>
                  <h1 className="text-3xl font-bold text-[var(--app-text)] flex items-center">
                     <Settings className="w-7 h-7 mr-3 text-[#2563EB]" />
                     Settings & System Control
                  </h1>
                  <p className="text-[var(--app-muted)] mt-2 max-w-2xl">
                     Manage account, hospital configuration, notifications, security, and device access with a premium MedLink control experience.
                  </p>
               </div>
               <div className="rounded-2xl border border-white/70 bg-white/80 backdrop-blur px-4 py-3 shadow-sm min-w-[240px]">
                  <div className="text-xs uppercase tracking-wide text-[var(--app-muted)] font-semibold">Current Profile</div>
                  <div className="mt-2 flex items-center gap-3">
                     <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#8B5CF6] text-white font-bold">
                        {profile.name
                           .split(' ')
                           .map((part) => part[0])
                           .join('')
                           .slice(0, 2)
                           .toUpperCase()}
                     </div>
                     <div>
                        <div className="text-sm font-semibold text-[var(--app-text)]">{profile.name}</div>
                        <div className="text-xs text-[var(--app-muted)]">{profile.role}</div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <OverviewCard title="Profile Sync" value="Active" subtitle="Auth state connected" icon={CheckCircle2} accent="text-emerald-600" />
            <OverviewCard title="Alerts Enabled" value={`${enabledNotificationCount}/3`} subtitle="Notification channels" icon={Bell} accent="text-[#2563EB]" />
            <OverviewCard title="Security Mode" value={securityForm.twoFactorEnabled ? '2FA On' : 'Standard'} subtitle="Protection level" icon={Lock} accent="text-[#8B5CF6]" />
            <OverviewCard title="Live Sessions" value={`${currentSessionsCount}`} subtitle="Connected devices" icon={RefreshCw} accent="text-[#14B8A6]" />
         </div>

         {saveMessage && (
            <div className="rounded-xl border border-[#2563EB]/20 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 text-sm font-medium text-[#2563EB] shadow-sm">
               {saveMessage}
            </div>
         )}

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-3 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 space-y-2 h-fit shadow-sm sticky top-6">
               <div className="rounded-xl bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] px-4 py-4 text-white mb-3">
                  <div className="text-xs uppercase tracking-wide text-white/80 font-semibold">Settings Navigation</div>
                  <div className="mt-1 text-lg font-semibold">MedLink Admin Panel</div>
                  <div className="text-xs text-white/80 mt-1">Structured configuration with live-saving experience.</div>
               </div>
               {tabItems.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                     <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                           isActive
                              ? 'bg-gradient-to-r from-[#eff6ff] to-[#f5f3ff] text-[#2563EB] border border-[#2563EB]/20 shadow-sm'
                              : 'text-[var(--app-muted)] hover:bg-[var(--app-sidebar)] hover:text-[var(--app-text)]'
                        }`}
                     >
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${isActive ? 'bg-white text-[#2563EB]' : 'bg-gray-100 text-[var(--app-muted)]'}`}>
                           <Icon className="w-4 h-4" />
                        </span>
                        <span>{tab.label}</span>
                     </button>
                  );
               })}
            </aside>

            <div className="lg:col-span-9 space-y-6">
               {activeTab === 'profile' && (
                  <section className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-2xl p-6">
                     <SectionHeader title="Profile & Account" subtitle="Manage your personal identity, email, and role mapping." icon={User} color="text-[#2563EB]" />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Name">
                           <input
                              type="text"
                              value={profile.name}
                              onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                              className={inputBaseClassName}
                           />
                        </Field>
                        <Field label="Email">
                           <input
                              type="email"
                              value={profile.email}
                              onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                              className={inputBaseClassName}
                           />
                        </Field>
                        <Field label="Role">
                           <input
                              type="text"
                              value={profile.role}
                              onChange={(e) => setProfile((prev) => ({ ...prev, role: e.target.value }))}
                              className={inputBaseClassName}
                           />
                        </Field>
                        <Field label="Hospital">
                           <input type="text" value={hospital.hospitalName} readOnly className={`${inputBaseClassName} bg-gray-50`} />
                        </Field>
                     </div>
                     <div className="mt-6 flex justify-end">
                        <button onClick={saveProfile} className={buttonPrimaryClassName}>
                           <Save className="w-4 h-4" /> Update Profile
                        </button>
                     </div>
                  </section>
               )}

               {activeTab === 'hospital' && (
                  <section className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-2xl p-6">
                     <SectionHeader title="Hospital Information" subtitle="Configure hospital identity, location, and support channels." icon={Building2} color="text-[#14B8A6]" />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Hospital Name">
                           <input
                              type="text"
                              value={hospital.hospitalName}
                              onChange={(e) => setHospital((prev) => ({ ...prev, hospitalName: e.target.value }))}
                              className={inputBaseClassName}
                           />
                        </Field>
                        <Field label="Location">
                           <input
                              type="text"
                              value={hospital.location}
                              onChange={(e) => setHospital((prev) => ({ ...prev, location: e.target.value }))}
                              className={inputBaseClassName}
                           />
                        </Field>
                        <Field label="Contact Number">
                           <input
                              type="text"
                              value={hospital.contactNumber}
                              onChange={(e) => setHospital((prev) => ({ ...prev, contactNumber: e.target.value }))}
                              className={inputBaseClassName}
                           />
                        </Field>
                     </div>
                     <div className="mt-6 flex justify-end">
                        <button onClick={saveHospital} className={buttonPrimaryClassName}>
                           <Save className="w-4 h-4" /> Save Hospital Info
                        </button>
                     </div>
                  </section>
               )}

               {activeTab === 'notifications' && (
                  <section className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-2xl p-6">
                     <SectionHeader title="Notification Settings" subtitle="Control which communication channels stay active for critical operations." icon={Bell} color="text-[#8B5CF6]" />
                     <div className="space-y-3">
                        <ToggleRow
                           title="Email Alerts"
                           subtitle="Receive system and performance alerts on email"
                           enabled={notifications.emailAlerts}
                           onToggle={() => setNotifications((prev) => ({ ...prev, emailAlerts: !prev.emailAlerts }))}
                        />
                        <ToggleRow
                           title="SMS Alerts"
                           subtitle="Receive high-priority alerts over SMS"
                           enabled={notifications.smsAlerts}
                           onToggle={() => setNotifications((prev) => ({ ...prev, smsAlerts: !prev.smsAlerts }))}
                        />
                        <ToggleRow
                           title="Emergency Alerts"
                           subtitle="Critical emergency and transfer incident notifications"
                           enabled={notifications.emergencyAlerts}
                           onToggle={() => setNotifications((prev) => ({ ...prev, emergencyAlerts: !prev.emergencyAlerts }))}
                        />
                     </div>
                     <div className="mt-6 flex justify-end">
                        <button onClick={saveNotifications} className={buttonPrimaryClassName}>
                           <Save className="w-4 h-4" /> Save Notifications
                        </button>
                     </div>
                  </section>
               )}

               {activeTab === 'prefs' && (
                  <section className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-2xl p-6">
                     <SectionHeader title="System Preferences" subtitle="Tune visual style, language, and operational refresh timing." icon={Settings} color="text-[#2563EB]" />

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        <ThemeCard title="Light" icon={Sun} active={prefs.theme === 'light'} onClick={() => setPrefs((prev) => ({ ...prev, theme: 'light' }))} />
                        <ThemeCard title="Dark" icon={Moon} active={prefs.theme === 'dark'} onClick={() => setPrefs((prev) => ({ ...prev, theme: 'dark' }))} />
                        <ThemeCard title="System" icon={Monitor} active={prefs.theme === 'system'} onClick={() => setPrefs((prev) => ({ ...prev, theme: 'system' }))} />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Language">
                           <div className="relative">
                              <Globe className="w-4 h-4 text-[var(--app-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                              <select
                                 value={prefs.language}
                                 onChange={(e) => setPrefs((prev) => ({ ...prev, language: e.target.value }))}
                                 className={`${inputBaseClassName} pl-9`}
                              >
                                 <option>English</option>
                                 <option>Hindi</option>
                              </select>
                           </div>
                        </Field>

                        <Field label="Auto Refresh Interval">
                           <div className="relative">
                              <Smartphone className="w-4 h-4 text-[var(--app-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                              <select
                                 value={prefs.autoRefreshSeconds}
                                 onChange={(e) => setPrefs((prev) => ({ ...prev, autoRefreshSeconds: Number(e.target.value) }))}
                                 className={`${inputBaseClassName} pl-9`}
                              >
                                 <option value={15}>15 seconds</option>
                                 <option value={30}>30 seconds</option>
                                 <option value={60}>60 seconds</option>
                              </select>
                           </div>
                        </Field>
                     </div>

                     <div className="mt-6 flex justify-end">
                        <button onClick={savePreferences} className={buttonPrimaryClassName}>
                           <Save className="w-4 h-4" /> Save Preferences
                        </button>
                     </div>
                  </section>
               )}

               {activeTab === 'security' && (
                  <section className="space-y-6">
                     <div className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-2xl p-6">
                        <SectionHeader title="Security Settings" subtitle="Protect access with password policy, 2FA, and device session management." icon={Shield} color="text-[#ef4444]" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <Field label="Current Password">
                              <input
                                 type="password"
                                 value={securityForm.currentPassword}
                                 onChange={(e) => setSecurityForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                                 className={inputBaseClassName}
                              />
                           </Field>
                           <Field label="New Password">
                              <input
                                 type="password"
                                 value={securityForm.newPassword}
                                 onChange={(e) => setSecurityForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                                 className={inputBaseClassName}
                              />
                           </Field>
                           <Field label="Confirm Password">
                              <input
                                 type="password"
                                 value={securityForm.confirmPassword}
                                 onChange={(e) => setSecurityForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                 className={inputBaseClassName}
                              />
                           </Field>
                        </div>

                        <div className="mt-4 flex items-center justify-between rounded-xl border border-[var(--app-border)] p-4 bg-gradient-to-r from-gray-50 to-red-50/40">
                           <div>
                              <div className="text-sm font-semibold text-[var(--app-text)]">Two-Factor Authentication</div>
                              <div className="text-xs text-[var(--app-muted)]">Enhance account security with OTP verification.</div>
                           </div>
                           <button
                              onClick={() => {
                                 setSecurityForm((prev) => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
                                 showSaved(`Two-factor authentication ${!securityForm.twoFactorEnabled ? 'enabled' : 'disabled'}.`);
                              }}
                              className={`px-3 py-1.5 rounded-md text-xs font-semibold ${securityForm.twoFactorEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'}`}
                           >
                              {securityForm.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                           </button>
                        </div>

                        <div className="mt-5 flex justify-end">
                           <button onClick={updatePassword} className={buttonPrimaryClassName}>
                              <Key className="w-4 h-4" /> Update Password
                           </button>
                        </div>
                     </div>

                     <div className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-2xl p-6">
                        <h3 className="text-md font-semibold text-[var(--app-text)] mb-3">Active Sessions</h3>
                        <div className="space-y-2">
                           {sessions.map((session) => (
                              <div key={session.id} className="rounded-lg border border-[var(--app-border)] px-3 py-2 flex items-center justify-between bg-white">
                                 <div>
                                    <div className="text-sm font-medium text-[var(--app-text)] flex items-center gap-2">
                                       <ShieldCheck className="w-4 h-4 text-[var(--app-blue)]" /> {session.device}
                                       {session.current && (
                                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">Current</span>
                                       )}
                                    </div>
                                    <div className="text-xs text-[var(--app-muted)]">{session.location} · {session.lastActive}</div>
                                 </div>
                                 {!session.current && (
                                    <button
                                       onClick={() => removeSession(session.id)}
                                       className="text-xs font-semibold text-[var(--app-red)] hover:underline"
                                    >
                                       Logout
                                    </button>
                                 )}
                              </div>
                           ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                           <div className="text-xs text-[var(--app-muted)] flex items-center gap-1">
                              <CircleAlert className="w-3.5 h-3.5 text-orange-500" />
                              Use this if you suspect unauthorized access.
                           </div>
                           <button onClick={logoutAllOtherSessions} className="px-3 py-1.5 rounded-md bg-[var(--app-red)] text-white text-xs font-semibold inline-flex items-center gap-1">
                              <LogOut className="w-3.5 h-3.5" /> Logout All Others
                           </button>
                        </div>
                     </div>
                  </section>
               )}
            </div>
         </div>
      </div>
   );
}

function SectionHeader({
   title,
   subtitle,
   icon: Icon,
   color,
}: {
   title: string;
   subtitle: string;
   icon: React.ComponentType<{ className?: string }>;
   color: string;
}) {
   return (
      <div className="mb-5 flex items-start justify-between gap-3 flex-wrap">
         <div>
            <h2 className="text-lg font-semibold text-[var(--app-text)] flex items-center gap-2">
               <Icon className={`w-5 h-5 ${color}`} /> {title}
            </h2>
            <p className="text-sm text-[var(--app-muted)] mt-1">{subtitle}</p>
         </div>
      </div>
   );
}

function OverviewCard({
   title,
   value,
   subtitle,
   icon: Icon,
   accent,
}: {
   title: string;
   value: string;
   subtitle: string;
   icon: React.ComponentType<{ className?: string }>;
   accent: string;
}) {
   return (
      <div className="rounded-2xl border border-[var(--app-border)] bg-white p-4 shadow-sm">
         <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-[var(--app-muted)] font-semibold">
            {title}
            <Icon className={`w-4 h-4 ${accent}`} />
         </div>
         <div className="mt-2 text-2xl font-bold text-[var(--app-text)]">{value}</div>
         <div className="text-xs text-[var(--app-muted)] mt-1">{subtitle}</div>
      </div>
   );
}

const inputBaseClassName =
   'w-full rounded-xl border border-[var(--app-border)] bg-white px-3 py-2.5 text-[var(--app-text)] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15';

const buttonPrimaryClassName =
   'inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
   return (
      <label className="block">
         <span className="block text-sm font-medium text-[var(--app-text)] mb-1">{label}</span>
         {children}
      </label>
   );
}

function ToggleRow({
   title,
   subtitle,
   enabled,
   onToggle,
}: {
   title: string;
   subtitle: string;
   enabled: boolean;
   onToggle: () => void;
}) {
   return (
      <div className="rounded-xl border border-[var(--app-border)] bg-white px-4 py-4 flex items-center justify-between shadow-sm">
         <div>
            <div className="text-sm font-semibold text-[var(--app-text)]">{title}</div>
            <div className="text-xs text-[var(--app-muted)]">{subtitle}</div>
         </div>
         <button
            onClick={onToggle}
            className={`h-6 w-12 rounded-full p-1 transition-colors ${enabled ? 'bg-[var(--app-blue)]' : 'bg-gray-300'}`}
         >
            <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
         </button>
      </div>
   );
}

function ThemeCard({
   title,
   icon: Icon,
   active,
   onClick,
}: {
   title: string;
   icon: React.ComponentType<{ className?: string }>;
   active: boolean;
   onClick: () => void;
}) {
   return (
      <button
         onClick={onClick}
         className={`rounded-xl border px-4 py-4 text-left transition-all shadow-sm ${active ? 'border-[#2563EB] bg-gradient-to-br from-blue-50 to-indigo-50' : 'border-[var(--app-border)] bg-white hover:bg-gray-50'}`}
      >
         <Icon className={`w-4 h-4 mb-2 ${active ? 'text-[var(--app-blue)]' : 'text-[var(--app-muted)]'}`} />
         <div className="text-sm font-semibold text-[var(--app-text)]">{title}</div>
      </button>
   );
}
