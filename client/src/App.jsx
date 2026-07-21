import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFound from './pages/NotFound';

const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminScanner = lazy(() => import('./pages/AdminScanner'));
const VerifyBadge = lazy(() => import('./pages/VerifyBadge'));

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<AdminFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify/:token" element={<VerifyBadge />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/scanner"
          element={
            <ProtectedRoute>
              <AdminScanner />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
