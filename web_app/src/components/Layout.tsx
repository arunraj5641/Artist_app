import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import {
    Palette,
    LayoutDashboard,
    Calendar,
    Star,
    Layers,
    Shield,
    Brush,
    ChevronLeft,
    ChevronRight,
    Settings
} from 'lucide-react';
import { AuthService } from '../services/AuthService';
import './Layout.css';

const Layout: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(AuthService.getCurrentUser());
    const role = user?.role || 'customer';
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        // Refresh user data to pick up name for existing sessions
        AuthService.refreshCurrentUser().then((updated) => {
            if (updated) setUser(updated);
        });
    }, []);

    // Role-based navigation (Settings removed — accessed via profile footer)
    const adminNavItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { icon: <Shield size={20} />, label: 'Users', path: '/users' },
        { icon: <Brush size={20} />, label: 'Artists', path: '/artists' },
        { icon: <Layers size={20} />, label: 'Services', path: '/services' },
        { icon: <Calendar size={20} />, label: 'Bookings', path: '/bookings' },
        { icon: <Star size={20} />, label: 'Reviews', path: '/reviews' },
    ];

    const artistNavItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { icon: <Layers size={20} />, label: 'My Services', path: '/my-services' },
        { icon: <Calendar size={20} />, label: 'My Bookings', path: '/my-bookings' },
        { icon: <Star size={20} />, label: 'My Reviews', path: '/my-reviews' },
    ];

    const customerNavItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { icon: <Brush size={20} />, label: 'Find Artists', path: '/find-artists' },
        { icon: <Calendar size={20} />, label: 'My Bookings', path: '/my-bookings' },
        { icon: <Star size={20} />, label: 'My Reviews', path: '/my-reviews' },
    ];

    const navItems = role === 'admin' ? adminNavItems : role === 'artist' ? artistNavItems : customerNavItems;

    const getWelcomeMessage = () => {
        if (role === 'admin') return 'Welcome back, Admin!';
        if (role === 'artist') return 'Welcome back, Artist!';
        return 'Welcome back!';
    };
    return (
        <div className={`layout-container-full ${collapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Topbar spanning 100% width */}
            <header className="main-header">
                <div className="topbar-logo-group">
                    <div className="logo-icon-box">
                        <Palette size={22} />
                    </div>
                    {!collapsed && <span className="logo-text">ArtistApp</span>}
                </div>
                <div className="topbar-divider"></div>
                <h1 className="page-title text-gradient">{getWelcomeMessage()}</h1>
            </header>

            <div className="layout-body-row">
                <aside className="sidebar">
                    {/* Nav links */}
                    <nav className="sidebar-nav">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/'}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
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
                            className={`sidebar-profile-btn ${collapsed ? 'collapsed' : ''}`}
                            onClick={() => navigate('/settings')}
                            title={collapsed ? `${user?.name || user?.email} · Settings` : undefined}
                        >
                            <div className="user-avatar">
                                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            {!collapsed && (
                                <div className="user-info">
                                    <p className="user-email">{user?.name || user?.email || 'User'}</p>
                                    <p className="user-role">{role}</p>
                                </div>
                            )}
                            {!collapsed && <Settings size={15} className="profile-settings-icon" />}
                        </button>
                    </div>
                </aside>

                <main className="main-content">
                    <section className="content-area">
                        <Outlet />
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Layout;
