import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export function NotFound() {
  return (
    <div className={styles.wrap}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.text}>The page you're looking for doesn't exist.</p>
      <Link to="/" className={styles.link}>
        Back to the directory
      </Link>
    </div>
  );
}
