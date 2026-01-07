'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Stat {
  id: number;
  label: string;
  value: string;
  icon: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}

const QuickStats = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [balance, setBalance] = useState(1234.56);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const stats: Stat[] = [
    {
      id: 1,
      label: 'Current Balance',
      value: `$${balance.toFixed(2)}`,
      icon: 'CurrencyDollarIcon',
    },
    {
      id: 2,
      label: 'Active Bonus',
      value: '$50.00',
      icon: 'GiftIcon',
      trend: 'up',
      trendValue: '50% wagered',
    },
    {
      id: 3,
      label: 'Loyalty Points',
      value: '2,450',
      icon: 'StarIcon',
      trend: 'up',
      trendValue: '+150 this week',
    },
  ];

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-surface-elevated-1 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="flex items-center gap-4 p-4 bg-surface-elevated-1 rounded-xl border border-border hover:border-accent transition-smooth"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg shrink-0">
            <Icon
              name={stat.icon as any}
              size={24}
              className="text-primary"
              variant="solid"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-secondary mb-1 caption">
              {stat.label}
            </p>
            <p className="text-xl font-bold text-text-primary data-text">
              {stat.value}
            </p>
            {stat.trend && stat.trendValue && (
              <p className="text-xs text-success mt-1 caption">
                {stat.trendValue}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
