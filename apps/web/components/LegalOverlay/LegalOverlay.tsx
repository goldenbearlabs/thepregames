// apps/web/components/LegalOverlay/LegalOverlay.tsx
'use client';

import { useState, useEffect } from 'react';
import styles from './LegalOverlay.module.css';
import Link from 'next/link';

export default function LegalOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    // Check if user has already agreed
    const hasAgreed = localStorage.getItem('legalAgeAgreed');
    if (!hasAgreed) {
      setIsVisible(true);
    } else {
      setIsAgreed(true);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem('legalAgeAgreed', 'true');
    setIsVisible(false);
    setIsAgreed(true);
  };

  if (!isVisible || isAgreed) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Age Verification</h2>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.warningIcon}>⚠️</div>
          <p className={styles.message}>
            By entering this site, you acknowledge that you are of legal drinking age in your country 
            and agree to our terms of service regarding alcohol-related content.
          </p>
          
          <div className={styles.requirements}>
            <h3>You Must:</h3>
            <ul>
              <li>Be of legal drinking age in your region</li>
              <li>Drink responsibly</li>
              <li>Never drink and drive</li>
              <li>Understand the risks associated with alcohol consumption</li>
            </ul>
          </div>

          <div className={styles.legalLinks}>
            <Link href="/legal/drinking-ages" className={styles.legalLink}>
              View Legal Drinking Ages by Region
            </Link>
          </div>
        </div>
        
        <div className={styles.modalActions}>
          <button 
            className={styles.agreeButton}
            onClick={handleAgree}
          >
            I Agree - Enter Site
          </button>
          <button 
            className={styles.disagreeButton}
            onClick={() => window.location.href = 'https://www.google.com'}
          >
            I Disagree - Exit
          </button>
        </div>
        
        <div className={styles.footerNote}>
          <p>Please drink responsibly. <a href="https://www.niaaa.nih.gov/" target="_blank" rel="noopener noreferrer">Learn more about responsible drinking</a></p>
        </div>
      </div>
    </div>
  );
}