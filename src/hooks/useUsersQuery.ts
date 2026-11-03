import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { UsersQuery } from '../api/users';
import { getUsers } from '../offline/usersRepository';

/**
 * Wraps the directory list fetch in react-query. `keepPreviousData` means
 * paginating/sorting/filtering swaps in new rows without flashing a full
 * loading state — the grid just updates once the new page arrives.
 *
 * getUsers falls back to a local IndexedDB cache when the network fails, so
 * this stays functional offline as long as the cache has been warmed once.
 */
export function useUsersQuery(query: UsersQuery) {
  return useQuery({
    queryKey: ['users', query],
    queryFn: ({ signal }) => getUsers(query, signal),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
