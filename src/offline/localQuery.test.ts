import { describe, expect, it } from 'vitest';
import type { User } from '../api/types';
import { queryLocalUsers } from './localQuery';

function makeUser(overrides: Partial<User> & Pick<User, 'id' | 'firstName' | 'lastName' | 'age' | 'role'>): User {
  return {
    maidenName: '',
    gender: 'female',
    email: `${overrides.firstName.toLowerCase()}@example.com`,
    phone: '000',
    username: overrides.firstName.toLowerCase(),
    birthDate: '2000-1-1',
    image: '',
    bloodGroup: 'O+',
    height: 170,
    weight: 60,
    eyeColor: 'Brown',
    hair: { color: 'Black', type: 'Straight' },
    address: {
      address: '1 Main St',
      city: 'Springfield',
      state: 'IL',
      stateCode: 'IL',
      postalCode: '00000',
      country: 'United States',
      coordinates: { lat: 0, lng: 0 },
    },
    university: 'Test University',
    bank: { cardExpire: '01/30', cardNumber: '0000', cardType: 'Visa', currency: 'USD', iban: 'US00' },
    company: { department: 'Engineering', name: 'Acme', title: 'Engineer', address: { address: '', city: '', state: '', stateCode: '', postalCode: '', country: '', coordinates: { lat: 0, lng: 0 } } },
    crypto: { coin: 'Bitcoin', wallet: '', network: '' },
    ...overrides,
  };
}

const users: User[] = [
  makeUser({ id: 1, firstName: 'Alice', lastName: 'Zephyr', age: 30, role: 'admin' }),
  makeUser({ id: 2, firstName: 'Bob', lastName: 'Young', age: 25, role: 'user' }),
  makeUser({ id: 3, firstName: 'Charlie', lastName: 'Xavier', age: 40, role: 'moderator' }),
  makeUser({ id: 4, firstName: 'Alina', lastName: 'Adams', age: 22, role: 'user' }),
];

describe('queryLocalUsers', () => {
  it('returns everyone, paginated, with no query', () => {
    const result = queryLocalUsers(users, { limit: 2, skip: 0 });
    expect(result.total).toBe(4);
    expect(result.users).toHaveLength(2);
    expect(result.users.map((u) => u.id)).toEqual([1, 2]);
  });

  it('filters by role', () => {
    const result = queryLocalUsers(users, { role: 'user', limit: 10, skip: 0 });
    expect(result.total).toBe(2);
    expect(result.users.map((u) => u.id).sort()).toEqual([2, 4]);
  });

  it('searches by first or last name, case-insensitively', () => {
    const result = queryLocalUsers(users, { q: 'ali', limit: 10, skip: 0 });
    // matches Alice (firstName) and Alina (firstName) and Adams (lastName, for Alina) — dedupe by id
    expect(result.users.map((u) => u.id).sort()).toEqual([1, 4]);
  });

  it('prefers search over role filter, mirroring the server API', () => {
    const result = queryLocalUsers(users, { q: 'bob', role: 'admin', limit: 10, skip: 0 });
    expect(result.users.map((u) => u.id)).toEqual([2]);
  });

  it('sorts by age ascending and descending', () => {
    const asc = queryLocalUsers(users, { sortBy: 'age', order: 'asc', limit: 10, skip: 0 });
    expect(asc.users.map((u) => u.age)).toEqual([22, 25, 30, 40]);

    const desc = queryLocalUsers(users, { sortBy: 'age', order: 'desc', limit: 10, skip: 0 });
    expect(desc.users.map((u) => u.age)).toEqual([40, 30, 25, 22]);
  });

  it('sorts by last name alphabetically', () => {
    const result = queryLocalUsers(users, { sortBy: 'lastName', order: 'asc', limit: 10, skip: 0 });
    expect(result.users.map((u) => u.lastName)).toEqual(['Adams', 'Xavier', 'Young', 'Zephyr']);
  });

  it('composes role filter, sort, and pagination together', () => {
    const result = queryLocalUsers(users, { role: 'user', sortBy: 'age', order: 'asc', limit: 1, skip: 1 });
    expect(result.total).toBe(2);
    expect(result.users.map((u) => u.id)).toEqual([2]);
  });
});
