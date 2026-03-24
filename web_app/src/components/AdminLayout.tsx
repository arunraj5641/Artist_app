import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Settings,
    Calendar,
    LogOut,
    Star,
    Layers,
    Brush,
    ChevronLeft,
    Moon,
    Sun,
    Shield
} from 'lucide-react';
import { AuthService } from '../services/AuthService';
import './AdminLayout.css';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const user = AuthService.getCurrentUser();

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    const adminNavItems = [
        { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/' },
        { icon: <Users size={18} />, label: 'Users', path: '/users' },
        { icon: <Brush size={18} />, label: 'Artists', path: '/artists' },
        { icon: <Shield size={18} />, label: 'Admins', path: '/admins' },
        { icon: <Layers size={18} />, label: 'Services', path: '/services' },
        { icon: <Calendar size={18} />, label: 'Bookings', path: '/bookings' },
        { icon: <Star size={18} />, label: 'Reviews', path: '/reviews' },
        { icon: <Settings size={18} />, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ChevronLeft size={16} /> Back
                    </button>
                    <h2>Admin Panel</h2>
                </div>

                <div className="admin-sidebar-profile">
                    <div className="profile-info">
                        <div className="avatar">{user?.email?.charAt(0).toUpperCase() || 'A'}</div>
                        <div className="email-wrap">
                            <span className="email">{user?.email || 'admin@admin.com'}</span>
                        </div>
                        <Settings size={16} className="settings-icon" />
                    </div>
                </div>

                <nav className="admin-nav">
                    {adminNavItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-topbar">
                    <div className="topbar-left">
                        <span className="breadcrumb">Admin / Users</span>
                    </div>
                    <div className="topbar-right">
                        <button className="theme-toggle">
                            <Sun size={18} />
                        </button>
                        <div className="topbar-profile">
                            <div className="avatar-small">
                                {user?.email?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <span>{user?.email || 'admin@admin.com'}</span>
                        </div>
                    </div>
                </header>

                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
