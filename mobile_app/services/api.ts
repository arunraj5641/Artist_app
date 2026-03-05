import axios, {
    AxiosError,
    type AxiosRequestConfig,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from 'axios';
import Constants from 'expo-constants';

// For physical devices, we need to use the machine's IP address.
// expo-constants helps us get the host IP during development.
const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost?.split(':').shift();

export const API_BASE_URL = localhost
    ? `http://${localhost}:3000/api/v1`
    : 'http://localhost:3000/api/v1';

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: any;
    message?: string;
    status?: number;
}

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        Accept: 'application/json',
    },
});

import storage from './storage';

// Request interceptor
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await storage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        return Promise.reject(error);
    }
);

interface ServiceConfig extends AxiosRequestConfig {
    url: string;
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    data?: any;
    params?: any;
}

export async function service<T = any>(
    config: ServiceConfig
): Promise<ApiResponse<T>> {
    try {
        const response = await apiClient(config);
        const backend = response.data;

        return {
            success: backend?.success ?? true,
            data: backend?.data ?? backend,
            status: response.status,
        };

    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            const backendError = error.response?.data;
            const message = backendError?.message || error.message || 'Something went wrong';

            return {
                success: false,
                error: backendError,
                status: error.response?.status,
                message,
            };
        }

        return {
            success: false,
            status: 500,
            message: 'Network error',
        };
    }
}

export const api = {
    get: <T = any>(url: string, params?: any) =>
        service<T>({ url, method: 'get', params }),
    post: <T = any>(url: string, data?: any) =>
        service<T>({ url, method: 'post', data }),
    put: <T = any>(url: string, data?: any) =>
        service<T>({ url, method: 'put', data }),
    patch: <T = any>(url: string, data?: any) =>
        service<T>({ url, method: 'patch', data }),
    delete: <T = any>(url: string) => service<T>({ url, method: 'delete' }),
};

export default api;
