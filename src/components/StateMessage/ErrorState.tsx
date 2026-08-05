import { AlertIcon } from '../icons';
import styles from './StateMessage.module.css';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.wrap} role="alert">
      <span className={`${styles.icon} ${styles.iconError}`}>
        <AlertIcon />
      </span>
      <h2 className={styles.title}>Something went wrong</h2>
      <p className={styles.text}>{message ?? "We couldn't load this. Check your connection and try again."}</p>
      <button type="button" className={styles.retry} onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
