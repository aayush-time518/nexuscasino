import type { Metadata } from 'next';
import SecureHeader from '@/components/common/SecureHeader';
import BottomTabNavigation from '@/components/common/BottomTabNavigation';
import AuthenticationGuard from '@/components/common/AuthenticationGuard';
import TransactionHistoryInteractive from './components/TransactionHistoryInteractive';

export const metadata: Metadata = {
  title: 'Transaction History - Nexus Gaming Casino',
  description:
    'View your complete financial activity including deposits, withdrawals, gaming wins and losses, and bonus activities. Export statements and track your account balance history.',
};

export default function TransactionHistoryPage() {
  return (
    <AuthenticationGuard requireAuth={true}>
      <div className="min-h-screen bg-background">
        <SecureHeader showBalance={true} />

        <main className="pt-20 pb-24 px-4 max-w-screen-2xl mx-auto">
          <TransactionHistoryInteractive />
        </main>

        <BottomTabNavigation />
      </div>
    </AuthenticationGuard>
  );
}
