"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Array<'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'EMPLOYEE'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles
}) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            // Not authenticated
            if (!user) {
                router.push('/login');
                return;
            }

            // Check role-based access
            if (allowedRoles && allowedRoles.length > 0) {
                if (!allowedRoles.includes(user.role)) {
                    router.push('/unauthorized');
                    return;
                }
            }
        }
    }, [user, loading, allowedRoles, router]);

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Not authenticated
    if (!user) {
        return null;
    }

    // Check role-based access
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
};
