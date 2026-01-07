'use client';

import React, { useState, useEffect } from 'react';
import HeroBanner from './HeroBanner';
import JackpotTicker from './JackpotTicker';
import QuickStats from './QuickStats';
import GameFilters from './GameFilters';
import GameCard from './GameCard';
import FavoritesSection from './FavouritesSection';
import Icon from '@/components/ui/AppIcon';

interface Game {
  id: number;
  title: string;
  provider: string;
  image: string;
  alt: string;
  category: string;
  isNew?: boolean;
  isHot?: boolean;
  hasDemo?: boolean;
  jackpot?: number;
  isFavorite?: boolean;
}

interface FilterState {
  category: string;
  provider: string;
  sortBy: string;
}

const GameLobbyInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    provider: 'all',
    sortBy: 'popular',
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        if (response.ok) {
          const data = await response.json();
          // Map backend data to frontend interface if needed (already mapped on backend but good to be safe)
          setGames(data);
          setFilteredGames(data);
        } else {
          console.error('Failed to fetch games');
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    let result = [...games];

    if (filters.category !== 'all') {
      result = result.filter((game) => game.category === filters.category);
    }

    if (filters.provider !== 'all') {
      result = result.filter((game) =>
        game.provider.toLowerCase().includes(filters.provider.toLowerCase())
      );
    }

    if (searchQuery) {
      result = result.filter(
        (game) =>
          game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.provider.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (filters.sortBy) {
      case 'new':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'az':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        result.sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0));
    }

    setFilteredGames(result);
  }, [filters, searchQuery, games, isHydrated]);

  const handleFilterChange = React.useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleSearchChange = React.useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFavoriteToggle = (gameId: number) => {
    setGames((prevGames) =>
      prevGames.map((game) =>
        game.id === gameId ? { ...game, isFavorite: !game.isFavorite } : game
      )
    );
  };

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-surface-elevated-2 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-text-secondary caption">
            Loading games...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <HeroBanner />
      <JackpotTicker />
      <QuickStats />
      <FavoritesSection />

      <div className="space-y-6">
        <GameFilters
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />

        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="flex items-center justify-center w-20 h-20 bg-surface-elevated-1 rounded-full mb-4">
              <Icon
                name="MagnifyingGlassIcon"
                size={40}
                className="text-text-secondary"
              />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2 font-heading">
              No games found
            </h3>
            <p className="text-sm text-text-secondary text-center max-w-md">
              Try adjusting your filters or search query to find more games.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameLobbyInteractive;
