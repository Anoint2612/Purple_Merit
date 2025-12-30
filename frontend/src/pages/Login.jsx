import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, Info, Copy } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const Login = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { login } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const userData = await login(data.email, data.password);
            addToast('Login successful!', 'success');
            if (userData.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            addToast(error.response?.data?.message || 'Login failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fillDemoCreds = () => {
        setValue('email', 'admin@example.com');
        setValue('password', 'Password123');
        addToast('Demo credentials filled!', 'info');
    };

    return (
        <div className="auth-container">
            <div style={{ width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="glass-card">
                    <div className="auth-header">
                        <h2>Welcome Back</h2>
                        <p>Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="john@example.com"
                            icon={Mail}
                            error={errors.email?.message}
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            icon={Lock}
                            error={errors.password?.message}
                            {...register('password', { required: 'Password is required' })}
                        />

                        <Button type="submit" disabled={isLoading} style={{ width: '100%' }}>
                            {isLoading ? <Spinner size={20} /> : 'Sign In'}
                        </Button>
                    </form>

                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem', animationDelay: '0.1s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)' }}>
                            <Info size={18} className="text-primary" />
                            <span style={{ fontWeight: 600 }}>Demo Credentials</span>
                        </div>
                        <button
                            onClick={fillDemoCreds}
                            className="btn-secondary"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', height: 'auto' }}
                            title="Auto-fill credentials"
                        >
                            <Copy size={12} style={{ marginRight: '0.25rem' }} /> Auto-fill
                        </button>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Email:</span>
                            <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.875rem', color: '#818cf8' }}>
                                admin@example.com
                            </code>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Password:</span>
                            <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.875rem', color: '#818cf8' }}>
                                Password123
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
