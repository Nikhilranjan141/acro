import { Map, TrendingUp, Sparkles } from 'lucide-react';

export default function InsightsPage() {
  return (
    <div className="space-y-6">
       <div className="mb-4">
        <h1 className="text-2xl font-bold text-[var(--app-text)] flex items-center">
          <Map className="w-6 h-6 mr-3 text-[var(--app-purple)]" />
          Health Map & AI Insights
        </h1>
        <p className="text-[var(--app-muted)] mt-1">Geospatial overview and predictive analytics for capacity planning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Area */}
        <div className="lg:col-span-2 bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-xl p-5 h-[600px] flex flex-col relative">
           <h2 className="text-lg font-semibold text-[var(--app-text)] mb-4">Regional Capacity Heatmap</h2>
           
           <div className="flex-1 rounded border border-[var(--app-border)] relative overflow-hidden flex items-center justify-center bg-gray-50/50">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50/30"></div>
              {/* Mock Heatmap Blobs */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-400/30 rounded-full blur-[40px]"></div>
              <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-[var(--app-red)]/30 rounded-full blur-[50px]"></div>
              <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-[var(--app-teal)]/20 rounded-full blur-[40px]"></div>
              
              <span className="z-10 text-[var(--app-muted)] bg-white/80 px-4 py-2 rounded-lg backdrop-blur-sm border border-[var(--app-border)] shadow-sm">
                 [Interactive Heatmap UI]
              </span>
           </div>
        </div>

        {/* AI Predictions */}
        <div className="space-y-6">
           <div className="bg-purple-50/50 border border-[var(--app-border)] border-t-2 border-t-[var(--app-purple)] rounded-xl p-5 shadow-sm">
              <h2 className="text-md font-bold text-[var(--app-text)] mb-4 flex items-center">
                 <Sparkles className="w-5 h-5 text-[var(--app-purple)] mr-2" /> Predictive Forecast
              </h2>
              <div className="space-y-4">
                 <div className="p-3 bg-white rounded border border-[var(--app-border)] shadow-sm">
                    <h4 className="text-sm font-semibold text-[var(--app-text)] flex items-center mb-1">
                        <TrendingUp className="w-4 h-4 text-orange-500 mr-2" /> Surge Warning
                    </h4>
                    <p className="text-xs text-[var(--app-muted)]">AI models predict a 15% increase in ER visits in the North District over the next 12 hours based on historical weather patterns.</p>
                 </div>
                 <div className="p-3 bg-white rounded border border-[var(--app-border)] shadow-sm">
                    <h4 className="text-sm font-semibold text-[var(--app-text)] flex items-center mb-1">
                        <TrendingUp className="w-4 h-4 text-[var(--app-teal)] mr-2" /> Bed Availability
                    </h4>
                    <p className="text-xs text-[var(--app-muted)]">Expected discharge of 12 patients in City General by 5 PM will stabilize current Level 2 alerts.</p>
                 </div>
              </div>
           </div>

           <div className="bg-[var(--app-card)] shadow-sm border border-[var(--app-border)] rounded-xl p-5 h-[270px] flex flex-col">
              <h2 className="text-md font-bold text-[var(--app-text)] mb-4">7-Day Forecast Trend</h2>
              <div className="flex-1 rounded border border-[var(--app-border)] border-dashed bg-gray-50 flex items-center justify-center text-[var(--app-muted)] text-sm">
                 [Forecast Chart]
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
