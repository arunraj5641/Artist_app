import React, { useMemo } from 'react';
import { Activity, Users as UsersIcon, TrendingUp, Shield } from 'lucide-react';
import type { User, PaginationMeta } from '../../services/UserService';

interface UsersStatsProps {
    users: User[];
    meta: PaginationMeta;
}

const UsersStats: React.FC<UsersStatsProps> = ({ users, meta }) => {
    const totalCount = meta?.total_count || users.length;

    const activeUsersCount = useMemo(() => {
        return meta?.active_count ?? users.filter((u) => u.status === 'active' || !u.status).length;
    }, [meta?.active_count, users]);

    const newUsersCount = useMemo(() => {
        return meta?.new_this_week_count ?? users.filter((u) => {
            const createdDate = new Date(u.created_at);
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return createdDate >= oneWeekAgo;
        }).length;
    }, [meta?.new_this_week_count, users]);

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-content">
                    <h3>Total Users</h3>
                    <div className="stat-value">{totalCount}</div>
                    <div className="stat-trend neutral">All active & inactive</div>
                </div>
                <div className="stat-icon-wrap bg-blue">
                    <UsersIcon size={20} />
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-content">
                    <h3>Active Users</h3>
                    <div className="stat-value">{activeUsersCount}</div>
                    <div className="stat-trend neutral">Currently active</div>
                </div>
                <div className="stat-icon-wrap bg-green">
                    <Activity size={20} />
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-content">
                    <h3>New This Week</h3>
                    <div className="stat-value">{newUsersCount}</div>
                    <div className="stat-trend positive">Recent signups</div>
                </div>
                <div className="stat-icon-wrap bg-yellow">
                    <TrendingUp size={20} />
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-content">
                    <h3>Platform Users</h3>
                    <div className="stat-value">1</div>
                    <div className="stat-trend empty">Customer</div>
                </div>
                <div className="stat-icon-wrap bg-shield">
                    <Shield size={20} />
                </div>
            </div>
        </div>
    );
};

export default React.memo(UsersStats);
