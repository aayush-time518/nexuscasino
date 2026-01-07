'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface AccountSummaryCardProps {
  balance: number;
  pendingWithdrawals: number;
  activeBonuses: number;
}

const AccountSummaryCard = ({
  balance,
  pendingWithdrawals,
  activeBonuses,
}: AccountSummaryCardProps) => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-warm-md">
        <div className="animate-pulse">
          <div className="h-6 bg-surface-elevated-1 rounded w-32 mb-4" />
          <div className="h-12 bg-surface-elevated-1 rounded w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-20 bg-surface-elevated-1 rounded" />
            <div className="h-20 bg-surface-elevated-1 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-warm-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary font-heading">
          Account Summary
        </h2>
        <button
          onClick={() => router.push('/payment-methods')}
          className="flex items-center gap-2 h-10 px-4 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:scale-[0.97] hover:shadow-glow-primary active:scale-95"
          aria-label="Deposit funds"
        >
          <Icon name="PlusIcon" size={18} />
          <span className="text-sm">Deposit</span>
        </button>
      </div>

      <div className="mb-6">
        <p className="text-sm text-text-secondary mb-2 caption">
          Current Balance
        </p>
        <p className="text-4xl font-bold text-primary data-text">
          ${balance.toFixed(2)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-surface-elevated-1 border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-warning/20 rounded-full">
              <Icon name="ClockIcon" size={20} className="text-warning" />
            </div>
            <p className="text-sm text-text-secondary caption">
              Pending Withdrawals
            </p>
          </div>
          <p className="text-2xl font-semibold text-text-primary data-text">
            ${pendingWithdrawals.toFixed(2)}
          </p>
        </div>

        <div className="bg-surface-elevated-1 border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-accent/20 rounded-full">
              <Icon name="GiftIcon" size={20} className="text-accent" />
            </div>
            <p className="text-sm text-text-secondary caption">
              Active Bonuses
            </p>
          </div>
          <p className="text-2xl font-semibold text-text-primary data-text">
            ${activeBonuses.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSummaryCard;
