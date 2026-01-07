'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthenticationGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthenticationGuard = ({
  children,
  requireAuth = false,
  redirectTo = '/login',
}: AuthenticationGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const sessionExpiry = localStorage.getItem('sessionExpiry');

        if (!authToken || !sessionExpiry) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const expiryTime = parseInt(sessionExpiry, 10);
        const currentTime = Date.now();

        if (currentTime > expiryTime) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('sessionExpiry');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();

    const interval = setInterval(() => {
      const sessionExpiry = localStorage.getItem('sessionExpiry');
      const authToken = localStorage.getItem('authToken');

      if (sessionExpiry && authToken) {
        const expiryTime = parseInt(sessionExpiry, 10);
        const currentTime = Date.now();

        if (currentTime > expiryTime) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('sessionExpiry');
          setIsAuthenticated(false);
          router.push(redirectTo);
        } else if (!isAuthenticated) {
          // Recover state if local storage has valid token but state is false
          setIsAuthenticated(true);
        }
      } else if (isAuthenticated) {
        // Token removed but state thinks auth?
        setIsAuthenticated(false);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [router, redirectTo, pathname]); // Added pathname to re-check auth on navigation

  useEffect(() => {
    if (isLoading) return;

    const protectedRoutes = [
      '/account-dashboard',
      '/payment-methods',
      '/game-play-interface',
    ];

    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedRoute && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    const publicOnlyRoutes = ['/login', '/registration'];
    const isPublicOnlyRoute = publicOnlyRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isPublicOnlyRoute && isAuthenticated) {
      router.push('/game-lobby');
      return;
    }
  }, [isAuthenticated, isLoading, pathname, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-surface-elevated-2 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-text-secondary caption">Loading...</p>
        </div>
      </div>
    );
  }

  const protectedRoutes = [
    '/account-dashboard',
    '/payment-methods',
    '/game-play-interface',
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (isProtectedRoute && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthenticationGuard;
