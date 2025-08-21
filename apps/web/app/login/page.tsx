// apps/web/app/login/page.tsx
import AuthForm from '@/components/AuthForm/AuthForm';
import styles from './page.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={`heading heading-xl ${styles.title}`}>Welcome Back!</h1>
            <p className={styles.subtitle}>
              Log in to access your games, tournaments, and personalized content.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}