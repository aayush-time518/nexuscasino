import type { Metadata } from 'next';
import SecureHeader from '@/components/common/SecureHeader';
import BottomTabNavigation from '@/components/common/BottomTabNavigation';
import AuthenticationGuard from '@/components/common/AuthenticationGuard';
import PromotionsInteractive from './components/PromotionsInteractive';

export const metadata: Metadata = {
  title: 'Promotions & Bonuses - Nexus Gaming Casino',
  description:
    'Explore exclusive casino promotions, bonus offers, and loyalty rewards. Claim welcome bonuses, reload bonuses, free spins, and cashback deals. Track your VIP status and redeem loyalty points.',
};

export default function PromotionsBonusesPage() {
  return (
    <AuthenticationGuard requireAuth={false}>
      <div className="min-h-screen bg-background">
        <SecureHeader showBalance={true} />

        <main className="pt-20 pb-24 max-w-screen-2xl mx-auto">
          <PromotionsInteractive />
        </main>

        <BottomTabNavigation />
      </div>
    </AuthenticationGuard>
  );
}
