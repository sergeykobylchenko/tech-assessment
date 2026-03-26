import type { UsersStorage } from '@/types/user.types';

const STORAGE_KEY = 'cendas_users';

const DEFAULT_STORAGE: UsersStorage = {
  active_user: null,
  users: {},
};

export function getStoredUsers(): UsersStorage {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_STORAGE;
  try {
    return JSON.parse(raw) as UsersStorage;
  } catch {
    return DEFAULT_STORAGE;
  }
}

export function setStoredUsers(data: UsersStorage): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function generateUserId(): string {
  return crypto.randomUUID();
}
