'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface WinCelebrationProps {
  winAmount: number;
  isVisible: boolean;
  onClose?: () => void;
}

const WinCelebration = ({
  winAmount,
  isVisible,
  onClose,
}: WinCelebrationProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (isVisible && winAmount > 0) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isHydrated, isVisible, winAmount, onClose]);

  if (!isHydrated || !show || winAmount <= 0) {
    return null;
  }

  const isBigWin = winAmount >= 50;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center pointer-events-none">
      <div className="relative">
        <div
          className={`relative px-8 py-6 bg-gradient-to-br from-accent/20 to-primary/20 backdrop-blur-md border-2 rounded-2xl shadow-warm-2xl animate-bounce ${
            isBigWin ? 'border-accent' : 'border-primary'
          }`}
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-glow-accent">
              <Icon
                name="TrophyIcon"
                size={28}
                variant="solid"
                className="text-black"
              />
            </div>
          </div>        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-accent mb-2 font-heading">
            {isBigWin ? 'BIG WIN!' : 'YOU WIN!'}
          </h2>
          <p className="text-4xl sm:text-5xl font-bold text-primary data-text">
            ${winAmount.toFixed(2)}
          </p>
          
          {/* Celebration message based on win amount */}
          <div className="mt-2 text-sm text-text-secondary">
            {winAmount >= 200 ? '🎰 MEGA WIN! 🎰' :
             winAmount >= 50 ? '💎 BIG WIN! 💎' :
             '🎉 Nice Win! 🎉'}
          </div>
        </div>

          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-accent rounded-full animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinCelebration;
