import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import type { User } from '../../services/UserService';
import { X, Edit2, Mail, Shield, Activity, User as UserIcon, Phone, MapPin, Settings } from 'lucide-react';
import './UserDetailsModal.css';

interface EditUserModalProps {
    user: User;
    onClose: () => void;
    allowedRoles?: string[];
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, allowedRoles }) => {
    const { updateUser, isUpdating } = useUsers();

    const [email, setEmail] = useState(user.email);
    const [role, setRole] = useState(user.role);
    const [status, setStatus] = useState(user.status || 'active');
    const [name, setName] = useState(user.name || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [address, setAddress] = useState(user.address || '');
    const [preferences, setPreferences] = useState(user.preferences || '');
    const [city, setCity] = useState(user.artist_profile?.city || '');
    const [bio, setBio] = useState(user.artist_profile?.bio || '');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await updateUser({
                id: user.id,
                data: {
                    email,
                    role,
                    status,
                    name,
                    phone,
                    address,
                    preferences,
                    ...(role === 'artist' ? { artist_profile_attributes: { id: user.artist_profile?.id, city, bio } as any } : {})
                }
            });
            onClose(); // Close modal on success
        } catch (err: any) {
            setError(err.message || 'Failed to update user');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="admin-modal-container add-user-modal" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <h3><Edit2 size={18} style={{ marginRight: '8px', verticalAlign: 'middle', display: 'inline' }} /> Edit User</h3>
                    <button className="close-btn" onClick={onClose}><X size={18} /></button>
                </div>

                <form onSubmit={handleSubmit} className="add-user-form">
                    <div className="admin-modal-body">
                        {error && <div className="error-message" style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.85rem' }}>{error}</div>}

                        <div className="form-group">
                            <label>Name</label>
                            <div className="input-with-icon">
                                <UserIcon size={16} className="input-icon" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter full name"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email Address <span className="required">*</span></label>
                            <div className="input-with-icon">
                                <Mail size={16} className="input-icon" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <div className="input-with-icon">
                                <Phone size={16} className="input-icon" />
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <div className="input-with-icon">
                                <MapPin size={16} className="input-icon" />
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter address"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Role <span className="required">*</span></label>
                            <div className="input-with-icon">
                                <Shield size={16} className="input-icon" />
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    disabled={allowedRoles?.length === 1}
                                    style={allowedRoles?.length === 1 ? { appearance: 'none', background: 'rgba(255, 255, 255, 0.03)', cursor: 'not-allowed', backgroundImage: 'none', paddingRight: '14px' } : undefined}
                                >
                                    {(!allowedRoles || allowedRoles.includes('admin')) && <option value="admin">Admin</option>}
                                    {(!allowedRoles || allowedRoles.includes('customer')) && <option value="customer">Customer</option>}
                                    {(!allowedRoles || allowedRoles.includes('artist')) && <option value="artist">Artist</option>}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Status <span className="required">*</span></label>
                            <div className="input-with-icon">
                                <Activity size={16} className="input-icon" />
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}

                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {role === 'customer' && (
                            <>
                                <div className="form-group">
                                    <label>Preferences</label>
                                    <div className="input-with-icon" style={{ height: 'auto' }}>
                                        <Settings size={16} className="input-icon" style={{ top: '16px', transform: 'none' }} />
                                        <textarea
                                            value={preferences}
                                            onChange={(e) => setPreferences(e.target.value)}
                                            placeholder="Enter customer preferences"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

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
                                        <UserIcon size={15} className="input-icon" style={{ top: '16px', transform: 'none' }} />
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            placeholder="Enter short professional bio"
                                            rows={3}
                                            style={{ paddingTop: '10px' }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                    </div>

                    <div className="admin-modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={isUpdating}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={isUpdating} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {isUpdating ? <span className="spinner-small" /> : <Edit2 size={16} />}
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
