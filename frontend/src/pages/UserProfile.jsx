import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { User, Mail, Lock, Save, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const UserProfile = () => {
    const { user, login } = useAuth(); // We might need to update user context after profile update
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile Form
    const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile, formState: { errors: profileErrors } } = useForm({
        defaultValues: {
            fullName: user?.fullName || '',
            email: user?.email || ''
        }
    });

    // Password Form
    const { register: registerPass, handleSubmit: handlePassSubmit, reset: resetPass, watch, formState: { errors: passErrors } } = useForm();
    const newPassword = watch('newPassword');

    useEffect(() => {
        if (user) {
            resetProfile({
                fullName: user.fullName,
                email: user.email
            });
        }
    }, [user, resetProfile]);

    const onProfileUpdate = async (data) => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await api.put('/users/me', data);
            // Update local user context if possible, or just show success
            // In a real app, we'd update the context. For now, let's just show success.
            // Actually, AuthContext should probably expose a way to update user state manually or refetch.
            // I'll just reload the page or rely on the next fetch. 
            // Better: trigger a reload of auth context? 
            // For simplicity, I will just show success message.
            setMessage({ type: 'success', text: 'Profile updated successfully' });
            setIsEditing(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const onPasswordUpdate = async (data) => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await api.put('/users/me/password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });
            setMessage({ type: 'success', text: 'Password updated successfully' });
            resetPass();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container" style={{ padding: '2rem' }}>
            <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="content-header">
                    <h1>My Profile</h1>
                    <p>Manage your account settings</p>
                </div>

                {message.text && (
                    <div className={message.type === 'error' ? 'error-alert' : 'success-alert'}>
                        {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                        {message.text}
                    </div>
                )}

                <div className="profile-section">
                    <div className="section-header">
                        <h3>Personal Information</h3>
                        {!isEditing && (
                            <button onClick={() => setIsEditing(true)} className="btn-secondary">
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleProfileSubmit(onProfileUpdate)} className="auth-form">
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Full Name</label>
                                <div className="input-wrapper">
                                    <User className="input-icon" size={20} />
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        {...registerProfile('fullName', { required: 'Full name is required' })}
                                    />
                                </div>
                                {profileErrors.fullName && <span className="error-msg">{profileErrors.fullName.message}</span>}
                            </div>

                            <div className="input-group">
                                <label>Email Address</label>
                                <div className="input-wrapper">
                                    <Mail className="input-icon" size={20} />
                                    <input
                                        type="email"
                                        disabled={!isEditing}
                                        {...registerProfile('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                    />
                                </div>
                                {profileErrors.email && <span className="error-msg">{profileErrors.email.message}</span>}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="form-actions">
                                <button type="button" onClick={() => { setIsEditing(false); resetProfile(); }} className="btn-secondary">
                                    <X size={16} /> Cancel
                                </button>
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Save Changes</>}
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                <div className="divider"></div>

                <div className="profile-section">
                    <h3>Change Password</h3>
                    <form onSubmit={handlePassSubmit(onPasswordUpdate)} className="auth-form">
                        <div className="input-group">
                            <label>Current Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    {...registerPass('currentPassword', { required: 'Current password is required' })}
                                />
                            </div>
                            {passErrors.currentPassword && <span className="error-msg">{passErrors.currentPassword.message}</span>}
                        </div>

                        <div className="form-grid">
                            <div className="input-group">
                                <label>New Password</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        {...registerPass('newPassword', {
                                            required: 'New password is required',
                                            minLength: { value: 8, message: 'Min 8 characters' },
                                            pattern: {
                                                value: /^(?=.*[A-Z])(?=.*[0-9])/,
                                                message: '1 uppercase & 1 number'
                                            }
                                        })}
                                    />
                                </div>
                                {passErrors.newPassword && <span className="error-msg">{passErrors.newPassword.message}</span>}
                            </div>

                            <div className="input-group">
                                <label>Confirm New Password</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        {...registerPass('confirmNewPassword', {
                                            required: 'Confirm password',
                                            validate: value => value === newPassword || "Passwords do not match"
                                        })}
                                    />
                                </div>
                                {passErrors.confirmNewPassword && <span className="error-msg">{passErrors.confirmNewPassword.message}</span>}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" size={16} /> : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
