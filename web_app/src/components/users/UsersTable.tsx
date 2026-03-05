import React, { useMemo } from 'react';
import type { User, PaginationMeta } from '../../services/UserService';
import { Mail, Phone, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface UsersTableProps {
    users: User[];
    meta: PaginationMeta;
    page: number;
    setPage: (page: number | ((p: number) => number)) => void;
    onEditUser: (user: User) => void;
    onDeleteUser: (userId: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
    users,
    meta,
    page,
    setPage,
    onEditUser,
    onDeleteUser,
}) => {

    const totalPages = meta?.total_pages || 1;
    const totalCount = meta?.total_count || 0;

    const pageNumbers = useMemo(() => {
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
    }, [totalPages, page]);

    return (
        <>
            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>USER</th>
                            <th>CONTACT</th>
                            <th>ROLE</th>
                            <th>STATUS</th>
                            <th>JOINED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                                    No users found on this page.
                                </td>
                            </tr>
                        ) : users.map((user) => (
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
                                        <button className="action-btn edit" onClick={() => onEditUser(user)}>
                                            <Edit2 size={14} />
                                        </button>
                                        <button className="action-btn delete" onClick={() => onDeleteUser(user.id)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination-bar">
                    <span className="pagination-info">
                        Page {meta?.current_page || page} of {totalPages} &mdash; {totalCount} total users
                    </span>
                    <div className="pagination-controls">
                        <button
                            className="page-btn"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {pageNumbers.map((p, i) =>
                            p === 'ellipsis' ? (
                                <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
                            ) : (
                                <button
                                    key={`page-${p}-${i}`}
                                    className={`page-btn ${page === p ? 'active' : ''}`}
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
        </>
    );
};

export default React.memo(UsersTable);
