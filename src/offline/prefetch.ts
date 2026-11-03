import { useEffect, useRef } from 'react';
import { fetchAllUsers } from '../api/users';
import { replaceCachedUsers } from './db';

let syncInFlight: Promise<void> | null = null;

/** Fetches the full ~208-user dataset and replaces the offline cache with it. */
export function syncOfflineCache(): Promise<void> {
  if (syncInFlight) return syncInFlight;

  syncInFlight = (async () => {
    try {
      const users = await fetchAllUsers();
      await replaceCachedUsers(users);
    } catch {
      // Best-effort — if this fails (e.g. we're already offline on first
      // load), the app just falls back further to whatever's already cached.
    } finally {
      syncInFlight = null;
    }
  })();

  return syncInFlight;
}

/** Keeps the offline cache warm: syncs once on mount, then again on every reconnect. */
export function useOfflineCacheSync() {
  const hasSyncedOnce = useRef(false);

  useEffect(() => {
    if (!hasSyncedOnce.current && navigator.onLine) {
      hasSyncedOnce.current = true;
      void syncOfflineCache();
    }

    const handleOnline = () => void syncOfflineCache();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);
}
