import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import { User, Mail, Lock, Save, X } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const UserProfile = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile, formState: { errors: profileErrors } } = useForm({
        defaultValues: {
            fullName: user?.fullName || '',
            email: user?.email || ''
        }
    });

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
        try {
            await api.put('/users/me', data);
            addToast('Profile updated successfully', 'success');
            setIsEditing(false);
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const onPasswordUpdate = async (data) => {
        setLoading(true);
        try {
            await api.put('/users/me/password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });
            addToast('Password updated successfully', 'success');
            resetPass();
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to update password', 'error');
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

                <div className="profile-section">
                    <div className="section-header">
                        <h3>Personal Information</h3>
                        {!isEditing && (
                            <Button onClick={() => setIsEditing(true)} variant="secondary">
                                Edit Profile
                            </Button>
                        )}
                    </div>

                    <form onSubmit={handleProfileSubmit(onProfileUpdate)} className="auth-form">
                        <div className="form-grid">
                            <Input
                                label="Full Name"
                                icon={User}
                                disabled={!isEditing}
                                error={profileErrors.fullName?.message}
                                {...registerProfile('fullName', { required: 'Full name is required' })}
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                icon={Mail}
                                disabled={!isEditing}
                                error={profileErrors.email?.message}
                                {...registerProfile('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                        </div>

                        {isEditing && (
                            <div className="form-actions">
                                <Button
                                    type="button"
                                    onClick={() => { setIsEditing(false); resetProfile(); }}
                                    variant="secondary"
                                    icon={X}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading} icon={Save}>
                                    {loading ? <Spinner size={16} /> : 'Save Changes'}
                                </Button>
                            </div>
                        )}
                    </form>
                </div>

                <div className="divider"></div>

                <div className="profile-section">
                    <h3>Change Password</h3>
                    <form onSubmit={handlePassSubmit(onPasswordUpdate)} className="auth-form">
                        <Input
                            label="Current Password"
                            type="password"
                            placeholder="••••••••"
                            icon={Lock}
                            error={passErrors.currentPassword?.message}
                            {...registerPass('currentPassword', { required: 'Current password is required' })}
                        />

                        <div className="form-grid">
                            <Input
                                label="New Password"
                                type="password"
                                placeholder="••••••••"
                                icon={Lock}
                                error={passErrors.newPassword?.message}
                                {...registerPass('newPassword', {
                                    required: 'New password is required',
                                    minLength: { value: 8, message: 'Min 8 characters' },
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=.*[0-9])/,
                                        message: '1 uppercase & 1 number'
                                    }
                                })}
                            />

                            <Input
                                label="Confirm New Password"
                                type="password"
                                placeholder="••••••••"
                                icon={Lock}
                                error={passErrors.confirmNewPassword?.message}
                                {...registerPass('confirmNewPassword', {
                                    required: 'Confirm password',
                                    validate: value => value === newPassword || "Passwords do not match"
                                })}
                            />
                        </div>

                        <div className="form-actions">
                            <Button type="submit" disabled={loading}>
                                {loading ? <Spinner size={16} /> : 'Update Password'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
