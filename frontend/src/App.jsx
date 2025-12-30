import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h1>Welcome, {user?.fullName}!</h1>
      <p>Role: {user?.role}</p>
      <button onClick={logout} className="btn-primary" style={{ width: 'auto', marginTop: '1rem' }}>Logout</button>
    </div>
  );
};

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to their appropriate dashboard if they try to access wrong one
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

        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
