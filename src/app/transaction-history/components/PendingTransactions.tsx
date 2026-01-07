'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import type { Transaction } from './TransactionHistoryInteractive';

interface PendingTransactionsProps {
  transactions: Transaction[];
}

const PendingTransactions = ({ transactions }: PendingTransactionsProps) => {
  if (transactions.length === 0) return null;

  return (
    <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
          <Icon name="ClockIcon" size={20} className="text-black" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-primary">
            Pending Transactions
          </h2>
          <p className="text-sm text-text-secondary">
            {transactions.length} transaction(s) awaiting completion
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-card rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center">
                <Icon
                  name={
                    transaction.type === 'withdrawal'
                      ? 'ArrowUpTrayIcon'
                      : 'ArrowDownTrayIcon'
                  }
                  size={16}
                  className="text-amber-500"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {transaction.description}
                </p>
                <p className="text-xs text-text-secondary">
                  Est. completion: 1-3 business days
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-text-primary">
                ${transaction.amount.toFixed(2)}
              </p>
              <button className="text-xs text-primary hover:text-primary-dark mt-1">
                Track Status
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingTransactions;
