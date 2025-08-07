/**
 * Enhanced route guard hook with role-based access control and error handling
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { checkRouteAccess, RouteAccessError } from '@/lib/route-protection';

export interface UseRouteGuardOptions {
  redirectTo?: string;
  showLoading?: boolean;
  onAccessDenied?: (error: RouteAccessError) => void;
}

export interface UseRouteGuardReturn {
  isLoading: boolean;
  isAllowed: boolean;
  error: RouteAccessError | null;
  isRedirecting: boolean;
}

export function useRouteGuard(options: UseRouteGuardOptions = {}): UseRouteGuardReturn {
  const { 
    redirectTo, 
    onAccessDenied 
  } = options;
  
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [error, setError] = useState<RouteAccessError | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      setIsLoading(true);
      return;
    }

    // Check route access
    const accessResult = checkRouteAccess(pathname, isAuthenticated, user);
    
    if (accessResult.allowed) {
      setIsAllowed(true);
      setError(null);
      setIsLoading(false);
    } else {
      setIsAllowed(false);
      setError(accessResult.error || null);
      
      // Handle access denied
      if (accessResult.error) {
        if (onAccessDenied) {
          onAccessDenied(accessResult.error);
        }
        
        // Auto-redirect if specified
        const targetRedirect = redirectTo || accessResult.error.redirectTo;
        if (targetRedirect) {
          setIsRedirecting(true);
          
          // For login redirects, preserve the intended destination
          if (targetRedirect === '/login') {
            const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
            router.push(loginUrl);
          } else {
            router.push(targetRedirect);
          }
          
          // Keep loading state during redirect
          return;
        }
      }
      
      setIsLoading(false);
    }
  }, [
    authLoading, 
    isAuthenticated, 
    user, 
    pathname, 
    redirectTo, 
    onAccessDenied, 
    router
  ]);

  return {
    isLoading,
    isAllowed,
    error,
    isRedirecting
  };
}

/**
 * Higher-order component for route protection
 */
export function withRouteGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: UseRouteGuardOptions = {}
): React.ComponentType<P> {
  const GuardedComponent = (props: P) => {
    const { isLoading, isAllowed, error, isRedirecting } = useRouteGuard(options);

    // Show loading during auth check or redirect
    if (isLoading || isRedirecting) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px',
          padding: '20px'
        }}>
          <div>Loading...</div>
        </div>
      );
    }

    // Show error if access denied and not redirecting
    if (!isAllowed && error && !isRedirecting) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2>Access Denied</h2>
          <p>{error.message}</p>
        </div>
      );
    }

    // Render component if access is allowed
    if (isAllowed) {
      return <WrappedComponent {...props} />;
    }

    // Fallback loading state
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px' 
      }}>
        <div>Loading...</div>
      </div>
    );
  };

  GuardedComponent.displayName = `withRouteGuard(${WrappedComponent.displayName || WrappedComponent.name})`;

  return GuardedComponent;
}