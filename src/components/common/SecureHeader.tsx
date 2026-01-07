'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface SecureHeaderProps {
  className?: string;
  showBalance?: boolean;
  onLogout?: () => void;
}

const SecureHeader = ({
  className = '',
  showBalance = true,
  onLogout,
}: SecureHeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState(1234.56);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check auth token from storage
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const expiry = localStorage.getItem('sessionExpiry');

      if (token && expiry) {
        if (Date.now() < parseInt(expiry)) {
          setIsAuthenticated(true);
          return;
        }
      }
      setIsAuthenticated(false);
    };

    checkAuth();

    // Listen for storage events (logout/login in other tabs)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [pathname]); // keeping pathname to re-check on nav, though storage event is better

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsAuthenticated(false);
    setShowUserMenu(false);
    router.push('/login');
  };

  // Poll for auth changes to handle client-side updates that don't trigger storage event
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      const token = localStorage.getItem('authToken');
      const expiry = localStorage.getItem('sessionExpiry');
      const isValid = token && expiry && Date.now() < parseInt(expiry);

      if (isValid !== isAuthenticated) {
        setIsAuthenticated(!!isValid);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [mounted, isAuthenticated]);

  const handleDeposit = () => {
    router.push('/payment-methods');
  };

  if (!mounted) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 bg-card shadow-warm-md z-[200] ${className}`}
      role="banner"
    >
      <div className="flex items-center justify-between h-16 px-4 max-w-screen-xl mx-auto">
        <Link
          href="/game-lobby"
          className="flex items-center gap-3 transition-smooth hover:opacity-80"
          aria-label="Nexus Gaming Casino Home"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-md">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M16 4L4 10V22L16 28L28 22V10L16 4Z"
                fill="currentColor"
                className="text-black"
              />
              <path
                d="M16 12L10 15V21L16 24L22 21V15L16 12Z"
                fill="currentColor"
                className="text-accent"
              />
            </svg>
          </div>
          <span className="text-xl font-semibold text-text-primary font-heading hidden sm:block">
            Nexus Gaming Casino
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated && showBalance && (
            <>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-surface-elevated-1 rounded-md border border-border">
                <Icon
                  name="CurrencyDollarIcon"
                  size={20}
                  className="text-accent"
                />
                <span className="text-sm font-medium text-text-primary data-text">
                  ${balance.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleDeposit}
                className="flex items-center gap-2 h-10 px-6 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:scale-[0.97] hover:shadow-glow-primary active:scale-95"
                aria-label="Deposit funds"
              >
                <Icon name="PlusIcon" size={18} />
                <span className="hidden sm:inline">Deposit</span>
              </button>
            </>
          )}

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center justify-center w-10 h-10 bg-surface-elevated-1 rounded-full border border-border transition-smooth hover:border-accent hover:shadow-glow-accent"
                aria-label="User menu"
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                <Icon
                  name="UserCircleIcon"
                  size={24}
                  className="text-text-primary"
                />
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-[49]"
                    onClick={() => setShowUserMenu(false)}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute right-0 top-12 w-56 bg-popover border border-border rounded-md shadow-warm-lg z-[50]"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-medium text-text-primary">
                        Account
                      </p>
                      <p className="text-xs text-text-secondary mt-1 caption">
                        user@example.com
                      </p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/account-dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-muted transition-smooth"
                        role="menuitem"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Icon name="UserCircleIcon" size={18} />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/payment-methods"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-muted transition-smooth"
                        role="menuitem"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Icon name="CreditCardIcon" size={18} />
                        <span>Payment Methods</span>
                      </Link>
                    </div>
                    <div className="border-t border-border py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-error hover:bg-muted transition-smooth"
                        role="menuitem"
                      >
                        <Icon name="ArrowRightOnRectangleIcon" size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 h-10 px-6 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:scale-[0.97] hover:shadow-glow-primary active:scale-95"
            >
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default SecureHeader;
