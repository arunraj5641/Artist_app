import React, { useState, useMemo, useEffect } from 'react';
import { useServiceOfferings } from '../../hooks/useServiceOfferings';
import { useArtistProfiles } from '../../hooks/useArtistProfiles';
import { AuthService } from '../../services/AuthService';
import { useToast } from '../../components/common/Toast';
import type { ServiceOffering } from '../../services/ServiceOfferingService';
import {
    AlertCircle, Search, X, Layers, Clock, DollarSign,
    Plus, Edit2, Trash2, Package, User, Save, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './ArtistPages.css';

const MyServicesPage: React.FC = () => {
    const {
        serviceOfferings, isLoading, error,
        createServiceOffering, updateServiceOffering, deleteServiceOffering,
        isCreating, isUpdating, isDeleting
    } = useServiceOfferings();

    const { artistProfiles, updateArtistProfile, isUpdating: isProfileUpdating } = useArtistProfiles();
    const { showToast } = useToast();
    const currentUser = AuthService.getCurrentUser();
    const myProfile = artistProfiles.find((p: any) => p.user_id === currentUser?.id);
    const [displayName, setDisplayName] = useState('');
    const [nameSaved, setNameSaved] = useState(false);
    const [showNamePopup, setShowNamePopup] = useState(false);

    useEffect(() => {
        if (myProfile?.name) setDisplayName(myProfile.name);
    }, [myProfile]);

    const handleSaveName = () => {
        if (!myProfile || !displayName.trim()) return;
        updateArtistProfile(
            { id: myProfile.id, data: { name: displayName.trim() } },
            {
                onSuccess: () => {
                    setNameSaved(true);
                    setShowNamePopup(true);
                    showToast(`Display name saved as "${displayName.trim()}"`, 'success');
                    setTimeout(() => setShowNamePopup(false), 3000);
                },
                onError: () => {
                    showToast('Failed to save display name', 'error');
                }
            }
        );
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<ServiceOffering | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', duration_minutes: '' });

    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return serviceOfferings.filter((s: ServiceOffering) =>
            !q || s.name.toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q)
        );
    }, [serviceOfferings, searchQuery]);

    const totalRevenuePotential = serviceOfferings.reduce((sum: number, s: ServiceOffering) => sum + (s.price || 0), 0);

    const openCreateModal = () => {
        setEditingService(null);
        setFormData({ name: '', description: '', price: '', duration_minutes: '' });
        setShowModal(true);
    };

    const openEditModal = (s: ServiceOffering) => {
        setEditingService(s);
        setFormData({
            name: s.name,
            description: s.description || '',
            price: String(s.price || ''),
            duration_minutes: String(s.duration_minutes || '')
        });
        setShowModal(true);
    };

    const handleSubmit = () => {
        const data = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            duration_minutes: parseInt(formData.duration_minutes)
        };
        if (editingService) {
            updateServiceOffering({ id: editingService.id, data }, { onSuccess: () => setShowModal(false) });
        } else {
            createServiceOffering(data, { onSuccess: () => setShowModal(false) });
        }
    };

    const handleDelete = (id: string) => {
        if (!window.confirm('Delete this service?')) return;
        deleteServiceOffering(id);
    };

    if (isLoading) {
        return <div className="page-loading"><div className="spinner" /><span>Loading services...</span></div>;
    }

    return (
        <div className="artist-page">
            {/* Header */}
            <div className="page-header">
                <div className="page-header-left">
                    <div className="page-header-icon blue"><Layers size={18} /></div>
                    <div>
                        <h1>My Services</h1>
                        <p>Create and manage your service offerings</p>
                    </div>
                </div>
                <button className="add-btn" onClick={openCreateModal}>
                    <Plus size={14} /> Add Service
                </button>
            </div>

            {/* Display Name Banner — artists only */}
            {currentUser?.role === 'artist' && <div style={{
                padding: '14px 18px',
                background: 'rgba(59,130,246,0.07)',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: 'var(--border-radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                position: 'relative'
            }}>
                <User size={16} style={{ color: '#f472b6', flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Your display name (shown to customers):</span>
                <input
                    value={displayName}
                    onChange={e => { setDisplayName(e.target.value); setNameSaved(false); }}
                    placeholder="Enter your display name..."
                    style={{
                        flex: 1,
                        minWidth: '180px',
                        padding: '7px 12px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '7px',
                        color: 'var(--text-primary)',
                        fontSize: '0.875rem',
                        fontFamily: 'var(--font-sans)'
                    }}
                />
                <button
                    onClick={handleSaveName}
                    disabled={!displayName.trim() || isProfileUpdating}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '7px 16px',
                        background: nameSaved ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)',
                        border: `1px solid ${nameSaved ? 'rgba(16,185,129,0.4)' : 'rgba(59,130,246,0.4)'}`,
                        borderRadius: '7px',
                        color: nameSaved ? '#34d399' : '#f472b6',
                        fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <Save size={13} />
                    {isProfileUpdating ? 'Saving...' : nameSaved ? 'Saved!' : 'Save Name'}
                </button>

                {/* Success Popup */}
                <AnimatePresence>
                    {showNamePopup && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            transition={{ duration: 0.25 }}
                            style={{
                                position: 'absolute',
                                bottom: 'calc(100% + 10px)',
                                right: 0,
                                background: 'rgba(16,185,129,0.15)',
                                border: '1px solid rgba(16,185,129,0.4)',
                                borderRadius: '10px',
                                padding: '10px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                whiteSpace: 'nowrap',
                                zIndex: 50
                            }}
                        >
                            <CheckCircle size={16} style={{ color: '#34d399' }} />
                            <span style={{ color: '#34d399', fontWeight: 600, fontSize: '0.85rem' }}>
                                Display name saved as <strong>"{displayName}"</strong>
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>}

            {/* Stats */}
            <div className="stats-row">
                <motion.div className="stat-card" whileHover={{ y: -2 }}>
                    <div className="stat-icon blue"><Package size={18} /></div>
                    <div><p className="stat-label">Total Services</p><p className="stat-value">{serviceOfferings.length}</p></div>
                </motion.div>
                <motion.div className="stat-card" whileHover={{ y: -2 }}>
                    <div className="stat-icon green"><DollarSign size={18} /></div>
                    <div><p className="stat-label">Price Range</p><p className="stat-value">
                        {serviceOfferings.length > 0 ? `$${Math.min(...serviceOfferings.map((s: ServiceOffering) => s.price || 0))} - $${Math.max(...serviceOfferings.map((s: ServiceOffering) => s.price || 0))}` : '$0'}
                    </p></div>
                </motion.div>
                <motion.div className="stat-card" whileHover={{ y: -2 }}>
                    <div className="stat-icon amber"><Clock size={18} /></div>
                    <div><p className="stat-label">Avg Duration</p><p className="stat-value">
                        {serviceOfferings.length > 0 ? `${Math.round(serviceOfferings.reduce((s: number, x: ServiceOffering) => s + (x.duration_minutes || 0), 0) / serviceOfferings.length)} min` : '0 min'}
                    </p></div>
                </motion.div>
            </div>

            {error && <div className="error-banner"><AlertCircle size={16} /><span>{String(error)}</span></div>}

            {/* Content Card */}
            <div className="content-card">
                <div className="toolbar">
                    <div className="toolbar-search">
                        <Search size={14} />
                        <input placeholder="Search services..." value={searchQuery} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} />
                        {searchQuery && <button className="clear-btn" onClick={() => setSearchQuery('')}><X size={14} /></button>}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon"><Layers size={24} /></div>
                        <p>{searchQuery ? `No services match "${searchQuery}"` : 'No services yet. Add your first service!'}</p>
                    </div>
                ) : (
                    <div className="card-grid">
                        {filtered.map((service: ServiceOffering, i: number) => (
                            <motion.div key={service.id} className="item-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}>
                                <div className="item-card-header">
                                    <div>
                                        <p className="item-card-title">{service.name}</p>
                                        <p className="item-card-subtitle">{service.description || 'No description'}</p>
                                    </div>
                                    <span className="price-tag">${service.price || 0}</span>
                                </div>
                                <div className="item-card-footer">
                                    <div className="item-card-meta">
                                        <span className="duration-tag"><Clock size={12} /> {service.duration_minutes || 0} min</span>
                                    </div>
                                    <div className="actions-row">
                                        <button className="icon-btn edit" onClick={() => openEditModal(service)} title="Edit"><Edit2 size={14} /></button>
                                        <button className="icon-btn delete" onClick={() => handleDelete(service.id)} disabled={isDeleting} title="Delete"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {filtered.length > 0 && (
                    <div className="list-footer">Showing <strong>{filtered.length}</strong> of <strong>{serviceOfferings.length}</strong> services</div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={(e: React.MouseEvent) => e.target === e.currentTarget && setShowModal(false)}>
                        <motion.div className="modal-card" initial={{ opacity: 0, scale: 0.93, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93, y: 20 }}>
                            <div className="modal-header">
                                <h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
                                <button className="modal-close" onClick={() => setShowModal(false)}><X size={15} /></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-field">
                                    <label>Service Name</label>
                                    <input value={formData.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Bridal Makeup" />
                                </div>
                                <div className="form-field">
                                    <label>Description</label>
                                    <textarea value={formData.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe your service..." />
                                </div>
                                <div className="form-field">
                                    <label>Price ($)</label>
                                    <input type="number" value={formData.price} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" />
                                </div>
                                <div className="form-field">
                                    <label>Duration (minutes)</label>
                                    <input type="number" value={formData.duration_minutes} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, duration_minutes: e.target.value })} placeholder="60" />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="submit-btn" onClick={handleSubmit} disabled={!formData.name || !formData.price || isCreating || isUpdating}>
                                    {isCreating || isUpdating ? 'Saving...' : editingService ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyServicesPage;
