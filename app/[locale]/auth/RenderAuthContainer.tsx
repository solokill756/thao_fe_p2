'use client';

import { useState } from 'react';
import LoginForm from './RenderLoginForm';
import RegisterForm from './RenderRegisterForm';
import SocialLogins from './RenderSocialLogins';
import TogglePanel from './RenderTogglePanel';
import { DictType } from '@/app/lib/type/dictType';
import styles from './AuthContainer.module.css';
interface AuthContainerProps {
  dictionary: DictType;
  locale: 'en' | 'vi';
}

export default function RenderAuthContainer({
  dictionary,
  locale,
}: AuthContainerProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.content}>
          <div className={styles.formSection}>
            {mode === 'login' ? (
              <LoginForm dictionary={dictionary} locale={locale} />
            ) : (
              <RegisterForm dictionary={dictionary} locale={locale} />
            )}

            <SocialLogins dictionary={dictionary} locale={locale} />
          </div>

          <TogglePanel
            mode={mode}
            onToggle={() => setMode(mode === 'login' ? 'register' : 'login')}
            dictionary={dictionary}
          />
        </div>
      </div>
    </div>
  );
}
