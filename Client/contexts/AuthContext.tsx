"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User, LoginCredentials, RegisterData } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Check authentication status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            setLoading(true);
            const response = await authAPI.getProfile();
            if (response.success && response.user) {
                setUser(response.user);
            }
        } catch (err: any) {
            // User not authenticated - this is okay
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: LoginCredentials) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authAPI.login(credentials);

            if (response.success && response.user) {
                setUser(response.user);
                router.push('/'); // Redirect to dashboard
            }
        } catch (err: any) {
            const errorMessage = err?.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authAPI.register(data);

            if (response.success && response.user) {
                setUser(response.user);
                router.push('/'); // Redirect to dashboard
            }
        } catch (err: any) {
            const errorMessage = err?.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await authAPI.logout();
            setUser(null);
            router.push('/login'); // Redirect to login page
        } catch (err: any) {
            console.error('Logout error:', err);
            // Even if logout fails, clear local state
            setUser(null);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const refreshUser = async () => {
        try {
            const response = await authAPI.getProfile();
            if (response.success && response.user) {
                setUser(response.user);
            }
        } catch (err) {
            setUser(null);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const value: AuthContextType = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        refreshUser,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
