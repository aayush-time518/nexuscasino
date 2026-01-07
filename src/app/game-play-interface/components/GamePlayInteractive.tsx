'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SecureHeader from '@/components/common/SecureHeader';
import GameControlOverlay from '@/components/common/GameControlOverlay';
import BottomTabNavigation from '@/components/common/BottomTabNavigation';
import GameViewPort from './GameViewPort';
import BettingControls from './BettingControls';
import QuickActions from './QuickActions';
import SessionInfo from './SessionInfo';
import WinCelebration from './WinCelebration';

interface GameData {
  id: string;
  name: string;
  image: string;
  type: 'slot' | 'table' | 'live';
  provider: string;
}

const GamePlayInteractive = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentGame, setCurrentGame] = useState<GameData | null>(null);
  const [balance, setBalance] = useState(1234.56);
  const [currentBet, setCurrentBet] = useState(5.0);
  const [showWin, setShowWin] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [showControlOverlay, setShowControlOverlay] = useState(false);
  const [gameSpinning, setGameSpinning] = useState(false);

  const mockGames: GameData[] = [
    {
      id: '1',
      name: 'Nexus Slots',
      image:
        'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg',
      type: 'slot',
      provider: 'Nexus Gaming',
    },
    {
      id: '2',
      name: 'Blackjack Classic',
      image:
        'https://images.pexels.com/photos/5137664/pexels-photo-5137664.jpeg',
      type: 'table',
      provider: 'Evolution',
    },
    {
      id: '3',
      name: 'Live Roulette',
      image:
        'https://images.pexels.com/photos/6664176/pexels-photo-6664176.jpeg',
      type: 'live',
      provider: 'Evolution',
    },
  ];

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const gameId = searchParams?.get('game') || '1';
    let game = mockGames.find((g) => g.id === gameId) || mockGames[0];

    // Fallback/Force ID 1 if not found
    if (!game) game = mockGames[0];

    setCurrentGame(game);
  }, [isHydrated, searchParams]);

  const handlePlay = () => {
    if (balance < currentBet) {
      alert("Insufficient funds!");
      return;
    }
    setBalance(prev => prev - currentBet);
    setGameSpinning(true);
    // Result handled by GameViewport callback
  };

  const handleSpinResult = (win: number) => {
    setGameSpinning(false);
    if (win > 0) {
      setWinAmount(win);
      setBalance(prev => prev + win);
      setShowWin(true);
    }
  };

  const handleBetChange = (amount: number) => {
    setCurrentBet(amount);
  };

  const handleExitGame = () => {
    router.push('/game-lobby');
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('sessionExpiry');
    }
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <SecureHeader showBalance onLogout={handleLogout} />

      <main className="pt-16 pb-20 lg:pb-0">
        <div className="relative h-[calc(100vh-16rem)] lg:h-[calc(100vh-12rem)]">
          <GameViewPort
            gameName={currentGame?.name || 'Game'}
            gameImage={currentGame?.image || ''}
            gameType={currentGame?.type || 'slot'}
            spinning={gameSpinning}
            onSpinResult={handleSpinResult}
            betAmount={currentBet}
          />

          <QuickActions gameName={currentGame?.name || 'Game'} />

          <SessionInfo />

          <WinCelebration
            winAmount={winAmount}
            isVisible={showWin}
            onClose={() => setShowWin(false)}
          />
        </div>

        <BettingControls
          gameType={currentGame?.type || 'slot'}
          currentBalance={balance}
          onBetChange={handleBetChange}
          onPlay={handlePlay}
          disabled={gameSpinning}
          winAmount={winAmount}
        />
      </main>
      <GameControlOverlay
        isVisible={showControlOverlay}
        onClose={() => setShowControlOverlay(false)}
        onExit={handleExitGame}
        gameName={currentGame?.name || 'Game'}
      />

      <div className="lg:hidden">
        <BottomTabNavigation />
      </div>
    </div>
  );
};

export default GamePlayInteractive;
