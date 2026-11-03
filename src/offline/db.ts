import type { User } from '../api/types';

const DB_NAME = 'personCardNav';
const DB_VERSION = 1;
const STORE_NAME = 'users';

function isIndexedDbAvailable(): boolean {
  return typeof indexedDB !== 'undefined';
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Replaces the entire cache with a fresh full-dataset snapshot. */
export async function replaceCachedUsers(users: User[]): Promise<void> {
  if (!isIndexedDbAvailable()) return;
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    for (const user of users) store.put(user);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

/** Upserts a single full user record (e.g. after a successful detail fetch). */
export async function cacheUser(user: User): Promise<void> {
  if (!isIndexedDbAvailable()) return;
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(user);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function getAllCachedUsers(): Promise<User[]> {
  if (!isIndexedDbAvailable()) return [];
  const db = await openDatabase();
  const users = await new Promise<User[]>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result as User[]);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return users;
}

export async function getCachedUserById(id: number): Promise<User | undefined> {
  if (!isIndexedDbAvailable()) return undefined;
  const db = await openDatabase();
  const user = await new Promise<User | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get(id);
    request.onsuccess = () => resolve(request.result as User | undefined);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return user;
}
