import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';
import Button from '../components/common/Button';

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
                    <Button onClick={logout} variant="icon" title="Logout">
                        <LogOut size={20} />
                    </Button>
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

export default UserDashboard;
