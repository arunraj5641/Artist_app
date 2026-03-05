import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { X, UserPlus, Mail, Lock, User as UserIcon, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import './UserDetailsModal.css';

interface AddUserModalProps {
    role: 'admin' | 'customer' | 'artist';
    onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ role, onClose }) => {
    const { createUser, isCreating } = useUsers();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [city, setCity] = useState('');
    const [bio, setBio] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            await createUser({
                name: name || undefined,
                email,
                phone: phone || undefined,
                address: address || undefined,
                password,
                password_confirmation: passwordConfirmation,
                role,
                ...(role === 'artist' ? { artist_profile_attributes: { city, bio } } : {})
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to create user');
        }
    };

    const getRoleTitle = () => {
        switch (role) {
            case 'admin': return 'Add Administrator';
            case 'artist': return 'Add Artist';
            default: return 'Add Customer';
        }
    };

    const getRoleColor = () => {
        switch (role) {
            case 'admin': return '#ef4444';
            case 'artist': return '#ec4899';
            default: return '#10b981';
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="admin-modal-container add-user-modal" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="admin-modal-header">
                    <h3>
                        <span style={{
                            width: 30, height: 30, borderRadius: 8,
                            background: `${getRoleColor()}20`,
                            border: `1px solid ${getRoleColor()}40`,
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            color: getRoleColor(), flexShrink: 0
                        }}>
                            <UserPlus size={15} />
                        </span>
                        {getRoleTitle()}
                    </h3>
                    <button className="close-btn" onClick={onClose}><X size={16} /></button>
                </div>

                <form onSubmit={handleSubmit} className="add-user-form">
                    <div className="admin-modal-body">

                        {/* Error Banner */}
                        {error && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                color: '#fca5a5',
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.25)',
                                padding: '10px 14px', borderRadius: 10, fontSize: '0.85rem'
                            }}>
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Name */}
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-with-icon">
                                <UserIcon size={15} className="input-icon" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter full name"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label>Email Address <span className="required">*</span></label>
                            <div className="input-with-icon">
                                <Mail size={15} className="input-icon" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={`enter_${role}_email@example.com`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="form-group">
                            <label>Phone Number</label>
                            <div className="input-with-icon">
                                <Phone size={15} className="input-icon" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="form-group">
                            <label>Address</label>
                            <div className="input-with-icon">
                                <MapPin size={15} className="input-icon" />
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter address"
                                />
                            </div>
                        </div>

                        {/* Password row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div className="form-group">
                                <label>Password <span className="required">*</span></label>
                                <div className="input-with-icon">
                                    <Lock size={15} className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min. 6 chars"
                                        required
                                        minLength={6}
                                        style={{ paddingRight: 38 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute', right: 10, background: 'none',
                                            border: 'none', color: '#64748b', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', padding: 4
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Confirm <span className="required">*</span></label>
                                <div className="input-with-icon">
                                    <Lock size={15} className="input-icon" />
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        placeholder="Re-enter"
                                        required
                                        minLength={6}
                                        style={{ paddingRight: 38 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        style={{
                                            position: 'absolute', right: 10, background: 'none',
                                            border: 'none', color: '#64748b', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', padding: 4
                                        }}
                                    >
                                        {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Artist Fields */}
                        {role === 'artist' && (
                            <>
                                <div className="form-group">
                                    <label>City</label>
                                    <div className="input-with-icon">
                                        <MapPin size={15} className="input-icon" />
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="Enter artist's city"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Professional Bio</label>
                                    <div className="input-with-icon" style={{ height: 'auto' }}>
                                        <UserPlus size={15} className="input-icon" style={{ top: '16px', transform: 'none' }} />
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            placeholder="Enter short professional bio"
                                            rows={2}
                                            style={{ paddingTop: '10px' }}
                                        />
                                    </div>
                                </div>
                                <div style={{
                                    fontSize: '0.8rem', color: '#94a3b8',
                                    background: 'rgba(255,255,255,0.03)',
                                    padding: '10px 14px', borderRadius: 10,
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    lineHeight: 1.5
                                }}>
                                    💡 The artist profile will be linked automatically.
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="admin-modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={isCreating}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={isCreating}>
                            {isCreating ? <span className="spinner-small" /> : <UserPlus size={15} />}
                            {isCreating ? 'Creating...' : `Create ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
