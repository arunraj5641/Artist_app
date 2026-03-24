import React, { useState } from 'react';
import type { User } from '../services/UserService';
import { useUsers } from '../hooks/useUsers';
import { Calendar, AlertCircle, Edit2, Trash2, X, Users, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Users.css';

const UsersPage: React.FC = () => {
  const { users, isLoading, error, updateUser, deleteUser, isUpdating, isDeleting } = useUsers();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateUser = (user: User, data: Partial<User>) => {
    updateUser({ id: user.id, data }, {
      onSuccess: () => setEditingUser(null)
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    deleteUser(userId);
  };

  const avatarClasses = ['avatar-violet', 'avatar-blue', 'avatar-emerald', 'avatar-rose', 'avatar-amber'];
  const getAvatarClass = (email: string) => avatarClasses[email.charCodeAt(0) % avatarClasses.length];

  const getRoleBadgeClass = (role: string) => {
    const map: Record<string, string> = {
      admin: 'role-admin',
      artist: 'role-artist',
      customer: 'role-customer',
    };
    return map[role] ?? 'role-customer';
  };

  if (isLoading) {
    return (
      <div className="users-loading">
        <div className="spinner" />
        <span>Loading users...</span>
      </div>
    );
  }

  return (
    <div className="users-page">

      {/* Page Header */}
      <div className="users-header">
        <div className="users-header-left">
          <div className="users-header-icon">
            <Users size={18} />
          </div>
          <div>
            <h1>System Users</h1>
            <p>Manage all users and their roles across the platform</p>
          </div>
        </div>
        <div className="users-total-badge">
          <span className="label">Total</span>
          <span className="count">{users.length}</span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="users-error">
          <AlertCircle size={16} />
          <span>{error instanceof Error ? error.message : String(error)}</span>
        </div>
      )}

      {/* Main Table Card */}
      <div className="users-table-card">

        {/* Search Bar */}
        <div className="users-search-bar">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search by email or role..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="users-search-clear" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Table */}
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="users-empty">
                    {searchQuery ? `No users match "${searchQuery}"` : 'No users found'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                  >
                    {/* User */}
                    <td>
                      <div className="user-info-cell">
                        <div className={`user-avatar ${getAvatarClass(user.email)}`}>
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="user-email">{user.email}</p>
                          <p className="user-id">#{user.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td>
                      <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Date */}
                    <td>
                      <div className="user-date-cell">
                        <Calendar size={13} />
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="users-actions">
                        <button
                          className="action-btn"
                          onClick={() => setEditingUser(user)}
                          disabled={isUpdating}
                          title="Edit User"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={isDeleting}
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredUsers.length > 0 && (
          <div className="users-table-footer">
            Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="modal-overlay"
            onClick={e => e.target === e.currentTarget && setEditingUser(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="modal-card"
            >
              {/* Modal Header */}
              <div className="modal-header">
                <h3>Edit User</h3>
                <button className="modal-close" onClick={() => setEditingUser(null)}>
                  <X size={15} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">

                {/* Avatar Preview */}
                <div className="modal-avatar-section">
                  <div className={`modal-avatar ${getAvatarClass(editingUser.email)}`}>
                    {editingUser.email.charAt(0).toUpperCase()}
                  </div>
                  <p className="modal-user-id">ID: {editingUser.id}</p>
                </div>

                {/* Email Field */}
                <div className="modal-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    defaultValue={editingUser.email}
                    onBlur={e => handleUpdateUser(editingUser, { email: e.target.value })}
                    disabled={isUpdating}
                  />
                </div>

                {/* Role Field */}
                <div className="modal-field">
                  <label>Role</label>
                  <div className="select-wrap">
                    <select
                      defaultValue={editingUser.role}
                      onBlur={e => handleUpdateUser(editingUser, { role: e.target.value })}
                      disabled={isUpdating}
                    >
                      <option value="admin">Admin</option>
                      <option value="artist">Artist</option>
                      <option value="customer">Customer</option>
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </div>

                {/* Saving Indicator */}
                {isUpdating && (
                  <div className="modal-saving">
                    <div className="spinner" />
                    Saving changes...
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

export default UsersPage;