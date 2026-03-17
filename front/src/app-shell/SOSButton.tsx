import { useState } from 'react';
import { Siren, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { runtimeConfig } from '../lib/runtimeConfig';

interface SOSResponse {
  success: boolean;
  audit?: { id: string; message: string };
  error?: string;
}

// Default Indore coordinates and city bounds
const CITY_BOUNDS: Record<string, { markerLat: number; markerLng: number }> = {
  Indore: { markerLat: 22.7196, markerLng: 75.8577 },
  Bhopal: { markerLat: 23.2599, markerLng: 77.4126 },
  Ujjain: { markerLat: 23.1765, markerLng: 75.7885 },
};

export default function SOSButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState('');

  const confirmSOS = async () => {
    setIsLoading(true);
    const defaultCity = runtimeConfig.defaultCity || 'Indore';
    const coords = CITY_BOUNDS[defaultCity] || CITY_BOUNDS.Indore;
    
    // Add slight random offset to simulate patient location variation within city
    const lat = coords.markerLat + (Math.random() * 0.02 - 0.01);
    const lng = coords.markerLng + (Math.random() * 0.02 - 0.01);

    try {
      const response = await fetch(`${runtimeConfig.apiBaseUrl}/api/actions/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng }),
      });

      const data: SOSResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to trigger SOS');
      }

      setIsOpen(false);
      setToastType('success');
      setToastMessage(
        data.audit?.message || 'Emergency protocols activated. Help is dispatched.'
      );
    } catch (err) {
      setToastType('error');
      setToastMessage(
        err instanceof Error ? err.message : 'Failed to trigger SOS. Please try again.'
      );
    } finally {
      setIsLoading(false);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 4000);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isLoading}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[var(--app-red)] text-white shadow-lg shadow-[var(--app-red)]/30 hover:scale-110 hover:shadow-xl hover:shadow-[var(--app-red)]/40 transition-all active:scale-95 ring-4 ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Emergency SOS"
      >
        {isLoading ? (
          <Loader2 className="w-8 h-8 animate-spin" />
        ) : (
          <Siren className="w-8 h-8 animate-pulse" />
        )}
      </button>

      {/* SOS Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl w-full max-w-sm p-6 shadow-2xl scale-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--app-red)]/10 text-[var(--app-red)] mx-auto mb-4">
              <Siren className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-center text-[var(--app-text)] mb-2">
              Trigger Emergency SOS?
            </h3>
            <p className="text-[var(--app-muted)] text-center text-sm mb-6">
              This will immediately alert nearby hospitals and dispatch emergency resources to your location.
              All dispatch coordinators will be notified and ambulances will be routed to you.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="flex-1 py-2 rounded-lg border border-[var(--app-border)] text-[var(--app-text)] hover:bg-[var(--app-sidebar)] font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSOS}
                disabled={isLoading}
                className="flex-1 py-2 rounded-lg bg-[var(--app-red)] text-white font-bold hover:bg-red-600 active:bg-red-700 transition-colors shadow-lg shadow-[var(--app-red)]/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Activating...
                  </>
                ) : (
                  'CONFIRM SOS'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastVisible && (
        <div
          className={`fixed bottom-24 right-6 z-50 border text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-4 ${
            toastType === 'success'
              ? 'bg-green-600/95 border-green-500'
              : 'bg-red-600/95 border-red-500'
          }`}
        >
          {toastType === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}
    </>
  );
}
