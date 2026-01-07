'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import type { Transaction } from './TransactionHistoryInteractive';

interface TransactionTableProps {
  transactions: Transaction[];
  expandedTransaction: string | null;
  onToggleExpand: (transactionId: string) => void;
}

const TransactionTable = ({
  transactions,
  expandedTransaction,
  onToggleExpand,
}: TransactionTableProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'ArrowDownTrayIcon';
      case 'withdrawal':
        return 'ArrowUpTrayIcon';
      case 'win':
        return 'TrophyIcon';
      case 'loss':
        return 'XMarkIcon';
      case 'bonus':
        return 'GiftIcon';
      case 'refund':
        return 'ArrowPathIcon';
      default:
        return 'DocumentTextIcon';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-blue-500 bg-blue-500/10';
      case 'withdrawal':
        return 'text-purple-500 bg-purple-500/10';
      case 'win':
        return 'text-green-500 bg-green-500/10';
      case 'loss':
        return 'text-red-500 bg-red-500/10';
      case 'bonus':
        return 'text-amber-500 bg-amber-500/10';
      default:
        return 'text-text-secondary bg-muted';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500';
      case 'failed':
        return 'bg-red-500/10 text-red-500';
      case 'cancelled':
        return 'bg-gray-500/10 text-gray-500';
      default:
        return 'bg-muted text-text-secondary';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const formatAmount = (amount: number, type: string) => {
    const prefix = ['withdrawal', 'loss'].includes(type) ? '-' : '+';
    return `${prefix}$${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-card rounded-xl shadow-warm-md border border-border overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                Date & Time
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                Description
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-text-primary">
                Amount
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-text-primary">
                Status
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-text-primary">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((transaction) => {
              const { date, time } = formatDate(transaction.date);
              const isExpanded = expandedTransaction === transaction.id;

              return (
                <React.Fragment key={transaction.id}>
                  <tr className="hover:bg-muted/50 transition-smooth">
                    <td className="px-6 py-4">
                      <div className="text-sm text-text-primary font-medium">
                        {date}
                      </div>
                      <div className="text-xs text-text-secondary">{time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(
                            transaction.type
                          )}`}
                        >
                          <Icon
                            name={getTypeIcon(transaction.type) as any}
                            size={16}
                          />
                        </div>
                        <span className="text-sm text-text-primary capitalize">
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-text-primary">
                        {transaction.description}
                      </div>
                      {transaction.paymentMethod && (
                        <div className="text-xs text-text-secondary mt-1">
                          {transaction.paymentMethod}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`text-sm font-semibold ${
                          ['deposit', 'win', 'bonus'].includes(transaction.type)
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {formatAmount(transaction.amount, transaction.type)}
                      </span>
                      {transaction.fee && transaction.fee > 0 && (
                        <div className="text-xs text-text-secondary mt-1">
                          Fee: ${transaction.fee.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onToggleExpand(transaction.id)}
                        className="text-primary hover:text-primary-dark transition-smooth"
                      >
                        <Icon
                          name={
                            isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'
                          }
                          size={20}
                        />
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-muted/30">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-text-secondary">
                              Transaction ID:
                            </span>
                            <span className="ml-2 text-text-primary font-mono">
                              {transaction.transactionId}
                            </span>
                          </div>
                          {transaction.gameSession && (
                            <div>
                              <span className="text-text-secondary">
                                Game Session:
                              </span>
                              <span className="ml-2 text-text-primary font-mono">
                                {transaction.gameSession}
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="text-text-secondary">
                              Processing Time:
                            </span>
                            <span className="ml-2 text-text-primary">
                              Instant
                            </span>
                          </div>
                          {transaction.fee !== undefined && (
                            <div>
                              <span className="text-text-secondary">
                                Transaction Fee:
                              </span>
                              <span className="ml-2 text-text-primary">
                                ${transaction.fee.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-border">
        {transactions.map((transaction) => {
          const { date, time } = formatDate(transaction.date);
          const isExpanded = expandedTransaction === transaction.id;

          return (
            <div key={transaction.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(
                      transaction.type
                    )}`}
                  >
                    <Icon
                      name={getTypeIcon(transaction.type) as any}
                      size={20}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary capitalize">
                      {transaction.type}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {date} · {time}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    ['deposit', 'win', 'bonus'].includes(transaction.type)
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {formatAmount(transaction.amount, transaction.type)}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <p className="text-sm text-text-primary">
                  {transaction.description}
                </p>
                {transaction.paymentMethod && (
                  <p className="text-xs text-text-secondary">
                    {transaction.paymentMethod}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    transaction.status
                  )}`}
                >
                  {transaction.status}
                </span>
                <button
                  onClick={() => onToggleExpand(transaction.id)}
                  className="text-primary hover:text-primary-dark text-sm font-medium flex items-center gap-1"
                >
                  {isExpanded ? 'Hide' : 'Show'} Details
                  <Icon
                    name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                    size={16}
                  />
                </button>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Transaction ID:</span>
                    <span className="text-text-primary font-mono text-xs">
                      {transaction.transactionId}
                    </span>
                  </div>
                  {transaction.gameSession && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Game Session:</span>
                      <span className="text-text-primary font-mono text-xs">
                        {transaction.gameSession}
                      </span>
                    </div>
                  )}
                  {transaction.fee !== undefined && transaction.fee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Fee:</span>
                      <span className="text-text-primary">
                        ${transaction.fee.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionTable;
