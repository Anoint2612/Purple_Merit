import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
    Users, CheckCircle, XCircle, ChevronLeft, ChevronRight,
    Search, Shield, ShieldAlert, LogOut
} from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState(null); // 'activate' or 'deactivate'

    const fetchUsers = async (pageNum) => {
        setLoading(true);
        try {
            const response = await api.get(`/admin/users?page=${pageNum}`);
            const { users, pagination } = response.data.data;
            setUsers(users);
            setTotalPages(pagination.pages);
            setPage(pagination.page);
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const handleActionClick = (user, type) => {
        setSelectedUser(user);
        setActionType(type);
        setModalOpen(true);
    };

    const confirmAction = async () => {
        if (!selectedUser || !actionType) return;

        try {
            const endpoint = `/admin/users/${selectedUser._id}/${actionType}`;
            await api.patch(endpoint);

            setSuccess(`User ${selectedUser.fullName} ${actionType}d successfully`);
            fetchUsers(page); // Refresh list

            // Clear success msg after 3s
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${actionType} user`);
            setTimeout(() => setError(''), 3000);
        } finally {
            setModalOpen(false);
            setSelectedUser(null);
            setActionType(null);
        }
    };

    return (
        <div className="dashboard-container">
            {/* Navbar */}
            <nav className="glass-nav">
                <div className="nav-brand">
                    <Shield size={24} className="text-primary" />
                    <span>Admin Portal</span>
                </div>
                <div className="nav-profile">
                    <span>{user?.fullName}</span>
                    <button onClick={logout} className="btn-icon" title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="content-header">
                    <h1>User Management</h1>
                    <p>Manage system access and user roles</p>
                </div>

                {error && <div className="error-alert">{error}</div>}
                {success && <div className="success-alert"><CheckCircle size={16} /> {success}</div>}

                <div className="glass-card table-container">
                    {loading ? (
                        <div className="loading-state">Loading users...</div>
                    ) : (
                        <>
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar">{u.fullName.charAt(0)}</div>
                                                    <div>
                                                        <div className="user-name">{u.fullName}</div>
                                                        <div className="user-email">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge badge-${u.role}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-dot ${u.status}`}></span>
                                                {u.status}
                                            </td>
                                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    {u.role !== 'admin' && (
                                                        <>
                                                            {u.status === 'active' ? (
                                                                <button
                                                                    onClick={() => handleActionClick(u, 'deactivate')}
                                                                    className="btn-action btn-danger"
                                                                    title="Deactivate User"
                                                                >
                                                                    <XCircle size={18} />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleActionClick(u, 'activate')}
                                                                    className="btn-action btn-success"
                                                                    title="Activate User"
                                                                >
                                                                    <CheckCircle size={18} />
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className="pagination">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="btn-page"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span>Page {page} of {totalPages}</span>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="btn-page"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={confirmAction}
                title={`Confirm ${actionType === 'activate' ? 'Activation' : 'Deactivation'}`}
                message={`Are you sure you want to ${actionType} ${selectedUser?.fullName}? This will ${actionType === 'deactivate' ? 'prevent them from logging in' : 'restore their access'}.`}
                type={actionType === 'deactivate' ? 'danger' : 'success'}
            />
        </div>
    );
};

export default AdminDashboard;
