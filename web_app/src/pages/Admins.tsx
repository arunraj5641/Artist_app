import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import type { User } from '../services/UserService';
import {
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Edit2,
    Trash2,
    Plus,
    Activity,
    Users as UsersIcon,
    Shield,
    TrendingUp,
    Phone,
    Mail
} from 'lucide-react';
import './Users.css';
import AddUserModal from '../components/admin/AddUserModal';
import EditUserModal from '../components/admin/EditUserModal';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';

const PER_PAGE = 7;

const AdminsPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const { users, meta, isLoading, error, deleteUser } = useUsers(page, PER_PAGE, 'admin');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedEditUser, setSelectedEditUser] = useState<User | null>(null);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    // Filter only admins from the current page results
    const adminUsers = users;

    const filteredAdmins = adminUsers.filter((u: User) => {
        const matchesSearch =
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === 'All Status' ||
            (u.status || 'active').toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const handleDeleteUser = (userId: string) => {
        setDeleteTargetId(userId);
    };

    const handleEditUser = (user: User) => {
        setSelectedEditUser(user);
        setEditModalOpen(true);
    };

    const totalPages = meta.total_pages;
    const totalCount = meta.total_count;

    // Generate page numbers
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (page > 3) pages.push('ellipsis');
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
            if (page < totalPages - 2) pages.push('ellipsis');
            pages.push(totalPages);
        }
        return pages;
    };

    if (isLoading) {
        return <div className="admin-loading"><div className="spinner" /> Loading admins...</div>;
    }
    if (error) {
        return <div className="admin-error">Failed to load admins.</div>;
    }

    const activeAdminsCount = meta?.active_count ?? adminUsers.filter((u: User) => u.status === 'active' || !u.status).length;

    const newAdminsCount = meta?.new_this_week_count ?? adminUsers.filter((u: User) => {
        const createdDate = new Date(u.created_at);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return createdDate >= oneWeekAgo;
    }).length;

    return (
        <div className="admin-users-page">
            <div className="admin-page-header">
                <p className="subtitle">Manage and monitor all administrators in the system</p>
                <button className="btn-primary" onClick={() => setAddModalOpen(true)}>
                    <Plus size={16} /> Add Admin
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-content">
                        <h3>Total Admins</h3>
                        <div className="stat-value">{totalCount > 0 ? totalCount : adminUsers.length}</div>
                        <div className="stat-trend neutral">0% vs last week</div>
                    </div>
                    <div className="stat-icon-wrap bg-blue">
                        <UsersIcon size={20} />
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-content">
                        <h3>Active Admins</h3>
                        <div className="stat-value">{activeAdminsCount}</div>
                        <div className="stat-trend neutral">0% vs last week</div>
                    </div>
                    <div className="stat-icon-wrap bg-green">
                        <Activity size={20} />
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-content">
                        <h3>New This Week</h3>
                        <div className="stat-value">{newAdminsCount}</div>
                        <div className="stat-trend positive">0% vs last week</div>
                    </div>
                    <div className="stat-icon-wrap bg-yellow">
                        <TrendingUp size={20} />
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-content">
                        <h3>Admin Groups</h3>
                        <div className="stat-value">1</div>
                        <div className="stat-trend empty"></div>
                    </div>
                    <div className="stat-icon-wrap bg-shield">
                        <Shield size={20} />
                    </div>
                </div>
            </div>

            <div className="table-container">
                <div className="table-filters">
                    <div className="search-bar">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                        />
                    </div>
                    <div className="filter-dropdowns">
                        <div className="dropdown">
                            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                                <option value="All Status">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <ChevronDown size={14} className="dropdown-icon" />
                        </div>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ADMIN</th>
                                <th>CONTACT</th>
                                <th>ROLE</th>
                                <th>STATUS</th>
                                <th>JOINED</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAdmins.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                                        No admins found on this page.
                                    </td>
                                </tr>
                            ) : filteredAdmins.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="td-user">
                                            <div className="td-avatar" style={{ background: 'linear-gradient(135deg, var(--accent-primary) 0%, #059669 100%)' }}>
                                                {user.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="td-user-info">
                                                <div className="td-name">{user.name || user.email.split('@')[0]}</div>
                                                <div className="td-id">ID: {user.id.slice(0, 8)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="td-contact">
                                            <div><Mail size={12} /> {user.email}</div>
                                            <div><Phone size={12} /> {user.phone || 'N/A'}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge role-${user.role}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={`status-badge status-${user.status || 'active'}`}>
                                            <span className="dot"></span>
                                            {user.status || 'Active'}
                                        </div>
                                    </td>
                                    <td className="td-date">
                                        {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td>
                                        <div className="td-actions">
                                            <button className="action-btn edit" onClick={() => handleEditUser(user)}>
                                                <Edit2 size={14} />
                                            </button>
                                            <button className="action-btn delete" onClick={() => handleDeleteUser(user.id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination Bar ── */}
                {totalPages > 1 && (
                    <div className="pagination-bar">
                        <span className="pagination-info">
                            Page {meta.current_page} of {totalPages} &mdash; {totalCount} total admins
                        </span>
                        <div className="pagination-controls">
                            <button
                                className="page-btn"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {getPageNumbers().map((p, i) =>
                                p === 'ellipsis' ? (
                                    <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
                                ) : (
                                    <button
                                        key={p}
                                        className={`page-btn${page === p ? ' active' : ''}`}
                                        onClick={() => setPage(p as number)}
                                    >
                                        {p}
                                    </button>
                                )
                            )}

                            <button
                                className="page-btn"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isAddModalOpen && (
                <AddUserModal role="admin" onClose={() => setAddModalOpen(false)} />
            )}

            {isEditModalOpen && selectedEditUser && (
                <EditUserModal user={selectedEditUser} onClose={() => setEditModalOpen(false)} />
            )}

            {deleteTargetId && (
                <ConfirmDeleteModal
                    title="Delete Admin"
                    message="Are you sure you want to permanently delete this administrator? This action cannot be undone."
                    confirmLabel="Delete Admin"
                    onConfirm={() => deleteUser(deleteTargetId)}
                    onClose={() => setDeleteTargetId(null)}
                />
            )}
        </div>
    );
};

export default AdminsPage;
