import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppShell from './app-shell/AppShell';
import DashboardPage from './pages/app/DashboardPage';
import FinderPage from './pages/app/FinderPage';
import ResourcesPage from './pages/app/ResourcesPage';
import TransfersPage from './pages/app/TransfersPage';
import InsightsPage from './pages/app/InsightsPage';
import SettingsPage from './pages/app/SettingsPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Protected App Routes */}
        <Route path="/app" element={<AppShell />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="finder" element={<FinderPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="transfers" element={<TransfersPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
