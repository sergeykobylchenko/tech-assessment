import { createRxDatabase, type RxDatabase } from 'rxdb/plugins/core';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { addCollections, type AppCollections } from './collections';

export type AppDatabase = RxDatabase<AppCollections>;

export async function createDatabase(userId: string): Promise<AppDatabase> {
  const db = await createRxDatabase<AppCollections>({
    name: `app_db_${userId}`,
    storage: getRxStorageDexie(),
    closeDuplicates: true,
  });

  await addCollections(db);

  return db;
}
