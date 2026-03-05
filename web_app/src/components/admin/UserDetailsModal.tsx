import React from 'react';
import type { User } from '../../services/UserService';
import { X, Briefcase, ShoppingBag, Mail, Phone, MapPin, Calendar, Star } from 'lucide-react';
import './UserDetailsModal.css';

interface UserDetailsModalProps {
    user: User;
    onClose: () => void;
    onEdit?: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, onClose, onEdit }) => {

    // Simulate what the detail files fields look like for different roles
    const renderClientFields = () => (
        <div className="details-section">
            <h4 className="section-title"><ShoppingBag size={14} /> Customer Profile</h4>
            <div className="details-grid">
                <div className="detail-item">
                    <span className="label">Total Bookings</span>
                    <span className="value">12</span>
                </div>
                <div className="detail-item">
                    <span className="label">Total Spent</span>
                    <span className="value">$450.00</span>
                </div>
                <div className="detail-item">
                    <span className="label">Last Booking</span>
                    <span className="value">Oct 12, 2025</span>
                </div>
                <div className="detail-item">
                    <span className="label">Loyalty Status</span>
                    <span className={`value ${user.loyalty_status?.toLowerCase().includes('gold') ? 'gold' : ''}`}>{user.loyalty_status || 'Regular'}</span>
                </div>
                <div className="detail-item full-width">
                    <span className="label">Preferences</span>
                    <span className="value">{user.preferences || 'No dietary or style preferences recorded.'}</span>
                </div>
            </div>
        </div>
    );

    const renderArtistFields = () => (
        <div className="details-section">
            <h4 className="section-title"><Briefcase size={14} /> Artist Portfolio & Fields</h4>
            <div className="details-grid">
                <div className="detail-item">
                    <span className="label">Active Services</span>
                    <span className="value">5</span>
                </div>
                <div className="detail-item">
                    <span className="label">Total Earnings</span>
                    <span className="value">$3,200.00</span>
                </div>
                <div className="detail-item">
                    <span className="label">Avg Rating</span>
                    <span className="value flex-center gap-1"><Star size={12} fill="#f59e0b" color="#f59e0b" /> 4.8</span>
                </div>
                <div className="detail-item hide-on-mobile"></div>
                <div className="detail-item full-width">
                    <span className="label">Bio</span>
                    <span className="value">Professional makeup artist with 5+ years of experience in film and bridal shoots. Based out of NY but willing to travel.</span>
                </div>
                <div className="detail-item full-width">
                    <span className="label">Skills</span>
                    <span className="value tags">
                        <span className="tag">Airbrush</span>
                        <span className="tag">SFX</span>
                        <span className="tag">Bridal</span>
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <h3>User Details</h3>
                    <button className="close-btn" onClick={onClose}><X size={18} /></button>
                </div>

                <div className="admin-modal-body">
                    {/* Common Details */}
                    <div className="user-profile-header">
                        <div className="large-avatar">{(user.name || user.email).charAt(0).toUpperCase()}</div>
                        <div className="profile-titles">
                            <h2>{user.name || user.email.split('@')[0]}</h2>
                            <p className="id">ID: {user.id}</p>
                            <span className={`badge badge-${user.role}`}>{user.role}</span>
                        </div>
                    </div>

                    <div className="details-section">
                        <h4 className="section-title">General Information</h4>
                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="label"><Mail size={12} /> Email</span>
                                <span className="value truncate">{user.email}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label"><Phone size={12} /> Phone</span>
                                <span className="value">{user.phone || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label"><MapPin size={12} /> Address</span>
                                <span className="value truncate">{user.address || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label"><Calendar size={12} /> Member Since</span>
                                <span className="value">{new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Role Specific Fields */}
                    {user.role === 'customer' && renderClientFields()}
                    {user.role === 'artist' && renderArtistFields()}
                    {user.role === 'admin' && (
                        <div className="details-section">
                            <h4 className="section-title">Admin Access</h4>
                            <p className="description">This user has full administrative privileges over the application.</p>
                        </div>
                    )}
                </div>

                <div className="admin-modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Close</button>
                    {onEdit && <button className="btn-primary" onClick={onEdit}>Edit User</button>}
                </div>
            </div>
        </div>
    );
};

export default UserDetailsModal;
