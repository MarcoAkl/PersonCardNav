import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useFavorites } from '../../hooks/useFavorites';
import { useTheme } from '../../hooks/useTheme';
import { GridIcon, MoonIcon, StarIcon, SunIcon, UsersIcon } from '../icons';
import styles from './Header.module.css';

export function Header() {
  const { favorites } = useFavorites();
  const { preference, toggleTheme } = useTheme();

  const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = preference === 'dark' || (preference === 'system' && prefersDark);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand} end>
          <span className={styles.brandMark} aria-hidden="true">
            <UsersIcon />
          </span>
          <span className={styles.brandName}>PersonCardNav</span>
        </NavLink>

        <nav className={styles.nav} aria-label="Primary">
          <NavLink
            to="/"
            end
            className={({ isActive }) => clsx(styles.navLink, isActive && styles.navLinkActive)}
          >
            <GridIcon aria-hidden="true" />
            <span>Directory</span>
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) => clsx(styles.navLink, isActive && styles.navLinkActive)}
          >
            <StarIcon filled aria-hidden="true" />
            <span>Favorites</span>
            {favorites.size > 0 && <span className={styles.badge}>{favorites.size}</span>}
          </NavLink>
        </nav>

        <button
          type="button"
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
}
