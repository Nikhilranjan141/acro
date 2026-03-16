import { useState } from 'react';
import { Siren } from 'lucide-react';

export default function SOSButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const confirmSOS = () => {
    setIsOpen(false);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[var(--app-red)] text-white shadow-lg shadow-[var(--app-red)]/30 hover:scale-110 hover:shadow-xl hover:shadow-[var(--app-red)]/40 transition-all active:scale-95 ring-4 ring-white/50"
        title="Emergency SOS"
      >
        <Siren className="w-8 h-8 animate-pulse" />
      </button>

      {/* SOS Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl w-full max-w-sm p-6 shadow-2xl scale-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--app-red)]/10 text-[var(--app-red)] mx-auto mb-4">
               <Siren className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-center text-[var(--app-text)] mb-2">Trigger SOS?</h3>
            <p className="text-[var(--app-muted)] text-center text-sm mb-6">
              This will immediately alert nearby hospitals and request an emergency ventilator or ambulance transfer.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 rounded-lg border border-[var(--app-border)] text-[var(--app-text)] hover:bg-[var(--app-sidebar)] font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSOS}
                className="flex-1 py-2 rounded-lg bg-[var(--app-red)] text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-[var(--app-red)]/20"
              >
                Confirm SOS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastVisible && (
        <div className="fixed bottom-24 right-6 z-50 bg-[var(--app-card)] border border-[var(--app-red)] text-[var(--app-text)] px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-4">
            <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--app-red)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--app-red)]"></span>
            </span>
            <span className="font-medium text-sm">Emergency protocols activated. Help is dispatched.</span>
        </div>
      )}
    </>
  );
}
