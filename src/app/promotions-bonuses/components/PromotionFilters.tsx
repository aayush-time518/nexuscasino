'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface PromotionFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

interface FilterOption {
  id: string;
  label: string;
  icon: string;
  count?: number;
}

const PromotionFilters = ({
  selectedCategory,
  onCategoryChange,
}: PromotionFiltersProps) => {
  const filters: FilterOption[] = [
    { id: 'all', label: 'All Offers', icon: 'SparklesIcon', count: 6 },
    { id: 'welcome', label: 'Welcome', icon: 'GiftIcon', count: 1 },
    { id: 'reload', label: 'Reload', icon: 'ArrowPathIcon', count: 2 },
    { id: 'freespins', label: 'Free Spins', icon: 'BoltIcon', count: 1 },
    { id: 'cashback', label: 'Cashback', icon: 'CurrencyDollarIcon', count: 1 },
    { id: 'vip', label: 'VIP Only', icon: 'StarIcon', count: 1 },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-text-primary">
        Browse by Category
      </h2>

      {/* Desktop View - Horizontal Scrollable */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-3 pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onCategoryChange(filter.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-smooth ${
                selectedCategory === filter.id
                  ? 'bg-primary text-black shadow-warm-md'
                  : 'bg-card hover:bg-muted text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              <Icon
                name={filter.icon as any}
                size={20}
                className={
                  selectedCategory === filter.id
                    ? 'text-black'
                    : 'text-text-secondary'
                }
              />
              <span>{filter.label}</span>
              {filter.count !== undefined && (
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    selectedCategory === filter.id
                      ? 'bg-black/20 text-black'
                      : 'bg-muted text-text-secondary'
                  }`}
                >
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionFilters;
