'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface VerificationStep {
  id: string;
  title: string;
  status: 'completed' | 'pending' | 'required';
  description: string;
}

interface AccountVerificationCardProps {
  verificationSteps: VerificationStep[];
  overallStatus: 'verified' | 'partial' | 'unverified';
}

const AccountVerificationCard = ({
  verificationSteps,
  overallStatus,
}: AccountVerificationCardProps) => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-warm-md">
        <div className="animate-pulse">
          <div className="h-6 bg-surface-elevated-1 rounded w-40 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-surface-elevated-1 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: VerificationStep['status']) => {
    switch (status) {
      case 'completed':
        return {
          icon: 'CheckCircleIcon' as const,
          color: 'text-success',
          bgColor: 'bg-success/20',
          label: 'Verified',
        };
      case 'pending':
        return {
          icon: 'ClockIcon' as const,
          color: 'text-warning',
          bgColor: 'bg-warning/20',
          label: 'Pending Review',
        };
      case 'required':
        return {
          icon: 'ExclamationCircleIcon' as const,
          color: 'text-error',
          bgColor: 'bg-error/20',
          label: 'Action Required',
        };
    }
  };

  const getOverallStatusConfig = () => {
    switch (overallStatus) {
      case 'verified':
        return {
          icon: 'ShieldCheckIcon' as const,
          color: 'text-success',
          bgColor: 'bg-success/20',
          title: 'Account Verified',
          message: 'Your account is fully verified and ready to use.',
        };
      case 'partial':
        return {
          icon: 'ExclamationTriangleIcon' as const,
          color: 'text-warning',
          bgColor: 'bg-warning/20',
          title: 'Verification In Progress',
          message: 'Complete the remaining steps to unlock all features.',
        };
      case 'unverified':
        return {
          icon: 'XCircleIcon' as const,
          color: 'text-error',
          bgColor: 'bg-error/20',
          title: 'Verification Required',
          message: 'Please verify your account to access all features.',
        };
    }
  };

  const overallConfig = getOverallStatusConfig();
  const completedSteps = verificationSteps.filter(
    (s) => s.status === 'completed'
  ).length;
  const totalSteps = verificationSteps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-warm-md">
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`flex items-center justify-center w-10 h-10 ${overallConfig.bgColor} rounded-full`}
        >
          <Icon
            name={overallConfig.icon}
            size={24}
            className={overallConfig.color}
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary font-heading">
            {overallConfig.title}
          </h2>
          <p className="text-sm text-text-secondary mt-1 caption">
            {overallConfig.message}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-text-secondary caption">
            Verification Progress
          </span>
          <span className="font-semibold text-text-primary data-text">
            {completedSteps} / {totalSteps} Complete
          </span>
        </div>
        <div className="relative w-full h-2 bg-surface-elevated-2 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-success to-primary transition-all duration-500 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {verificationSteps.map((step) => {
          const statusConfig = getStatusConfig(step.status);
          return (
            <div
              key={step.id}
              className="bg-surface-elevated-1 border border-border rounded-lg p-4 transition-smooth hover:border-accent"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`flex items-center justify-center w-10 h-10 ${statusConfig.bgColor} rounded-full flex-shrink-0`}
                  >
                    <Icon
                      name={statusConfig.icon}
                      size={20}
                      className={statusConfig.color}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-text-primary">
                        {step.title}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 ${statusConfig.bgColor} ${statusConfig.color} text-xs font-medium rounded-md caption`}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary caption">
                      {step.description}
                    </p>
                  </div>
                </div>

                {step.status === 'required' && (
                  <button
                    onClick={() => router.push('/account-dashboard')}
                    className="flex items-center gap-1 px-3 py-1.5 ml-3 bg-primary text-primary-foreground text-xs font-medium rounded-md transition-smooth hover:scale-[0.97] active:scale-95 caption flex-shrink-0"
                  >
                    <span>Complete</span>
                    <Icon name="ArrowRightIcon" size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {overallStatus !== 'verified' && (
        <div className="mt-6 p-4 bg-muted border border-border rounded-lg">
          <div className="flex items-start gap-3">
            <Icon
              name="InformationCircleIcon"
              size={20}
              className="text-accent mt-0.5"
            />
            <div>
              <p className="text-sm text-text-primary font-medium mb-1">
                Why Verify?
              </p>
              <ul className="text-xs text-text-secondary space-y-1 caption">
                <li>• Unlock higher deposit and withdrawal limits</li>
                <li>• Access exclusive promotions and bonuses</li>
                <li>• Faster withdrawal processing times</li>
                <li>• Enhanced account security</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountVerificationCard;
