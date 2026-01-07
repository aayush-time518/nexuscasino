'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface TransactionFiltersProps {
  selectedDateRange: string;
  selectedType: string;
  selectedStatus: string;
  searchQuery: string;
  onDateRangeChange: (range: string) => void;
  onTypeChange: (type: string) => void;
  onStatusChange: (status: string) => void;
  onSearchChange: (query: string) => void;
}

const TransactionFilters = ({
  selectedDateRange,
  selectedType,
  selectedStatus,
  searchQuery,
  onDateRangeChange,
  onTypeChange,
  onStatusChange,
  onSearchChange,
}: TransactionFiltersProps) => {
  const dateRanges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'deposit', label: 'Deposits' },
    { value: 'withdrawal', label: 'Withdrawals' },
    { value: 'win', label: 'Wins' },
    { value: 'loss', label: 'Losses' },
    { value: 'bonus', label: 'Bonuses' },
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="bg-card rounded-xl p-6 shadow-warm-md border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="FunnelIcon" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Search
          </label>
          <div className="relative">
            <Icon
              name="MagnifyingGlassIcon"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Transaction ID, description..."
              className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary placeholder:text-text-secondary"
            />
          </div>
        </div>

        {/* Date Range Select */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Date Range
          </label>
          <select
            value={selectedDateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
          >
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Type Select */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
          >
            {types.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Select */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
