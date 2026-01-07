'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface GameControlOverlayProps {
  isVisible?: boolean;
  onClose?: () => void;
  onExit?: () => void;
  gameName?: string;
  className?: string;
}

const GameControlOverlay = ({
  isVisible = false,
  onClose,
  onExit,
  gameName = 'Game',
  className = '',
}: GameControlOverlayProps) => {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(isVisible);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    setShowOverlay(isVisible);
  }, [isVisible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleToggleOverlay();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches[0].clientX < 20) {
        setTouchStart(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStart !== null) {
        const touchEnd = e.touches[0].clientY;
        const diff = touchEnd - touchStart;
        if (Math.abs(diff) > 50) {
          handleToggleOverlay();
          setTouchStart(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [touchStart]);

  const handleToggleOverlay = () => {
    const newState = !showOverlay;
    setShowOverlay(newState);
    if (onClose && !newState) {
      onClose();
    }
  };

  const handleExitGame = () => {
    if (onExit) {
      onExit();
    } else {
      router.push('/game-lobby');
    }
    setShowExitConfirm(false);
    setShowOverlay(false);
  };

  const handleResponsibleGaming = () => {
    router.push('/account-dashboard');
  };

  return (
    <>
      <button
        onClick={handleToggleOverlay}
        className="fixed top-4 right-4 z-[400] flex items-center justify-center w-12 h-12 bg-card border border-border rounded-full shadow-warm-lg transition-smooth hover:border-accent hover:shadow-glow-accent active:scale-95"
        aria-label={showOverlay ? 'Hide game controls' : 'Show game controls'}
        aria-expanded={showOverlay}
      >
        <Icon
          name={showOverlay ? 'XMarkIcon' : 'Bars3Icon'}
          size={24}
          className="text-text-primary"
        />
      </button>

      {showOverlay && (
        <>
          <div
            className="fixed inset-0 bg-background z-[399]"
            onClick={handleToggleOverlay}
            aria-hidden="true"
          />

          <div
            className={`fixed top-0 right-0 w-full sm:w-80 h-full bg-card border-l border-border shadow-warm-2xl z-[400] transform transition-smooth ${className}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-controls-title"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2
                  id="game-controls-title"
                  className="text-lg font-semibold text-text-primary font-heading"
                >
                  Game Controls
                </h2>
                <button
                  onClick={handleToggleOverlay}
                  className="flex items-center justify-center w-10 h-10 rounded-md transition-smooth hover:bg-muted"
                  aria-label="Close controls"
                >
                  <Icon
                    name="XMarkIcon"
                    size={24}
                    className="text-text-secondary"
                  />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  <div className="p-4 bg-surface-elevated-1 rounded-md border border-border">
                    <p className="text-sm font-medium text-text-primary mb-1">
                      Currently Playing
                    </p>
                    <p className="text-lg font-semibold text-primary font-heading">
                      {gameName}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setShowExitConfirm(true)}
                      className="flex items-center gap-3 w-full px-4 py-3 bg-surface-elevated-1 rounded-md border border-border transition-smooth hover:border-accent hover:shadow-glow-accent"
                    >
                      <Icon
                        name="ArrowLeftIcon"
                        size={20}
                        className="text-text-primary"
                      />
                      <span className="text-sm font-medium text-text-primary">
                        Exit Game
                      </span>
                    </button>

                    <button
                      onClick={handleResponsibleGaming}
                      className="flex items-center gap-3 w-full px-4 py-3 bg-surface-elevated-1 rounded-md border border-border transition-smooth hover:border-warning hover:shadow-warm"
                    >
                      <Icon
                        name="ShieldCheckIcon"
                        size={20}
                        className="text-warning"
                      />
                      <span className="text-sm font-medium text-text-primary">
                        Responsible Gaming
                      </span>
                    </button>

                    <button
                      onClick={() => router.push('/account-dashboard')}
                      className="flex items-center gap-3 w-full px-4 py-3 bg-surface-elevated-1 rounded-md border border-border transition-smooth hover:border-accent hover:shadow-glow-accent"
                    >
                      <Icon
                        name="UserCircleIcon"
                        size={20}
                        className="text-text-primary"
                      />
                      <span className="text-sm font-medium text-text-primary">
                        My Account
                      </span>
                    </button>

                    <button
                      onClick={() => router.push('/payment-methods')}
                      className="flex items-center gap-3 w-full px-4 py-3 bg-surface-elevated-1 rounded-md border border-border transition-smooth hover:border-accent hover:shadow-glow-accent"
                    >
                      <Icon
                        name="CreditCardIcon"
                        size={20}
                        className="text-text-primary"
                      />
                      <span className="text-sm font-medium text-text-primary">
                        Wallet
                      </span>
                    </button>
                  </div>

                  <div className="p-4 bg-muted rounded-md border border-border">
                    <div className="flex items-start gap-3">
                      <Icon
                        name="InformationCircleIcon"
                        size={20}
                        className="text-accent mt-0.5"
                      />
                      <div>
                        <p className="text-xs text-text-secondary caption">
                          Swipe from the left edge or press ESC to access
                          controls during gameplay.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showExitConfirm && (
        <>
          <div
            className="fixed inset-0 bg-background z-[500]"
            onClick={() => setShowExitConfirm(false)}
            aria-hidden="true"
          />

          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-card rounded-xl border border-border shadow-warm-2xl z-[500]"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="exit-confirm-title"
            aria-describedby="exit-confirm-description"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-warning/20 rounded-full">
                  <Icon
                    name="ExclamationTriangleIcon"
                    size={24}
                    className="text-warning"
                  />
                </div>
                <h3
                  id="exit-confirm-title"
                  className="text-lg font-semibold text-text-primary font-heading"
                >
                  Exit Game?
                </h3>
              </div>

              <p
                id="exit-confirm-description"
                className="text-sm text-text-secondary mb-6"
              >
                Are you sure you want to exit? Your current game progress will
                be saved.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 h-12 px-6 bg-surface-elevated-1 text-text-primary rounded-md font-medium transition-smooth hover:bg-surface-elevated-2 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExitGame}
                  className="flex-1 h-12 px-6 bg-error text-error-foreground rounded-md font-medium transition-smooth hover:scale-[0.97] active:scale-95"
                >
                  Exit Game
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default GameControlOverlay;
