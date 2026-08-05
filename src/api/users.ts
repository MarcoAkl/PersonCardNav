import type { Role, User, UserSummary, UsersResponse } from './types';

const BASE_URL = 'https://dummyjson.com';

/** Fields requested for grid cards — keeps list payloads small. */
const SUMMARY_FIELDS = 'id,firstName,lastName,image,age,role,company';

export type SortField = 'firstName' | 'lastName' | 'age';
export type SortOrder = 'asc' | 'desc';

export interface UsersQuery {
  /** Free-text search term. Takes precedence over `role` (DummyJSON has no endpoint combining both). */
  q?: string;
  role?: Role | '';
  sortBy?: SortField;
  order?: SortOrder;
  limit: number;
  skip: number;
}

class ApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Picks the DummyJSON endpoint for the current query. Search and role-filter
 * are mutually exclusive server-side, so a non-empty `q` always wins.
 */
export function buildUsersUrl(query: UsersQuery): string {
  const { q, role, sortBy, order, limit, skip } = query;

  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('skip', String(skip));
  params.set('select', SUMMARY_FIELDS);
  if (sortBy) {
    params.set('sortBy', sortBy);
    params.set('order', order ?? 'asc');
  }

  const trimmedQuery = q?.trim();
  if (trimmedQuery) {
    params.set('q', trimmedQuery);
    return `${BASE_URL}/users/search?${params.toString()}`;
  }

  if (role) {
    params.set('key', 'role');
    params.set('value', role);
    return `${BASE_URL}/users/filter?${params.toString()}`;
  }

  return `${BASE_URL}/users?${params.toString()}`;
}

export async function fetchUsers(
  query: UsersQuery,
  signal?: AbortSignal,
): Promise<UsersResponse<UserSummary>> {
  const res = await fetch(buildUsersUrl(query), { signal });
  if (!res.ok) {
    throw new ApiError(`Failed to load people (${res.status})`, res.status);
  }
  return res.json() as Promise<UsersResponse<UserSummary>>;
}

export async function fetchUserById(id: number, signal?: AbortSignal): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${id}`, { signal });
  if (!res.ok) {
    throw new ApiError(`Failed to load this person (${res.status})`, res.status);
  }
  return res.json() as Promise<User>;
}
