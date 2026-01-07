'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

const VIPSection = () => {
  const vipBenefits = [
    { icon: 'UserGroupIcon', label: 'Personal Account Manager' },
    { icon: 'BoltIcon', label: 'Faster Withdrawals' },
    { icon: 'GiftIcon', label: 'Exclusive Bonuses' },
    { icon: 'TrophyIcon', label: 'Special Tournaments' },
  ];

  return (
    <div className="bg-gradient-to-br from-amber-900/20 to-amber-600/10 border-2 border-amber-500/30 rounded-xl overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="StarIcon" size={32} className="text-black" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-text-primary">
                VIP Program
              </h2>
              <span className="px-2 py-1 bg-amber-500 text-black text-xs font-semibold rounded-full">
                PREMIUM
              </span>
            </div>
            <p className="text-text-secondary">
              Unlock exclusive rewards, personalized service, and premium
              benefits
            </p>
          </div>
        </div>

        {/* VIP Benefits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {vipBenefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 bg-card/50 rounded-lg"
            >
              <Icon
                name={benefit.icon as any}
                size={24}
                className="text-amber-500 mb-2"
              />
              <span className="text-sm text-text-primary font-medium">
                {benefit.label}
              </span>
            </div>
          ))}
        </div>

        {/* Current Tier */}
        <div className="bg-card/70 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-secondary text-sm">Current Tier</span>
            <span className="text-amber-500 font-semibold">Silver</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-500"
              style={{ width: '65%' }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-text-secondary">
            <span>Silver</span>
            <span>35% to Gold</span>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold rounded-lg transition-smooth shadow-warm-md hover:shadow-warm-lg flex items-center justify-center gap-2">
          <Icon name="SparklesIcon" size={20} />
          <span>Explore VIP Benefits</span>
        </button>
      </div>
    </div>
  );
};

export default VIPSection;
