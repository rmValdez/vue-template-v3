import { ROLE_PERMISSIONS, type Role, type Permission } from './permissions';

export class RbacEngine {
  hasPermission(userRole: Role | undefined | null, permission: Permission): boolean {
    if (!userRole) return false;
    const permissions = ROLE_PERMISSIONS[userRole] || [];
    return permissions.includes(permission);
  }

  hasAllPermissions(
    userRole: Role | undefined | null,
    permissions: Permission[]
  ): boolean {
    if (!userRole || permissions.length === 0) return false;
    return permissions.every(perm => this.hasPermission(userRole, perm));
  }

  hasAnyPermission(
    userRole: Role | undefined | null,
    permissions: Permission[]
  ): boolean {
    if (!userRole) return false;
    return permissions.some(perm => this.hasPermission(userRole, perm));
  }

  canAccessRoute(userRole: Role | undefined | null, requiredRoles?: Role[]): boolean {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!userRole) return false;
    return requiredRoles.includes(userRole);
  }
}

export const rbac = new RbacEngine();
