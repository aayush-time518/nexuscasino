// Sound effects for the slot machine
export class SlotSoundEffects {
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContextClass();
      } catch (e) {
        console.warn('Audio context not available');
      }
    }
  }

  private createOscillator(frequency: number, type: OscillatorType = 'sine'): OscillatorNode | null {
    if (!this.audioContext) return null;
    
    const oscillator = this.audioContext.createOscillator();
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    return oscillator;
  }

  private createGain(volume: number = 0.1): GainNode | null {
    if (!this.audioContext) return null;
    
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume;
    return gainNode;
  }

  // Play spinning reel sound
  playSpinSound(): void {
    if (!this.audioContext) return;

    const oscillator = this.createOscillator(200, 'sawtooth');
    const gain = this.createGain(0.1);
    
    if (!oscillator || !gain) return;

    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);
    
    // Create a spinning sound effect
    const now = this.audioContext.currentTime;
    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(150, now + 0.3);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    
    oscillator.start(now);
    oscillator.stop(now + 0.5);
  }

  // Play reel stop sound
  playReelStopSound(reelIndex: number): void {
    if (!this.audioContext) return;

    const frequency = 300 + (reelIndex * 50);
    const oscillator = this.createOscillator(frequency, 'square');
    const gain = this.createGain(0.15);
    
    if (!oscillator || !gain) return;

    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  }

  // Play small win sound
  playSmallWin(): void {
    if (!this.audioContext) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    notes.forEach((frequency, index) => {
      setTimeout(() => {
        const oscillator = this.createOscillator(frequency, 'sine');
        const gain = this.createGain(0.2);
        
        if (!oscillator || !gain) return;

        oscillator.connect(gain);
        gain.connect(this.audioContext!.destination);
        
        const now = this.audioContext!.currentTime;
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        oscillator.start(now);
        oscillator.stop(now + 0.3);
      }, index * 100);
    });
  }

  // Play big win sound
  playBigWin(): void {
    if (!this.audioContext) return;

    // Play a fanfare-like sound
    const melody = [
      { freq: 523.25, time: 0 },    // C5
      { freq: 659.25, time: 0.1 },  // E5
      { freq: 783.99, time: 0.2 },  // G5
      { freq: 1046.50, time: 0.3 }, // C6
      { freq: 1318.51, time: 0.4 }, // E6
      { freq: 1567.98, time: 0.5 }, // G6
    ];

    melody.forEach(({ freq, time }) => {
      setTimeout(() => {
        const oscillator = this.createOscillator(freq, 'triangle');
        const gain = this.createGain(0.15);
        
        if (!oscillator || !gain) return;

        oscillator.connect(gain);
        gain.connect(this.audioContext!.destination);
        
        const now = this.audioContext!.currentTime;
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        oscillator.start(now);
        oscillator.stop(now + 0.4);
      }, time * 1000);
    });
  }

  // Play jackpot sound
  playJackpot(): void {
    if (!this.audioContext) return;

    // Play explosive jackpot sound
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const frequency = 200 + Math.random() * 1000;
        const oscillator = this.createOscillator(frequency, 'sawtooth');
        const gain = this.createGain(0.1);
        
        if (!oscillator || !gain) return;

        oscillator.connect(gain);
        gain.connect(this.audioContext!.destination);
        
        const now = this.audioContext!.currentTime;
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        oscillator.start(now);
        oscillator.stop(now + 0.5);
      }, i * 50);
    }
  }

  // Play button click sound
  playButtonClick(): void {
    if (!this.audioContext) return;

    const oscillator = this.createOscillator(800, 'square');
    const gain = this.createGain(0.05);
    
    if (!oscillator || !gain) return;

    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }
}

export default SlotSoundEffects;
