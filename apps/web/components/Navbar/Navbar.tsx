// apps/web/components/Navbar/Navbar.tsx
"use client"
import styles from './Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { games } from '../../config/game';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGamesDropdownOpen, setIsGamesDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleGamesDropdown = () => {
    setIsGamesDropdownOpen(!isGamesDropdownOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <Image 
            src="/beer-pong.png" 
            alt="ThePregames Logo" 
            width={40} 
            height={40} 
          />
          <span>ThePregames</span>
        </Link>

        <div className={`${styles.navMenu} ${isMenuOpen ? styles.navMenuOpen : ''}`}>
          <div 
            className={styles.navItemWithDropdown}
            onMouseEnter={() => setIsGamesDropdownOpen(true)}
            onMouseLeave={() => setIsGamesDropdownOpen(false)}
          >
            <button 
              className={styles.navLink}
              onClick={toggleGamesDropdown}
              aria-expanded={isGamesDropdownOpen}
            >
              Games
              <svg className={styles.dropdownIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {isGamesDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>Popular Games</div>
                {games.slice(0, 6).map(game => (
                  <Link
                    key={game.id}
                    href={game.route}
                    className={styles.dropdownItem}
                    style={{ '--game-color': game.color } as React.CSSProperties}
                  >
                    <span className={styles.gameIcon}>{game.icon}</span>
                    <span className={styles.gameName}>{game.name}</span>
                  </Link>
                ))}
                <div className={styles.dropdownDivider}></div>
                <Link href="/games" className={styles.dropdownItem}>
                  <span className={styles.gameIcon}>🎮</span>
                  <span className={styles.gameName}>View All Games</span>
                </Link>
              </div>
            )}
          </div>
          
          <Link href="/recipes" className={styles.navLink}>Recipes</Link>
          <Link href="/tournaments" className={styles.navLink}>Tournaments</Link>
          <Link href="/ball-knowledge" className={styles.navLink}>Ball Knowledge</Link>
          <Link href="/pricing" className={styles.navLink}>Pricing</Link>
          
          <div className={styles.authButtons}>
            <Link href="/login" className={styles.navLink}>Log In</Link>
            <Link href="/signup" className={`btn ${styles.signUpBtn}`}>Sign Up</Link>
          </div>
        </div>

        <button 
          className={styles.hamburger} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}