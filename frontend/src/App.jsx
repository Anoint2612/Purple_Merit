import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import UserDashboard from './pages/UserDashboard';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} />;
  }

  return children;
};

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={
            <PrivateRoute requiredRole="user">
              <UserDashboard />
            </PrivateRoute>
          } />

          {/* Admin Dashboard */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute requiredRole="admin">
              <AdminDashboard />
            </PrivateRoute>
          } />

          {/* Profile Page - Accessible by both */}
          <Route path="/profile" element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          } />

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
