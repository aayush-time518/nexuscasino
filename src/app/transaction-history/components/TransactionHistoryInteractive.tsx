'use client';

import React, { useState } from 'react';
import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';
import TransactionSummary from './TransactionSummary';
import ExportOptions from './ExportOptions';
import PendingTransactions from './PendingTransactions';

export interface Transaction {
  id: string;
  date: string;
  type: 'deposit' | 'withdrawal' | 'win' | 'loss' | 'bonus' | 'refund';
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  paymentMethod?: string;
  description: string;
  transactionId: string;
  fee?: number;
  gameSession?: string;
}

const TransactionHistoryInteractive = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('30days');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(
    null
  );

  // Mock transaction data
  useEffect(() => {
    setIsHydrated(true);

    const fetchTransactions = async () => {
      try {
        // Fetch transactions from API
        const response = await fetch('/api/transactions');
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
          setFilteredTransactions(data);
        } else {
          console.error('Failed to fetch transactions');
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const pendingTransactions = allTransactions.filter(
    (t) => t.status === 'pending'
  );

  // Filter transactions based on selected filters
  const filteredTransactions = allTransactions.filter((transaction) => {
    // Type filter
    if (selectedType !== 'all' && transaction.type !== selectedType) {
      return false;
    }

    // Status filter
    if (selectedStatus !== 'all' && transaction.status !== selectedStatus) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(searchLower) ||
        transaction.transactionId.toLowerCase().includes(searchLower) ||
        transaction.paymentMethod?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const handleExport = (format: 'pdf' | 'csv') => {
    console.log(`Exporting transactions as ${format.toUpperCase()}`);
    // Implement export functionality
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
          Transaction History
        </h1>
        <p className="text-text-secondary">
          View and manage your complete financial activity
        </p>
      </div>

      {/* Transaction Summary Cards */}
      <TransactionSummary transactions={allTransactions} />

      {/* Pending Transactions */}
      {pendingTransactions.length > 0 && (
        <PendingTransactions transactions={pendingTransactions} />
      )}

      {/* Filters and Export */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <TransactionFilters
          selectedDateRange={selectedDateRange}
          selectedType={selectedType}
          selectedStatus={selectedStatus}
          searchQuery={searchQuery}
          onDateRangeChange={setSelectedDateRange}
          onTypeChange={setSelectedType}
          onStatusChange={setSelectedStatus}
          onSearchChange={setSearchQuery}
        />
        <ExportOptions onExport={handleExport} />
      </div>

      {/* Transaction Table */}
      <TransactionTable
        transactions={filteredTransactions}
        expandedTransaction={expandedTransaction}
        onToggleExpand={setExpandedTransaction}
      />

      {/* No Results Message */}
      {filteredTransactions.length === 0 && (
        <div className="text-center py-12 bg-card rounded-xl">
          <p className="text-text-secondary text-lg">
            No transactions found matching your filters
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistoryInteractive;
