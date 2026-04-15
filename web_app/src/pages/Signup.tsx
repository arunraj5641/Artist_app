import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Palette, Mail, Lock, User, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { AuthService } from '../services/AuthService';
import Button from '../components/Button';
import './Login.css'; // Reuse login styles
import { motion } from 'framer-motion';

const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<'artist' | 'customer'>('artist');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await AuthService.signup({
                name,
                email,
                password,
                password_confirmation: confirmPassword,
                role: role
            });
            if (response.success) {
                navigate('/');
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err: any) {
            const message = err.response?.data?.errors?.join(', ') || err.message || 'Connection lost. Please try again.';
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
                    className="visual-content"
                >
                    <div className="visual-circle primary" />
                    <div className="visual-circle secondary" />
                    <div className="visual-text">
                        <h2 className="text-gradient">Join the community of creators.</h2>
                        <p>Start your journey today and showcase your talent to the world with ArtistApp.</p>
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
                        <h1>Create Account</h1>
                        <p>Join ArtistApp and start managing your craft</p>
                    </div>

                    <form onSubmit={handleSignup} className="login-form">
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
                                <Palette size={18} />
                                <span>I'm an Artist</span>
                            </button>
                            <button
                                type="button"
                                className={`role-tab ${role === 'customer' ? 'active' : ''}`}
                                onClick={() => setRole('customer')}
                            >
                                <ArrowRight size={18} />
                                <span>I'm a Client</span>
                            </button>
                        </div>

                        <div className="input-group">
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <User size={18} />
                                <input
                                    type="text"
                                    placeholder="Your display name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
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
                            <label>Password</label>
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

                        <div className="input-group">
                            <label>Confirm Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <Button size="lg" isLoading={loading} className="w-full">
                            Create Account <ArrowRight size={18} />
                        </Button>

                        <p className="signup-prompt">
                            Already have an account? <Link to="/login">Sign in instead</Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
