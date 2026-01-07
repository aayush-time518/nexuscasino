'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface BettingControlsProps {
  gameType: 'slot' | 'table' | 'live';
  currentBalance: number;
  onBetChange?: (amount: number) => void;
  onPlay?: () => void;
  onAutoPlay?: (enabled: boolean) => void;
  disabled?: boolean;
  winAmount?: number;
}

const BettingControls = ({
  gameType,
  currentBalance,
  onBetChange,
  onPlay,
  onAutoPlay,
  disabled,
  winAmount = 0,
}: BettingControlsProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [betAmount, setBetAmount] = useState(5.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [autoPlayCount, setAutoPlayCount] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [totalSpins, setTotalSpins] = useState(0);

  const betOptions = [0.5, 1.0, 2.5, 5.0, 10.0, 25.0, 50.0, 100.0];

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (autoPlayEnabled && autoPlayCount > 0) {
      const interval = setInterval(() => {
        handlePlay();
        setAutoPlayCount((prev) => {
          if (prev <= 1) {
            setAutoPlayEnabled(false);
            if (onAutoPlay) onAutoPlay(false);
            return 0;
          }
          return prev - 1;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isHydrated, autoPlayEnabled, autoPlayCount]);

  const handleBetChange = (amount: number) => {
    if (amount <= currentBalance) {
      setBetAmount(amount);
      if (onBetChange) onBetChange(amount);
    }
  };

  const handlePlay = () => {
    if (betAmount <= currentBalance && !isPlaying) {
      setIsPlaying(true);
      setTotalSpins(prev => prev + 1);
      if (onPlay) onPlay();

      setTimeout(() => {
        setIsPlaying(false);
        // Track wins when we receive winAmount
        if (winAmount > 0) {
          setTotalWins(prev => prev + winAmount);
        }
      }, 2500); // Increased timeout to match the enhanced slot animation
    }
  };

  const handleAutoPlay = () => {
    const newState = !autoPlayEnabled;
    setAutoPlayEnabled(newState);
    if (newState) {
      setAutoPlayCount(10);
    } else {
      setAutoPlayCount(0);
    }
    if (onAutoPlay) onAutoPlay(newState);
  };

  if (!isHydrated) {
    return (
      <div className="w-full h-24 bg-card border-t border-border">
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-2 border-surface-elevated-2 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-card border-t border-border shadow-warm-lg">
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs text-text-secondary caption mb-2">
                Bet Amount
              </p>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {betOptions.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleBetChange(amount)}
                    disabled={amount > currentBalance || isPlaying}
                    className={`flex-shrink-0 min-w-[64px] h-10 px-3 rounded-md font-medium transition-smooth data-text ${betAmount === amount
                      ? 'bg-primary text-primary-foreground shadow-glow-primary'
                      : 'bg-surface-elevated-1 text-text-primary hover:bg-surface-elevated-2 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    aria-label={`Set bet to $${amount.toFixed(2)}`}
                  >
                    ${amount.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <p className="text-xs text-text-secondary caption">Balance</p>
                <p className="text-lg font-semibold text-accent data-text">
                  ${currentBalance.toFixed(2)}
                </p>
              </div>
              {gameType === 'slot' && totalSpins > 0 && (
                <div className="text-right text-xs text-text-secondary">
                  <div>Spins: {totalSpins}</div>
                  <div>RTP: {totalSpins > 0 ? ((totalWins / (totalSpins * betAmount)) * 100).toFixed(1) : 0}%</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {gameType === 'slot' && (
              <button
                onClick={handleAutoPlay}
                disabled={isPlaying}
                className={`flex items-center justify-center gap-2 h-12 px-6 rounded-md font-medium transition-smooth ${autoPlayEnabled
                  ? 'bg-warning text-warning-foreground shadow-warm'
                  : 'bg-surface-elevated-1 text-text-primary hover:bg-surface-elevated-2'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={
                  autoPlayEnabled ? 'Stop auto play' : 'Start auto play'
                }
              >
                <Icon
                  name={autoPlayEnabled ? 'PauseIcon' : 'PlayIcon'}
                  size={20}
                  variant="solid"
                />
                <span className="hidden sm:inline">
                  {autoPlayEnabled ? `Auto (${autoPlayCount})` : 'Auto Play'}
                </span>
              </button>
            )}

            <button
              onClick={handlePlay}
              disabled={
                disabled || isPlaying || betAmount > currentBalance || autoPlayEnabled
              }
              className="flex-1 flex items-center justify-center gap-3 h-14 px-8 bg-primary text-primary-foreground rounded-md font-semibold text-lg transition-smooth hover:scale-[0.98] hover:shadow-glow-primary active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label={gameType === 'slot' ? 'Spin reels' : 'Place bet'}
            >
              {isPlaying ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Playing...</span>
                </>
              ) : (
                <>
                  <Icon name="PlayIcon" size={24} variant="solid" />
                  <span>{gameType === 'slot' ? 'SPIN' : 'PLAY'}</span>
                </>
              )}
            </button>

            <button
              className="flex items-center justify-center w-12 h-12 bg-surface-elevated-1 rounded-md transition-smooth hover:bg-surface-elevated-2 active:scale-95"
              aria-label="Game settings"
            >
              <Icon
                name="Cog6ToothIcon"
                size={24}
                className="text-text-primary"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettingControls;
