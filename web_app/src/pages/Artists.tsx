import React, { useState, useMemo } from 'react';
import { useArtistProfiles } from '../hooks/useArtistProfiles';
import type { ArtistProfile } from '../services/ArtistProfileService';
import {
    AlertCircle, Search, X, MapPin, Calendar, Eye, Trash2,
    Brush, CheckCircle, Clock, DollarSign, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Artists.css';

const FILTERS = ['All', 'Approved', 'Pending'];

const ArtistsPage: React.FC = () => {
    const {
        artistProfiles,
        isLoading,
        error,
        deleteArtistProfile,
        isDeleting
    } = useArtistProfiles();

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedArtist, setSelectedArtist] = useState<ArtistProfile | null>(null);

    const filteredArtists = useMemo(() => {
        return artistProfiles.filter((a: ArtistProfile) => {
            const query = searchQuery.toLowerCase();
            const matchSearch = !query ||
                (a.bio || '').toLowerCase().includes(query) ||
                (a.city || '').toLowerCase().includes(query) ||
                a.user_id.toLowerCase().includes(query) ||
                (a.user?.email || '').toLowerCase().includes(query);

            const matchStatus =
                statusFilter === 'All' ||
                (statusFilter === 'Approved' && a.is_approved) ||
                (statusFilter === 'Pending' && !a.is_approved);

            return matchSearch && matchStatus;
        });
    }, [artistProfiles, searchQuery, statusFilter]);

    const stats = useMemo(() => ({
        total: artistProfiles.length,
        approved: artistProfiles.filter((a: ArtistProfile) => a.is_approved).length,
        pending: artistProfiles.filter((a: ArtistProfile) => !a.is_approved).length,
        avgPrice: artistProfiles.length > 0
            ? Math.round(artistProfiles.reduce((sum: number, a: ArtistProfile) => sum + (a.base_price || 0), 0) / artistProfiles.length)
            : 0,
    }), [artistProfiles]);

    const avatarGradients = ['avatar-gradient-1', 'avatar-gradient-2', 'avatar-gradient-3', 'avatar-gradient-4', 'avatar-gradient-5'];
    const getAvatarGradient = (id: string) => avatarGradients[id.charCodeAt(0) % avatarGradients.length];

    const getInitial = (artist: ArtistProfile) => {
        if (artist.user?.email) return artist.user.email.charAt(0).toUpperCase();
        return 'A';
    };

    const handleDelete = (id: string) => {
        if (!window.confirm('Are you sure you want to delete this artist profile? This action cannot be undone.')) return;
        deleteArtistProfile(id);
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

            {/* Page Header */}
            <div className="artists-header">
                <div className="artists-header-left">
                    <div className="artists-header-icon">
                        <Brush size={18} />
                    </div>
                    <div>
                        <h1>Artist Directory</h1>
                        <p>Manage and monitor all artist profiles on the platform</p>
                    </div>
                </div>
                <div className="artists-total-badge">
                    <span className="label">Total</span>
                    <span className="count">{stats.total}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="artists-stats-grid">
                <motion.div className="artists-stat-card" whileHover={{ y: -2 }}>
                    <div className="artists-stat-icon blue"><Users size={18} /></div>
                    <div>
                        <p className="artists-stat-label">Total Artists</p>
                        <p className="artists-stat-value">{stats.total}</p>
                    </div>
                </motion.div>
                <motion.div className="artists-stat-card" whileHover={{ y: -2 }}>
                    <div className="artists-stat-icon green"><CheckCircle size={18} /></div>
                    <div>
                        <p className="artists-stat-label">Approved</p>
                        <p className="artists-stat-value">{stats.approved}</p>
                    </div>
                </motion.div>
                <motion.div className="artists-stat-card" whileHover={{ y: -2 }}>
                    <div className="artists-stat-icon amber"><Clock size={18} /></div>
                    <div>
                        <p className="artists-stat-label">Pending Approval</p>
                        <p className="artists-stat-value">{stats.pending}</p>
                    </div>
                </motion.div>
                <motion.div className="artists-stat-card" whileHover={{ y: -2 }}>
                    <div className="artists-stat-icon purple"><DollarSign size={18} /></div>
                    <div>
                        <p className="artists-stat-label">Avg Base Price</p>
                        <p className="artists-stat-value">${stats.avgPrice}</p>
                    </div>
                </motion.div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="artists-error">
                    <AlertCircle size={16} />
                    <span>{error instanceof Error ? error.message : String(error)}</span>
                </div>
            )}

            {/* Table Card */}
            <div className="artists-table-card">

                {/* Toolbar: Search + Filter */}
                <div className="artists-toolbar">
                    <div className="artists-search">
                        <Search size={14} />
                        <input
                            type="text"
                            placeholder="Search by email, city, or bio..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="artists-search-clear" onClick={() => setSearchQuery('')}>
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <div className="artists-filter-pills">
                        {FILTERS.map(f => (
                            <button
                                key={f}
                                className={`filter-pill ${statusFilter === f ? 'active' : ''}`}
                                onClick={() => setStatusFilter(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Artist Cards */}
                {filteredArtists.length === 0 ? (
                    <div className="artists-empty">
                        <div className="artists-empty-icon">
                            <Brush size={24} />
                        </div>
                        <p>{searchQuery ? `No artists match "${searchQuery}"` : 'No artist profiles found'}</p>
                    </div>
                ) : (
                    <div className="artists-grid">
                        {filteredArtists.map((artist: ArtistProfile, i: number) => (
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
                                        <p className="artist-email">{artist.user?.email || `Artist #${artist.id.slice(0, 8)}`}</p>
                                        <p className="artist-city">
                                            <MapPin size={12} />
                                            {artist.city || 'Location not set'}
                                        </p>
                                    </div>
                                    <div className="artist-card-badges">
                                        <span className={`approval-badge ${artist.is_approved ? 'approved' : 'pending'}`}>
                                            {artist.is_approved ? (
                                                <><CheckCircle size={10} /> Approved</>
                                            ) : (
                                                <><Clock size={10} /> Pending</>
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className={`artist-bio ${!artist.bio ? 'empty' : ''}`}>
                                    {artist.bio || 'No bio provided yet.'}
                                </div>

                                {/* Stats Row */}
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
                                        <p className="stat-val">{artist.services?.length || 0}</p>
                                        <p className="stat-lbl">Services</p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="artist-card-footer">
                                    <span className="artist-joined">
                                        <Calendar size={11} />
                                        Joined {new Date(artist.created_at).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric'
                                        })}
                                    </span>
                                    <div className="artist-card-actions">
                                        <button
                                            className="artist-action-btn view"
                                            title="View Details"
                                            onClick={() => setSelectedArtist(artist)}
                                        >
                                            <Eye size={14} />
                                        </button>
                                        <button
                                            className="artist-action-btn delete"
                                            title="Delete Profile"
                                            onClick={() => handleDelete(artist.id)}
                                            disabled={isDeleting}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Table Footer */}
                {filteredArtists.length > 0 && (
                    <div className="artists-table-footer">
                        Showing <strong>{filteredArtists.length}</strong> of <strong>{artistProfiles.length}</strong> artists
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedArtist && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="artist-modal-overlay"
                        onClick={e => e.target === e.currentTarget && setSelectedArtist(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.93, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.93, y: 20 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                            className="artist-modal-card"
                        >
                            <div className="artist-modal-header">
                                <h3>Artist Profile</h3>
                                <button className="artist-modal-close" onClick={() => setSelectedArtist(null)}>
                                    <X size={15} />
                                </button>
                            </div>

                            <div className="artist-modal-body">
                                {/* Avatar + Email */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    <div className={`artist-avatar ${getAvatarGradient(selectedArtist.id)}`}>
                                        {getInitial(selectedArtist)}
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                                            {selectedArtist.user?.email || `Artist #${selectedArtist.id.slice(0, 8)}`}
                                        </p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2px', fontFamily: 'monospace' }}>
                                            ID: {selectedArtist.id}
                                        </p>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="artist-detail-row">
                                    <span className="detail-label">City</span>
                                    <span className="detail-value">{selectedArtist.city || '—'}</span>
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
                                    <span className="detail-label">Approval Status</span>
                                    <span className={`approval-badge ${selectedArtist.is_approved ? 'approved' : 'pending'}`}>
                                        {selectedArtist.is_approved ? 'Approved' : 'Pending'}
                                    </span>
                                </div>
                                {selectedArtist.approved_at && (
                                    <div className="artist-detail-row">
                                        <span className="detail-label">Approved On</span>
                                        <span className="detail-value">
                                            {new Date(selectedArtist.approved_at).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                )}
                                <div className="artist-detail-row">
                                    <span className="detail-label">Joined</span>
                                    <span className="detail-value">
                                        {new Date(selectedArtist.created_at).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="artist-detail-row">
                                    <span className="detail-label">Services</span>
                                    <span className="detail-value">{selectedArtist.services?.length || 0}</span>
                                </div>
                                <div className="artist-detail-row">
                                    <span className="detail-label">Bookings</span>
                                    <span className="detail-value">{selectedArtist.bookings?.length || 0}</span>
                                </div>
                                <div className="artist-detail-row">
                                    <span className="detail-label">Reviews</span>
                                    <span className="detail-value">{selectedArtist.reviews?.length || 0}</span>
                                </div>

                                {/* Bio */}
                                {selectedArtist.bio && (
                                    <div>
                                        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '8px' }}>Bio</p>
                                        <div className="artist-bio">
                                            {selectedArtist.bio}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ArtistsPage;
