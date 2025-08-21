// apps/web/components/Footer/Footer.tsx
import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>ThePregames</h3>
            <p>Your ultimate companion for drinking games and pre-game fun. Drink responsibly and have fun!</p>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="Twitter">TW</a>
              <a href="#" aria-label="TikTok">TT</a>
            </div>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerSubheading}>Features</h4>
            <ul className={styles.footerLinks}>
              <li><Link href="/games">Games</Link></li>
              <li><Link href="/recipes">Drink Recipes</Link></li>
              <li><Link href="/tournaments">Tournaments</Link></li>
              <li><Link href="/ball-knowledge">Ball Knowledge</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerSubheading}>Company</h4>
            <ul className={styles.footerLinks}>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerSubheading}>Legal</h4>
            <ul className={styles.footerLinks}>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/responsible-drinking">Drink Responsibly</Link></li>
              <li><Link href="/legal/drinking-ages">Drinking Ages</Link></li>
            </ul>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            © {currentYear} ThePregames. All rights reserved.
          </div>
          <div className={styles.attribution}>
            <a href="https://www.flaticon.com/free-icons/beer-pong" title="beer pong icons">
              Beer pong icons created by Freepik - Flaticon
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}