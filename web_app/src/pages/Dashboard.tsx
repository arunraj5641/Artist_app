import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Handshake,
    CalendarCheck,
    TrendingUp,
    Clock,
    ChevronRight,
    Star,
    Layers,
    DollarSign,
    Sparkles,
    CalendarDays,
    Eye,
    PlusCircle,
    Settings,
    Search,
} from 'lucide-react';
import { useResource } from '../hooks/useResource';
import { AuthService } from '../services/AuthService';
import './Dashboard.css';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { data, loading } = useResource<any>('/dashboard');
    const stats = data?.stats;
    const user = AuthService.getCurrentUser();
    const role = user?.role || 'customer';
    const displayName = user?.name || user?.email?.split('@')[0] || 'there';

    // Stat cards per role
    const adminStatCards = [
        { label: 'Total Artists', value: stats?.total_artists ?? 0, icon: <Users />, color: '#9400D3', bg: 'rgba(148,0,211,0.12)' },
        { label: 'Total Bookings', value: stats?.total_bookings ?? 0, icon: <CalendarCheck />, color: '#ED80E9', bg: 'rgba(237,128,233,0.12)' },
        { label: 'Active Services', value: stats?.total_services ?? 0, icon: <Handshake />, color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
        { label: 'Revenue', value: `$${stats?.total_payments ?? stats?.total_revenue ?? 0}`, icon: <TrendingUp />, color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
    ];

    const artistStatCards = [
        { label: 'My Bookings', value: stats?.total_bookings ?? 0, icon: <CalendarCheck />, color: '#9400D3', bg: 'rgba(148,0,211,0.12)' },
        { label: 'My Services', value: stats?.total_services ?? 0, icon: <Layers />, color: '#ED80E9', bg: 'rgba(237,128,233,0.12)' },
        { label: 'Revenue', value: `$${stats?.total_revenue ?? 0}`, icon: <DollarSign />, color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
        { label: 'Reviews', value: stats?.total_reviews ?? 0, icon: <Star />, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
    ];

    const customerStatCards = [
        { label: 'My Bookings', value: stats?.total_bookings ?? 0, icon: <CalendarCheck />, color: '#9400D3', bg: 'rgba(148,0,211,0.12)' },
        { label: 'Total Spent', value: `$${stats?.total_spent ?? 0}`, icon: <DollarSign />, color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
    ];

    const statCards = role === 'admin' ? adminStatCards : role === 'artist' ? artistStatCards : customerStatCards;

    // Quick actions per role
    const artistActions = [
        { icon: <PlusCircle size={18} />, title: 'Add Service', desc: 'Create a new service offering', color: '#9400D3', bg: 'rgba(148,0,211,0.12)', path: '/my-services' },
        { icon: <CalendarDays size={18} />, title: 'My Bookings', desc: 'Check your upcoming appointments', color: '#ED80E9', bg: 'rgba(237,128,233,0.12)', path: '/my-bookings' },
        { icon: <Eye size={18} />, title: 'My Reviews', desc: 'See what customers are saying', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', path: '/my-reviews' },
        { icon: <Settings size={18} />, title: 'Settings', desc: 'Manage your account', color: '#64748b', bg: 'rgba(100,116,139,0.12)', path: '/settings' },
    ];

    const adminActions = [
        { icon: <Users size={18} />, title: 'Manage Users', desc: 'View and edit user accounts', color: '#9400D3', bg: 'rgba(148,0,211,0.12)', path: '/users' },
        { icon: <Sparkles size={18} />, title: 'Artists', desc: 'Browse all artist profiles', color: '#ED80E9', bg: 'rgba(237,128,233,0.12)', path: '/artists' },
        { icon: <CalendarCheck size={18} />, title: 'Bookings', desc: 'View all platform bookings', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', path: '/bookings' },
        { icon: <TrendingUp size={18} />, title: 'Revenue', desc: 'Track platform earnings', color: '#34d399', bg: 'rgba(52,211,153,0.12)', path: '/services' },
    ];

    const customerActions = [
        { icon: <Search size={18} />, title: 'Find Artists', desc: 'Discover talented creators', color: '#9400D3', bg: 'rgba(148,0,211,0.12)', path: '/find-artists' },
        { icon: <CalendarDays size={18} />, title: 'My Bookings', desc: 'View your appointments', color: '#ED80E9', bg: 'rgba(237,128,233,0.12)', path: '/my-bookings' },
        { icon: <Star size={18} />, title: 'My Reviews', desc: 'See your feedback', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', path: '/my-reviews' },
        { icon: <Settings size={18} />, title: 'Settings', desc: 'Manage your account', color: '#64748b', bg: 'rgba(100,116,139,0.12)', path: '/settings' },
    ];

    const quickActions = role === 'admin' ? adminActions : role === 'artist' ? artistActions : customerActions;

    const bookingsPath = role === 'admin' ? '/bookings' : '/my-bookings';

    const avatarColors = ['#9400D3', '#7b00a3', '#ED80E9', '#a78bfa', '#D3D3FF'];

    if (loading) {
        return (
            <div className="center-loader">
                <div className="dashboard-spinner" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="dashboard"
        >
            {/* Greeting */}
            <div className="dashboard-greeting">
                <div>
                    <h1>Good {getTimeOfDay()}, <span className="greeting-name">{displayName}</span></h1>
                    <p className="greeting-sub">Here's what's happening on your dashboard today.</p>
                </div>
            </div>

            {/* Stat cards */}
            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        className="stat-card glass"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.07 }}
                        whileHover={{ y: -4 }}
                    >
                        <div className="stat-icon" style={{ backgroundColor: stat.bg, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">{stat.label}</p>
                            <h3 className="stat-value" style={{ color: stat.color }}>{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom grid */}
            <div className="dashboard-grid">
                {/* Recent Bookings */}
                <div className="recent-section glass">
                    <div className="section-header">
                        <div className="section-title-group">
                            <div className="section-icon-pill" style={{ background: 'rgba(148,0,211,0.12)', color: '#ED80E9' }}>
                                <CalendarCheck size={15} />
                            </div>
                            <h3>{role === 'admin' ? 'Recent Bookings' : 'Upcoming Appointments'}</h3>
                        </div>
                        <button className="view-all" onClick={() => navigate(bookingsPath)}>
                            View All <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="recent-list">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="recent-item"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + i * 0.06 }}
                                whileHover={{ x: 4 }}
                            >
                                <div
                                    className="item-avatar"
                                    style={{ background: `linear-gradient(135deg, ${avatarColors[i]}, ${avatarColors[i + 1]})` }}
                                >
                                    {role === 'artist' ? 'CL' : 'JD'}
                                </div>
                                <div className="item-info">
                                    <p className="item-name">{role === 'artist' ? 'Client Name' : 'John Doe'}</p>
                                    <p className="item-sub">{role === 'artist' ? 'Bridal Makeup Session' : 'Digital Portrait Session'}</p>
                                </div>
                                <div className="item-meta">
                                    <p className="item-time"><Clock size={11} /> 2 hours ago</p>
                                    <span className="status-badge pending">Pending</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="performance-section glass">
                    <div className="section-header">
                        <div className="section-title-group">
                            <div className="section-icon-pill" style={{ background: 'rgba(148,0,211,0.12)', color: '#ED80E9' }}>
                                <Sparkles size={15} />
                            </div>
                            <h3>Quick Actions</h3>
                        </div>
                    </div>
                    <div className="actions-grid">
                        {quickActions.map((action, i) => (
                            <motion.button
                                key={i}
                                className="action-card"
                                onClick={() => navigate(action.path)}
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + i * 0.06 }}
                                whileHover={{ x: 4 }}
                            >
                                <div className="action-icon" style={{ background: action.bg, color: action.color }}>
                                    {action.icon}
                                </div>
                                <div className="action-text">
                                    <span className="action-title">{action.title}</span>
                                    <p className="action-desc">{action.desc}</p>
                                </div>
                                <ChevronRight size={14} className="action-arrow" style={{ color: action.color }} />
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

function getTimeOfDay() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
}

export default Dashboard;
