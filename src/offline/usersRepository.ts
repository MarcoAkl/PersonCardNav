import type { User, UserSummary, UsersResponse } from '../api/types';
import { fetchUserById, fetchUsers, type UsersQuery } from '../api/users';
import { cacheUser, getAllCachedUsers, getCachedUserById } from './db';
import { queryLocalUsers } from './localQuery';

export class OfflineUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OfflineUnavailableError';
  }
}

/**
 * Network-first, cache-fallback directory query. If the request can't reach
 * DummyJSON (offline, or any network-level failure), it serves the same
 * query against the local IndexedDB snapshot instead of failing outright —
 * search/filter/sort/pagination all keep working on cached data.
 */
export async function getUsers(query: UsersQuery, signal?: AbortSignal): Promise<UsersResponse<UserSummary>> {
  try {
    return await fetchUsers(query, signal);
  } catch (networkError) {
    const cached = await getAllCachedUsers();
    if (cached.length === 0) throw networkError;
    return queryLocalUsers(cached, query);
  }
}

/**
 * Network-first, cache-fallback single-user lookup — same fallback as
 * getUsers, so a detail page (or a favorite) already synced to the cache
 * stays viewable offline.
 */
export async function getUserById(id: number, signal?: AbortSignal): Promise<User> {
  try {
    const user = await fetchUserById(id, signal);
    void cacheUser(user);
    return user;
  } catch (networkError) {
    const cached = await getCachedUserById(id);
    if (!cached) {
      throw networkError instanceof Error
        ? networkError
        : new OfflineUnavailableError('This person is not available offline yet.');
    }
    return cached;
  }
}
