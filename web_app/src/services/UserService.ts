import { apiService } from './api';

export interface User {
    id: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
    name?: string;
    phone?: string;
    address?: string;
    loyalty_status?: string;
    preferences?: string;
    artist_profile?: any;
    artist_profile_attributes?: {
        city?: string;
        bio?: string;
    };
}

export interface PaginationMeta {
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
    total_pages: number;
    total_count: number;
    active_count?: number;
    new_this_week_count?: number;
}

export const UserService = {
    getAllUsers: async (page = 1, perPage = 10, role?: string): Promise<{ data: User[]; meta: PaginationMeta }> => {
        const params: any = { page, per_page: perPage };
        if (role) {
            params.role = role;
        }
        const response = await apiService.get('/users', params);
        return {
            data: (response.data as User[]) ?? [],
            meta: response.meta ?? { current_page: 1, next_page: null, prev_page: null, total_pages: 1, total_count: 0 }
        };
    },

    createUser: async (userData: Partial<User> & { password?: string, password_confirmation?: string }) => {
        const response = await apiService.post('/users', { user: userData });
        return response.data;
    },

    updateUserStatus: async (id: string, status: string) => {
        const response = await apiService.patch(`/users/${id}`, { user: { status } });
        return response.data;
    },

    updateUser: async (id: string, userData: Partial<User>) => {
        const response = await apiService.patch(`/users/${id}`, { user: userData });
        return response.data;
    },

    deleteUser: async (id: string) => {
        const response = await apiService.delete(`/users/${id}`);
        return response.data;
    }
};
