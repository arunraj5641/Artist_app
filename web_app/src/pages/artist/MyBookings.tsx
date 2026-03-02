import React, { useState, useMemo } from 'react';
import { useBookings } from '../../hooks/useBookings';
import { AuthService } from '../../services/AuthService';
import type { Booking } from '../../services/BookingService';
import {
    AlertCircle, Search, X, Calendar, Clock, DollarSign,
    CheckCircle, XCircle, CalendarCheck, Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import './ArtistPages.css';

const STATUS_FILTERS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

const MyBookingsPage: React.FC = () => {
    const {
        bookings, isLoading, error,
        updateBooking, isUpdating,
        deleteBooking, isDeleting
    } = useBookings();

    const currentUser = AuthService.getCurrentUser();
    const isArtist = currentUser?.role === 'artist';
    const isCustomer = currentUser?.role === 'customer';

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filtered = useMemo(() => {
        return bookings.filter((b: Booking) => {
            const q = searchQuery.toLowerCase();
            const matchSearch = !q ||
                b.status.toLowerCase().includes(q) ||
                b.booking_date.includes(q);
            const matchStatus = statusFilter === 'All' || b.status === statusFilter.toLowerCase();
            return matchSearch && matchStatus;
        });
    }, [bookings, searchQuery, statusFilter]);

    const stats = useMemo(() => ({
        total: bookings.length,
        pending: bookings.filter((b: Booking) => b.status === 'pending').length,
        confirmed: bookings.filter((b: Booking) => b.status === 'confirmed').length,
        completed: bookings.filter((b: Booking) => b.status === 'completed').length,
        totalRevenue: bookings.filter((b: Booking) => b.status === 'completed')
            .reduce((sum: number, b: Booking) => sum + (b.total_amount || 0), 0),
    }), [bookings]);

    const handleStatusChange = (bookingId: string, newStatus: string) => {
        updateBooking({ id: bookingId, data: { status: newStatus } });
    };

    const handleDelete = (bookingId: string) => {
        if (!window.confirm('Delete this booking? This cannot be undone.')) return;
        deleteBooking(bookingId);
    };

    if (isLoading) {
        return <div className="page-loading"><div className="spinner" /><span>Loading bookings...</span></div>;
    }

    return (
        <div className="artist-page">
            {/* Header */}
            <div className="page-header">
                <div className="page-header-left">
                    <div className="page-header-icon emerald"><Calendar size={18} /></div>
                    <div>
                        <h1>My Bookings</h1>
                        <p>{isArtist ? 'Review and approve booking requests' : 'Track and manage your appointments'}</p>
                    </div>
                </div>
                <div className="page-header-badge">
                    <span className="label">Total</span>
                    <span className="count">{stats.total}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-row">
                <motion.div className="stat-card" whileHover={{ y: -2 }}>
                    <div className="stat-icon amber"><Clock size={18} /></div>
                    <div><p className="stat-label">Pending</p><p className="stat-value">{stats.pending}</p></div>
                </motion.div>
                <motion.div className="stat-card" whileHover={{ y: -2 }}>
                    <div className="stat-icon blue"><CalendarCheck size={18} /></div>
                    <div><p className="stat-label">Confirmed</p><p className="stat-value">{stats.confirmed}</p></div>
                </motion.div>
                <motion.div className="stat-card" whileHover={{ y: -2 }}>
                    <div className="stat-icon green"><CheckCircle size={18} /></div>
                    <div><p className="stat-label">Completed</p><p className="stat-value">{stats.completed}</p></div>
                </motion.div>
                <motion.div className="stat-card" whileHover={{ y: -2 }}>
                    <div className="stat-icon purple"><DollarSign size={18} /></div>
                    <div><p className="stat-label">Revenue</p><p className="stat-value">${stats.totalRevenue}</p></div>
                </motion.div>
            </div>

            {error && <div className="error-banner"><AlertCircle size={16} /><span>{String(error)}</span></div>}

            {/* Content Card */}
            <div className="content-card">
                <div className="toolbar">
                    <div className="toolbar-search">
                        <Search size={14} />
                        <input placeholder="Search bookings..." value={searchQuery} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} />
                        {searchQuery && <button className="clear-btn" onClick={() => setSearchQuery('')}><X size={14} /></button>}
                    </div>
                    <div className="pills">
                        {STATUS_FILTERS.map(f => (
                            <button key={f} className={`pill ${statusFilter === f ? 'active' : ''}`} onClick={() => setStatusFilter(f)}>{f}</button>
                        ))}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon"><Calendar size={24} /></div>
                        <p>{searchQuery || statusFilter !== 'All' ? 'No bookings match your filters' : 'No bookings yet'}</p>
                    </div>
                ) : (
                    <div className="card-grid">
                        {filtered.map((booking: Booking, i: number) => (
                            <motion.div key={booking.id} className="item-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}>
                                <div className="item-card-header">
                                    <div>
                                        <p className="item-card-title">
                                            Booking #{booking.id.slice(0, 8)}
                                        </p>
                                        <p className="item-card-subtitle">
                                            {new Date(booking.booking_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <span className={`badge ${booking.status}`}>{booking.status}</span>
                                </div>

                                <div className="detail-rows">
                                    <div className="detail-item">
                                        <span className="dlabel">Time</span>
                                        <span className="dvalue">{booking.start_time || '—'} → {booking.end_time || '—'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="dlabel">Amount</span>
                                        <span className="dvalue">${booking.total_amount || 0}</span>
                                    </div>
                                </div>

                                <div className="item-card-footer">
                                    <span className="meta-item">
                                        <Calendar size={11} />
                                        Created {new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>

                                    <div className="actions-row">
                                        {/* ── ARTIST ACTIONS: approve pending bookings ── */}
                                        {isArtist && booking.status === 'pending' && (
                                            <button
                                                className="icon-btn edit"
                                                title="Approve Request"
                                                onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                                disabled={isUpdating}
                                            >
                                                <CheckCircle size={14} />
                                            </button>
                                        )}
                                        {isArtist && booking.status === 'confirmed' && (
                                            <button
                                                className="icon-btn edit"
                                                title="Mark Complete"
                                                onClick={() => handleStatusChange(booking.id, 'completed')}
                                                disabled={isUpdating}
                                            >
                                                <CheckCircle size={14} />
                                            </button>
                                        )}
                                        {isArtist && (booking.status === 'pending' || booking.status === 'confirmed') && (
                                            <button
                                                className="icon-btn delete"
                                                title="Cancel Booking"
                                                onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                                disabled={isUpdating}
                                            >
                                                <XCircle size={14} />
                                            </button>
                                        )}

                                        {/* ── CUSTOMER ACTIONS: cancel or delete ── */}
                                        {isCustomer && booking.status === 'pending' && (
                                            <button
                                                className="icon-btn delete"
                                                title="Cancel Booking"
                                                onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                                disabled={isUpdating}
                                            >
                                                <XCircle size={14} />
                                            </button>
                                        )}
                                        {isCustomer && (
                                            <button
                                                className="icon-btn delete"
                                                title="Delete Booking"
                                                onClick={() => handleDelete(booking.id)}
                                                disabled={isDeleting}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {filtered.length > 0 && (
                    <div className="list-footer">Showing <strong>{filtered.length}</strong> of <strong>{bookings.length}</strong> bookings</div>
                )}
            </div>
        </div>
    );
};

export default MyBookingsPage;
