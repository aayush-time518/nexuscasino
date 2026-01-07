'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface QuickActionsProps {
  gameName: string;
  onShowRules?: () => void;
  onShowPaytable?: () => void;
  onToggleSound?: (enabled: boolean) => void;
}

const QuickActions = ({
  gameName,
  onShowRules,
  onShowPaytable,
  onToggleSound,
}: QuickActionsProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    if (onToggleSound) onToggleSound(newState);
  };

  const actions = [
    {
      id: 'rules',
      label: 'Rules',
      icon: 'BookOpenIcon' as const,
      onClick: onShowRules,
    },
    {
      id: 'paytable',
      label: 'Paytable',
      icon: 'CurrencyDollarIcon' as const,
      onClick: onShowPaytable,
    },
    {
      id: 'sound',
      label: soundEnabled ? 'Sound On' : 'Sound Off',
      icon: (soundEnabled ? 'SpeakerWaveIcon' : 'SpeakerXMarkIcon') as const,
      onClick: handleToggleSound,
    },
  ];

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="fixed left-4 top-20 z-[300] flex flex-col gap-2">
      {actions.map((action) => (
        <div key={action.id} className="relative">
          <button
            onClick={action.onClick}
            onMouseEnter={() => setShowTooltip(action.id)}
            onMouseLeave={() => setShowTooltip(null)}
            className="flex items-center justify-center w-12 h-12 bg-card border border-border rounded-full shadow-warm-lg transition-smooth hover:border-accent hover:shadow-glow-accent active:scale-95"
            aria-label={action.label}
          >
            <Icon name={action.icon} size={20} className="text-text-primary" />
          </button>

          {showTooltip === action.id && (
            <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-2 bg-popover border border-border rounded-md shadow-warm whitespace-nowrap z-10">
              <p className="text-sm text-text-primary caption">
                {action.label}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuickActions;
