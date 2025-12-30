import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Lock } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const Signup = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { signup } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const password = watch('password');

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await signup(data.fullName, data.email, data.password);
            addToast('Account created successfully! Redirecting to login...', 'success');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            addToast(error.response?.data?.message || 'Signup failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-card">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join us and start your journey</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        icon={User}
                        error={errors.fullName?.message}
                        {...register('fullName', {
                            required: 'Full name is required',
                            minLength: { value: 3, message: 'Name must be at least 3 characters' }
                        })}
                    />

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
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 8, message: 'Password must be at least 8 characters' },
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*[0-9])/,
                                message: 'Must contain 1 uppercase and 1 number'
                            }
                        })}
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        icon={Lock}
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: value => value === password || "Passwords do not match"
                        })}
                    />

                    <Button type="submit" disabled={isLoading} style={{ width: '100%' }}>
                        {isLoading ? <Spinner size={20} /> : 'Sign Up'}
                    </Button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Log in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
