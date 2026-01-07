import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Badge {
  id: number;
  name: string;
  icon: string;
  description: string;
}

const TrustBadges = () => {
  const badges: Badge[] = [
    {
      id: 1,
      name: 'SSL Secured',
      icon: 'LockClosedIcon',
      description: '256-bit encryption',
    },
    {
      id: 2,
      name: 'Licensed',
      icon: 'ShieldCheckIcon',
      description: 'Gaming Commission',
    },
    {
      id: 3,
      name: 'Responsible Gaming',
      icon: 'HeartIcon',
      description: 'Player Protection',
    },
    {
      id: 4,
      name: '21+ Only',
      icon: 'IdentificationIcon',
      description: 'Age Verified',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="flex flex-col items-center gap-2 p-4 bg-surface-elevated-1 rounded-md border border-border"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-accent/20 rounded-full">
              <Icon
                name={badge.icon as any}
                size={20}
                className="text-accent"
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-text-primary">
                {badge.name}
              </p>
              <p className="text-[10px] text-text-secondary caption mt-0.5">
                {badge.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted rounded-md border border-border">
        <div className="flex items-start gap-3">
          <Icon
            name="InformationCircleIcon"
            size={20}
            className="text-accent mt-0.5 flex-shrink-0"
          />
          <div>
            <p className="text-xs text-text-secondary caption">
              By signing in, you agree to our Terms of Service and Privacy
              Policy. Must be 21+ to play. Gambling Problem? Call 1-800-GAMBLER.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
