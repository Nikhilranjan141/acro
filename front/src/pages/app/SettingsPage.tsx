import { Settings, Shield, Bell, Key } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6 border-b border-[var(--app-border)] pb-4">
        <h1 className="text-2xl font-bold text-[var(--app-text)] flex items-center">
          <Settings className="w-6 h-6 mr-3 text-[var(--app-muted)]" />
          Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {/* Settings Nav */}
         <div className="md:col-span-1 space-y-1">
            <button className="w-full flex items-center px-3 py-2 bg-[var(--app-blue)]/10 text-[var(--app-blue)] font-medium rounded-lg text-sm mb-1">
               <Shield className="w-4 h-4 mr-2" /> Account
            </button>
            <button className="w-full flex items-center px-3 py-2 text-[var(--app-muted)] hover:bg-[var(--app-card)] hover:text-[var(--app-text)] font-medium rounded-lg text-sm mb-1 transition-colors">
               <Bell className="w-4 h-4 mr-2" /> Notifications
            </button>
            <button className="w-full flex items-center px-3 py-2 text-[var(--app-muted)] hover:bg-[var(--app-card)] hover:text-[var(--app-text)] font-medium rounded-lg text-sm mb-1 transition-colors">
               <Key className="w-4 h-4 mr-2" /> Security
            </button>
         </div>

         {/* Settings Content Placeholder */}
         <div className="md:col-span-3 space-y-6">
            <div className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-xl p-5">
               <h2 className="text-lg font-semibold text-[var(--app-text)] mb-4">Profile Information</h2>
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-[var(--app-text)] mb-1">Full Name</label>
                     <input type="text" defaultValue="Dr. Sarah Connor" className="w-full bg-white border border-[var(--app-border)] rounded-md px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-[var(--app-blue)] focus:ring-1 focus:ring-[var(--app-blue)]" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-[var(--app-text)] mb-1">Email Address</label>
                     <input type="email" defaultValue="sarah.connor@hospital.org" className="w-full bg-white border border-[var(--app-border)] rounded-md px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-[var(--app-blue)] focus:ring-1 focus:ring-[var(--app-blue)]" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-[var(--app-text)] mb-1">Role / Department</label>
                     <input type="text" defaultValue="Head of Emergency Transfer, District 4" readOnly className="w-full bg-gray-50 border border-[var(--app-border)] rounded-md px-3 py-2 text-[var(--app-muted)] cursor-not-allowed hidden md:block" />
                  </div>
               </div>
               <div className="mt-6 flex justify-end">
                  <button className="px-4 py-2 bg-[var(--app-blue)] text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
                    Save Changes
                  </button>
               </div>
            </div>
            
             <div className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-xl p-5">
               <h2 className="text-lg font-semibold text-[var(--app-red)] mb-4">Danger Zone</h2>
               <p className="text-sm text-[var(--app-muted)] mb-4">Permanent actions regarding your account and associated organization data.</p>
               <button className="px-4 py-2 border border-[var(--app-red)] text-[var(--app-red)] font-medium rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
                 Deactivate Account
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
