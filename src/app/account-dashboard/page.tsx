import type { Metadata } from 'next';
import SecureHeader from '@/components/common/SecureHeader';
import BottomTabNavigation from '@/components/common/BottomTabNavigation';
import AuthenticationGuard from '@/components/common/AuthenticationGuard';
import AccountDashboardInteractive from './components/AccountDashboardInteractive';

export const metadata: Metadata = {
  title: 'Account Dashboard - Nexus Gaming Casino',
  description:
    'Manage your Nexus Gaming Casino account with comprehensive financial tracking, transaction history, responsible gaming controls, loyalty rewards, and account verification in one centralized dashboard.',
};

export default function AccountDashboardPage() {
  return (
    <AuthenticationGuard requireAuth={true} redirectTo="/login">
      <div className="min-h-screen bg-background">
        <SecureHeader showBalance={true} />

        <main className="pt-20 pb-24 px-4 max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary font-heading mb-2">
              Account Dashboard
            </h1>
            <p className="text-text-secondary">
              Manage your account, track transactions, and control your gaming
              experience
            </p>
          </div>

          <AccountDashboardInteractive />
        </main>

        <BottomTabNavigation />
      </div>
    </AuthenticationGuard>
  );
}
