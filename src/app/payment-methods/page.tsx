import type { Metadata } from 'next';
import SecureHeader from '@/components/common/SecureHeader';
import BottomTabNavigation from '@/components/common/BottomTabNavigation';
import AuthenticationGuard from '@/components/common/AuthenticationGuard';
import PaymentMethodsInteractive from './components/PaymentMethodsInteractive';

export const metadata: Metadata = {
  title: 'Payment Methods - Nexus Gaming Casino',
  description:
    'Manage your payment methods, deposit funds, and withdraw winnings securely with multiple payment options including credit cards, bank transfers, and digital wallets.',
};

export default function PaymentMethodsPage() {
  return (
    <AuthenticationGuard requireAuth={true}>
      <div className="min-h-screen bg-background">
        <SecureHeader showBalance={true} />

        <main className="pt-16">
          <PaymentMethodsInteractive />
        </main>

        <BottomTabNavigation />
      </div>
    </AuthenticationGuard>
  );
}
