import clsx from 'clsx';
import { StarIcon } from '../icons';
import styles from './FavoriteButton.module.css';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  personName: string;
  size?: 'md' | 'lg';
  className?: string;
}

export function FavoriteButton({ isFavorite, onToggle, personName, size = 'md', className }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      className={clsx(styles.button, isFavorite && styles.active, size === 'lg' && styles.large, className)}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle();
      }}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remove ${personName} from favorites` : `Add ${personName} to favorites`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <StarIcon filled={isFavorite} className={styles.icon} />
    </button>
  );
}
