'use client';

import React, { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import AdvancedSlotMachine from './AdvancedSlotMachine';

interface GameViewportProps {
  gameName: string;
  gameImage: string;
  gameType: string;
  spinning?: boolean;
  onSpinResult?: (win: number) => void;
  betAmount?: number;
}

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '💎', '⭐', '7️⃣', '🎰'];
const PAYOUTS: Record<string, number> = {
  '🍒': 5, '🍋': 8, '🍊': 12, '�': 15, '💎': 25, '⭐': 40, '7️⃣': 75, '🎰': 150
};

const PAYLINES = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row  
  [6, 7, 8], // Bottom row
  [0, 4, 8], // Top-left to bottom-right diagonal
  [2, 4, 6], // Top-right to bottom-left diagonal
];

const GameViewport = ({ gameName, gameImage, gameType, spinning, onSpinResult, betAmount }: GameViewportProps) => {
  const [reels, setReels] = useState(['7️⃣', '🍒', '🍋', '💎', '🍊', '🍇', '⭐', '7️⃣', '🎰']);
  const [isSpinningLocal, setIsSpinningLocal] = useState(false);
  const [winningCombination, setWinningCombination] = useState<number[]>([]);
  const [lastWin, setLastWin] = useState(0);

  const getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

  const checkWinningCombinations = (grid: string[]): { totalWin: number; winningLines: number[] } => {
    let totalWin = 0;
    let winningLines: number[] = [];

    PAYLINES.forEach((line, lineIndex) => {
      const [pos1, pos2, pos3] = line;
      const symbol1 = grid[pos1];
      const symbol2 = grid[pos2];
      const symbol3 = grid[pos3];

      // Check for three of a kind
      if (symbol1 === symbol2 && symbol2 === symbol3) {
        totalWin += PAYOUTS[symbol1] * 10; // 3 of a kind multiplier
        winningLines.push(lineIndex);
      }
      // Check for two of a kind (partial wins)
      else if (symbol1 === symbol2 || symbol2 === symbol3 || symbol1 === symbol3) {
        totalWin += Math.floor(PAYOUTS[symbol1] * 2); // 2 of a kind multiplier
        winningLines.push(lineIndex);
      }
    });

    return { totalWin, winningLines };
  };

  useEffect(() => {
    if (spinning && !isSpinningLocal) {
      setIsSpinningLocal(true);
      setWinningCombination([]);
      setLastWin(0);

      // Create spinning animation
      let spinCount = 0;
      const maxSpins = 20;
      
      const spinInterval = setInterval(() => {
        setReels(prev => prev.map(() => getRandomSymbol()));
        spinCount++;
        
        if (spinCount >= maxSpins) {
          clearInterval(spinInterval);
          
          // Generate final result with some bias for better gameplay
          const finalGrid = Array(9).fill(null).map(() => {
            const rand = Math.random();
            // Slightly increase chances for better symbols
            if (rand < 0.05) return '🎰'; // 5% chance for jackpot
            if (rand < 0.15) return '7️⃣'; // 10% chance for sevens
            if (rand < 0.25) return '💎'; // 10% chance for diamonds
            if (rand < 0.40) return '⭐'; // 15% chance for stars
            return SYMBOLS[Math.floor(Math.random() * 4)]; // Remaining symbols
          });

          // Occasionally force a winning combination for demo purposes
          if (Math.random() < 0.3) {
            const luckySymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const winningLine = PAYLINES[Math.floor(Math.random() * PAYLINES.length)];
            winningLine.forEach(pos => {
              finalGrid[pos] = luckySymbol;
            });
          }

          setReels(finalGrid);
          
          // Calculate winnings
          const { totalWin, winningLines } = checkWinningCombinations(finalGrid);
          setWinningCombination(winningLines);
          setLastWin(totalWin);
          setIsSpinningLocal(false);

          if (onSpinResult) onSpinResult(totalWin);
        }
      }, 100);
    }
  }, [spinning]);

  const renderSlotGrid = () => {
    return (
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
        {reels.map((symbol, index) => (
          <div 
            key={index} 
            className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-b from-white to-gray-100 rounded-lg flex items-center justify-center text-3xl sm:text-4xl border-4 border-gray-300 shadow-lg relative overflow-hidden ${
              isSpinningLocal ? "animate-pulse" : ""
            } ${
              winningCombination.some(lineIndex => PAYLINES[lineIndex].includes(index)) 
                ? "ring-4 ring-yellow-400 shadow-yellow-400/50 animate-bounce" 
                : ""
            }`}
          >
            <span className={isSpinningLocal ? "animate-spin" : ""}>{symbol}</span>
            {!isSpinningLocal && winningCombination.some(lineIndex => PAYLINES[lineIndex].includes(index)) && (
              <div className="absolute inset-0 bg-yellow-400/20 animate-pulse" />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (gameType === 'slot') {
    return (
      <div className="relative w-full h-full">
        <AdvancedSlotMachine
          spinning={!!spinning}
          onSpinResult={(win: number) => onSpinResult?.(win)}
          betAmount={betAmount || 10}
          gameName={gameName}
        />
      </div>
    );
  }

  // Fallback for other game types
  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {gameImage && (
        <AppImage
          src={gameImage}
          alt={gameName}
          fill
          className="object-cover opacity-80"
          priority
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
        <h2 className="text-4xl font-bold text-white drop-shadow-lg">
          {gameName}
        </h2>
        {/* Debug Info */}
        <div className="absolute bottom-4 left-4 text-xs text-white bg-black/50 p-2 rounded">
          Debug: Type={gameType}, Name={gameName}, Img={gameImage ? 'Yes' : 'No'}
        </div>
      </div>
    </div>
  );
};

export default GameViewport;
