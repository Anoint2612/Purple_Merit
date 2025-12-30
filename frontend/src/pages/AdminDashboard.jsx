import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
    Shield, CheckCircle, XCircle, LogOut, AlertTriangle
} from 'lucide-react';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const { addToast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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
            addToast('Failed to fetch users', 'error');
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

            addToast(`User ${selectedUser.fullName} ${actionType}d successfully`, 'success');
            fetchUsers(page); // Refresh list
        } catch (err) {
            addToast(err.response?.data?.message || `Failed to ${actionType} user`, 'error');
        } finally {
            setModalOpen(false);
            setSelectedUser(null);
            setActionType(null);
        }
    };

    const modalFooter = (
        <>
            <Button onClick={() => setModalOpen(false)} variant="secondary">Cancel</Button>
            <Button
                onClick={confirmAction}
                variant={actionType === 'deactivate' ? 'danger' : 'success'}
            >
                Confirm
            </Button>
        </>
    );

    return (
        <div className="dashboard-container">
            {/* Navbar */}
            <nav className="glass-nav">
                <div className="nav-brand">
                    <Shield size={24} className="text-primary" />
                    <span>Admin Portal</span>
                </div>
                <div className="nav-profile">
                    <a href="/profile" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem' }}>
                        <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                            {user?.fullName?.charAt(0)}
                        </div>
                        <span>{user?.fullName}</span>
                    </a>
                    <Button onClick={logout} variant="icon" title="Logout">
                        <LogOut size={20} />
                    </Button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="content-header">
                    <h1>User Management</h1>
                    <p>Manage system access and user roles</p>
                </div>

                <div className="glass-card table-container">
                    {loading ? (
                        <div className="loading-state" style={{ padding: '2rem', textAlign: 'center' }}>
                            <Spinner size={32} />
                            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading users...</p>
                        </div>
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
                                                                    className="btn-action btn-success"
                                                                    title="Active (Click to Deactivate)"
                                                                >
                                                                    <CheckCircle size={18} />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleActionClick(u, 'activate')}
                                                                    className="btn-action btn-danger"
                                                                    title="Inactive (Click to Activate)"
                                                                >
                                                                    <XCircle size={18} />
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

                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </>
                    )}
                </div>
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={`Confirm ${actionType === 'activate' ? 'Activation' : 'Deactivation'}`}
                footer={modalFooter}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div className={`modal-icon ${actionType === 'deactivate' ? 'danger' : 'success'}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p>Are you sure you want to {actionType} <strong>{selectedUser?.fullName}</strong>?</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                            This will {actionType === 'deactivate' ? 'prevent them from logging in' : 'restore their access'}.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
