import { 
  getUserRole, 
  hasRequiredRole, 
  checkRouteAccess, 
  getLoginRedirect,
  getRouteDisplayName 
} from './route-protection';
import { AuthUser } from './auth';

// Mock user data
const mockUser: AuthUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  confirmed: true,
  blocked: false
};

describe('route-protection', () => {
  describe('getUserRole', () => {
    it('should return null for null user', () => {
      expect(getUserRole(null)).toBeNull();
    });

    it('should return employee role for authenticated user', () => {
      expect(getUserRole(mockUser)).toBe('employee');
    });
  });

  describe('hasRequiredRole', () => {
    it('should return true when no roles required', () => {
      expect(hasRequiredRole('employee', undefined)).toBe(true);
      expect(hasRequiredRole('employee', [])).toBe(true);
    });

    it('should return false when user has no role', () => {
      expect(hasRequiredRole(null, ['employee'])).toBe(false);
    });

    it('should respect role hierarchy', () => {
      expect(hasRequiredRole('admin', ['employee'])).toBe(true);
      expect(hasRequiredRole('manager', ['employee'])).toBe(true);
      expect(hasRequiredRole('employee', ['employee'])).toBe(true);
      expect(hasRequiredRole('viewer', ['employee'])).toBe(false);
    });
  });

  describe('checkRouteAccess', () => {
    it('should allow access to public routes', () => {
      const result = checkRouteAccess('/login', false, null);
      expect(result.allowed).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should deny access to authenticated routes for unauthenticated users', () => {
      const result = checkRouteAccess('/', false, null);
      expect(result.allowed).toBe(false);
      expect(result.error?.type).toBe('unauthorized');
      expect(result.error?.redirectTo).toBe('/login');
    });

    it('should allow access to authenticated routes for authenticated users', () => {
      const result = checkRouteAccess('/', true, mockUser);
      expect(result.allowed).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should handle unknown routes with default authentication requirement', () => {
      const result = checkRouteAccess('/unknown', false, null);
      expect(result.allowed).toBe(false);
      expect(result.error?.type).toBe('unauthorized');
    });
  });

  describe('getLoginRedirect', () => {
    it('should redirect to dashboard for no intended path', () => {
      expect(getLoginRedirect()).toBe('/');
      expect(getLoginRedirect(undefined)).toBe('/');
    });

    it('should redirect to dashboard for login path', () => {
      expect(getLoginRedirect('/login')).toBe('/');
    });

    it('should redirect to valid known routes', () => {
      expect(getLoginRedirect('/products')).toBe('/products');
      expect(getLoginRedirect('/sales')).toBe('/sales');
    });

    it('should redirect to dashboard for unknown routes', () => {
      expect(getLoginRedirect('/unknown')).toBe('/');
    });
  });

  describe('getRouteDisplayName', () => {
    it('should return configured display names', () => {
      expect(getRouteDisplayName('/')).toBe('Dashboard');
      expect(getRouteDisplayName('/products')).toBe('Products');
      expect(getRouteDisplayName('/stock')).toBe('Stock Management');
      expect(getRouteDisplayName('/purchases')).toBe('Purchases');
    });

    it('should generate display name for unknown routes', () => {
      expect(getRouteDisplayName('/unknown')).toBe('Unknown');
      expect(getRouteDisplayName('/some-route')).toBe('Some-route');
    });
  });

  describe('checkRouteAccess purchases', () => {
    it('should allow access to purchases route for authenticated users', () => {
      const result = checkRouteAccess('/purchases', true, mockUser);
      expect(result.allowed).toBe(true);
      expect(result.error).toBeUndefined();
    });


    it('should deny access to purchases route for unauthenticated users', () => {
      const result = checkRouteAccess('/purchases', false, null);
      expect(result.allowed).toBe(false);
      expect(result.error?.type).toBe('unauthorized');
    });
  });
});