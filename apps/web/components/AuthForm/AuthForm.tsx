// apps/web/components/AuthForm/AuthForm.tsx
'use client';

import { useState } from 'react';
import styles from './AuthForm.module.css';
import Image from 'next/image';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
    ageVerified: false,
    profileImage: null as File | null
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file' && files) {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (will be implemented later with Firebase)
    console.log('Form submitted:', formData);
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign in (will be implemented later with Firebase)
    console.log('Google sign in');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <Image 
            src="/beer-pong.png" 
            alt="ThePregames Logo" 
            width={60} 
            height={60} 
          />
          <h2>{mode === 'login' ? 'Log In' : 'Create Account'}</h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'signup' && (
            <div className={styles.profileSection}>
              <div className={styles.avatarUpload}>
                <div className={styles.avatarPreview}>
                  {previewImage ? (
                    <Image src={previewImage} alt="Profile preview" width={80} height={80} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      <span>+</span>
                    </div>
                  )}
                </div>
                <label className={styles.uploadLabel}>
                  Upload Photo
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleInputChange}
                    className={styles.fileInput}
                  />
                </label>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div className={styles.formGroup}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required={mode === 'signup'}
                placeholder="Choose a username"
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {mode === 'signup' && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Confirm your password"
                />
              </div>

              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="ageVerified"
                  name="ageVerified"
                  checked={formData.ageVerified}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="ageVerified">
                  I confirm that I am of legal drinking age in my region
                </label>
              </div>
            </>
          )}

          <button type="submit" className={styles.submitButton}>
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </button>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <button 
            type="button" 
            className={styles.googleButton}
            onClick={handleGoogleSignIn}
          >
            <svg className={styles.googleIcon} viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {mode === 'login' ? (
            <p className={styles.switchMode}>
              Dont have an account? <a href="/signup">Sign up</a>
            </p>
          ) : (
            <p className={styles.switchMode}>
              Already have an account? <a href="/login">Log in</a>
            </p>
          )}
        </form>
      </div>

      {mode === 'signup' && (
        <div className={styles.proSection}>
          <h3>Upgrade to Pro for More Features!</h3>
          <div className={styles.proBenefits}>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🎮</div>
              <div className={styles.benefitText}>
                <h4>All Games Unlocked</h4>
                <p>Access to all premium games including Blackjack and Quiplash</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🔊</div>
              <div className={styles.benefitText}>
                <h4>Spotify Integration</h4>
                <p>Full Spotify integration for Powerhour and Centurion games</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🚫</div>
              <div className={styles.benefitText}>
                <h4>Ad-Free Experience</h4>
                <p>Enjoy an uninterrupted gaming experience without ads</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🏆</div>
              <div className={styles.benefitText}>
                <h4>Tournament Creation</h4>
                <p>Create and manage your own Beer Olympics tournaments</p>
              </div>
            </div>
          </div>
          <div className={styles.pricing}>
            <p>Only <span>$5/month</span> or <span>$50/year</span> (save 17%)</p>
          </div>
        </div>
      )}
    </div>
  );
}