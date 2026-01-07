import type { Metadata } from 'next';
import SecureHeader from '@/components/common/SecureHeader';
import BottomTabNavigation from '@/components/common/BottomTabNavigation';
import AuthenticationGuard from '@/components/common/AuthenticationGuard';
import RegistrationForm from './components/RegistrationForm';
import TrustSignals from './components/TrustSignals';
import LoginPrompt from './components/LoginPrompt';

export const metadata: Metadata = {
  title: 'Create Account - Nexus Gaming Casino',
  description:
    'Join Nexus Gaming Casino today. Create your account in minutes with secure registration, identity verification, and responsible gaming controls. Start playing your favorite casino games with confidence.',
};

export default function RegistrationPage() {
  return (
    <AuthenticationGuard requireAuth={false}>
      <div className="min-h-screen bg-background">
        <SecureHeader showBalance={false} />

        <main className="pt-20 pb-24 sm:pb-8">
          <div className="max-w-screen-xl mx-auto">
            <RegistrationForm />
            <TrustSignals />
            <LoginPrompt />
          </div>
        </main>

        <div className="sm:hidden">
          <BottomTabNavigation />
        </div>
      </div>
    </AuthenticationGuard>
  );
}
