import { apiService } from './api';
import { TokenManager } from './TokenManager';

export const AuthService = {
    login: async (credentials: any) => {
        const response = await apiService.post('/login', credentials);
        if (response.success) {
            await TokenManager.setToken(response.data.token);
            // Store user info (includes name, email, role, id)
            const { token, ...userInfo } = response.data;
            localStorage.setItem('user', JSON.stringify(userInfo));
        }
        return response;
    },

    signup: async (userData: any) => {
        const response = await apiService.post('/signup', { user: userData });
        if (response.success) {
            await TokenManager.setToken(response.data.token);
            // Server returns { user, token }. We store user.
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
    },

    logout: async () => {
        await TokenManager.clearToken();
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Refresh user info from /me endpoint and update localStorage
    refreshCurrentUser: async () => {
        try {
            const response = await apiService.get('/me');
            if (response.success && response.data) {
                const existing = AuthService.getCurrentUser() || {};
                const updated = { ...existing, ...response.data };
                localStorage.setItem('user', JSON.stringify(updated));
                return updated;
            }
        } catch (_) {
            // Silently fail — user stays logged in with old data
        }
        return AuthService.getCurrentUser();
    },
};
