import type { Metadata } from 'next';
import LoginInteractive from './components/LoginInteractive';
import AuthenticationGuard from '@/components/common/AuthenticationGuard';

export const metadata: Metadata = {
  title: 'Login - Nexus Gaming Casino',
  description:
    'Sign in to your Nexus Gaming Casino account to access premium casino games, manage your wallet, and enjoy exclusive rewards and promotions.',
};

export default function LoginPage() {
  return (
    <AuthenticationGuard requireAuth={false}>
      <LoginInteractive />
    </AuthenticationGuard>
  );
}
