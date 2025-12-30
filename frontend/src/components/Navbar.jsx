import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="glass-nav">
            <div className="nav-brand">
                {user.role === 'admin' ? (
                    <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', textDecoration: 'none' }}>
                        <Shield size={24} className="text-primary" />
                        <span>Admin Portal</span>
                    </Link>
                ) : (
                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', textDecoration: 'none' }}>
                        <LayoutDashboard size={24} className="text-primary" />
                        <span>Dashboard</span>
                    </Link>
                )}
            </div>

            <div className="nav-profile">
                <div className="user-info" style={{ textAlign: 'right', marginRight: '1rem', display: 'none', '@media (min-width: 768px)': { display: 'block' } }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{user.role}</div>
                </div>

                <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`} title="Profile">
                    <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '1rem', cursor: 'pointer' }}>
                        {user.fullName?.charAt(0)}
                    </div>
                </Link>

                <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }}></div>

                <button onClick={handleLogout} className="btn-icon" title="Logout">
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
