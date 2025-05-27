'use client';
import { PermissionGuard } from '@/app/components';
import { usePermissions } from '../../hooks/usePermissions';
import { useOptionStore } from '@/app/store';
import useOptions from '@/app/hooks/useOptions';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { getAll } = useOptions();
    const { options } = useOptionStore();
    useEffect(() => {
        getAll();
        console.log(options); 
    }, []);
    const { username, hasPermission } = usePermissions();
    return (
        <PermissionGuard permissions={['dashboard']}>
            <div>
                <h1>{username}</h1>
            </div>
        </PermissionGuard>
    );
} 