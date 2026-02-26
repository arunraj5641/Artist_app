import React from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import {
    Palette,
    LayoutDashboard,
    Users,
    Settings,
    Calendar,
    LogOut,
    Star,
    Layers,
    Shield,
    Brush,
    User
} from 'lucide-react';
import { AuthService } from '../services/AuthService';
import './Layout.css';

const Layout: React.FC = () => {
    const navigate = useNavigate();
    const user = AuthService.getCurrentUser();
    const role = user?.role || 'customer';

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    // Role-based navigation
    const adminNavItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { icon: <Shield size={20} />, label: 'Users', path: '/users' },
        { icon: <Brush size={20} />, label: 'Artists', path: '/artists' },
        { icon: <Layers size={20} />, label: 'Services', path: '/services' },
        { icon: <Calendar size={20} />, label: 'Bookings', path: '/bookings' },
        { icon: <Star size={20} />, label: 'Reviews', path: '/reviews' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    ];

    const artistNavItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { icon: <Layers size={20} />, label: 'My Services', path: '/my-services' },
        { icon: <Calendar size={20} />, label: 'My Bookings', path: '/my-bookings' },
        { icon: <Star size={20} />, label: 'My Reviews', path: '/my-reviews' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    ];

    const customerNavItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { icon: <Brush size={20} />, label: 'Find Artists', path: '/artists' },
        { icon: <Calendar size={20} />, label: 'My Bookings', path: '/my-bookings' },
        { icon: <Star size={20} />, label: 'My Reviews', path: '/my-reviews' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    ];

    const navItems = role === 'admin' ? adminNavItems : role === 'artist' ? artistNavItems : customerNavItems;

    const getWelcomeMessage = () => {
        if (role === 'admin') return 'Welcome back, Admin!';
        if (role === 'artist') return 'Welcome back, Artist!';
        return 'Welcome back!';
    };

    return (
        <div className="layout-container">
            <aside className="sidebar glass">
                <div className="sidebar-header">
                    <Palette className="logo-icon" size={32} />
                    <span className="logo-text">ArtistApp</span>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="user-info">
                            <p className="user-email">{user?.email || 'User'}</p>
                            <p className="user-role">{role}</p>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="main-header glass">
                    <h1 className="page-title text-gradient">{getWelcomeMessage()}</h1>
                    <div className="header-actions">
                        <div className="notification-bell">
                            {/* Add notification icon if needed */}
                        </div>
                    </div>
                </header>

                <section className="content-area">
                    <Outlet />
                </section>
            </main>
        </div>
    );
};

export default Layout;
