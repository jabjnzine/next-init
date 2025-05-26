import { useAuthStore } from '../store';

export function usePermissions() {
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const user = useAuthStore((state) => state.user);

  return {
    hasPermission,
    isAdmin: user?.superadmin || user?.roles?.name === 'Superadmin',
    username: user?.users?.username,
    roleId: user?.users?.role_id,
    roleName: user?.roles?.name,
    permissions: user?.permission || [],
    hasAnyPermission: (permissions: string[]) =>
      permissions.some(permission => hasPermission(permission)),
    hasAllPermissions: (permissions: string[]) =>
      permissions.every(permission => hasPermission(permission)),
  };
} 