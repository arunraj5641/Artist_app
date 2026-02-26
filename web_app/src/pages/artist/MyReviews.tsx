import React, { useState, useMemo } from 'react';
import { useReviews } from '../../hooks/useReviews';
import type { Review } from '../../services/ReviewService';
import {
    AlertCircle, Search, X, Star, MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import './ArtistPages.css';

const RATING_FILTERS = ['All', '5 ★', '4 ★', '3 ★', '2 ★', '1 ★'];

const MyReviewsPage: React.FC = () => {
    const { reviews, isLoading, error } = useReviews();
    const [searchQuery, setSearchQuery] = useState('');
    const [ratingFilter, setRatingFilter] = useState('All');

    const filtered = useMemo(() => {
        return reviews.filter((r: Review) => {
            const q = searchQuery.toLowerCase();
            const matchSearch = !q || (r.comment || '').toLowerCase().includes(q);
            const matchRating = ratingFilter === 'All' || r.rating === parseInt(ratingFilter.charAt(0));
            return matchSearch && matchRating;
        });
    }, [reviews, searchQuery, ratingFilter]);

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    const renderStars = (rating: number) =>
        Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={14} fill={i < rating ? '#f59e0b' : 'transparent'} color={i < rating ? '#f59e0b' : '#64748b'} />
        ));

    if (isLoading) {
        return <div className="page-loading"><div className="spinner" /><span>Loading reviews...</span></div>;
    }

    return (
        <div className="artist-page">
            {/* Header */}
            <div className="page-header">
                <div className="page-header-left">
                    <div className="page-header-icon amber"><Star size={18} /></div>
                    <div>
                        <h1>My Reviews</h1>
                        <p>See what your customers are saying</p>
                    </div>
                </div>
                <div className="page-header-badge">
                    <span className="label">Avg</span>
                    <span className="count">★ {avgRating}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-row">
                <motion.div className="stat-card" whileHover={{ y: -2 }}>
                    <div className="stat-icon blue"><MessageSquare size={18} /></div>
                    <div><p className="stat-label">Total Reviews</p><p className="stat-value">{reviews.length}</p></div>
                </motion.div>
                <motion.div className="stat-card" whileHover={{ y: -2 }}>
                    <div className="stat-icon amber"><Star size={18} /></div>
                    <div><p className="stat-label">Average Rating</p><p className="stat-value">★ {avgRating}</p></div>
                </motion.div>
                <motion.div className="stat-card" whileHover={{ y: -2 }}>
                    <div className="stat-icon green"><Star size={18} /></div>
                    <div><p className="stat-label">5-Star Reviews</p><p className="stat-value">{reviews.filter((r: Review) => r.rating === 5).length}</p></div>
                </motion.div>
            </div>

            {error && <div className="error-banner"><AlertCircle size={16} /><span>{String(error)}</span></div>}

            {/* Content Card */}
            <div className="content-card">
                <div className="toolbar">
                    <div className="toolbar-search">
                        <Search size={14} />
                        <input placeholder="Search reviews..." value={searchQuery} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} />
                        {searchQuery && <button className="clear-btn" onClick={() => setSearchQuery('')}><X size={14} /></button>}
                    </div>
                    <div className="pills">
                        {RATING_FILTERS.map(f => (
                            <button key={f} className={`pill ${ratingFilter === f ? 'active' : ''}`} onClick={() => setRatingFilter(f)}>{f}</button>
                        ))}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon"><Star size={24} /></div>
                        <p>{searchQuery || ratingFilter !== 'All' ? 'No reviews match your filters' : 'No reviews yet. Complete bookings to get reviews!'}</p>
                    </div>
                ) : (
                    <div className="card-grid">
                        {filtered.map((review: Review, i: number) => (
                            <motion.div key={review.id} className="item-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}>
                                <div className="item-card-header">
                                    <div>
                                        <p className="item-card-title">Customer Review</p>
                                        <p className="item-card-subtitle">
                                            {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="stars-row">{renderStars(review.rating)}</div>
                                </div>

                                {review.comment && (
                                    <div className="review-quote">"{review.comment}"</div>
                                )}

                                <div className="item-card-footer">
                                    <span className="meta-item">
                                        <Star size={11} /> Rating: {review.rating}/5
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {filtered.length > 0 && (
                    <div className="list-footer">Showing <strong>{filtered.length}</strong> of <strong>{reviews.length}</strong> reviews</div>
                )}
            </div>
        </div>
    );
};

export default MyReviewsPage;
