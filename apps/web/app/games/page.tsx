// apps/web/app/games/page.tsx
'use client';

import { useState } from 'react';
import { games, gameCategories, Game } from '../../config/game';
import styles from './page.module.css';

export default function GamesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Games');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'All Games' || game.category === selectedCategory;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className="container">
          <h1 className={`heading heading-xl ${styles.title}`}>Game Library</h1>
          <p className={styles.subtitle}>
            Discover the perfect drinking game for your next party. Filter by category, number of players, or complexity.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>

          <div className={styles.categoryFilters}>
            {gameCategories.map(category => (
              <button
                key={category}
                className={`${styles.categoryFilter} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.gameGrid}>
          {filteredGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className={styles.noResults}>
            <h3>No games found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

function GameCard({ game }: { game: Game }) {
  return (
    <div className={styles.gameCard}>
      <div className={styles.gameImageContainer}>
        <img 
          src={game.image} 
          alt={game.name}
          className={styles.gameImage}
        />
        <div className={styles.gameOverlay}></div>
        <div className={styles.gameCategory}>{game.category}</div>
      </div>
      
      <div className={styles.gameContent}>
        <h3 className={styles.gameName}>{game.name}</h3>
        <p className={styles.gameDescription}>{game.description}</p>
        
        <div className={styles.gameMeta}>
          <div className={styles.metaItem}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>{game.players} players</span>
          </div>
          <div className={styles.metaItem}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span>{game.complexity}</span>
          </div>
        </div>
        
        <a href={game.route} className={styles.playButton}>
          Play Now
        </a>
      </div>
    </div>
  );
}