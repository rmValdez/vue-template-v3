import { describe, it, expect } from 'vitest';
import { rbac } from '../rbac';

describe('RbacEngine', () => {
  it('allows admin full permissions', () => {
    expect(rbac.hasPermission('admin', 'users:delete')).toBe(true);
    expect(rbac.hasPermission('admin', 'settings:manage')).toBe(true);
    expect(rbac.hasPermission('admin', 'posts:create')).toBe(true);
  });

  it('restricts member from admin permissions', () => {
    expect(rbac.hasPermission('member', 'users:delete')).toBe(false);
    expect(rbac.hasPermission('member', 'settings:manage')).toBe(false);
    expect(rbac.hasPermission('member', 'posts:create')).toBe(true);
  });

  it('restricts guest to read only', () => {
    expect(rbac.hasPermission('guest', 'posts:create')).toBe(false);
    expect(rbac.hasPermission('guest', 'posts:read')).toBe(true);
  });

  it('validates canAccessRoute with allowed roles', () => {
    expect(rbac.canAccessRoute('admin', ['admin', 'manager'])).toBe(true);
    expect(rbac.canAccessRoute('member', ['admin', 'manager'])).toBe(false);
    expect(rbac.canAccessRoute('member', undefined)).toBe(true);
  });
});
