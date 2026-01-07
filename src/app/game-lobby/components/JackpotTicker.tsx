'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Jackpot {
  id: number;
  name: string;
  amount: number;
  game: string;
}

const JackpotTicker = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [jackpots, setJackpots] = useState<Jackpot[]>([
    { id: 1, name: 'Mega Fortune', amount: 2456789.45, game: 'Mega Fortune' },
    {
      id: 2,
      name: 'Divine Fortune',
      amount: 1234567.89,
      game: 'Divine Fortune',
    },
    { id: 3, name: 'Hall of Gods', amount: 987654.32, game: 'Hall of Gods' },
    { id: 4, name: 'Arabian Nights', amount: 765432.1, game: 'Arabian Nights' },
  ]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const interval = setInterval(() => {
      setJackpots((prev) =>
        prev.map((jackpot) => ({
          ...jackpot,
          amount: jackpot.amount + Math.random() * 10,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isHydrated]);

  if (!isHydrated) {
    return (
      <div className="w-full h-20 bg-surface-elevated-1 rounded-xl animate-pulse" />
    );
  }

  return (
    <div className="relative w-full bg-gradient-to-r from-surface-elevated-1 via-surface-elevated-2 to-surface-elevated-1 rounded-xl border border-accent/30 overflow-hidden shadow-glow-accent">
      <div className="flex items-center gap-4 px-4 py-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center justify-center w-10 h-10 bg-accent/20 rounded-full">
            <Icon
              name="SparklesIcon"
              size={24}
              className="text-accent"
              variant="solid"
            />
          </div>
          <span className="text-sm font-semibold text-accent uppercase tracking-wide">
            Progressive Jackpots
          </span>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex gap-8 animate-scroll">
            {[...jackpots, ...jackpots].map((jackpot, index) => (
              <div
                key={`${jackpot.id}-${index}`}
                className="flex items-center gap-3 shrink-0"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-text-secondary caption">
                    {jackpot.game}
                  </span>
                  <span className="text-lg font-bold text-accent data-text">
                    ${jackpot.amount.toFixed(2)}
                  </span>
                </div>
                {index < jackpots.length * 2 - 1 && (
                  <div className="w-px h-8 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default JackpotTicker;
