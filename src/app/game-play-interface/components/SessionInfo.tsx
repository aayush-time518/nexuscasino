'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SessionInfoProps {
  onShowResponsibleGaming?: () => void;
}

const SessionInfo = ({ onShowResponsibleGaming }: SessionInfoProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const interval = setInterval(() => {
      setSessionTime((prev) => {
        const newTime = prev + 1;
        if (newTime % 1800 === 0) {
          setShowReminder(true);
          setTimeout(() => setShowReminder(false), 10000);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isHydrated]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-24 left-4 z-[300] px-4 py-2 bg-card/90 backdrop-blur-sm border border-border rounded-md shadow-warm">
        <div className="flex items-center gap-2">
          <Icon name="ClockIcon" size={16} className="text-text-secondary" />
          <p className="text-sm text-text-secondary caption">
            Session:{' '}
            <span className="text-text-primary data-text">
              {formatTime(sessionTime)}
            </span>
          </p>
        </div>
      </div>

      {showReminder && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-[400]">
          <div className="bg-warning/20 border border-warning rounded-lg p-4 shadow-warm-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-warning/30 rounded-full">
                <Icon
                  name="ExclamationTriangleIcon"
                  size={20}
                  className="text-warning"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-text-primary mb-1 font-heading">
                  Take a Break
                </h3>
                <p className="text-xs text-text-secondary caption mb-3">
                  You've been playing for {Math.floor(sessionTime / 60)}{' '}
                  minutes. Remember to play responsibly.
                </p>
                <button
                  onClick={onShowResponsibleGaming}
                  className="text-xs font-medium text-warning hover:underline caption"
                >
                  Learn More About Responsible Gaming
                </button>
              </div>
              <button
                onClick={() => setShowReminder(false)}
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md transition-smooth hover:bg-warning/20"
                aria-label="Dismiss reminder"
              >
                <Icon
                  name="XMarkIcon"
                  size={16}
                  className="text-text-secondary"
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionInfo;
