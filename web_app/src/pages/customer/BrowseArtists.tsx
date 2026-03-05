import React, { useState, useMemo } from 'react';
import { useArtistProfiles } from '../../hooks/useArtistProfiles';
import { useBookings } from '../../hooks/useBookings';
import type { ArtistProfile } from '../../services/ArtistProfileService';
import {
    AlertCircle, Search, X, MapPin, Calendar, Clock,
    DollarSign, Brush, Star, CalendarPlus, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../components/common/Toast';
import '../Artists.css';
import './CustomerPages.css';

interface ServiceOffering {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration_minutes: number;
    artist_profile_id: string;
}

interface BookingForm {
    service_id: string;
    artist_profile_id: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    total_amount: number;
}

const BrowseArtistsPage: React.FC = () => {
    const { artistProfiles, isLoading, error } = useArtistProfiles();
    const { createBooking, isCreating } = useBookings();
    const { showToast } = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedArtist, setSelectedArtist] = useState<ArtistProfile | null>(null);
    const [bookingService, setBookingService] = useState<ServiceOffering | null>(null);
    const [bookingForm, setBookingForm] = useState<BookingForm>({
        service_id: '',
        artist_profile_id: '',
        booking_date: '',
        start_time: '',
        end_time: '',
        total_amount: 0
    });

    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return artistProfiles.filter((a: ArtistProfile) =>
            !q ||
            (a.name || '').toLowerCase().includes(q) ||
            (a.bio || '').toLowerCase().includes(q) ||
            (a.city || '').toLowerCase().includes(q) ||
            (a.services || []).some((s: any) => s.name.toLowerCase().includes(q))
        );
    }, [artistProfiles, searchQuery]);

    const avatarGradients = ['avatar-gradient-1', 'avatar-gradient-2', 'avatar-gradient-3', 'avatar-gradient-4', 'avatar-gradient-5'];
    const getAvatarGradient = (id: string) => avatarGradients[id.charCodeAt(0) % avatarGradients.length];
    const getDisplayName = (artist: ArtistProfile) => artist.name || 'Artist';
    const getInitial = (artist: ArtistProfile) => (artist.name || 'A').charAt(0).toUpperCase();

    const openBooking = (service: ServiceOffering, artistProfileId: string) => {
        setBookingService(service);
        setBookingForm({
            service_id: service.id,
            artist_profile_id: artistProfileId,
            booking_date: '',
            start_time: '',
            end_time: '',
            total_amount: service.price
        });
    };

    const handleBook = () => {
        if (!bookingForm.booking_date || !bookingForm.start_time) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        createBooking(bookingForm as any, {
            onSuccess: () => {
                showToast('Booking created successfully! 🎉', 'success');
                setBookingService(null);
            }
        });
    };

    if (isLoading) {
        return (
            <div className="artists-loading">
                <div className="spinner" />
                <span>Loading artists...</span>
            </div>
        );
    }

    return (
        <div className="artists-page">
            {/* Header */}
            <div className="artists-header">
                <div className="artists-header-left">
                    <div className="artists-header-icon">
                        <Brush size={18} />
                    </div>
                    <div>
                        <h1>Find Artists</h1>
                        <p>Discover talented artists and book their services</p>
                    </div>
                </div>
                <div className="artists-total-badge">
                    <span className="label">Artists</span>
                    <span className="count">{artistProfiles.length}</span>
                </div>
            </div>

            {error && (
                <div className="artists-error">
                    <AlertCircle size={16} />
                    <span>{error instanceof Error ? error.message : String(error)}</span>
                </div>
            )}

            {/* Search */}
            <div className="artists-table-card">
                <div className="artists-toolbar">
                    <div className="artists-search">
                        <Search size={14} />
                        <input
                            type="text"
                            placeholder="Search by name, city, or service..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="artists-search-clear" onClick={() => setSearchQuery('')}>
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="artists-empty">
                        <div className="artists-empty-icon"><Brush size={24} /></div>
                        <p>{searchQuery ? `No artists match "${searchQuery}"` : 'No artists available yet.'}</p>
                    </div>
                ) : (
                    <div className="artists-grid">
                        {filtered.map((artist: ArtistProfile, i: number) => (
                            <motion.div
                                key={artist.id}
                                className="artist-card"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.3 }}
                            >
                                {/* Card Header */}
                                <div className="artist-card-header">
                                    <div className={`artist-avatar ${getAvatarGradient(artist.id)}`}>
                                        {getInitial(artist)}
                                    </div>
                                    <div className="artist-card-info">
                                        <p className="artist-email">{getDisplayName(artist)}</p>
                                        <p className="artist-city">
                                            <MapPin size={12} />
                                            {artist.city || 'Location not set'}
                                        </p>
                                    </div>
                                    <div className="artist-card-badges">
                                        {artist.is_approved && (
                                            <span className="approval-badge approved">
                                                <CheckCircle size={10} /> Verified
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className={`artist-bio ${!artist.bio ? 'empty' : ''}`}>
                                    {artist.bio || 'No bio provided yet.'}
                                </div>

                                {/* Stats */}
                                <div className="artist-card-stats">
                                    <div className="artist-mini-stat">
                                        <p className="stat-val">{artist.experience_years || 0}</p>
                                        <p className="stat-lbl">Yrs Exp</p>
                                    </div>
                                    <div className="artist-mini-stat">
                                        <p className="stat-val">${artist.base_price || 0}</p>
                                        <p className="stat-lbl">Base Price</p>
                                    </div>
                                    <div className="artist-mini-stat">
                                        <p className="stat-val">{(artist.services || []).length}</p>
                                        <p className="stat-lbl">Services</p>
                                    </div>
                                </div>

                                {/* Services */}
                                {artist.services && artist.services.length > 0 && (
                                    <div className="customer-services-list">
                                        <p className="customer-services-title">Available Services</p>
                                        {artist.services.map((service: any) => (
                                            <div key={service.id} className="customer-service-item">
                                                <div className="customer-service-info">
                                                    <strong>{service.name}</strong>
                                                    <span className="customer-service-meta">
                                                        <Clock size={11} /> {service.duration_minutes} min
                                                    </span>
                                                    {service.description && (
                                                        <p className="customer-service-desc">{service.description}</p>
                                                    )}
                                                </div>
                                                <div className="customer-service-right">
                                                    <span className="customer-service-price">${service.price}</span>
                                                    <button
                                                        className="book-btn"
                                                        onClick={() => openBooking(service, artist.id)}
                                                    >
                                                        <CalendarPlus size={13} /> Book
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="artist-card-footer">
                                    <span className="artist-joined">
                                        <Calendar size={11} />
                                        Joined {new Date(artist.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </span>
                                    <button
                                        className="artist-action-btn view"
                                        title="View Profile"
                                        onClick={() => setSelectedArtist(artist)}
                                    >
                                        <Star size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {filtered.length > 0 && (
                    <div className="artists-table-footer">
                        Showing <strong>{filtered.length}</strong> of <strong>{artistProfiles.length}</strong> artists
                    </div>
                )}
            </div>

            {/* Artist Detail Modal */}
            <AnimatePresence>
                {selectedArtist && (
                    <motion.div
                        className="artist-modal-overlay"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={e => e.target === e.currentTarget && setSelectedArtist(null)}
                    >
                        <motion.div
                            className="artist-modal-card"
                            initial={{ opacity: 0, scale: 0.93, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.93, y: 20 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                        >
                            <div className="artist-modal-header">
                                <h3>Artist Profile</h3>
                                <button className="artist-modal-close" onClick={() => setSelectedArtist(null)}>
                                    <X size={15} />
                                </button>
                            </div>
                            <div className="artist-modal-body">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    <div className={`artist-avatar ${getAvatarGradient(selectedArtist.id)}`}>
                                        {getInitial(selectedArtist)}
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                                            {getDisplayName(selectedArtist)}
                                        </p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                                            {selectedArtist.city || 'Location not provided'}
                                        </p>
                                    </div>
                                </div>

                                <div className="artist-detail-row">
                                    <span className="detail-label">Experience</span>
                                    <span className="detail-value">{selectedArtist.experience_years || 0} years</span>
                                </div>
                                <div className="artist-detail-row">
                                    <span className="detail-label">Base Price</span>
                                    <span className="detail-value">${selectedArtist.base_price || 0}</span>
                                </div>
                                <div className="artist-detail-row">
                                    <span className="detail-label">Status</span>
                                    <span className={`approval-badge ${selectedArtist.is_approved ? 'approved' : 'pending'}`}>
                                        {selectedArtist.is_approved ? 'Verified' : 'Pending'}
                                    </span>
                                </div>

                                {selectedArtist.bio && (
                                    <div>
                                        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Bio</p>
                                        <div className="artist-bio">{selectedArtist.bio}</div>
                                    </div>
                                )}

                                {selectedArtist.services && selectedArtist.services.length > 0 && (
                                    <div>
                                        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Services</p>
                                        <div className="customer-services-list" style={{ gap: '8px' }}>
                                            {selectedArtist.services.map((s: any) => (
                                                <div key={s.id} className="customer-service-item">
                                                    <div className="customer-service-info">
                                                        <strong>{s.name}</strong>
                                                        <span className="customer-service-meta"><Clock size={11} /> {s.duration_minutes} min</span>
                                                        {s.description && <p className="customer-service-desc">{s.description}</p>}
                                                    </div>
                                                    <div className="customer-service-right">
                                                        <span className="customer-service-price">${s.price}</span>
                                                        <button
                                                            className="book-btn"
                                                            onClick={() => { openBooking(s, selectedArtist.id); setSelectedArtist(null); }}
                                                        >
                                                            <CalendarPlus size={13} /> Book
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Booking Modal */}
            <AnimatePresence>
                {bookingService && (
                    <motion.div
                        className="artist-modal-overlay"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={e => e.target === e.currentTarget && setBookingService(null)}
                    >
                        <motion.div
                            className="artist-modal-card"
                            initial={{ opacity: 0, scale: 0.93, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.93, y: 20 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                        >
                            <div className="artist-modal-header">
                                <h3>Book Service</h3>
                                <button className="artist-modal-close" onClick={() => setBookingService(null)}>
                                    <X size={15} />
                                </button>
                            </div>
                            <div className="artist-modal-body">
                                {/* Service Summary */}
                                <div className="booking-service-summary">
                                    <div>
                                        <p className="booking-service-name">{bookingService.name}</p>
                                        <p className="booking-service-meta">
                                            <Clock size={12} /> {bookingService.duration_minutes} min
                                        </p>
                                        {bookingService.description && (
                                            <p className="booking-service-desc">{bookingService.description}</p>
                                        )}
                                    </div>
                                    <span className="booking-service-price">${bookingService.price}</span>
                                </div>

                                {/* Form */}
                                <div className="booking-form">
                                    <div className="booking-field">
                                        <label>Date <span style={{ color: '#f87171' }}>*</span></label>
                                        <input
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={bookingForm.booking_date}
                                            onChange={e => setBookingForm({ ...bookingForm, booking_date: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div className="booking-field">
                                            <label>Start Time <span style={{ color: '#f87171' }}>*</span></label>
                                            <input
                                                type="time"
                                                value={bookingForm.start_time}
                                                onChange={e => setBookingForm({ ...bookingForm, start_time: e.target.value })}
                                            />
                                        </div>
                                        <div className="booking-field">
                                            <label>End Time</label>
                                            <input
                                                type="time"
                                                value={bookingForm.end_time}
                                                onChange={e => setBookingForm({ ...bookingForm, end_time: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="booking-total">
                                    <span>Total Amount</span>
                                    <span className="booking-total-amount">${bookingService.price}</span>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button className="booking-cancel-btn" onClick={() => setBookingService(null)}>Cancel</button>
                                    <button
                                        className="booking-confirm-btn"
                                        onClick={handleBook}
                                        disabled={isCreating || !bookingForm.booking_date || !bookingForm.start_time}
                                    >
                                        {isCreating ? 'Booking...' : 'Confirm Booking'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BrowseArtistsPage;
