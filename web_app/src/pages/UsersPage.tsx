import React, { useState, useMemo, useCallback } from 'react';
import { useUsers } from '../hooks/useUsers';
import type { User } from '../services/UserService';
import { Plus } from 'lucide-react';
import './Users.css';

// Components
import UsersStats from '../components/users/UsersStats';
import UsersToolbar from '../components/users/UsersToolbar';
import UsersTable from '../components/users/UsersTable';
import AddUserModal from '../components/admin/AddUserModal';
import EditUserModal from '../components/admin/EditUserModal';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';

const PER_PAGE = 7;

const UsersPage: React.FC = () => {
    // 1. Data Fetching
    const [page, setPage] = useState(1);
    const { users, meta, isLoading, error, deleteUser } = useUsers(page, PER_PAGE, 'customer');

    // 2. Filters & State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');

    // 3. Modals State
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedEditUser, setSelectedEditUser] = useState<User | null>(null);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    // 4. Memoized Filtered Data (Applying local string matching to current page)
    const filteredUsers = useMemo(() => {
        return users.filter((u: User) => {
            const matchesSearch =
                u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (u.name || '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === 'All Status' ||
                (u.status || 'active').toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesStatus;
        });
    }, [users, searchQuery, statusFilter]);

    // 5. Handlers
    const handleEditUser = useCallback((user: User) => {
        setSelectedEditUser(user);
        setEditModalOpen(true);
    }, []);

    const handleDeleteUser = useCallback((userId: string) => {
        setDeleteTargetId(userId);
    }, []);

    const confirmDelete = useCallback(() => {
        if (deleteTargetId) {
            deleteUser(deleteTargetId);
            setDeleteTargetId(null);
        }
    }, [deleteUser, deleteTargetId]);

    // 6. Loading/Error boundaries
    if (isLoading) {
        return (
            <div className="admin-loading">
                <div className="spinner" /> Loading users...
            </div>
        );
    }

    if (error) {
        return <div className="admin-error">Failed to load users.</div>;
    }

    return (
        <div className="admin-users-page" style={{ padding: '24px' }}>
            {/* Header section */}
            <header className="admin-page-header">
                <div>
                    <h2 style={{ margin: '0 0 8px', fontSize: '1.5rem', color: '#f8fafc' }}>Platform Users</h2>
                    <p className="subtitle">Manage and monitor all customer users across the platform.</p>
                </div>
                <button className="btn-primary" onClick={() => setAddModalOpen(true)}>
                    <Plus size={16} /> Add User
                </button>
            </header>

            {/* Top Statistics Component */}
            <UsersStats users={users} meta={meta} />

            {/* Main Table Interface */}
            <div className="table-container">
                <UsersToolbar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    setPage={setPage}
                />

                <UsersTable
                    users={filteredUsers}
                    meta={meta}
                    page={page}
                    setPage={setPage}
                    onEditUser={handleEditUser}
                    onDeleteUser={handleDeleteUser}
                />
            </div>

            {/* Modals Portal Elements */}
            {isAddModalOpen && (
                <AddUserModal role="customer" onClose={() => setAddModalOpen(false)} />
            )}

            {isEditModalOpen && selectedEditUser && (
                <EditUserModal
                    user={selectedEditUser}
                    onClose={() => setEditModalOpen(false)}
                    allowedRoles={['customer']}
                />
            )}

            {deleteTargetId && (
                <ConfirmDeleteModal
                    title="Delete User"
                    message="Are you sure you want to permanently delete this user? This action cannot be undone."
                    confirmLabel="Delete User"
                    onConfirm={confirmDelete}
                    onClose={() => setDeleteTargetId(null)}
                />
            )}
        </div>
    );
};

export default UsersPage;
