'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface FavoriteGame {
  id: number;
  title: string;
  image: string;
  alt: string;
  lastPlayed: string;
}

const FavoritesSection = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteGame[]>([
    {
      id: 1,
      title: 'Starburst',
      image:
        'https://images.unsplash.com/photo-1577495508048-b63587924f3d',
      alt: 'Colorful cosmic slot game with bright stars and gems on purple space background',
      lastPlayed: '2 hours ago',
    },
    {
      id: 2,
      title: 'Book of Dead',
      image:
        'https://images.unsplash.com/photo-1577495508048-b63587924f3d',
      alt: 'Ancient Egyptian themed slot with golden pharaoh mask and hieroglyphics on dark background',
      lastPlayed: '5 hours ago',
    },
    {
      id: 3,
      title: "Gonzo's Quest",
      image:
        'https://images.unsplash.com/photo-1577495508048-b63587924f3d',
      alt: 'Adventure slot game featuring explorer character with ancient Aztec temple ruins',
      lastPlayed: '1 day ago',
    },
    {
      id: 4,
      title: 'Mega Moolah',
      image: 'https://images.unsplash.com/photo-1454627497732-c424266b7201',
      alt: 'Safari themed progressive jackpot slot with lion and African savanna landscape',
      lastPlayed: '2 days ago',
    },
  ]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleGameClick = (gameId: number) => {
    router.push('/game-play-interface');
  };

  if (!isHydrated) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-surface-elevated-1 rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-[4/3] bg-surface-elevated-1 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon
            name="HeartIcon"
            size={24}
            className="text-error"
            variant="solid"
          />
          <h2 className="text-xl font-semibold text-text-primary font-heading">
            Your Favorites
          </h2>
        </div>
        <button
          onClick={() => router.push('/account-dashboard')}
          className="text-sm text-accent hover:text-accent/80 font-medium transition-smooth"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {favorites.map((game) => (
          <button
            key={game.id}
            onClick={() => handleGameClick(game.id)}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border hover:border-accent transition-smooth"
          >
            <AppImage
              src={game.image}
              alt={game.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full shadow-glow-primary">
                <Icon
                  name="PlayIcon"
                  size={24}
                  className="text-primary-foreground"
                  variant="solid"
                />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background to-transparent">
              <p className="text-sm font-semibold text-text-primary truncate">
                {game.title}
              </p>
              <p className="text-xs text-text-secondary caption">
                {game.lastPlayed}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FavoritesSection;
