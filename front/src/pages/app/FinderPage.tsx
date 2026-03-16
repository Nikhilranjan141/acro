import { Brain, Search, MapPin, Building2 } from 'lucide-react';

export default function FinderPage() {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[var(--app-text)] flex items-center">
          <Brain className="w-6 h-6 mr-3 text-[var(--app-purple)]" />
          AI Predict & Hospital Finder
        </h1>
        <p className="text-[var(--app-muted)] mt-1">Intelligently match patient needs with available resources</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left column: Search / filters */}
        <div className="lg:col-span-1 bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-xl p-5 flex flex-col overflow-y-auto">
           <h2 className="text-lg font-semibold text-[var(--app-text)] mb-4 border-b border-[var(--app-border)] pb-2">Filter Parameters</h2>
           <div className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-[var(--app-text)] mb-1">Condition Keywords</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Search className="h-4 w-4 text-[var(--app-muted)]" />
                   </div>
                   <input type="text" className="w-full bg-white border border-[var(--app-border)] rounded-md pl-10 pr-3 py-2 text-[var(--app-text)] placeholder-[var(--app-muted)] focus:border-[var(--app-purple)] focus:ring-1 focus:ring-[var(--app-purple)] outline-none" placeholder="e.g. Cardiac Arrest, Trauma" />
                 </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-[var(--app-text)] mb-1">Severity Level</label>
                 <select className="w-full bg-white border border-[var(--app-border)] rounded-md px-3 py-2 text-[var(--app-text)] focus:border-[var(--app-purple)] outline-none">
                    <option>Critical / Level 1</option>
                    <option>Urgent / Level 2</option>
                    <option>Non-Urgent / Level 3</option>
                 </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-[var(--app-text)] mb-1">Resource Required</label>
                 <select className="w-full bg-white border border-[var(--app-border)] rounded-md px-3 py-2 text-[var(--app-text)] focus:border-[var(--app-purple)] outline-none">
                    <option>ICU Bed + Ventilator</option>
                    <option>Surgical Suite</option>
                    <option>General Admission</option>
                 </select>
              </div>
              <button className="w-full bg-[var(--app-purple)] text-white font-medium py-2 rounded-md hover:bg-purple-600 transition-colors mt-4">
                Run AI Match
              </button>
           </div>
        </div>

        {/* Right column: Results & Mini Map */}
        <div className="lg:col-span-2 space-y-6 flex flex-col min-h-0">
            {/* Top recommendation */}
            <div className="bg-purple-50 border border-[var(--app-purple)] rounded-xl p-5 shadow-sm">
               <div className="flex justify-between items-start">
                  <div>
                     <div className="inline-flex items-center space-x-1 px-2 py-1 bg-[var(--app-purple)] text-white rounded text-xs font-bold mb-2 tracking-wide uppercase">
                         <Brain className="w-3 h-3" /> <span>98% Match Score</span>
                     </div>
                     <h3 className="text-xl font-bold text-[var(--app-text)] flex items-center mt-1">
                         <Building2 className="w-5 h-5 mr-2 text-[var(--app-muted)]" />
                         Central City General Hospital
                     </h3>
                     <p className="text-sm text-[var(--app-muted)] mt-1 flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-[var(--app-teal)]" /> 2.4 miles away (Est. 8 min via EMS)
                     </p>
                  </div>
                  <div className="text-right">
                      <div className="text-2xl font-bold text-[var(--app-teal)]">4</div>
                      <div className="text-xs text-[var(--app-muted)]">ICU Beds Free</div>
                  </div>
               </div>
               <div className="mt-4 pt-4 border-t border-purple-200 flex space-x-3">
                  <button className="flex-1 py-2 bg-[var(--app-blue)] text-white text-sm font-medium rounded hover:bg-blue-600">Dispatch Request</button>
                  <button className="flex-1 py-2 bg-white border border-[var(--app-border)] text-[var(--app-text)] text-sm font-medium rounded hover:bg-gray-50">View Details</button>
               </div>
            </div>

            {/* List and Map */}
            <div className="flex-1 grid grid-cols-2 gap-6 min-h-[300px]">
               {/* List */}
               <div className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-xl overflow-y-auto">
                   <div className="p-4 border-b border-[var(--app-border)] bg-gray-50">
                      <h4 className="font-semibold text-[var(--app-text)] text-sm">Alternative Matches</h4>
                   </div>
                   <div className="divide-y divide-[var(--app-border)]">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                           <div className="flex justify-between items-center mb-1">
                              <div className="font-medium text-[var(--app-text)] text-sm">Northside Medical Center {i}</div>
                              <div className="text-xs font-bold text-[var(--app-blue)]">{90 - (i*5)}%</div>
                           </div>
                           <div className="text-xs text-[var(--app-muted)]">3.1 miles • 1 ICU bed available</div>
                        </div>
                      ))}
                   </div>
               </div>
               {/* Map */}
               <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl relative overflow-hidden flex items-center justify-center bg-blue-50/50">
                   <div className="absolute inset-0 bg-blue-50/20"></div>
                   <span className="z-10 text-[var(--app-muted)]">[Mini Map Placeholder]</span>
               </div>
            </div>
        </div>

      </div>
    </div>
  );
}
