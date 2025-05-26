'use client';

import ProtectedRoute from '../components/ProtectedRoute';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>

            <div>
                <button>login</button>
            </div>
            {children}
        </ProtectedRoute>
    );
} 