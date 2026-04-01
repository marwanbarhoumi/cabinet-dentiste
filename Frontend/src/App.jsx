import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminAppointments from './pages/admin/Appointments';
import AdminPatients from './pages/admin/Patients';

// Client Pages
import ClientHome from './pages/client/Home';
import BookAppointment from './pages/client/BookAppointment';
import MyAppointments from './pages/client/MyAppointments';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin' : '/client'} />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/client" />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/appointments" element={<ProtectedRoute role="admin"><AdminAppointments /></ProtectedRoute>} />
      <Route path="/admin/patients" element={<ProtectedRoute role="admin"><AdminPatients /></ProtectedRoute>} />

      {/* Client Routes */}
      <Route path="/client" element={<ProtectedRoute role="client"><ClientHome /></ProtectedRoute>} />
      <Route path="/client/book" element={<ProtectedRoute role="client"><BookAppointment /></ProtectedRoute>} />
      <Route path="/client/appointments" element={<ProtectedRoute role="client"><MyAppointments /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}