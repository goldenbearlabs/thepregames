// apps/web/components/GameTemplate/GameTemplate.tsx
import styles from './GameTemplate.module.css';
import Link from 'next/link';
import Image from 'next/image';

interface GameTemplateProps {
  game: {
    id: string;
    name: string;
    description: string;
    image: string;
    category: string;
    players: string;
    complexity: 'Low' | 'Medium' | 'High';
  };
}

export default function GameTemplate({ game }: GameTemplateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.gameImage}>
              <Image 
                src={game.image} 
                alt={game.name}
                width={120}
                height={120}
              />
            </div>
            <h1 className={styles.gameTitle}>{game.name}</h1>
            <p className={styles.gameCategory}>{game.category}</p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.content}>
          <div className={styles.main}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>About This Game</h2>
              <p>{game.description}</p>
              
              <div className={styles.gameDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Players:</span>
                  <span className={styles.detailValue}>{game.players}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Complexity:</span>
                  <span className={styles.detailValue}>{game.complexity}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Category:</span>
                  <span className={styles.detailValue}>{game.category}</span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>How to Play</h2>
              <p>This game is currently under development. Check back soon for the full rules and gameplay instructions!</p>
              <p>In the meantime, you can explore other games or check out our drink recipes to prepare for your next game night.</p>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Play Now</h3>
              <p>This game will be available to play soon. Stay tuned for updates!</p>
              
              <div className={styles.actions}>
                <button className={styles.primaryButton} disabled>
                  Coming Soon
                </button>
                <Link href="/games" className={styles.secondaryButton}>
                  Explore Other Games
                </Link>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>You Might Also Like</h3>
              <div className={styles.relatedGames}>
                <Link href="/games/ride-the-bus" className={styles.relatedGame}>
                  <div className={styles.relatedGameImage}>
                    <Image 
                      src="/ride-the-bus.png" 
                      alt="Ride the Bus"
                      width={40}
                      height={40}
                    />
                  </div>
                  <span className={styles.relatedGameName}>Ride the Bus</span>
                </Link>
                <Link href="/games/most-likely" className={styles.relatedGame}>
                  <div className={styles.relatedGameImage}>
                    <Image 
                      src="/most-likely-to.png" 
                      alt="Most Likely To"
                      width={40}
                      height={40}
                    />
                  </div>
                  <span className={styles.relatedGameName}>Most Likely To</span>
                </Link>
                <Link href="/games/powerhour" className={styles.relatedGame}>
                  <div className={styles.relatedGameImage}>
                    <Image 
                      src="/powerhour.png" 
                      alt="Power Hour"
                      width={40}
                      height={40}
                    />
                  </div>
                  <span className={styles.relatedGameName}>Power Hour</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}