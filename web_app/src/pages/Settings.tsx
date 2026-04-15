import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Shield, Bell, Palette, ChevronRight } from 'lucide-react';
import { AuthService } from '../services/AuthService';
import './Settings.css';

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const user = AuthService.getCurrentUser();

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    const settingsSections = [
        {
            title: 'Account',
            items: [
                { icon: <User size={16} />, label: 'Profile', description: 'Manage your profile details', action: () => {} },
                { icon: <Mail size={16} />, label: 'Email', description: user?.email || 'No email set', action: () => {} },
            ]
        },
        {
            title: 'Preferences',
            items: [
                { icon: <Bell size={16} />, label: 'Notifications', description: 'Manage notification settings', action: () => {} },
                { icon: <Palette size={16} />, label: 'Appearance', description: 'Wisteria bloom theme', action: () => {} },
            ]
        },
        {
            title: 'Security',
            items: [
                { icon: <Shield size={16} />, label: 'Password', description: 'Change your password', action: () => {} },
            ]
        },
    ];

    return (
        <div className="settings-page">
            {/* Header */}
            <div className="settings-header">
                <div className="settings-header-icon">
                    <User size={18} />
                </div>
                <div>
                    <h1>Account Settings</h1>
                    <p>Manage your account preferences and security</p>
                </div>
            </div>

            {/* Profile Card */}
            <div className="settings-profile-card">
                <div className="settings-avatar">
                    {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="settings-profile-info">
                    <p className="settings-profile-email">{user?.name || user?.email || 'User'}</p>
                    <span className="settings-role-badge">{user?.role || 'user'}</span>
                </div>
            </div>

            {/* Settings Sections */}
            {settingsSections.map((section) => (
                <div key={section.title} className="settings-section">
                    <h2 className="settings-section-title">{section.title}</h2>
                    <div className="settings-items">
                        {section.items.map((item) => (
                            <button key={item.label} className="settings-item" onClick={item.action}>
                                <div className="settings-item-icon">{item.icon}</div>
                                <div className="settings-item-text">
                                    <span className="settings-item-label">{item.label}</span>
                                    <span className="settings-item-desc">{item.description}</span>
                                </div>
                                <ChevronRight size={16} className="settings-item-arrow" />
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            {/* Logout */}
            <div className="settings-section">
                <h2 className="settings-section-title">Session</h2>
                <div className="settings-items">
                    <button className="settings-item settings-item-danger" onClick={handleLogout}>
                        <div className="settings-item-icon settings-item-icon-danger">
                            <LogOut size={16} />
                        </div>
                        <div className="settings-item-text">
                            <span className="settings-item-label">Log Out</span>
                            <span className="settings-item-desc">Sign out of your account</span>
                        </div>
                        <ChevronRight size={16} className="settings-item-arrow" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
