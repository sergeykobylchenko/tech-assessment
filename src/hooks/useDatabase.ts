import { useContext } from 'react';
import { DatabaseContext } from '@/db/DatabaseProvider';
import type { AppDatabase } from '@/db/database';

export function useDatabase(): AppDatabase {
  const db = useContext(DatabaseContext);
  if (!db) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return db;
}
