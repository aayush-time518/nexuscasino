'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface LoyaltyTier {
  name: string;
  level: number;
  color: string;
  benefits: string[];
}

interface Reward {
  id: string;
  title: string;
  points: number;
  description: string;
  available: boolean;
}

interface LoyaltyProgramSectionProps {
  currentTier: LoyaltyTier;
  nextTier: LoyaltyTier | null;
  currentPoints: number;
  pointsToNextTier: number;
  rewards: Reward[];
}

const LoyaltyProgramSection = ({
  currentTier,
  nextTier,
  currentPoints,
  pointsToNextTier,
  rewards,
}: LoyaltyProgramSectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-warm-md">
        <div className="animate-pulse">
          <div className="h-6 bg-surface-elevated-1 rounded w-40 mb-4" />
          <div className="h-32 bg-surface-elevated-1 rounded mb-4" />
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-surface-elevated-1 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = nextTier
    ? Math.min((currentPoints / (currentPoints + pointsToNextTier)) * 100, 100)
    : 100;

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-6 shadow-warm-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent/20 rounded-full">
              <Icon
                name="StarIcon"
                size={24}
                className="text-accent"
                variant="solid"
              />
            </div>
            <h2 className="text-xl font-semibold text-text-primary font-heading">
              Loyalty Program
            </h2>
          </div>

          <button
            onClick={() => setShowRewardsModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium transition-smooth hover:scale-[0.97] hover:shadow-glow-primary active:scale-95 caption"
          >
            <Icon name="GiftIcon" size={16} />
            <span>View Rewards</span>
          </button>
        </div>

        <div className="bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-text-secondary mb-1 caption">
                Current Tier
              </p>
              <p
                className={`text-2xl font-bold ${currentTier.color} font-heading`}
              >
                {currentTier.name}
              </p>
            </div>
            <div className="flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full">
              <span className="text-2xl font-bold text-accent data-text">
                {currentTier.level}
              </span>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary caption">
                Points Balance
              </span>
              <span className="font-semibold text-text-primary data-text">
                {currentPoints.toLocaleString()} pts
              </span>
            </div>

            {nextTier && (
              <>
                <div className="relative w-full h-3 bg-surface-elevated-2 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent to-primary transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary caption">
                    {pointsToNextTier.toLocaleString()} pts to {nextTier.name}
                  </span>
                  <span className="font-medium text-accent data-text">
                    {progressPercentage.toFixed(0)}%
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-text-secondary mb-2 caption">
              Current Benefits:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentTier.benefits.slice(0, 4).map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Icon
                    name="CheckCircleIcon"
                    size={14}
                    className="text-success"
                  />
                  <span className="text-xs text-text-primary caption">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface-elevated-1 border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="TrophyIcon" size={20} className="text-accent" />
              <p className="text-sm font-medium text-text-primary">
                Available Rewards
              </p>
            </div>
            <p className="text-2xl font-semibold text-text-primary data-text">
              {rewards.filter((r) => r.available).length}
            </p>
          </div>

          <div className="bg-surface-elevated-1 border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="SparklesIcon" size={20} className="text-primary" />
              <p className="text-sm font-medium text-text-primary">
                Points This Month
              </p>
            </div>
            <p className="text-2xl font-semibold text-text-primary data-text">
              {Math.floor(currentPoints * 0.3).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {showRewardsModal && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[300]"
            onClick={() => setShowRewardsModal(false)}
            aria-hidden="true"
          />

          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-2xl max-h-[80vh] bg-card rounded-xl border border-border shadow-warm-2xl z-[300] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rewards-modal-title"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3
                id="rewards-modal-title"
                className="text-lg font-semibold text-text-primary font-heading"
              >
                Available Rewards
              </h3>
              <button
                onClick={() => setShowRewardsModal(false)}
                className="flex items-center justify-center w-8 h-8 rounded-md transition-smooth hover:bg-muted"
                aria-label="Close dialog"
              >
                <Icon
                  name="XMarkIcon"
                  size={20}
                  className="text-text-secondary"
                />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
              <div className="space-y-4">
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className={`bg-surface-elevated-1 border rounded-lg p-4 transition-smooth ${
                      reward.available
                        ? 'border-accent hover:shadow-glow-accent'
                        : 'border-border opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-text-primary mb-1">
                          {reward.title}
                        </h4>
                        <p className="text-sm text-text-secondary caption">
                          {reward.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Icon
                          name="StarIcon"
                          size={16}
                          className="text-accent"
                          variant="solid"
                        />
                        <span className="text-sm font-semibold text-accent data-text">
                          {reward.points.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      disabled={!reward.available}
                      className={`w-full h-10 px-4 rounded-lg font-medium transition-smooth ${
                        reward.available
                          ? 'bg-primary text-primary-foreground hover:scale-[0.97] hover:shadow-glow-primary active:scale-95'
                          : 'bg-surface-elevated-2 text-text-secondary cursor-not-allowed'
                      }`}
                    >
                      {reward.available ? 'Redeem Now' : 'Insufficient Points'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LoyaltyProgramSection;
