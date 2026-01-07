'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: string;
  date: string;
  estimatedCompletion?: string;
}

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const getStatusColor = () => {
    switch (transaction.status) {
      case 'completed':
        return 'text-success bg-success/20';
      case 'pending':
        return 'text-warning bg-warning/20';
      case 'processing':
        return 'text-accent bg-accent/20';
      case 'failed':
        return 'text-error bg-error/20';
      default:
        return 'text-text-secondary bg-muted';
    }
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
        return 'CheckCircleIcon';
      case 'pending':
        return 'ClockIcon';
      case 'processing':
        return 'ArrowPathIcon';
      case 'failed':
        return 'XCircleIcon';
      default:
        return 'InformationCircleIcon';
    }
  };

  return (
    <div className="p-4 bg-surface-elevated-1 rounded-md border border-border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-md ${
              transaction.type === 'deposit' ? 'bg-success/20' : 'bg-warning/20'
            }`}
          >
            <Icon
              name={
                transaction.type === 'deposit'
                  ? 'ArrowDownTrayIcon'
                  : 'ArrowUpTrayIcon'
              }
              size={20}
              className={
                transaction.type === 'deposit' ? 'text-success' : 'text-warning'
              }
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
            </p>
            <p className="text-xs text-text-secondary mt-0.5 caption">
              {transaction.method}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-text-primary data-text">
            {transaction.type === 'deposit' ? '+' : '-'}$
            {transaction.amount.toFixed(2)}
          </p>
          <p className="text-xs text-text-secondary mt-0.5 caption">
            {transaction.date}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getStatusColor()}`}
        >
          <Icon name={getStatusIcon() as any} size={14} variant="solid" />
          <span className="text-xs font-medium capitalize caption">
            {transaction.status}
          </span>
        </div>
        {transaction.estimatedCompletion &&
          transaction.status !== 'completed' && (
            <p className="text-xs text-text-secondary caption">
              Est. {transaction.estimatedCompletion}
            </p>
          )}
      </div>
    </div>
  );
};

export default TransactionCard;
