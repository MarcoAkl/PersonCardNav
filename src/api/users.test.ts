import { describe, expect, it } from 'vitest';
import { buildUsersUrl } from './users';

describe('buildUsersUrl', () => {
  it('hits the plain list endpoint when there is no search or role filter', () => {
    const url = buildUsersUrl({ limit: 12, skip: 0 });
    expect(url).toMatch(/^https:\/\/dummyjson\.com\/users\?/);
    expect(url).not.toContain('/search');
    expect(url).not.toContain('/filter');

    const params = new URL(url).searchParams;
    expect(params.get('limit')).toBe('12');
    expect(params.get('skip')).toBe('0');
  });

  it('hits the filter endpoint with key=role when a role is set', () => {
    const url = buildUsersUrl({ role: 'admin', limit: 12, skip: 0 });
    expect(url).toContain('/users/filter?');

    const params = new URL(url).searchParams;
    expect(params.get('key')).toBe('role');
    expect(params.get('value')).toBe('admin');
  });

  it('hits the search endpoint when a query is present', () => {
    const url = buildUsersUrl({ q: 'john', limit: 12, skip: 0 });
    expect(url).toContain('/users/search?');
    expect(new URL(url).searchParams.get('q')).toBe('john');
  });

  it('prefers search over role filter, since the API cannot combine them', () => {
    const url = buildUsersUrl({ q: 'john', role: 'admin', limit: 12, skip: 0 });
    expect(url).toContain('/users/search?');
    expect(url).not.toContain('/users/filter?');

    const params = new URL(url).searchParams;
    expect(params.get('q')).toBe('john');
    // The role is simply not sent — the endpoint doesn't support it.
    expect(params.has('key')).toBe(false);
  });

  it('trims whitespace-only queries and falls back to the list endpoint', () => {
    const url = buildUsersUrl({ q: '   ', limit: 12, skip: 0 });
    expect(url).toMatch(/^https:\/\/dummyjson\.com\/users\?/);
    expect(url).not.toContain('/search');
  });

  it('includes sortBy and order across all three modes when a sort field is set', () => {
    const list = new URL(buildUsersUrl({ sortBy: 'age', order: 'desc', limit: 12, skip: 0 })).searchParams;
    expect(list.get('sortBy')).toBe('age');
    expect(list.get('order')).toBe('desc');

    const filtered = new URL(
      buildUsersUrl({ role: 'moderator', sortBy: 'lastName', order: 'asc', limit: 12, skip: 0 }),
    ).searchParams;
    expect(filtered.get('sortBy')).toBe('lastName');
    expect(filtered.get('order')).toBe('asc');

    const searched = new URL(
      buildUsersUrl({ q: 'ann', sortBy: 'firstName', order: 'asc', limit: 12, skip: 0 }),
    ).searchParams;
    expect(searched.get('sortBy')).toBe('firstName');
  });

  it('omits sortBy entirely when no sort field is chosen', () => {
    const url = buildUsersUrl({ limit: 12, skip: 0 });
    expect(new URL(url).searchParams.has('sortBy')).toBe(false);
  });

  it('carries pagination through to skip/limit', () => {
    const url = buildUsersUrl({ role: 'user', limit: 12, skip: 24 });
    const params = new URL(url).searchParams;
    expect(params.get('skip')).toBe('24');
    expect(params.get('limit')).toBe('12');
  });
});
