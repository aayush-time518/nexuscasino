'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SlotMachineProps {
  spinning: boolean;
  onSpinResult: (result: SpinResult) => void;
  betAmount: number;
  betLines: number;
}

interface SpinResult {
  totalWin: number;
  winningLines: WinningLine[];
  isJackpot: boolean;
  isBigWin: boolean;
  symbols: string[][];
}

interface WinningLine {
  lineIndex: number;
  symbols: string;
  payout: number;
  positions: number[];
}

// Enhanced symbol system with realistic probabilities
const SYMBOLS = [
  { symbol: '🍒', name: 'Cherry', weight: 100, payout: [0, 0, 5, 10, 25] },
  { symbol: '🍋', name: 'Lemon', weight: 80, payout: [0, 0, 8, 15, 30] },
  { symbol: '🍊', name: 'Orange', weight: 70, payout: [0, 0, 12, 20, 40] },
  { symbol: '🍇', name: 'Grape', weight: 60, payout: [0, 0, 15, 25, 50] },
  { symbol: '🔔', name: 'Bell', weight: 40, payout: [0, 2, 20, 50, 100] },
  { symbol: '💎', name: 'Diamond', weight: 25, payout: [0, 5, 50, 100, 250] },
  { symbol: '⭐', name: 'Star', weight: 15, payout: [0, 10, 75, 200, 500] },
  { symbol: '7️⃣', name: 'Lucky 7', weight: 8, payout: [0, 20, 150, 500, 1000] },
  { symbol: '🎰', name: 'Jackpot', weight: 2, payout: [0, 50, 500, 2000, 5000] }
];

// Create weighted reel strips for realistic distribution
const createReelStrip = (length: number = 100) => {
  const strip: string[] = [];
  const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
  
  for (let i = 0; i < length; i++) {
    let random = Math.random() * totalWeight;
    for (const symbolData of SYMBOLS) {
      random -= symbolData.weight;
      if (random <= 0) {
        strip.push(symbolData.symbol);
        break;
      }
    }
  }
  return strip;
};

const REEL_STRIPS = [
  createReelStrip(),
  createReelStrip(),
  createReelStrip(),
  createReelStrip(),
  createReelStrip()
];

// 25 realistic paylines for 5x3 slot
const PAYLINES = [
  [0, 1, 2, 3, 4], // Top row
  [5, 6, 7, 8, 9], // Middle row
  [10, 11, 12, 13, 14], // Bottom row
  [0, 6, 12, 8, 4], // Diagonal
  [10, 6, 2, 8, 14], // Diagonal
  [0, 1, 7, 13, 14], // V-shape
  [10, 11, 7, 3, 4], // V-shape
  [0, 6, 7, 8, 4], // W-shape
  [10, 6, 7, 8, 14], // W-shape
  [5, 1, 2, 3, 9], // Bent line
  [5, 11, 12, 13, 9], // Bent line
  [0, 1, 12, 3, 4], // Zigzag
  [10, 11, 2, 13, 14], // Zigzag
  [5, 6, 2, 8, 9], // Mountain
  [5, 6, 12, 8, 9], // Valley
  [0, 6, 2, 8, 14], // X-pattern
  [10, 6, 12, 8, 4], // X-pattern
  [5, 1, 7, 3, 9], // Diamond
  [5, 11, 7, 13, 9], // Diamond
  [0, 11, 7, 3, 14], // Star
  [10, 1, 7, 13, 4], // Star
  [0, 1, 12, 13, 14], // L-shape
  [10, 11, 2, 3, 4], // L-shape
  [5, 1, 12, 3, 9], // T-shape
  [5, 11, 2, 13, 9] // T-shape
];

const RealisticSlotMachine: React.FC<SlotMachineProps> = ({
  spinning,
  onSpinResult,
  betAmount,
  betLines
}) => {
  const [reelPositions, setReelPositions] = useState([0, 0, 0, 0, 0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningLines, setWinningLines] = useState<WinningLine[]>([]);
  const [currentSymbols, setCurrentSymbols] = useState<string[][]>([]);
  const [spinSound, setSpinSound] = useState<HTMLAudioElement | null>(null);
  const [winSound, setWinSound] = useState<HTMLAudioElement | null>(null);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create audio context for sound effects
      const spinAudio = new Audio();
      const winAudio = new Audio();
      setSpinSound(spinAudio);
      setWinSound(winAudio);
    }
  }, []);

  const getVisibleSymbols = useCallback((position: number, reelIndex: number) => {
    const strip = REEL_STRIPS[reelIndex];
    const symbols: string[] = [];
    for (let i = 0; i < 3; i++) {
      const index = (position + i) % strip.length;
      symbols.push(strip[index]);
    }
    return symbols;
  }, []);

  const calculateWins = useCallback((symbols: string[][]) => {
    const wins: WinningLine[] = [];
    
    // Check each active payline
    for (let lineIndex = 0; lineIndex < Math.min(betLines, PAYLINES.length); lineIndex++) {
      const line = PAYLINES[lineIndex];
      const lineSymbols: string[] = [];
      
      // Get symbols on this payline
      line.forEach(position => {
        const reelIndex = Math.floor(position / 3);
        const symbolIndex = position % 3;
        if (symbols[reelIndex] && symbols[reelIndex][symbolIndex]) {
          lineSymbols.push(symbols[reelIndex][symbolIndex]);
        }
      });
      
      // Check for winning combinations
      if (lineSymbols.length === 5) {
        const firstSymbol = lineSymbols[0];
        let matchCount = 1;
        
        // Count consecutive matches from left
        for (let i = 1; i < lineSymbols.length; i++) {
          if (lineSymbols[i] === firstSymbol) {
            matchCount++;
          } else {
            break;
          }
        }
        
        // Check if it's a winning combination (3+ matches)
        if (matchCount >= 3) {
          const symbolData = SYMBOLS.find(s => s.symbol === firstSymbol);
          if (symbolData && symbolData.payout[matchCount] > 0) {
            wins.push({
              lineIndex,
              symbols: firstSymbol,
              payout: symbolData.payout[matchCount] * betAmount,
              positions: line.slice(0, matchCount)
            });
          }
        }
      }
    }
    
    return wins;
  }, [betAmount, betLines]);

  const performSpin = useCallback(() => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setWinningLines([]);
    
    // Play spin sound
    if (spinSound) {
      spinSound.currentTime = 0;
      spinSound.play().catch(() => {}); // Ignore audio errors
    }
    
    const newPositions = reelPositions.map(() => 
      Math.floor(Math.random() * REEL_STRIPS[0].length)
    );
    
    // Animate reels stopping one by one
    const stopDelays = [0, 200, 400, 600, 800];
    
    stopDelays.forEach((delay, index) => {
      setTimeout(() => {
        setReelPositions(prev => {
          const updated = [...prev];
          updated[index] = newPositions[index];
          return updated;
        });
        
        // Check for wins after all reels stop
        if (index === stopDelays.length - 1) {
          setTimeout(() => {
            const finalSymbols = newPositions.map((pos, reelIndex) => 
              getVisibleSymbols(pos, reelIndex)
            );
            
            setCurrentSymbols(finalSymbols);
            const wins = calculateWins(finalSymbols);
            setWinningLines(wins);
            
            const totalWin = wins.reduce((sum, win) => sum + win.payout, 0);
            const isJackpot = wins.some(win => win.symbols === '🎰');
            const isBigWin = totalWin >= betAmount * 50;
            
            if (totalWin > 0 && winSound) {
              winSound.currentTime = 0;
              winSound.play().catch(() => {});
            }
            
            setIsSpinning(false);
            onSpinResult({
              totalWin,
              winningLines: wins,
              isJackpot,
              isBigWin,
              symbols: finalSymbols
            });
          }, 500);
        }
      }, delay);
    });
  }, [isSpinning, reelPositions, getVisibleSymbols, calculateWins, onSpinResult, spinSound, winSound]);

  useEffect(() => {
    if (spinning && !isSpinning) {
      performSpin();
    }
  }, [spinning, performSpin, isSpinning]);

  useEffect(() => {
    // Initialize visible symbols
    const initialSymbols = reelPositions.map((pos, index) => 
      getVisibleSymbols(pos, index)
    );
    setCurrentSymbols(initialSymbols);
  }, [reelPositions, getVisibleSymbols]);

  const isWinningPosition = (reelIndex: number, symbolIndex: number) => {
    const position = reelIndex * 3 + symbolIndex;
    return winningLines.some(win => win.positions.includes(position));
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto p-6">
      {/* Slot Machine Frame */}
      <div className="bg-gradient-to-b from-yellow-400 via-yellow-300 to-yellow-600 p-8 rounded-3xl border-8 border-yellow-700 shadow-2xl">
        {/* Machine Header */}
        <div className="text-center mb-6">
          <div className="bg-black text-green-400 font-mono text-xl p-4 rounded-lg border-2 border-gray-700 mb-4">
            <div className="flex justify-between items-center">
              <span>BET: ${betAmount.toFixed(2)}</span>
              <span>LINES: {betLines}</span>
              <span>TOTAL: ${(betAmount * betLines).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Reel Container */}
        <div className="bg-black p-6 rounded-2xl border-4 border-gray-800 shadow-inner">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }, (_, reelIndex) => (
              <div
                key={reelIndex}
                ref={el => reelRefs.current[reelIndex] = el}
                className="relative h-48 bg-gradient-to-b from-gray-100 to-gray-300 rounded-lg border-4 border-gray-400 overflow-hidden"
              >
                <AnimatePresence>
                  {currentSymbols[reelIndex]?.map((symbol, symbolIndex) => (
                    <motion.div
                      key={`${reelIndex}-${symbolIndex}`}
                      className={`absolute w-full h-16 flex items-center justify-center text-4xl font-bold border-b border-gray-300 ${
                        isWinningPosition(reelIndex, symbolIndex)
                          ? 'bg-yellow-200 ring-4 ring-yellow-400 animate-pulse'
                          : 'bg-white'
                      }`}
                      style={{ top: `${symbolIndex * 64}px` }}
                      initial={isSpinning ? { y: -200, opacity: 0 } : {}}
                      animate={isSpinning ? { y: 0, opacity: 1 } : {}}
                      transition={{ 
                        duration: 0.3,
                        delay: reelIndex * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                    >
                      {symbol}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Spinning overlay */}
                {isSpinning && (
                  <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center">
                    <div className="text-6xl animate-spin">🎰</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Win Display */}
        <div className="text-center mt-6">
          <div className="bg-black text-green-400 font-mono text-2xl p-4 rounded-lg border-2 border-gray-700">
            {winningLines.length > 0 ? (
              <div className="space-y-2">
                <div className="text-yellow-400 font-bold">
                  WIN: ${winningLines.reduce((sum, win) => sum + win.payout, 0).toFixed(2)}
                </div>
                <div className="text-sm">
                  {winningLines.map((win, index) => (
                    <div key={index}>
                      Line {win.lineIndex + 1}: {win.symbols} x{win.positions.length} = ${win.payout.toFixed(2)}
                    </div>
                  ))}
                </div>
              </div>
            ) : isSpinning ? (
              "SPINNING..."
            ) : (
              "GOOD LUCK!"
            )}
          </div>
        </div>
      </div>

      {/* Paylines Visualization */}
      {winningLines.length > 0 && (
        <div className="mt-6 bg-black/80 text-white p-4 rounded-lg">
          <h3 className="text-center font-bold text-yellow-400 mb-2">WINNING LINES</h3>
          <div className="grid grid-cols-5 gap-4">
            {winningLines.map((win, index) => (
              <div key={index} className="text-center text-sm">
                <div className="text-yellow-400">Line {win.lineIndex + 1}</div>
                <div>{win.symbols} x{win.positions.length}</div>
                <div>${win.payout.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paytable */}
      <div className="mt-6 bg-black/90 text-white p-6 rounded-lg border border-yellow-500">
        <h3 className="text-center font-bold text-yellow-400 mb-4">PAYTABLE</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {SYMBOLS.map((symbolData) => (
            <div key={symbolData.symbol} className="text-center">
              <div className="text-2xl mb-2">{symbolData.symbol}</div>
              <div className="space-y-1">
                {symbolData.payout.map((payout, index) => (
                  index >= 3 && payout > 0 && (
                    <div key={index} className="flex justify-between">
                      <span>x{index}</span>
                      <span className="text-yellow-400">{payout}x</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealisticSlotMachine;
