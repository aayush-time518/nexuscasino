'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

const LoyaltyTracker = () => {
  const [loyaltyData, setLoyaltyData] = React.useState({
    points: 0,
    tier: 'Bronze',
    tierLevel: 1
  });

  React.useEffect(() => {
    const fetchLoyalty = async () => {
      try {
        const response = await fetch('/api/loyalty');
        if (response.ok) {
          const data = await response.json();
          setLoyaltyData(data);
        }
      } catch (error) {
        console.error('Error fetching loyalty:', error);
      }
    };
    fetchLoyalty();
  }, []);

  const currentPoints = loyaltyData.points;
  const nextTierPoints = 2500;
  const progress = (currentPoints / nextTierPoints) * 100;

  const redeemableRewards = [
    {
      id: 1,
      name: '$25 Casino Credit',
      points: 2500,
      icon: 'CurrencyDollarIcon',
    },
    { id: 2, name: '50 Free Spins', points: 2000, icon: 'BoltIcon' },
    { id: 3, name: '$10 Bonus', points: 1000, icon: 'GiftIcon' },
  ];

  return (
    <div className="bg-card rounded-xl p-6 shadow-warm-md border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-1">
            Loyalty Points
          </h2>
          <p className="text-text-secondary text-sm">
            Earn points with every bet
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">
            {currentPoints.toLocaleString()}
          </div>
          <div className="text-xs text-text-secondary">Available Points</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-text-secondary">
            Progress to Next Tier
          </span>
          <span className="text-sm font-semibold text-text-primary">
            {nextTierPoints - currentPoints} points needed
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Redeemable Rewards */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Redeem Points
        </h3>
        {redeemableRewards.map((reward) => (
          <div
            key={reward.id}
            className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-smooth"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon
                  name={reward.icon as any}
                  size={20}
                  className="text-primary"
                />
              </div>
              <div>
                <p className="font-medium text-text-primary">{reward.name}</p>
                <p className="text-xs text-text-secondary">
                  {reward.points} points
                </p>
              </div>
            </div>
            <button
              disabled={currentPoints < reward.points}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-smooth ${currentPoints >= reward.points
                  ? 'bg-primary hover:bg-primary-dark text-black'
                  : 'bg-muted text-text-secondary cursor-not-allowed'
                }`}
            >
              {currentPoints >= reward.points ? 'Redeem' : 'Locked'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoyaltyTracker;
