import type { Metadata } from 'next';
import SecureHeader from '@/components/common/SecureHeader';
import BottomTabNavigation from '@/components/common/BottomTabNavigation';
import AuthenticationGuard from '@/components/common/AuthenticationGuard';
import GameLobbyInteractive from './components/GameLobbyInteractive';

export const metadata: Metadata = {
  title: 'Game Lobby - Nexus Gaming Casino',
  description:
    'Discover and play hundreds of casino games including slots, table games, live dealer, and progressive jackpots. Browse our extensive game library with personalized recommendations and exclusive promotions.',
};

export default function GameLobbyPage() {
  return (
    <AuthenticationGuard requireAuth={false}>
      <div className="min-h-screen bg-background">
        <SecureHeader showBalance={true} />

        <main className="pt-20 pb-24 px-4 max-w-screen-2xl mx-auto">
          <GameLobbyInteractive />
        </main>

        <BottomTabNavigation />
      </div>
    </AuthenticationGuard>
  );
}
