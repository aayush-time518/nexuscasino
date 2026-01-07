'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ActiveBonus {
  id: string;
  name: string;
  bonusAmount: number;
  wageringRequired: number;
  wageringCompleted: number;
  expiresIn: string;
  type: 'deposit' | 'freespins' | 'cashback';
}

const ActiveBonusTracker = () => {
  const activeBonuses: ActiveBonus[] = [
    {
      id: '1',
      name: 'Welcome Bonus',
      bonusAmount: 500,
      wageringRequired: 15000,
      wageringCompleted: 8750,
      expiresIn: '5 days',
      type: 'deposit',
    },
    {
      id: '2',
      name: 'Free Spins Bonus',
      bonusAmount: 50,
      wageringRequired: 2000,
      wageringCompleted: 1200,
      expiresIn: '2 days',
      type: 'freespins',
    },
  ];

  const getBonusIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'GiftIcon';
      case 'freespins':
        return 'BoltIcon';
      case 'cashback':
        return 'CurrencyDollarIcon';
      default:
        return 'SparklesIcon';
    }
  };

  if (activeBonuses.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-xl p-6 shadow-warm-md border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="SparklesIcon" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary">
            Active Bonuses
          </h2>
          <p className="text-text-secondary text-sm">
            Track your bonus progress
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {activeBonuses.map((bonus) => {
          const progress =
            (bonus.wageringCompleted / bonus.wageringRequired) * 100;

          return (
            <div
              key={bonus.id}
              className="p-4 bg-muted rounded-lg border border-border hover:border-primary/30 transition-smooth"
            >
              {/* Bonus Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon
                      name={getBonusIcon(bonus.type) as any}
                      size={16}
                      className="text-primary"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      {bonus.name}
                    </h3>
                    <p className="text-xs text-text-secondary">
                      ${bonus.bonusAmount} bonus
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-text-secondary">Expires in</div>
                  <div className="text-sm font-semibold text-warning">
                    {bonus.expiresIn}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-text-secondary">
                    Wagering Progress
                  </span>
                  <span className="text-xs font-semibold text-text-primary">
                    ${bonus.wageringCompleted.toLocaleString()} / $
                    {bonus.wageringRequired.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  {Math.round(progress)}% complete
                </div>
              </div>

              {/* Remaining Amount */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xs text-text-secondary">
                  Remaining to wager
                </span>
                <span className="text-sm font-semibold text-primary">
                  $
                  {(
                    bonus.wageringRequired - bonus.wageringCompleted
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Link */}
      <button className="w-full mt-4 py-2 text-sm text-primary hover:text-primary-dark font-medium transition-smooth">
        View All Active Bonuses
      </button>
    </div>
  );
};

export default ActiveBonusTracker;
