import { useEffect, useState } from 'react';
import { SearchIcon, XIcon } from '../icons';
import styles from './Controls.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const DEBOUNCE_MS = 350;

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [draft, setDraft] = useState(value);

  // Keep the input in sync when the URL changes from elsewhere (back/forward, clearing filters).
  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (draft === value) return;
    const timeout = setTimeout(() => onChange(draft), DEBOUNCE_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  return (
    <div className={styles.searchField}>
      <SearchIcon className={styles.searchIcon} />
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search people by name…"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        aria-label="Search people by name"
      />
      {draft && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={() => {
            setDraft('');
            onChange('');
          }}
          aria-label="Clear search"
        >
          <XIcon />
        </button>
      )}
    </div>
  );
}
