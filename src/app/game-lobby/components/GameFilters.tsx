'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface GameFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onSearchChange: (search: string) => void;
}

interface FilterState {
  category: string;
  provider: string;
  sortBy: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface Provider {
  id: string;
  name: string;
}

const GameFilters = ({ onFilterChange, onSearchChange }: GameFiltersProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const categories: Category[] = [
    { id: 'all', name: 'All Games', icon: 'SparklesIcon', count: 450 },
    { id: 'slots', name: 'Slots', icon: 'BoltIcon', count: 280 },
    { id: 'table', name: 'Table Games', icon: 'Square3Stack3DIcon', count: 85 },
    { id: 'live', name: 'Live Dealer', icon: 'VideoCameraIcon', count: 45 },
    { id: 'jackpot', name: 'Jackpots', icon: 'TrophyIcon', count: 25 },
    { id: 'new', name: 'New Games', icon: 'FireIcon', count: 15 },
  ];

  const providers: Provider[] = [
    { id: 'all', name: 'All Providers' },
    { id: 'netent', name: 'NetEnt' },
    { id: 'evolution', name: 'Evolution Gaming' },
    { id: 'pragmatic', name: 'Pragmatic Play' },
    { id: 'microgaming', name: 'Microgaming' },
    { id: 'playngo', name: "Play'n GO" },
  ];

  useEffect(() => {
    if (!isHydrated) return;

    onFilterChange({
      category: activeCategory,
      provider: selectedProvider,
      sortBy,
    });
  }, [activeCategory, selectedProvider, sortBy, isHydrated, onFilterChange]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  if (!isHydrated) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-surface-elevated-1 rounded-xl animate-pulse" />
        <div className="h-16 bg-surface-elevated-1 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Icon
            name="MagnifyingGlassIcon"
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search games..."
            className="w-full h-12 pl-12 pr-4 bg-surface-elevated-1 text-text-primary rounded-xl border border-border focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-smooth"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 h-12 px-6 bg-surface-elevated-1 text-text-primary rounded-xl border border-border hover:border-accent transition-smooth sm:hidden"
        >
          <Icon name="AdjustmentsHorizontalIcon" size={20} />
          <span className="font-medium">Filters</span>
        </button>

        <div className="hidden sm:flex items-center gap-3">
          <select
            value={selectedProvider}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="h-12 px-4 bg-surface-elevated-1 text-text-primary rounded-xl border border-border focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-smooth cursor-pointer"
          >
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="h-12 px-4 bg-surface-elevated-1 text-text-primary rounded-xl border border-border focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-smooth cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="new">Newest First</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-col gap-3 p-4 bg-surface-elevated-1 rounded-xl border border-border sm:hidden">
          <select
            value={selectedProvider}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="h-12 px-4 bg-surface-elevated-2 text-text-primary rounded-lg border border-border focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-smooth cursor-pointer"
          >
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="h-12 px-4 bg-surface-elevated-2 text-text-primary rounded-lg border border-border focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-smooth cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="new">Newest First</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-smooth shrink-0 ${
              activeCategory === category.id
                ? 'bg-primary text-primary-foreground shadow-glow-primary'
                : 'bg-surface-elevated-1 text-text-primary border border-border hover:border-accent'
            }`}
          >
            <Icon
              name={category.icon as any}
              size={18}
              variant={activeCategory === category.id ? 'solid' : 'outline'}
            />
            <span>{category.name}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeCategory === category.id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-text-secondary'
              }`}
            >
              {category.count}
            </span>
          </button>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default GameFilters;
