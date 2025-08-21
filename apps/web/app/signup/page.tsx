// apps/web/app/signup/page.tsx
import AuthForm from '@/components/AuthForm/AuthForm';
import styles from './page.module.css';

export default function SignupPage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={`heading heading-xl ${styles.title}`}>Join ThePregames</h1>
            <p className={styles.subtitle}>
              Create an account to unlock all our drinking games, tournaments, and features.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}