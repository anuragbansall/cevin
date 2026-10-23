import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { Spinner } from './components/Spinner.jsx';

const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const TasksPage = lazy(() => import('./pages/TasksPage.jsx'));
const ReposPage = lazy(() => import('./pages/ReposPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));
const GithubInstallPage = lazy(() => import('./pages/GithubInstallPage.jsx'));

function PageLoader() {
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <Spinner size={22} className="text-[var(--color-brand-400)]" />
    </div>
  );
}

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Landing — no navbar */}
          <Route path="/" element={<LandingPage />} />

          {/* GitHub install callback */}
          <Route path="/github/install" element={<GithubInstallPage />} />

          {/* App pages — with navbar */}
          <Route
            path="/dashboard"
            element={<AppLayout><DashboardPage /></AppLayout>}
          />
          <Route
            path="/tasks"
            element={<AppLayout><TasksPage /></AppLayout>}
          />
          <Route
            path="/repos"
            element={<AppLayout><ReposPage /></AppLayout>}
          />
          <Route
            path="/settings"
            element={<AppLayout><SettingsPage /></AppLayout>}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
