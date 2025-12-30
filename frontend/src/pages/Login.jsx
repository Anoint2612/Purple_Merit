import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
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

    return (
        <div className="auth-container">
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
        </div>
    );
};

export default Login;
