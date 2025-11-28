import { DictType } from '@/app/lib/types/dictType';
import styles from '@/app/lib/css/RenderTogglePanel.module.css';

interface TogglePanelProps {
  mode: 'login' | 'register';
  onToggle: () => void;
  dictionary: DictType;
}
export default function RenderTogglePanel({
  mode,
  onToggle,
  dictionary,
}: TogglePanelProps) {
  const loginDict = dictionary.auth?.login;
  const registerDict = dictionary.auth?.register;
  return (
    <div className={styles.panel}>
      {/* Lớp phủ mờ */}
      <div className={styles.overlay}></div>

      <div className={styles.content}>
        {mode === 'register' ? (
          <>
            <h2 className={styles.title}>{registerDict?.noAccount!}</h2>
            <p className={styles.subtitle}>{registerDict?.subtitle!}</p>
            <button onClick={onToggle} className={styles.button}>
              {registerDict?.login!}
            </button>
          </>
        ) : (
          <>
            <h2 className={styles.title}>{loginDict?.noAccount!}</h2>
            <p className={styles.subtitle}>{loginDict?.subtitle!}</p>
            <button onClick={onToggle} className={styles.button}>
              {loginDict?.register!}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
