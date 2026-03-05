import React, { useCallback } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface UsersToolbarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    setPage: (page: number) => void;
}

const UsersToolbar: React.FC<UsersToolbarProps> = ({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    setPage,
}) => {

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1);
    }, [setSearchQuery, setPage]);

    const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
        setPage(1);
    }, [setStatusFilter, setPage]);

    return (
        <div className="table-filters">
            <div className="search-bar">
                <Search size={16} />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="filter-dropdowns">
                <div className="dropdown">
                    <select value={statusFilter} onChange={handleStatusChange}>
                        <option value="All Status">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <ChevronDown size={14} className="dropdown-icon" />
                </div>
            </div>
        </div>
    );
};

export default React.memo(UsersToolbar);
