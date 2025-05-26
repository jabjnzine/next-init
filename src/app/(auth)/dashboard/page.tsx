'use client';

import { PermissionGuard } from '@/app/components';
import { usePermissions } from '../../hooks/usePermissions';

export default function DashboardPage() {
    const { username, hasPermission } = usePermissions();
    return (
        <PermissionGuard permissions={['dashboard']}>
            <div>
                <h1>{username}</h1>
            </div>
        </PermissionGuard>
    );
} 