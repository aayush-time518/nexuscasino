'use client';

import React, { useState, useEffect } from 'react';
import AccountSummaryCard from './AccountSummaryCard';
import TransactionHistorySection from './TransactionHistorySection';
import ResponsibleGamingPanel from './ResponsibleGamingPanel';
import LoyaltyProgramSection from './LoyaltyProgramSection';
import AccountVerificationCard from './AccountVerificationCard';
import AccountSettingsSection from './AccountSettingsSection';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
}

interface GamingLimit {
  type: 'deposit' | 'loss' | 'session';
  current: number;
  limit: number;
  period: string;
}

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

interface VerificationStep {
  id: string;
  title: string;
  status: 'completed' | 'pending' | 'required';
  description: string;
}

interface SettingItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
}

const AccountDashboardInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [accountData, setAccountData] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loyaltyData, setLoyaltyData] = useState<any>(null);

  useEffect(() => {
    setIsHydrated(true);
    setDataLoading(true); // Start data loading

    Promise.all([
      fetch('/api/account/summary').then(res => res.ok ? res.json() : null),
      fetch('/api/transactions').then(res => res.ok ? res.json() : []),
      fetch('/api/loyalty').then(res => res.ok ? res.json() : null)
    ]).then(([acc, txs, loyalty]) => {
      setAccountData(acc);

      if (Array.isArray(txs)) {
        const mapped = txs.map((t: any) => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          status: t.status,
          date: new Date(t.createdAt).toLocaleString(),
          description: t.description
        }));
        setTransactions(mapped);
      }

      setLoyaltyData(loyalty);
    })
      .catch(err => console.error('Error fetching dashboard data:', err))
      .finally(() => setDataLoading(false));

  }, []);

  const mockGamingLimits: GamingLimit[] = [
    {
      type: 'deposit',
      current: 700,
      limit: 1000,
      period: 'Daily Limit',
    },
    {
      type: 'loss',
      current: 150,
      limit: 500,
      period: 'Daily Limit',
    },
    {
      type: 'session',
      current: 2.5,
      limit: 4,
      period: 'Daily Limit',
    },
  ];

  const currentTier: LoyaltyTier = loyaltyData ? {
    name: loyaltyData.tier,
    level: loyaltyData.tierLevel,
    color: 'text-accent',
    benefits: [
      '5% Cashback on Losses',
      'Priority Customer Support',
      'Exclusive Game Access',
      'Birthday Bonus',
      'Weekly Reload Bonus',
      'Faster Withdrawals',
    ],
  } : {
    name: 'Bronze',
    level: 1,
    color: 'text-accent',
    benefits: []
  };

  const mockNextTier: LoyaltyTier = {
    name: 'Platinum',
    level: 4,
    color: 'text-primary',
    benefits: [
      '10% Cashback on Losses',
      'Dedicated Account Manager',
      'VIP Events Access',
      'Higher Withdrawal Limits',
    ],
  };

  const mockRewards: Reward[] = [
    {
      id: 'reward_001',
      title: '$25 Free Play',
      points: 2500,
      description: 'Redeem for $25 in free casino credits',
      available: true,
    },
    {
      id: 'reward_002',
      title: '$50 Free Play',
      points: 5000,
      description: 'Redeem for $50 in free casino credits',
      available: true,
    },
    {
      id: 'reward_003',
      title: '$100 Free Play',
      points: 10000,
      description: 'Redeem for $100 in free casino credits',
      available: false,
    },
    {
      id: 'reward_004',
      title: 'VIP Event Ticket',
      points: 15000,
      description: 'Exclusive access to VIP casino events',
      available: false,
    },
  ];

  const mockVerificationSteps: VerificationStep[] = [
    {
      id: 'step_001',
      title: 'Email Verification',
      status: 'completed',
      description: 'Verify your email address',
    },
    {
      id: 'step_002',
      title: 'Phone Verification',
      status: 'completed',
      description: 'Verify your phone number via SMS',
    },
    {
      id: 'step_003',
      title: 'Identity Verification',
      status: 'pending',
      description: 'Upload government-issued ID for verification',
    },
    {
      id: 'step_004',
      title: 'Address Verification',
      status: 'required',
      description: 'Upload proof of address (utility bill or bank statement)',
    },
  ];

  const mockNotificationSettings: SettingItem[] = [
    {
      id: 'notif_001',
      title: 'Promotional Emails',
      description: 'Receive emails about bonuses and promotions',
      icon: 'EnvelopeIcon',
      enabled: true,
    },
    {
      id: 'notif_002',
      title: 'Transaction Alerts',
      description: 'Get notified about deposits and withdrawals',
      icon: 'BellAlertIcon',
      enabled: true,
    },
    {
      id: 'notif_003',
      title: 'Game Updates',
      description: 'Notifications about new games and features',
      icon: 'SparklesIcon',
      enabled: false,
    },
    {
      id: 'notif_004',
      title: 'Responsible Gaming Reminders',
      description: 'Receive reminders about your gaming limits',
      icon: 'ShieldCheckIcon',
      enabled: true,
    },
  ];

  const mockPrivacySettings: SettingItem[] = [
    {
      id: 'privacy_001',
      title: 'Profile Visibility',
      description: 'Allow other players to view your profile',
      icon: 'EyeIcon',
      enabled: false,
    },
    {
      id: 'privacy_002',
      title: 'Activity Sharing',
      description: 'Share your gaming activity on social media',
      icon: 'ShareIcon',
      enabled: false,
    },
    {
      id: 'privacy_003',
      title: 'Data Analytics',
      description: 'Allow us to use your data to improve services',
      icon: 'ChartBarIcon',
      enabled: true,
    },
  ];

  if (!isHydrated || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-surface-elevated-2 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-text-secondary caption">
            {dataLoading ? 'Loading profile data...' : 'Loading dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AccountSummaryCard
        balance={accountData?.balance || 0}
        pendingWithdrawals={accountData?.pendingWithdrawals || 0}
        activeBonuses={accountData?.activeBonus || 0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AccountVerificationCard
          verificationSteps={mockVerificationSteps}
          overallStatus="partial"
        />

        <LoyaltyProgramSection
          currentTier={currentTier}
          nextTier={mockNextTier}
          currentPoints={loyaltyData?.points || 0}
          pointsToNextTier={2500} // This could be calculated dynamicallly
          rewards={mockRewards}
        />
      </div>

      <TransactionHistorySection transactions={transactions} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResponsibleGamingPanel limits={mockGamingLimits} />

        <AccountSettingsSection
          notificationSettings={mockNotificationSettings}
          privacySettings={mockPrivacySettings}
        />
      </div>
    </div>
  );
};

export default AccountDashboardInteractive;
