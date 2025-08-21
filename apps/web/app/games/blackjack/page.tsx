// apps/web/app/games/blackjack/page.tsx
import GameTemplate from '@/components/GameTemplate/GameTemplate';
import { games } from '../../../config/game';

export default function BlackjackPage() {
  const game = games.find(g => g.id === 'blackjack');
  
  if (!game) {
    return <div>Game not found</div>;
  }

  return <GameTemplate game={game} />;
}