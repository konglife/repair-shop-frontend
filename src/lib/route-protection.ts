/**
 * Enhanced route protection utilities for role-based access control
 * and improved error handling for the Repair Shop Dashboard
 */

import { AuthUser } from '@/lib/auth';

// Define user roles for future expansion
export type UserRole = 'admin' | 'manager' | 'employee' | 'viewer';

// Route protection levels
export type ProtectionLevel = 'public' | 'authenticated' | 'role-based';

// Route configuration interface
export interface RouteConfig {
  path: string;
  protection: ProtectionLevel;
  requiredRoles?: UserRole[];
  redirectTo?: string;
  displayName?: string;
}

// Error types for route access
export interface RouteAccessError {
  type: 'unauthorized' | 'forbidden' | 'not_found' | 'token_expired';
  message: string;
  redirectTo?: string;
}

// Route configuration for the application
export const routeConfigs: Record<string, RouteConfig> = {
  '/': {
    path: '/',
    protection: 'authenticated',
    displayName: 'Dashboard'
  },
  '/products': {
    path: '/products',
    protection: 'authenticated',
    displayName: 'Products'
  },
  '/stock': {
    path: '/stock',
    protection: 'authenticated',
    displayName: 'Stock Management'
  },
  '/sales': {
    path: '/sales',
    protection: 'authenticated',
    displayName: 'Sales'
  },
  '/repairs': {
    path: '/repairs',
    protection: 'authenticated',
    displayName: 'Repairs'
  },
  '/purchases': {
    path: '/purchases',
    protection: 'authenticated',
    displayName: 'Purchases'
  },
  '/login': {
    path: '/login',
    protection: 'public',
    displayName: 'Login'
  }
};

/**
 * Get user role from user data
 * For now, all authenticated users are 'employee' level
 * This can be expanded when role data is added to the backend
 */
export function getUserRole(user: AuthUser | null): UserRole | null {
  if (!user) return null;
  
  // Future: Extract role from user.role or user.permissions
  // For now, all authenticated users are employees
  return 'employee';
}

/**
 * Check if user has required role for a route
 */
export function hasRequiredRole(userRole: UserRole | null, requiredRoles?: UserRole[]): boolean {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  if (!userRole) return false;
  
  // Role hierarchy (higher roles include permissions of lower roles)
  const roleHierarchy: Record<UserRole, number> = {
    viewer: 1,
    employee: 2,
    manager: 3,
    admin: 4
  };
  
  const userLevel = roleHierarchy[userRole] || 0;
  const minRequiredLevel = Math.min(...requiredRoles.map(role => roleHierarchy[role] || 999));
  
  return userLevel >= minRequiredLevel;
}

/**
 * Check route access for a user
 */
export function checkRouteAccess(
  path: string,
  isAuthenticated: boolean,
  user: AuthUser | null
): { allowed: boolean; error?: RouteAccessError } {
  const config = routeConfigs[path];
  
  // If no specific config, default to authenticated access
  const protection = config?.protection || 'authenticated';
  const requiredRoles = config?.requiredRoles;
  
  // Public routes are always accessible
  if (protection === 'public') {
    return { allowed: true };
  }
  
  // Check authentication
  if (!isAuthenticated || !user) {
    return {
      allowed: false,
      error: {
        type: 'unauthorized',
        message: 'You must be logged in to access this page.',
        redirectTo: '/login'
      }
    };
  }
  
  // Check role-based access
  if (protection === 'role-based') {
    const userRole = getUserRole(user);
    
    if (!hasRequiredRole(userRole, requiredRoles)) {
      return {
        allowed: false,
        error: {
          type: 'forbidden',
          message: 'You do not have permission to access this page.',
          redirectTo: '/'
        }
      };
    }
  }
  
  return { allowed: true };
}

/**
 * Get redirect destination after successful login
 */
export function getLoginRedirect(intendedPath?: string): string {
  // Don't redirect to login or other auth pages
  if (!intendedPath || intendedPath === '/login') {
    return '/';
  }
  
  // Validate the intended path is a known route
  if (routeConfigs[intendedPath]) {
    return intendedPath;
  }
  
  // Default to dashboard
  return '/';
}

/**
 * Get display name for a route
 */
export function getRouteDisplayName(path: string): string {
  return routeConfigs[path]?.displayName || path.replace('/', '').replace(/^\w/, c => c.toUpperCase());
}