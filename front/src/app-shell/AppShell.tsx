import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuthStore } from '../state/auth';
import '../styles/theme.css'; // Load CSS variables

export default function AppShell() {
  const isAuthed = useAuthStore((state) => state.isAuthed);

  if (!isAuthed) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="theme-app-light min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] font-sans flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[var(--app-bg)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
