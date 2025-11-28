'use client';

import { useState } from 'react';
import RegisterForm from './RenderRegisterForm';
import SocialLogins from './RenderSocialLogins';
import TogglePanel from './RenderTogglePanel';
import { DictType } from '@/app/lib/types/dictType';
import LoginForm from './RenderLoginForm';
import { ArrowLeft } from 'lucide-react';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';
import styles from '@/app/lib/css/AuthContainer.module.css';
interface AuthContainerProps {
  dictionary: DictType;
  locale: 'en' | 'vi';
}

export default function RenderAuthContainer({
  dictionary,
  locale,
}: AuthContainerProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { push } = useNavigationLoading();
  const backText = dictionary.common?.back || 'Back';

  const handleBack = () => {
    push(`/${locale}/`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        {/* Back Button */}
        <button onClick={handleBack} className={styles.backButton}>
          <ArrowLeft className={styles.backIcon} />
          <span>{backText}</span>
        </button>
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
