import clsx from 'clsx';
import styles from './SkeletonGrid.module.css';

interface SkeletonGridProps {
  count?: number;
}

export function SkeletonGrid({ count = 12 }: SkeletonGridProps) {
  return (
    <div className={styles.grid} role="status" aria-label="Loading people">
      {Array.from({ length: count }).map((_, index) => (
        <div className={styles.card} key={index} aria-hidden="true">
          <div className={clsx(styles.avatar, styles.shimmer)} />
          <div className={clsx(styles.line, styles.name, styles.shimmer)} />
          <div className={clsx(styles.line, styles.title, styles.shimmer)} />
          <div className={clsx(styles.line, styles.company, styles.shimmer)} />
        </div>
      ))}
      <span className="visually-hidden">Loading people…</span>
    </div>
  );
}
