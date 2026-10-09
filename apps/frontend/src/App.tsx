import { lazy, Suspense } from 'react';
import { Link, Outlet, Route, Routes } from 'react-router-dom';
import { AppHeader } from './components/layout/AppHeader';
import { LoadingComponent } from './components/Other';
import { WebsocketNotification } from './components/WebsocketNotification';
import './App.css';

const PlayerListPage = lazy(
  () => import('./pages/PlayerListPage/PlayerListPage'),
);
const PlayerTrendsPage = lazy(
  () => import('./pages/PlayerTrendsPage/PlayerTrendsPage'),
);
const PlayerDetailPage = lazy(
  () => import('./pages/PlayerDetailPage/PlayerDetailPage'),
);
const SettingsPage = lazy(() => import('./pages/SettingsPage/SettingsPage'));
const GetStartedPage = lazy(
  () => import('./pages/GetStartedPage/GetStartedPage'),
);

export default function App() {
  return (
    <>
      <WebsocketNotification />
      <Routes>
        <Route
          path="/"
          element={
            <div className="app-shell">
              <AppHeader />
              <main id="main-content" className="app-content" tabIndex={-1}>
                <Suspense fallback={<LoadingComponent />}>
                  <Outlet />
                </Suspense>
              </main>
            </div>
          }
        >
          <Route index element={<PlayerListPage />} />
          <Route path="players" element={<PlayerListPage />} />
          <Route path="players-trends" element={<PlayerTrendsPage />} />
          <Route path="players-detail" element={<PlayerDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="get-started" element={<GetStartedPage />} />
          <Route
            path="*"
            element={
              <div className="page-container">
                <h2>404 Not Found</h2>
                <Link to="/">FC Career Top</Link>
              </div>
            }
          />
        </Route>
      </Routes>
    </>
  );
}
