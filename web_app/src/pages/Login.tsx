import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Palette, Mail, Lock, AlertCircle, ArrowRight, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { AuthService } from '../services/AuthService';
import Button from '../components/Button';
import './Login.css';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<'artist' | 'customer'>('artist');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await AuthService.login({ email, password });
            if (response.success) {
                const userData = response.data;

                // Enforce role consistency
                if (userData.role !== role && userData.role !== 'admin') {
                    AuthService.logout();
                    setError(`This account is registered as a ${userData.role}. Please select the correct tab.`);
                    setLoading(false);
                    return;
                }

                // Force a hard redirect so that `App.tsx` completely re-evaluates `AuthService.getCurrentUser()`
                // and correctly re-renders the appropriate layouts (AdminLayout vs custom Layout).
                window.location.href = '/';
            } else {
                setError(response.message || 'Invalid credentials');
            }
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'Connection lost. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-visual">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="visual-content"
                >
                    <div className="visual-circle primary" />
                    <div className="visual-circle secondary" />
                    <div className="visual-text">
                        <h2 className="text-gradient">Bring your creativity to life.</h2>
                        <p>The ultimate platform for professional artists to manage their craft and grow their audience.</p>
                    </div>
                </motion.div>
            </div>

            <div className="login-form-side">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="login-card glass"
                >
                    <div className="form-header">
                        <Palette className="form-logo" size={40} />
                        <h1>Welcome Back</h1>
                        <p>Please enter your details to sign in</p>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        {error && (
                            <div className="error-message">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="role-selection">
                            <button
                                type="button"
                                className={`role-tab ${role === 'artist' ? 'active' : ''}`}
                                onClick={() => setRole('artist')}
                            >
                                <Palette size={16} />
                                <span>Artist</span>
                            </button>
                            <button
                                type="button"
                                className={`role-tab ${role === 'customer' ? 'active' : ''}`}
                                onClick={() => setRole('customer')}
                            >
                                <UserIcon size={16} />
                                <span>Client</span>
                            </button>
                        </div>

                        <div className="input-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="label-row">
                                <label>Password</label>
                                <Link to="/forgot-password">Forgot password?</Link>
                            </div>
                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <Button size="lg" isLoading={loading} className="w-full">
                            Sign In <ArrowRight size={18} />
                        </Button>

                        <p className="signup-prompt">
                            Don't have an account? <Link to="/signup">Create one for free</Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
