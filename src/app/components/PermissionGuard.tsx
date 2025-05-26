'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '../hooks/usePermissions';

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions?: string[];
  requireAll?: boolean;
  fallbackPath?: string;
}

export default function PermissionGuard({
  children,
  permissions = [],
  requireAll = false,
  fallbackPath = '/unauthorized',
}: PermissionGuardProps) {
  const router = useRouter();
  const { hasAnyPermission, hasAllPermissions } = usePermissions();

  const hasAccess = permissions.length === 0 || 
    (requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions));

  useEffect(() => {
    if (!hasAccess) {
      router.push(fallbackPath);
    }
  }, [hasAccess, router, fallbackPath]);

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
} 