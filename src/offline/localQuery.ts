import type { User, UserSummary, UsersResponse } from '../api/types';
import type { SortField, SortOrder, UsersQuery } from '../api/users';

function matchesSearch(user: User, needle: string): boolean {
  const haystacks = [user.firstName, user.lastName, user.maidenName, user.email, user.company?.name, user.company?.title];
  return haystacks.some((field) => field?.toLowerCase().includes(needle));
}

function compareBy(field: SortField, order: SortOrder) {
  const dir = order === 'desc' ? -1 : 1;
  return (a: User, b: User) => {
    if (field === 'age') return (a.age - b.age) * dir;
    return a[field].localeCompare(b[field]) * dir;
  };
}

/**
 * Mirrors buildUsersUrl's server-side semantics (search beats role filter,
 * sort/pagination compose with either) but runs entirely against an
 * in-memory snapshot of the cached dataset — used when the network is down.
 */
export function queryLocalUsers(allUsers: User[], query: UsersQuery): UsersResponse<UserSummary> {
  let matched = allUsers;

  const trimmedQuery = query.q?.trim().toLowerCase();
  if (trimmedQuery) {
    matched = matched.filter((user) => matchesSearch(user, trimmedQuery));
  } else if (query.role) {
    matched = matched.filter((user) => user.role === query.role);
  }

  if (query.sortBy) {
    matched = [...matched].sort(compareBy(query.sortBy, query.order ?? 'asc'));
  }

  const total = matched.length;
  const users = matched.slice(query.skip, query.skip + query.limit);

  return { users, total, skip: query.skip, limit: query.limit };
}
