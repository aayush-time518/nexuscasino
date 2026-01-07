import React from 'react';
import Icon from '@/components/ui/AppIcon';

const TrustSignals = () => {
  const certifications = [
    {
      icon: 'ShieldCheckIcon',
      label: 'New Jersey Division of Gaming Enforcement',
      color: 'text-success',
    },
    {
      icon: 'LockClosedIcon',
      label: '256-bit SSL Encryption',
      color: 'text-accent',
    },
    {
      icon: 'CheckBadgeIcon',
      label: 'Responsible Gaming Certified',
      color: 'text-primary',
    },
    {
      icon: 'UserGroupIcon',
      label: 'Age Verification Required',
      color: 'text-warning',
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-surface-elevated-1 rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4 font-heading">
          Your Security & Safety
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-card rounded-md border border-border"
            >
              <Icon name={cert.icon as any} size={24} className={cert.color} />
              <div>
                <p className="text-sm text-text-primary font-medium">
                  {cert.label}
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
              className="text-accent mt-0.5"
            />
            <div>
              <p className="text-xs text-text-secondary caption">
                Nexus Gaming Casino is committed to responsible gaming. We use
                advanced security measures to protect your personal information
                and ensure fair play. All games are regularly audited for
                fairness and randomness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;
