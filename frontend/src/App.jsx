import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import { useAuth } from './context/AuthContext';
import { User, LogOut } from 'lucide-react';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="dashboard-container">
      <nav className="glass-nav">
        <div className="nav-brand">
          <span>User Dashboard</span>
        </div>
        <div className="nav-profile">
          <a href="/profile" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} /> Profile
          </a>
          <button onClick={logout} className="btn-icon" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </nav>
      <div className="dashboard-content">
        <div className="glass-card">
          <h1>Welcome, {user?.fullName}!</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
            You are logged in as a <strong>{user?.role}</strong>.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <a href="/profile" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
              Go to Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  );
}

export default App;
