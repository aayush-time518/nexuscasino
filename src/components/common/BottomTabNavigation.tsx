'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface TabItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
  requiresAuth?: boolean;
}

interface BottomTabNavigationProps {
  className?: string;
}

const BottomTabNavigation = ({ className = '' }: BottomTabNavigationProps) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs: TabItem[] = [
    {
      label: 'Games',
      path: '/game-lobby',
      icon: 'SparklesIcon',
      requiresAuth: false,
    },
    {
      label: 'Account',
      path: '/account-dashboard',
      icon: 'UserCircleIcon',
      requiresAuth: true,
    },
    {
      label: 'Wallet',
      path: '/payment-methods',
      icon: 'CreditCardIcon',
      requiresAuth: true,
    },
    {
      label: 'Profile',
      path: '/login',
      icon: 'UserIcon',
      requiresAuth: false,
    },
  ];

  const isActive = (path: string) => {
    if (
      path === '/login' &&
      (pathname === '/login' || pathname === '/registration')
    ) {
      return true;
    }
    if (
      path === '/game-lobby' &&
      (pathname === '/game-lobby' || pathname === '/game-play-interface')
    ) {
      return true;
    }
    return pathname === path;
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-warm-lg z-[100] ${className}`}
      role="navigation"
      aria-label="Bottom tab navigation"
    >
      <div className="flex items-center justify-around h-20 px-4 max-w-screen-xl mx-auto">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-3 py-2 rounded-md transition-smooth relative group ${
                active
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-muted'
              }`}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  name={tab.icon as any}
                  variant={active ? 'solid' : 'outline'}
                  size={24}
                  className={`transition-smooth ${
                    active
                      ? 'text-primary'
                      : 'text-text-secondary group-hover:text-text-primary'
                  }`}
                />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-medium text-black bg-accent rounded-full">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] font-medium mt-1 transition-smooth caption ${
                  active
                    ? 'text-primary'
                    : 'text-text-secondary group-hover:text-text-primary'
                }`}
              >
                {tab.label}
              </span>
              {active && (
                <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-12 h-[2px] bg-primary rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabNavigation;
