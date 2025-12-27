import axiosInstance from './axios';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'EMPLOYEE';
    department: string;
    maintenanceTeam?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'EMPLOYEE';
    department: string;
    maintenanceTeam?: {
        _id: string;
        name: string;
        specialization: string;
    };
}

export interface AuthResponse {
    success: boolean;
    user: User;
}

export const authAPI = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await axiosInstance.post('/auth/register', data);
        return response.data;
    },

    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await axiosInstance.post('/auth/login', credentials);
        return response.data;
    },

    getProfile: async (): Promise<AuthResponse> => {
        const response = await axiosInstance.get('/auth/profile');
        return response.data;
    },

    logout: async (): Promise<{ success: boolean; message: string }> => {
        const response = await axiosInstance.post('/auth/logout');
        return response.data;
    },
};
