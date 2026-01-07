'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface GamingLimit {
  type: 'deposit' | 'loss' | 'session';
  current: number;
  limit: number;
  period: string;
}

interface ResponsibleGamingPanelProps {
  limits: GamingLimit[];
}

const ResponsibleGamingPanel = ({ limits }: ResponsibleGamingPanelProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLimit, setSelectedLimit] = useState<GamingLimit | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-warm-md">
        <div className="animate-pulse">
          <div className="h-6 bg-surface-elevated-1 rounded w-48 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-surface-elevated-1 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getLimitIcon = (type: GamingLimit['type']) => {
    switch (type) {
      case 'deposit':
        return { name: 'BanknotesIcon' as const, color: 'text-primary' };
      case 'loss':
        return {
          name: 'ExclamationTriangleIcon' as const,
          color: 'text-warning',
        };
      case 'session':
        return { name: 'ClockIcon' as const, color: 'text-accent' };
    }
  };

  const getLimitLabel = (type: GamingLimit['type']) => {
    switch (type) {
      case 'deposit':
        return 'Deposit Limit';
      case 'loss':
        return 'Loss Limit';
      case 'session':
        return 'Session Time Limit';
    }
  };

  const getProgressPercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-error';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-success';
  };

  const handleEditLimit = (limit: GamingLimit) => {
    setSelectedLimit(limit);
    setShowEditModal(true);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-6 shadow-warm-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-warning/20 rounded-full">
              <Icon name="ShieldCheckIcon" size={24} className="text-warning" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary font-heading">
              Responsible Gaming
            </h2>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {limits.map((limit, index) => {
            const iconConfig = getLimitIcon(limit.type);
            const percentage = getProgressPercentage(
              limit.current,
              limit.limit
            );
            const progressColor = getProgressColor(percentage);

            return (
              <div
                key={index}
                className="bg-surface-elevated-1 border border-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-10 h-10 ${iconConfig.color}/20 rounded-full`}
                    >
                      <Icon
                        name={iconConfig.name}
                        size={20}
                        className={iconConfig.color}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {getLimitLabel(limit.type)}
                      </p>
                      <p className="text-xs text-text-secondary mt-1 caption">
                        {limit.period}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleEditLimit(limit)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-text-primary bg-surface-elevated-2 rounded-md transition-smooth hover:bg-surface-elevated-3 caption"
                  >
                    <Icon name="PencilIcon" size={14} />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary caption">
                      {limit.type === 'session' ? 'Time Used' : 'Amount Used'}
                    </span>
                    <span className="font-semibold text-text-primary data-text">
                      {limit.type === 'session'
                        ? `${limit.current} / ${limit.limit} hours`
                        : `$${limit.current.toFixed(
                            2
                          )} / $${limit.limit.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="relative w-full h-2 bg-surface-elevated-2 rounded-full overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 h-full ${progressColor} transition-all duration-500 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {percentage >= 90 && (
                    <div className="flex items-start gap-2 mt-2 p-2 bg-error/10 border border-error/20 rounded-md">
                      <Icon
                        name="ExclamationCircleIcon"
                        size={16}
                        className="text-error mt-0.5"
                      />
                      <p className="text-xs text-error caption">
                        You are approaching your{' '}
                        {getLimitLabel(limit.type).toLowerCase()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <button className="flex items-center justify-center gap-2 w-full h-12 px-6 bg-surface-elevated-1 border border-border text-text-primary rounded-lg font-medium transition-smooth hover:border-warning hover:shadow-warm">
            <Icon name="PauseIcon" size={20} />
            <span>Take a Break</span>
          </button>

          <button className="flex items-center justify-center gap-2 w-full h-12 px-6 bg-surface-elevated-1 border border-border text-text-primary rounded-lg font-medium transition-smooth hover:border-error hover:shadow-warm">
            <Icon name="LockClosedIcon" size={20} />
            <span>Self-Exclusion</span>
          </button>
        </div>

        <div className="mt-6 p-4 bg-muted border border-border rounded-lg">
          <div className="flex items-start gap-3">
            <Icon
              name="InformationCircleIcon"
              size={20}
              className="text-accent mt-0.5"
            />
            <div>
              <p className="text-sm text-text-primary font-medium mb-1">
                Need Help?
              </p>
              <p className="text-xs text-text-secondary mb-2 caption">
                If you feel you may have a gambling problem, we're here to help.
              </p>
              <a
                href="tel:1-800-522-4700"
                className="text-xs text-primary hover:underline font-medium caption"
              >
                Call 1-800-522-4700
              </a>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && selectedLimit && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[300]"
            onClick={() => setShowEditModal(false)}
            aria-hidden="true"
          />

          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-card rounded-xl border border-border shadow-warm-2xl z-[300]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-limit-title"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3
                  id="edit-limit-title"
                  className="text-lg font-semibold text-text-primary font-heading"
                >
                  Edit {getLimitLabel(selectedLimit.type)}
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
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

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    New Limit Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                      $
                    </span>
                    <input
                      type="number"
                      defaultValue={selectedLimit.limit}
                      className="w-full h-12 pl-8 pr-4 bg-input border border-border rounded-lg text-text-primary focus-ring"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Icon
                      name="ExclamationTriangleIcon"
                      size={16}
                      className="text-warning mt-0.5"
                    />
                    <p className="text-xs text-text-secondary caption">
                      Changes to limits may take up to 24 hours to take effect.
                      Decreases are immediate.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 h-12 px-6 bg-surface-elevated-1 text-text-primary rounded-lg font-medium transition-smooth hover:bg-surface-elevated-2 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 h-12 px-6 bg-primary text-primary-foreground rounded-lg font-medium transition-smooth hover:scale-[0.97] hover:shadow-glow-primary active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ResponsibleGamingPanel;
