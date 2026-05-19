import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import Plants from './pages/Plants';
import PlantDetail from './pages/PlantDetail';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';

function ProtectedLayout() {
  const { user, loading } = useAuth();
  const { open, toggle } = useSidebar();

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas-ice flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-valley-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-canvas-ice">
      <Sidebar />

      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-stone-moss bg-canvas-ice sticky top-0 z-10">
          <button
            onClick={toggle}
            className="p-1.5 rounded-lg hover:bg-stone-moss/50 transition-colors"
            aria-label="Abrir menú"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
            </svg>
          </button>
          <span className="text-[16px] font-bold text-adaline-ink">🌿 Plantia</span>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8 max-w-5xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function PublicRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/plants" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route path="/auth/callback" element={<AuthCallback />} />

            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Navigate to="/plants" replace />} />
              <Route path="/plants" element={<Plants />} />
              <Route path="/plants/:id" element={<PlantDetail />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </AuthProvider>
  );
}
