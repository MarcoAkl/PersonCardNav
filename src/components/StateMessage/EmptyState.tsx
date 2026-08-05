import type { ReactNode } from 'react';
import { SearchIcon } from '../icons';
import styles from './StateMessage.module.css';

interface EmptyStateProps {
  title?: string;
  text?: string;
  action?: ReactNode;
}

export function EmptyState({ title = 'No people found', text, action }: EmptyStateProps) {
  return (
    <div className={styles.wrap}>
      <span className={`${styles.icon} ${styles.iconEmpty}`}>
        <SearchIcon />
      </span>
      <h2 className={styles.title}>{title}</h2>
      {text && <p className={styles.text}>{text}</p>}
      {action}
    </div>
  );
}
