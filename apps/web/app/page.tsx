// apps/web/app/page.tsx
import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={`${styles.hero} section`}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.logoContainer}>
                <img 
                  src="/beer-pong.png" 
                  alt="ThePregames Logo" 
                  className={styles.heroLogo}
                />
            </div>
            <h1 className={`heading heading-xl ${styles.heroTitle}`}>
              Level Up Your <span className={styles.accent}>Pregame</span>
            </h1>
            <p className={styles.heroSubtitle}>
              The ultimate app for drinking games, recipes, and tournaments. 
              Perfect for parties, game nights, and everything in between.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/signup" className="btn">Get Started</Link>
              <Link href="/games" className="btn btn-secondary">Explore Games</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`${styles.features} section`}>
        <div className="container">
          <h2 className={`heading heading-lg text-center ${styles.sectionTitle}`}>
            Why Choose ThePregames?
          </h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎮</div>
              <h3 className={styles.featureTitle}>20+ Games</h3>
              <p className={styles.featureDescription}>
                From classic drinking games to exclusive creations, always have 
                the perfect game for your party.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🍹</div>
              <h3 className={styles.featureTitle}>Cocktail Recipes</h3>
              <p className={styles.featureDescription}>
                Discover, create, and share amazing drink recipes rated by 
                the community for taste and potency.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🏆</div>
              <h3 className={styles.featureTitle}>Tournaments</h3>
              <p className={styles.featureDescription}>
                Organize and compete in Beer Olympics tournaments with 
                custom brackets and scoring systems.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3 className={styles.featureTitle}>Ball Knowledge</h3>
              <p className={styles.featureDescription}>
                Daily sports trivia challenges with leaderboards and 
                special rewards for top performers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Games Preview Section */}
      <section className={`${styles.gamesPreview} section`}>
        <div className="container">
          <div className={styles.gamesContent}>
            <div className={styles.gamesText}>
              <h2 className={`heading heading-lg ${styles.sectionTitle}`}>
                Games for Every Occasion
              </h2>
              <p>
                Whether youre hosting a small gathering or a massive party, 
                weve got games that fit the vibe. Filter by group size, 
                difficulty, and equipment needed.
              </p>
              <ul className={styles.gameList}>
                <li>Ride the Bus</li>
                <li>Blackjack</li>
                <li>Quiplash</li>
                <li>Most Likely To</li>
                <li>Charades</li>
                <li>Powerhour</li>
                <li>And many more...</li>
              </ul>
              <Link href="/games" className="btn">See All Games</Link>
            </div>
            <div className={styles.gamesVisual}>
              {/* Placeholder for game visual */}
              <div className={styles.gameVisualPlaceholder}>
                <div className={styles.phoneMockup}>
                  <div className={styles.phoneScreen}>
                    <div className={styles.gameInterfacePreview}>
                      <div className={styles.gameCard}>A</div>
                      <div className={styles.gameCard}>K</div>
                      <div className={styles.gameActions}>
                        <button>Hit</button>
                        <button>Stand</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`${styles.cta} section`}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={`heading heading-lg ${styles.ctaTitle}`}>
              Ready to Elevate Your Pregame?
            </h2>
            <p className={styles.ctaText}>
              Join thousands of users already transforming their parties with ThePregames.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/signup" className="btn">Get Started Free</Link>
              <Link href="/pricing" className="btn btn-secondary">View Pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}