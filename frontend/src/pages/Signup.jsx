import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Loader2, CheckCircle } from 'lucide-react';

const Signup = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const password = watch('password');

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError('');
        try {
            // The requirement says "Redirect to login on success", but usually signup logs you in automatically.
            // However, I will follow the specific instruction: "Redirect to login on success".
            // Wait, my AuthContext.signup automatically logs the user in (sets token).
            // I should modify the flow or just redirect to dashboard if they are already logged in.
            // BUT the user explicitly asked: "Redirect to login on success".
            // This implies they might want email verification or just a manual login flow.
            // I will strictly follow "Redirect to login on success".

            // Actually, if I use my AuthContext.signup, it sets the token.
            // I'll assume "Redirect to login" means navigate('/login') even if they have a token, 
            // OR I can just show a success message and then navigate.
            // Let's stick to the user's request: "Redirect to login on success".

            await signup(data.fullName, data.email, data.password);
            setSuccessMessage('Account created successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setServerError(error.response?.data?.message || 'Signup failed');
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

                {serverError && <div className="error-alert">{serverError}</div>}
                {successMessage && <div className="success-alert"><CheckCircle size={16} /> {successMessage}</div>}

                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <div className="input-group">
                        <label>Full Name</label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={20} />
                            <input
                                type="text"
                                placeholder="John Doe"
                                {...register('fullName', {
                                    required: 'Full name is required',
                                    minLength: { value: 3, message: 'Name must be at least 3 characters' }
                                })}
                            />
                        </div>
                        {errors.fullName && <span className="error-msg">{errors.fullName.message}</span>}
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                placeholder="john@example.com"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                        </div>
                        {errors.email && <span className="error-msg">{errors.email.message}</span>}
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=.*[0-9])/,
                                        message: 'Must contain 1 uppercase and 1 number'
                                    }
                                })}
                            />
                        </div>
                        {errors.password && <span className="error-msg">{errors.password.message}</span>}
                    </div>

                    <div className="input-group">
                        <label>Confirm Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: value => value === password || "Passwords do not match"
                                })}
                            />
                        </div>
                        {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword.message}</span>}
                    </div>

                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Log in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
