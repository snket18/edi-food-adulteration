import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TestNew from './pages/TestNew';
import TestCapture from './pages/TestCapture';
import TestProcessing from './pages/TestProcessing';
import TestResult from './pages/TestResult';
import History from './pages/History';
import HistoryDetail from './pages/HistoryDetail';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Monitoring from './pages/Monitoring';
import Analytics from './pages/Analytics';
import Map from './pages/Map';
import AdminTests from './pages/AdminTests';
import AdminTestDetail from './pages/AdminTestDetail';
import Reports from './pages/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Authenticated Routes with MainLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Consumer/Vendor/Any Authenticated User Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/test" element={<TestNew />} />
              <Route path="/test/capture" element={<TestCapture />} />
              <Route path="/test/processing" element={<TestProcessing />} />
              <Route path="/test/result" element={<TestResult />} />
              <Route path="/history" element={<History />} />
              <Route path="/history/:id" element={<HistoryDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Inspector/Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['INSPECTOR', 'ADMIN']} />}>
                <Route path="/monitoring" element={<Monitoring />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/map" element={<Map />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/tests" element={<AdminTests />} />
                <Route path="/tests/:id" element={<AdminTestDetail />} />
              </Route>
            </Route>
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
