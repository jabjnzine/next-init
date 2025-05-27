'use client';

import ProtectedRoute from '../components/ProtectedRoute';
import { useAuthStore } from '../store';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>

            <div>
                <button onClick={() => {
                    useAuthStore.getState().logout();
                }}>logout</button>
            </div>
            {children}
        </ProtectedRoute>
    );
} 