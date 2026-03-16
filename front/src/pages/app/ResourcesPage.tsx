import { Database, AlertTriangle } from 'lucide-react';

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
       <div className="mb-4">
        <h1 className="text-2xl font-bold text-[var(--app-text)] flex items-center">
          <Database className="w-6 h-6 mr-3 text-[var(--app-teal)]" />
          Resource Intelligence
        </h1>
        <p className="text-[var(--app-muted)] mt-1">Network-wide tracking of critical medical assets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Alerts / Small Charts Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-xl p-5">
             <h2 className="text-sm font-bold text-[var(--app-text)] uppercase mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" /> Action Needed
             </h2>
             <div className="space-y-3">
               <div className="bg-orange-50 border border-orange-200 p-3 rounded">
                 <div className="text-sm text-[var(--app-text)] font-medium">Beds Critically Low</div>
                 <div className="text-xs text-[var(--app-muted)] mt-1">South District is operating at 95% total capacity.</div>
               </div>
               <div className="bg-gray-50 border border-[var(--app-border)] p-3 rounded">
                 <div className="text-sm text-[var(--app-text)] font-medium">Ventilator Re-allocation</div>
                 <div className="text-xs text-[var(--app-muted)] mt-1">AI Suggests moving 4 unused units from East Wing to ER.</div>
               </div>
             </div>
          </div>

          <div className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-xl p-5 h-48 flex items-center justify-center relative overflow-hidden bg-gray-50/50">
              <span className="text-[var(--app-muted)] z-10 text-sm">[Trend Chart]</span>
          </div>
        </div>

        {/* Main Table Area */}
        <div className="lg:col-span-3 bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[var(--app-border)] bg-white flex justify-between items-center">
             <h2 className="font-semibold text-[var(--app-text)]">Facility Inventory Status</h2>
             <div className="flex space-x-2">
                <button className="px-3 py-1 bg-white border border-[var(--app-border)] rounded text-xs text-[var(--app-text)] hover:bg-gray-50">Export</button>
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--app-muted)]">
              <thead className="bg-[#F9FAFB] text-xs uppercase text-[var(--app-text)]">
                <tr className="border-b border-[var(--app-border)]">
                  <th className="px-6 py-4 font-semibold text-[var(--app-text)]">Hospital</th>
                  <th className="px-6 py-4 font-semibold text-[var(--app-text)] text-center">ICU Beds</th>
                  <th className="px-6 py-4 font-semibold text-[var(--app-text)] text-center">Ventilators</th>
                  <th className="px-6 py-4 font-semibold text-[var(--app-text)] text-center">Blood Supply</th>
                  <th className="px-6 py-4 font-semibold text-[var(--app-text)] text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]">
                {[
                  { name: 'General Hospital', icu: '4/50', vents: '12', blood: 'Adequate', status: 'Warning', statusColor: 'text-orange-700 bg-orange-100' },
                  { name: 'City Medical', icu: '15/30', vents: '8', blood: 'Low', status: 'Stable', statusColor: 'text-[var(--app-teal)] bg-teal-50' },
                  { name: 'Eastside Clinic', icu: '0/10', vents: '2', blood: 'Depleted', status: 'Critical', statusColor: 'text-[var(--app-red)] bg-red-50' },
                  { name: 'North Wing Hosp', icu: '8/20', vents: '15', blood: 'Adequate', status: 'Stable', statusColor: 'text-[var(--app-teal)] bg-teal-50' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 font-medium text-[var(--app-text)] whitespace-nowrap">{row.name}</td>
                    <td className="px-6 py-4 text-center">{row.icu}</td>
                    <td className="px-6 py-4 text-center">{row.vents}</td>
                    <td className="px-6 py-4 text-center">{row.blood}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${row.statusColor}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
