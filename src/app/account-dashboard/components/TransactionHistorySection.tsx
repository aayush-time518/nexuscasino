'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
}

interface TransactionHistorySectionProps {
  transactions: Transaction[];
}

const TransactionHistorySection = ({
  transactions,
}: TransactionHistorySectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [filter, setFilter] = useState<
    'all' | 'deposit' | 'withdrawal' | 'gaming'
  >('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-warm-md">
        <div className="animate-pulse">
          <div className="h-6 bg-surface-elevated-1 rounded w-40 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-surface-elevated-1 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getFilteredTransactions = () => {
    let filtered = transactions;

    if (filter === 'deposit') {
      filtered = transactions.filter((t) => t.type === 'deposit');
    } else if (filter === 'withdrawal') {
      filtered = transactions.filter((t) => t.type === 'withdrawal');
    } else if (filter === 'gaming') {
      filtered = transactions.filter(
        (t) => t.type === 'bet' || t.type === 'win'
      );
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return { name: 'ArrowDownTrayIcon' as const, color: 'text-success' };
      case 'withdrawal':
        return { name: 'ArrowUpTrayIcon' as const, color: 'text-warning' };
      case 'bet':
        return {
          name: 'CurrencyDollarIcon' as const,
          color: 'text-text-secondary',
        };
      case 'win':
        return { name: 'TrophyIcon' as const, color: 'text-accent' };
      case 'bonus':
        return { name: 'GiftIcon' as const, color: 'text-primary' };
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/20 text-success text-xs font-medium rounded-md caption">
            <Icon name="CheckCircleIcon" size={14} />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning/20 text-warning text-xs font-medium rounded-md caption">
            <Icon name="ClockIcon" size={14} />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-error/20 text-error text-xs font-medium rounded-md caption">
            <Icon name="XCircleIcon" size={14} />
            Failed
          </span>
        );
    }
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-warm-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-text-primary font-heading">
          Transaction History
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-elevated-1 rounded-lg p-1">
            {(['all', 'deposit', 'withdrawal', 'gaming'] as const).map(
              (filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-smooth caption ${
                    filter === filterType
                      ? 'bg-primary text-primary-foreground'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              )
            )}
          </div>

          <button
            onClick={() =>
              setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')
            }
            className="flex items-center gap-2 px-3 py-2 bg-surface-elevated-1 border border-border rounded-lg text-sm font-medium text-text-primary transition-smooth hover:border-accent caption"
            aria-label={`Sort by ${
              sortOrder === 'newest' ? 'oldest' : 'newest'
            } first`}
          >
            <Icon
              name={sortOrder === 'newest' ? 'ArrowDownIcon' : 'ArrowUpIcon'}
              size={16}
            />
            <span className="hidden sm:inline">
              {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
            </span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex items-center justify-center w-16 h-16 bg-surface-elevated-1 rounded-full mb-4">
              <Icon
                name="DocumentTextIcon"
                size={32}
                className="text-text-secondary"
              />
            </div>
            <p className="text-sm text-text-secondary caption">
              No transactions found
            </p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => {
            const iconConfig = getTransactionIcon(transaction.type);
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-surface-elevated-1 border border-border rounded-lg transition-smooth hover:border-accent"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className={`flex items-center justify-center w-10 h-10 ${iconConfig.color}/20 rounded-full flex-shrink-0`}
                  >
                    <Icon
                      name={iconConfig.name}
                      size={20}
                      className={iconConfig.color}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-text-secondary mt-1 caption">
                      {transaction.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                  <div className="text-right">
                    <p
                      className={`text-lg font-semibold data-text ${
                        transaction.type === 'deposit' ||
                        transaction.type === 'win'
                          ? 'text-success'
                          : transaction.type === 'withdrawal' ||
                            transaction.type === 'bet'
                          ? 'text-text-primary'
                          : 'text-accent'
                      }`}
                    >
                      {transaction.type === 'deposit' ||
                      transaction.type === 'win'
                        ? '+'
                        : '-'}
                      ${transaction.amount.toFixed(2)}
                    </p>
                    <div className="mt-1">
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {filteredTransactions.length > 0 && (
        <div className="flex justify-center mt-6">
          <button className="flex items-center gap-2 px-6 py-2 bg-surface-elevated-1 border border-border rounded-lg text-sm font-medium text-text-primary transition-smooth hover:border-accent hover:shadow-glow-accent caption">
            <span>Load More</span>
            <Icon name="ChevronDownIcon" size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistorySection;
