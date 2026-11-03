import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOffIcon } from '../icons';
import styles from './OfflineBanner.module.css';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div className={styles.banner} role="status">
      <WifiOffIcon className={styles.icon} />
      <span>You're offline — showing saved data. Favorites still save on this device.</span>
    </div>
  );
}
