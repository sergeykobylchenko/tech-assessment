import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { createDatabase, type AppDatabase } from './database';

export const DatabaseContext = createContext<AppDatabase | null>(null);

interface DatabaseProviderProps {
  userId: string;
  children: ReactNode;
}

export function DatabaseProvider({ userId, children }: DatabaseProviderProps) {
  const [db, setDb] = useState<AppDatabase | null>(null);

  useEffect(() => {
    let cancelled = false;
    let instance: AppDatabase | null = null;

    createDatabase(userId).then((database) => {
      if (cancelled) {
        database.close();
        return;
      }
      instance = database;
      setDb(database);
    });

    return () => {
      cancelled = true;
      instance?.close();
      setDb(null);
    };
  }, [userId]);

  if (!db) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading database...</p>
      </div>
    );
  }

  return (
    <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>
  );
}
