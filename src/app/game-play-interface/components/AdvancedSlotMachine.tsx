'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SlotSoundEffects from './SlotSoundEffects';

interface AdvancedSlotMachineProps {
  spinning: boolean;
  onSpinResult: (win: number) => void;
  betAmount: number;
  gameName: string;
}

interface WinningLine {
  lineIndex: number;
  symbol: string;
  payout: number;
  positions: number[];
  matchCount: number;
}

// Professional casino-grade symbol system
const SYMBOLS = [
  { symbol: '🍒', name: 'Cherry', weight: 120, payouts: [0, 0, 5, 15, 50] },
  { symbol: '🍋', name: 'Lemon', weight: 100, payouts: [0, 0, 8, 20, 75] },
  { symbol: '🍊', name: 'Orange', weight: 90, payouts: [0, 0, 12, 30, 100] },
  { symbol: '🍇', name: 'Grape', weight: 80, payouts: [0, 0, 15, 40, 150] },
  { symbol: '🔔', name: 'Bell', weight: 60, payouts: [0, 2, 25, 75, 250] },
  { symbol: '💎', name: 'Diamond', weight: 40, payouts: [0, 5, 50, 150, 500] },
  { symbol: '⭐', name: 'Star', weight: 25, payouts: [0, 10, 100, 300, 750] },
  { symbol: '7️⃣', name: 'Lucky 7', weight: 15, payouts: [0, 25, 200, 750, 2000] },
  { symbol: '🎰', name: 'Jackpot', weight: 5, payouts: [0, 100, 1000, 5000, 10000] }
];

// Create weighted reel strips for realistic probability
const createReelStrip = (reelIndex: number) => {
  const strip: string[] = [];
  const stripLength = 128; // Longer strips for more realistic distribution
  
  // Adjust weights based on reel position (first reel slightly better for building wins)
  const reelMultiplier = reelIndex === 0 ? 1.1 : reelIndex >= 3 ? 0.9 : 1.0;
  
  const adjustedWeights = SYMBOLS.map(symbol => ({
    ...symbol,
    weight: Math.floor(symbol.weight * reelMultiplier)
  }));
  
  const totalWeight = adjustedWeights.reduce((sum, s) => sum + s.weight, 0);
  
  for (let i = 0; i < stripLength; i++) {
    let random = Math.random() * totalWeight;
    for (const symbolData of adjustedWeights) {
      random -= symbolData.weight;
      if (random <= 0) {
        strip.push(symbolData.symbol);
        break;
      }
    }
  }
  
  // Ensure no more than 3 consecutive identical symbols to prevent unfair runs
  for (let i = 0; i < strip.length - 3; i++) {
    if (strip[i] === strip[i + 1] && strip[i + 1] === strip[i + 2] && strip[i + 2] === strip[i + 3]) {
      // Replace the 4th consecutive symbol with a different one
      const differentSymbols = SYMBOLS.filter(s => s.symbol !== strip[i]);
      const randomSymbol = differentSymbols[Math.floor(Math.random() * differentSymbols.length)];
      strip[i + 3] = randomSymbol.symbol;
    }
  }
  
  return strip;
};

const REEL_STRIPS = Array.from({ length: 5 }, (_, index) => createReelStrip(index));

// 25 professional paylines
const PAYLINES = [
  // Horizontal lines
  [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14],
  // Diagonal lines
  [0, 6, 12, 8, 4], [10, 6, 2, 8, 14],
  // V shapes
  [0, 1, 7, 13, 14], [10, 11, 7, 3, 4],
  // W shapes
  [0, 6, 7, 8, 4], [10, 6, 7, 8, 14],
  // Zigzag patterns
  [5, 1, 2, 3, 9], [5, 11, 12, 13, 9],
  [0, 1, 12, 3, 4], [10, 11, 2, 13, 14],
  // Mountain/valley
  [5, 6, 2, 8, 9], [5, 6, 12, 8, 9],
  // Diamond shapes
  [5, 1, 7, 3, 9], [5, 11, 7, 13, 9],
  // X patterns
  [0, 6, 2, 8, 14], [10, 6, 12, 8, 4],
  // Star patterns
  [0, 11, 7, 3, 14], [10, 1, 7, 13, 4],
  // L shapes
  [0, 1, 12, 13, 14], [10, 11, 2, 3, 4],
  // T shapes
  [5, 1, 12, 3, 9]
];

const AdvancedSlotMachine: React.FC<AdvancedSlotMachineProps> = ({
  spinning,
  onSpinResult,
  betAmount,
  gameName
}) => {
  const [reelPositions, setReelPositions] = useState([0, 0, 0, 0, 0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningLines, setWinningLines] = useState<WinningLine[]>([]);
  const [reelSymbols, setReelSymbols] = useState<string[][]>([[], [], [], [], []]);
  const [spinPhase, setSpinPhase] = useState(0); // 0: ready, 1: spinning, 2: stopping
  const [nearMiss, setNearMiss] = useState<boolean>(false);
  const soundEffects = useRef<SlotSoundEffects>(new SlotSoundEffects());

  // Play sound effect
  const playSound = useCallback((type: 'spin' | 'stop' | 'smallWin' | 'bigWin' | 'jackpot', reelIndex?: number) => {
    switch (type) {
      case 'spin':
        soundEffects.current.playSpinSound();
        break;
      case 'stop':
        soundEffects.current.playReelStopSound(reelIndex || 0);
        break;
      case 'smallWin':
        soundEffects.current.playSmallWin();
        break;
      case 'bigWin':
        soundEffects.current.playBigWin();
        break;
      case 'jackpot':
        soundEffects.current.playJackpot();
        break;
    }
  }, []);

  // Get visible symbols for a reel
  const getVisibleSymbols = useCallback((position: number, reelIndex: number): string[] => {
    const strip = REEL_STRIPS[reelIndex];
    const symbols: string[] = [];
    for (let i = 0; i < 3; i++) {
      const index = (position + i) % strip.length;
      symbols.push(strip[index]);
    }
    return symbols;
  }, []);

  // Calculate all winning combinations with proper payline logic
  const calculateWins = useCallback((symbols: string[][]): WinningLine[] => {
    const wins: WinningLine[] = [];
    
    // Create a 3x5 grid from the reel symbols
    const grid: string[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        if (symbols[col] && symbols[col][row]) {
          grid[row * 5 + col] = symbols[col][row];
        }
      }
    }
    
    // Define all 25 paylines properly
    const paylines = [
      // Horizontal lines
      [0, 1, 2, 3, 4],   // Top row
      [5, 6, 7, 8, 9],   // Middle row  
      [10, 11, 12, 13, 14], // Bottom row
      
      // Diagonal lines
      [0, 6, 12, 8, 4],  // Top-left to bottom-right diagonal
      [10, 6, 2, 8, 14], // Bottom-left to top-right diagonal
      
      // V shapes
      [0, 1, 7, 13, 14], // V from top
      [10, 11, 7, 3, 4], // Inverted V from bottom
      
      // W shapes
      [0, 6, 7, 8, 4],   // W from top
      [10, 6, 7, 8, 14], // W from bottom
      
      // Zigzag patterns
      [5, 1, 2, 3, 9],   // Center-top zigzag
      [5, 11, 12, 13, 9], // Center-bottom zigzag
      [0, 1, 12, 3, 4],  // Top-bottom zigzag
      [10, 11, 2, 13, 14], // Bottom-top zigzag
      
      // Mountain/valley patterns
      [5, 6, 2, 8, 9],   // Mountain
      [5, 6, 12, 8, 9],  // Valley
      
      // Diamond shapes
      [5, 1, 7, 3, 9],   // Diamond from center
      [5, 11, 7, 13, 9], // Inverted diamond from center
      
      // X patterns
      [0, 6, 2, 8, 14],  // X pattern 1
      [10, 6, 12, 8, 4], // X pattern 2
      
      // Star patterns
      [0, 11, 7, 3, 14], // Star pattern 1
      [10, 1, 7, 13, 4], // Star pattern 2
      
      // L shapes
      [0, 1, 12, 13, 14], // L shape
      [10, 11, 2, 3, 4],  // Inverted L shape
      
      // T shapes
      [5, 1, 12, 3, 9],  // T shape
      [5, 11, 2, 13, 9]  // Inverted T shape
    ];
    
    // Check each payline
    paylines.forEach((line, lineIndex) => {
      const lineSymbols: string[] = [];
      const validPositions: number[] = [];
      
      // Get symbols on this payline
      line.forEach(position => {
        if (position < grid.length && grid[position]) {
          lineSymbols.push(grid[position]);
          validPositions.push(position);
        }
      });
      
      if (lineSymbols.length >= 3) {
        // Check for winning combinations (left to right only)
        const firstSymbol = lineSymbols[0];
        let consecutiveCount = 1;
        
        // Count consecutive matching symbols from left
        for (let i = 1; i < lineSymbols.length; i++) {
          if (lineSymbols[i] === firstSymbol) {
            consecutiveCount++;
          } else {
            break; // Stop at first non-matching symbol
          }
        }
        
        // Check if we have a winning combination (minimum 3 consecutive)
        if (consecutiveCount >= 3) {
          const symbolData = SYMBOLS.find(s => s.symbol === firstSymbol);
          if (symbolData) {
            const payoutIndex = Math.min(consecutiveCount, symbolData.payouts.length - 1);
            const basePayout = symbolData.payouts[payoutIndex];
            
            if (basePayout > 0) {
              // Calculate final payout with bet multiplier
              const finalPayout = basePayout * betAmount;
              
              wins.push({
                lineIndex,
                symbol: firstSymbol,
                payout: finalPayout,
                positions: validPositions.slice(0, consecutiveCount),
                matchCount: consecutiveCount
              });
            }
          }
        }
      }
    });
    
    // Remove duplicate wins on same positions (keep highest payout)
    const uniqueWins: WinningLine[] = [];
    const processedPositions = new Set<string>();
    
    // Sort wins by payout (highest first)
    wins.sort((a, b) => b.payout - a.payout);
    
    wins.forEach(win => {
      const positionKey = win.positions.sort().join('-');
      if (!processedPositions.has(positionKey)) {
        uniqueWins.push(win);
        processedPositions.add(positionKey);
      }
    });
    
    return uniqueWins;
  }, [betAmount]);

  // Check for near misses (2 matching symbols in a line)
  const checkNearMiss = useCallback((symbols: string[][]): boolean => {
    const grid: string[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        if (symbols[col] && symbols[col][row]) {
          grid[row * 5 + col] = symbols[col][row];
        }
      }
    }
    
    // Check main horizontal lines for near misses
    const mainLines = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14]];
    
    for (const line of mainLines) {
      const lineSymbols = line.map(pos => grid[pos]).filter(Boolean);
      if (lineSymbols.length >= 3) {
        // Check if first two symbols match but third doesn't
        if (lineSymbols[0] === lineSymbols[1] && lineSymbols[0] !== lineSymbols[2]) {
          const symbolData = SYMBOLS.find(s => s.symbol === lineSymbols[0]);
          if (symbolData && symbolData.payouts[3] >= 50) { // Only for valuable symbols
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  // Main spin logic with realistic mechanics
  const performSpin = useCallback(async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSpinPhase(1);
    setWinningLines([]);
    
    // Play spin sound
    playSound('spin');
    
    // Generate final positions with realistic distribution
    let finalPositions = reelPositions.map((_, reelIndex) => 
      Math.floor(Math.random() * REEL_STRIPS[reelIndex].length)
    );
    
    // Calculate potential outcome
    let finalSymbols = finalPositions.map((pos, reelIndex) => 
      getVisibleSymbols(pos, reelIndex)
    );
    let potentialWins = calculateWins(finalSymbols);
    let totalPotentialWin = potentialWins.reduce((sum, win) => sum + win.payout, 0);
    
    // Implement realistic win frequency (adjust based on bet)
    const winChance = Math.min(0.35 + (betAmount / 1000), 0.45); // 35-45% win rate
    const shouldWin = Math.random() < winChance;
    
    if (!shouldWin && totalPotentialWin > 0) {
      // Force a losing outcome by adjusting one reel
      const reelToAdjust = Math.floor(Math.random() * 5);
      let attempts = 0;
      
      while (attempts < 20) {
        const newPosition = Math.floor(Math.random() * REEL_STRIPS[reelToAdjust].length);
        finalPositions[reelToAdjust] = newPosition;
        
        finalSymbols = finalPositions.map((pos, reelIndex) => 
          getVisibleSymbols(pos, reelIndex)
        );
        
        const newWins = calculateWins(finalSymbols);
        const newTotalWin = newWins.reduce((sum, win) => sum + win.payout, 0);
        
        if (newTotalWin === 0) {
          potentialWins = newWins;
          totalPotentialWin = newTotalWin;
          break;
        }
        attempts++;
      }
    } else if (shouldWin && totalPotentialWin === 0) {
      // Try to force a small win
      let attempts = 0;
      const targetSymbol = ['🍒', '🍋', '🍊'][Math.floor(Math.random() * 3)];
      
      while (attempts < 15) {
        // Adjust first 3 reels to have same symbol
        for (let i = 0; i < 3; i++) {
          const strip = REEL_STRIPS[i];
          const targetIndices = strip.map((sym, idx) => sym === targetSymbol ? idx : -1)
                                   .filter(idx => idx !== -1);
          
          if (targetIndices.length > 0) {
            const randomIndex = targetIndices[Math.floor(Math.random() * targetIndices.length)];
            finalPositions[i] = randomIndex;
          }
        }
        
        finalSymbols = finalPositions.map((pos, reelIndex) => 
          getVisibleSymbols(pos, reelIndex)
        );
        
        const newWins = calculateWins(finalSymbols);
        const newTotalWin = newWins.reduce((sum, win) => sum + win.payout, 0);
        
        if (newTotalWin > 0) {
          potentialWins = newWins;
          totalPotentialWin = newTotalWin;
          break;
        }
        attempts++;
      }
    }
    
    // Animate reels stopping in sequence
    const stopDelays = [0, 300, 600, 900, 1200];
    
    for (let i = 0; i < stopDelays.length; i++) {
      setTimeout(() => {
        setReelPositions(prev => {
          const updated = [...prev];
          updated[i] = finalPositions[i];
          return updated;
        });
        
        // Play stop sound for each reel
        playSound('stop', i);
        
        // After last reel stops, show results
        if (i === stopDelays.length - 1) {
          setTimeout(() => {
            setReelSymbols(finalSymbols);
            setWinningLines(potentialWins);
            
            // Check for near miss
            const isNearMiss = totalPotentialWin === 0 && checkNearMiss(finalSymbols);
            setNearMiss(isNearMiss);
            
            // Play appropriate win sound
            if (totalPotentialWin > 0) {
              const hasJackpot = potentialWins.some(win => win.symbol === '🎰');
              if (hasJackpot) {
                playSound('jackpot');
              } else if (totalPotentialWin >= betAmount * 50) {
                playSound('bigWin');
              } else {
                playSound('smallWin');
              }
            }
            
            setSpinPhase(2);
            setTimeout(() => {
              setIsSpinning(false);
              setSpinPhase(0);
              onSpinResult(totalPotentialWin);
            }, totalPotentialWin > 0 ? 2500 : 800);
            
          }, 500);
        }
      }, stopDelays[i]);
    }
  }, [isSpinning, reelPositions, getVisibleSymbols, calculateWins, onSpinResult, playSound, betAmount]);

  // Trigger spin when spinning prop changes
  useEffect(() => {
    if (spinning && !isSpinning) {
      performSpin();
    }
  }, [spinning, performSpin, isSpinning]);

  // Initialize reel symbols
  useEffect(() => {
    const initialSymbols = reelPositions.map((pos, index) => 
      getVisibleSymbols(pos, index)
    );
    setReelSymbols(initialSymbols);
  }, [reelPositions, getVisibleSymbols]);

  // Check if position is winning (improved for 5x3 grid)
  const isWinningPosition = useCallback((reelIndex: number, symbolIndex: number): boolean => {
    const gridPosition = symbolIndex * 5 + reelIndex; // Convert to grid position
    return winningLines.some(win => win.positions.includes(gridPosition));
  }, [winningLines]);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-black overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main slot machine container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-full p-4">
        {/* Machine frame */}
        <div className="bg-gradient-to-b from-yellow-400 via-yellow-300 to-yellow-600 p-8 rounded-3xl border-8 border-yellow-700 shadow-2xl max-w-4xl w-full">
          {/* Header display */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-purple-900 mb-2">{gameName.toUpperCase()}</h1>
            <div className="bg-black text-green-400 font-mono text-lg p-3 rounded-lg border-2 border-gray-700">
              <div className="flex justify-between items-center">
                <span>BET: ${betAmount.toFixed(2)}</span>
                <span className="text-yellow-400">
                  {isSpinning ? 'SPINNING...' : winningLines.length > 0 ? `WIN: $${winningLines.reduce((sum, win) => sum + win.payout, 0).toFixed(2)}` : 'GOOD LUCK!'}
                </span>
                <span>LINES: 9</span>
              </div>
            </div>
          </div>

          {/* Reel container */}
          <div className="bg-black p-6 rounded-2xl border-4 border-gray-800 shadow-inner relative">
            {/* Payline indicators */}
            {winningLines.length > 0 && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                {winningLines.map((win, index) => (
                  <div
                    key={index}
                    className="absolute border-2 border-yellow-400 rounded animate-pulse"
                    style={{
                      left: '10%',
                      right: '10%',
                      top: `${20 + (win.lineIndex % 3) * 30}%`,
                      height: '20%'
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Reels grid */}
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: 5 }, (_, reelIndex) => (
                <div key={reelIndex} className="relative">
                  {/* Reel container */}
                  <div className="h-48 bg-gradient-to-b from-gray-100 to-gray-300 rounded-lg border-4 border-gray-400 overflow-hidden relative">
                    {/* Spinning overlay */}
                    {isSpinning && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center z-20"
                        animate={{ 
                          backgroundColor: ['rgba(59, 130, 246, 0.5)', 'rgba(239, 68, 68, 0.5)']
                        }}
                        transition={{ 
                          duration: 0.6, 
                          repeat: Infinity, 
                          repeatType: "reverse",
                          ease: "easeInOut"
                        }}
                      >
                        <motion.div
                          className="text-6xl"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                        >
                          🎰
                        </motion.div>
                      </motion.div>
                    )}
                    
                    {/* Reel symbols */}
                    <AnimatePresence>
                      {reelSymbols[reelIndex]?.map((symbol, symbolIndex) => (
                        <motion.div
                          key={`${reelIndex}-${symbolIndex}-${symbol}`}
                          className={`absolute w-full h-16 flex items-center justify-center text-4xl font-bold border-b border-gray-300 z-10 ${
                            isWinningPosition(reelIndex, symbolIndex)
                              ? 'bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 shadow-lg ring-4 ring-yellow-400'
                              : 'bg-white'
                          }`}
                          style={{ top: `${symbolIndex * 64}px` }}
                          initial={isSpinning ? { 
                            y: -100, 
                            opacity: 0,
                            rotateX: -90 
                          } : {}}
                          animate={isSpinning ? { 
                            y: 0, 
                            opacity: 1,
                            rotateX: 0
                          } : {
                            scale: isWinningPosition(reelIndex, symbolIndex) ? 1.1 : 1
                          }}
                          transition={{ 
                            duration: 0.5,
                            delay: reelIndex * 0.1,
                            type: "spring",
                            stiffness: 200,
                            damping: 15
                          }}
                        >
                          <motion.span
                            animate={isWinningPosition(reelIndex, symbolIndex) ? {
                              scale: 1.2,
                              rotateY: 360
                            } : {}}
                            transition={{
                              duration: 1,
                              repeat: isWinningPosition(reelIndex, symbolIndex) ? Infinity : 0,
                              repeatType: "reverse",
                              ease: "easeInOut"
                            }}
                          >
                            {symbol}
                          </motion.span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  
                  {/* Reel number */}
                  <div className="text-center mt-2 text-purple-900 font-bold">
                    REEL {reelIndex + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Win display and effects */}
          {winningLines.length > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 bg-gradient-to-r from-green-600 to-green-400 text-white p-6 rounded-xl border-4 border-green-700 shadow-2xl"
            >
              <div className="text-center">
                <motion.h2 
                  className="text-3xl font-black mb-4"
                  animate={{ scale: 1.1 }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    ease: "easeInOut" 
                  }}
                >
                  🎉 WINNER! 🎉
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {winningLines.map((win, index) => (
                    <div key={index} className="bg-black/20 p-3 rounded-lg">
                      <div className="text-sm font-semibold">Line {win.lineIndex + 1}</div>
                      <div className="text-2xl my-2 flex items-center justify-center gap-1">
                        {Array.from({ length: win.matchCount }).map((_, i) => (
                          <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                            {win.symbol}
                          </span>
                        ))}
                      </div>
                      <div className="text-lg font-bold text-yellow-300">${win.payout.toFixed(2)}</div>
                      <div className="text-xs text-gray-200">
                        {win.matchCount}x {SYMBOLS.find(s => s.symbol === win.symbol)?.name || win.symbol}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-2xl font-black">
                  TOTAL WIN: ${winningLines.reduce((sum, win) => sum + win.payout, 0).toFixed(2)}
                </div>
                <div className="text-sm mt-2 opacity-80">
                  {winningLines.length} winning line{winningLines.length !== 1 ? 's' : ''}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Paytable */}
        <motion.div 
          className="mt-6 bg-black/90 text-white p-6 rounded-xl border border-yellow-500 max-w-4xl w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-center font-bold text-yellow-400 mb-4 text-xl">PAYTABLE</h3>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-4 text-center text-sm">
            {SYMBOLS.map((symbolData) => (
              <div key={symbolData.symbol} className="border border-gray-600 p-2 rounded">
                <div className="text-2xl mb-2">{symbolData.symbol}</div>
                <div className="text-xs space-y-1">
                  {symbolData.payouts.map((payout, index) => (
                    index >= 2 && payout > 0 && (
                      <div key={index} className="flex justify-between">
                        <span>{index}x</span>
                        <span className="text-yellow-400">{payout}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedSlotMachine;
