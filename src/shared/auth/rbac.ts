import { ROLE_PERMISSIONS, type Role, type Permission } from './permissions';

export interface UserPermissionHolder {
  role?: Role | string;
  permissions?: string[];
}

export class RbacEngine {
  hasPermission(
    subject: UserPermissionHolder | Role | undefined | null,
    permission: Permission | string
  ): boolean {
    if (!subject) return false;

    // 1. Direct backend permissions check (Single Source of Truth)
    if (typeof subject === 'object' && Array.isArray(subject.permissions)) {
      if (subject.permissions.includes('*')) return true;
      if (subject.permissions.includes(permission)) return true;
    }

    // 2. Fallback to client role matrix
    const role = (typeof subject === 'object' ? subject.role : subject) as Role | undefined;
    if (!role) return false;
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission as Permission);
  }

  hasAllPermissions(
    subject: UserPermissionHolder | Role | undefined | null,
    permissions: (Permission | string)[]
  ): boolean {
    if (!subject || permissions.length === 0) return false;
    return permissions.every(perm => this.hasPermission(subject, perm));
  }

  hasAnyPermission(
    subject: UserPermissionHolder | Role | undefined | null,
    permissions: (Permission | string)[]
  ): boolean {
    if (!subject) return false;
    return permissions.some(perm => this.hasPermission(subject, perm));
  }

  canAccessRoute(userRole: Role | undefined | null, requiredRoles?: Role[]): boolean {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!userRole) return false;
    return requiredRoles.includes(userRole);
  }
}

export const rbac = new RbacEngine();
