import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Settings,
    Calendar,
    Star,
    Layers,
    Brush,
    ChevronLeft,
    ChevronRight,
    Sun,
    Shield,
    Palette
} from 'lucide-react';
import { AuthService } from '../services/AuthService';
import './AdminLayout.css';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(AuthService.getCurrentUser());
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        AuthService.refreshCurrentUser().then((updated) => {
            if (updated) setUser(updated);
        });
    }, []);

    // Settings removed from nav — accessed via profile footer
    const adminNavItems = [
        { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/' },
        { icon: <Users size={18} />, label: 'Users', path: '/users' },
        { icon: <Brush size={18} />, label: 'Artists', path: '/artists' },
        { icon: <Shield size={18} />, label: 'Admins', path: '/admins' },
        { icon: <Layers size={18} />, label: 'Services', path: '/services' },
        { icon: <Calendar size={18} />, label: 'Bookings', path: '/bookings' },
        { icon: <Star size={18} />, label: 'Reviews', path: '/reviews' },
    ];

    return (
        <div className={`admin-layout-full ${collapsed ? 'admin-sidebar-collapsed' : ''}`}>
            <header className="admin-topbar">
                <div className="topbar-logo-group">
                    <div className="admin-logo-row">
                        <div className="admin-logo-icon-box">
                            <Palette size={18} />
                        </div>
                        {!collapsed && <span className="admin-logo-text">Admin Panel</span>}
                    </div>
                </div>
                <div className="topbar-divider"></div>
                <span className="breadcrumb">Admin / Users</span>
                <div className="topbar-right">
                    <button className="theme-toggle">
                        <Sun size={18} />
                    </button>
                    <div className="topbar-profile">
                        <div className="avatar-small">
                            {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <span>{user?.name || user?.email || 'Admin'}</span>
                    </div>
                </div>
            </header>

            <div className="admin-body-row">
                <aside className="admin-sidebar">
                    {/* Nav */}
                    <nav className="admin-nav">
                        {adminNavItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/'}
                                className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                                title={collapsed ? item.label : undefined}
                            >
                                {item.icon}
                                {!collapsed && <span>{item.label}</span>}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Collapse toggle + Profile footer */}
                    <div className="sidebar-bottom">
                        <button
                            className={`sidebar-collapse-toggle ${collapsed ? 'collapsed' : ''}`}
                            onClick={() => setCollapsed(!collapsed)}
                            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                            {!collapsed && <span>Collapse</span>}
                        </button>

                        <button
                            className={`admin-profile-btn ${collapsed ? 'collapsed' : ''}`}
                            onClick={() => navigate('/settings')}
                            title={collapsed ? `${user?.name || user?.email} · Settings` : undefined}
                        >
                            <div className="avatar">
                                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            {!collapsed && (
                                <div className="email-wrap">
                                    <span className="email">{user?.name || user?.email || 'Admin'}</span>
                                </div>
                            )}
                            {!collapsed && <Settings size={15} className="settings-icon" />}
                        </button>
                    </div>
                </aside>

                <main className="admin-main">
                    <div className="admin-content">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
