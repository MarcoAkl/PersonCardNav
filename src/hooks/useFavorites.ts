import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'personCardNav.favorites';

function readFavorites(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is number => typeof id === 'number') : [];
  } catch {
    return [];
  }
}

/**
 * localStorage-backed favorites set, kept in sync across tabs via the
 * `storage` event and across components in this tab via a custom event
 * (the `storage` event only fires in *other* tabs/windows).
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(() => new Set(readFavorites()));

  useEffect(() => {
    const sync = () => setFavorites(new Set(readFavorites()));
    window.addEventListener('storage', sync);
    window.addEventListener('personCardNav:favorites-changed', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('personCardNav:favorites-changed', sync);
    };
  }, []);

  const persist = useCallback((next: Set<number>) => {
    setFavorites(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    window.dispatchEvent(new Event('personCardNav:favorites-changed'));
  }, []);

  const isFavorite = useCallback((id: number) => favorites.has(id), [favorites]);

  const toggleFavorite = useCallback(
    (id: number) => {
      const next = new Set(favorites);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      persist(next);
    },
    [favorites, persist],
  );

  return { favorites, isFavorite, toggleFavorite };
}
