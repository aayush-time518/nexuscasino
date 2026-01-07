'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface GameCardProps {
  game: {
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
    playUrl?: string | null;
    demoUrl?: string | null;
  };
  onFavoriteToggle: (gameId: number) => void;
}

const GameCard = ({ game, onFavoriteToggle }: GameCardProps) => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handlePlayClick = () => {
    if (game.playUrl) {
      window.open(game.playUrl, '_blank');
    } else {
      router.push(`/game-play-interface?game=${game.id}`);
    }
  };

  const handleDemoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (game.demoUrl) {
      window.open(game.demoUrl, '_blank');
    } else {
      router.push(`/game-play-interface?game=${game.id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle(game.id);
  };

  return (
    <div
      className="group relative bg-surface-elevated-1 rounded-xl overflow-hidden border border-border hover:border-accent transition-smooth cursor-pointer"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={handlePlayClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-surface-elevated-2 animate-pulse" />
        )}
        <AppImage
          src={game.image}
          alt={game.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onLoad={() => setImageLoaded(true)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {game.isNew && (
            <span className="flex items-center gap-1 px-2 py-1 bg-accent text-black text-xs font-bold rounded-md">
              <Icon name="SparklesIcon" size={12} variant="solid" />
              NEW
            </span>
          )}
          {game.isHot && (
            <span className="flex items-center gap-1 px-2 py-1 bg-error text-error-foreground text-xs font-bold rounded-md">
              <Icon name="FireIcon" size={12} variant="solid" />
              HOT
            </span>
          )}
        </div>

        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full transition-smooth hover:bg-background hover:scale-110"
          aria-label={
            game.isFavorite ? 'Remove from favorites' : 'Add to favorites'
          }
        >
          <Icon
            name="HeartIcon"
            size={18}
            variant={game.isFavorite ? 'solid' : 'outline'}
            className={game.isFavorite ? 'text-error' : 'text-text-primary'}
          />
        </button>

        {game.jackpot && (
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-2 px-3 py-2 bg-accent/90 backdrop-blur-sm rounded-lg">
            <Icon
              name="TrophyIcon"
              size={16}
              className="text-black"
              variant="solid"
            />
            <span className="text-sm font-bold text-black data-text">
              ${game.jackpot.toLocaleString()}
            </span>
          </div>
        )}

        <div
          className={`absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 p-4 transition-all duration-300 ${showActions
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0'
            }`}
        >
          <button
            onClick={handlePlayClick}
            className="flex-1 flex items-center justify-center gap-2 h-10 px-4 bg-primary text-primary-foreground rounded-lg font-semibold transition-smooth hover:scale-[0.97] hover:shadow-glow-primary active:scale-95"
          >
            <Icon name="PlayIcon" size={18} variant="solid" />
            <span>Play</span>
          </button>
          {game.hasDemo && (
            <button
              onClick={handleDemoClick}
              className="flex items-center justify-center gap-2 h-10 px-4 bg-surface-elevated-2 text-text-primary rounded-lg font-medium transition-smooth hover:bg-surface-elevated-3 active:scale-95"
            >
              <Icon name="EyeIcon" size={18} />
              <span>Demo</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-text-primary mb-1 truncate">
          {game.title}
        </h3>
        <p className="text-xs text-text-secondary caption truncate">
          {game.provider}
        </p>
      </div>
    </div>
  );
};

export default GameCard;
