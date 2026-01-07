import type { Metadata } from 'next';
import { Suspense } from 'react';
import AuthenticationGuard from '@/components/common/AuthenticationGuard';
import GamePlayInteractive from './components/GamePlayInteractive';

export const metadata: Metadata = {
  title: 'Game Play - Nexus Gaming Casino',
  description:
    'Experience immersive casino gaming with real-time betting controls, balance management, and full-screen gameplay across slots, table games, and live dealer experiences.',
};

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-surface-elevated-2 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-text-secondary caption">
          Loading game interface...
        </p>
      </div>
    </div>
  );
}

export default function GamePlayInterfacePage() {
  return (
    <AuthenticationGuard requireAuth redirectTo="/login">
      <Suspense fallback={<LoadingSkeleton />}>
        <GamePlayInteractive />
      </Suspense>
    </AuthenticationGuard>
  );
}
