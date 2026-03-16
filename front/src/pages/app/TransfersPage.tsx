import { ArrowRight, UserPlus, Clock, CheckCircle } from 'lucide-react';

export default function TransfersPage() {
  const columns = [
    { id: 'requested', title: 'Requested', icon: UserPlus, color: 'text-blue-400' },
    { id: 'accepted', title: 'Accepted / Prep', icon: Clock, color: 'text-orange-400' },
    { id: 'transit', title: 'In Transit', icon: ArrowRight, color: 'text-yellow-400' },
    { id: 'completed', title: 'Completed', icon: CheckCircle, color: 'text-green-400' },
  ];

  return (
    <div className="h-full flex flex-col space-y-4">
       <div className="mb-2">
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Patient Transfer Pipeline</h1>
        <p className="text-[var(--app-muted)] mt-1">Manage and track inter-facility patient movements.</p>
      </div>

       <div className="flex-1 min-h-0 flex space-x-4 overflow-x-auto pb-4">
          {columns.map((col) => {
             const Icon = col.icon;
             return (
               <div key={col.id} className="flex-1 min-w-[280px] bg-gray-50/50 rounded-xl flex flex-col items-stretch max-w-sm border border-[var(--app-border)]">
                  {/* Column Header */}
                  <div className="p-3 border-b border-[var(--app-border)] flex items-center justify-between sticky top-0 bg-gray-50/90 backdrop-blur-sm z-10 rounded-t-xl">
                     <div className="flex items-center font-semibold text-[var(--app-text)]">
                        <Icon className={`w-4 h-4 mr-2 ${col.color}`} />
                        {col.title}
                     </div>
                     <span className="bg-white border border-[var(--app-border)] px-2 py-0.5 rounded text-xs font-bold text-[var(--app-muted)] shadow-sm">
                        {col.id === 'transit' ? 3 : 2}
                     </span>
                  </div>
                  
                  {/* Cards */}
                  <div className="p-3 space-y-3 overflow-y-auto flex-1 h-0">
                     {[1, 2].map((i) => (
                        <div key={i} className="bg-[var(--app-card)] border border-[var(--app-border)] p-4 rounded-lg shadow-sm hover:border-[var(--app-blue)] cursor-pointer transition-colors group">
                           <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-bold text-[var(--app-muted)]">ID: #TR-90{i}</span>
                              <span className={`w-2 h-2 rounded-full ${i===1?'bg-[var(--app-red)]':'bg-[var(--app-teal)]'}`}></span>
                           </div>
                           <h4 className="font-semibold text-[var(--app-text)] text-sm mb-1">Patient {col.id}-{i}</h4>
                           <div className="text-xs text-[var(--app-muted)] mt-3 pt-3 border-t border-[var(--app-border)]">
                              <div className="flex justify-between mt-1">
                                 <span>From: General</span>
                                 <CategoryBadge colId={col.id} />
                              </div>
                              <div className="flex justify-between mt-1">
                                 <span>To: Central Med</span>
                              </div>
                           </div>
                        </div>
                     ))}
                     {col.id === 'transit' && (
                         <div className="bg-[var(--app-card)] border border-[var(--app-blue)] p-4 rounded-lg shadow-sm shadow-[var(--app-blue)]/5 cursor-pointer group">
                           <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-bold text-[var(--app-blue)]">ETA: 6 mins</span>
                              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                           </div>
                           <h4 className="font-semibold text-[var(--app-text)] text-sm mb-1">Patient transit-3</h4>
                           <div className="text-xs text-[var(--app-muted)] mt-3 pt-3 border-t border-[var(--app-border)]">
                               Ambulance AMB-104 en route to South Wing.
                           </div>
                        </div>
                     )}
                  </div>
               </div>
             )
          })}
       </div>
    </div>
  );
}

function CategoryBadge({ colId }: { colId: string }) {
    if (colId === 'completed') return null;
    return <span className="text-[var(--app-purple)] font-medium">Auto-matched</span>;
}
