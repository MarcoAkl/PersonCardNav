import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchUsers, type UsersQuery } from '../api/users';

/**
 * Wraps the directory list fetch in react-query. `keepPreviousData` means
 * paginating/sorting/filtering swaps in new rows without flashing a full
 * loading state — the grid just updates once the new page arrives.
 */
export function useUsersQuery(query: UsersQuery) {
  return useQuery({
    queryKey: ['users', query],
    queryFn: ({ signal }) => fetchUsers(query, signal),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
