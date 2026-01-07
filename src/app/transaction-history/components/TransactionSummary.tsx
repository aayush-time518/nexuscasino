'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import type { Transaction } from './TransactionHistoryInteractive';

interface TransactionSummaryProps {
  transactions: Transaction[];
}

const TransactionSummary = ({ transactions }: TransactionSummaryProps) => {
  const calculateSummary = () => {
    const summary = {
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalWins: 0,
      totalLosses: 0,
      netActivity: 0,
    };

    transactions.forEach((transaction) => {
      switch (transaction.type) {
        case 'deposit':
          summary.totalDeposits += transaction.amount;
          break;
        case 'withdrawal':
          summary.totalWithdrawals += transaction.amount;
          break;
        case 'win':
          summary.totalWins += transaction.amount;
          break;
        case 'loss':
          summary.totalLosses += transaction.amount;
          break;
      }
    });

    summary.netActivity =
      summary.totalDeposits +
      summary.totalWins -
      summary.totalWithdrawals -
      summary.totalLosses;

    return summary;
  };

  const summary = calculateSummary();

  const summaryCards = [
    {
      title: 'Total Deposits',
      amount: summary.totalDeposits,
      icon: 'ArrowDownTrayIcon',
      color: 'text-blue-500 bg-blue-500/10',
      trend: '+12.5%',
    },
    {
      title: 'Total Withdrawals',
      amount: summary.totalWithdrawals,
      icon: 'ArrowUpTrayIcon',
      color: 'text-purple-500 bg-purple-500/10',
      trend: '+8.3%',
    },
    {
      title: 'Total Wins',
      amount: summary.totalWins,
      icon: 'TrophyIcon',
      color: 'text-green-500 bg-green-500/10',
      trend: '+15.7%',
    },
    {
      title: 'Net Activity',
      amount: summary.netActivity,
      icon: 'ChartBarIcon',
      color:
        summary.netActivity >= 0
          ? 'text-green-500 bg-green-500/10'
          : 'text-red-500 bg-red-500/10',
      trend: summary.netActivity >= 0 ? '+5.2%' : '-3.4%',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((card, index) => (
        <div
          key={index}
          className="bg-card rounded-xl p-6 shadow-warm-md border border-border hover:shadow-warm-lg transition-smooth"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${card.color}`}
            >
              <Icon name={card.icon as any} size={24} />
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                card.trend.startsWith('+')
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-red-500/10 text-red-500'
              }`}
            >
              {card.trend}
            </span>
          </div>
          <div>
            <p className="text-text-secondary text-sm mb-1">{card.title}</p>
            <p
              className={`text-2xl font-bold ${
                card.amount >= 0 ? 'text-text-primary' : 'text-red-500'
              }`}
            >
              $
              {Math.abs(card.amount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionSummary;
