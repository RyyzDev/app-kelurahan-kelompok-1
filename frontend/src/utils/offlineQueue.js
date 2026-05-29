import { openDB } from 'idb';

const DB_NAME = 'sigercap_offline';
const STORE_NAME = 'scans';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    }
  },
});

export const saveScanOffline = async (scanData) => {
  const db = await dbPromise;
  const dataToSave = {
    ...scanData,
    timestamp: new Date().toISOString(),
    synced: false,
  };
  return db.add(STORE_NAME, dataToSave);
};

export const getPendingScans = async () => {
  const db = await dbPromise;
  const allScans = await db.getAll(STORE_NAME);
  return allScans.filter(scan => !scan.synced);
};

export const markScanAsSynced = async (id) => {
  const db = await dbPromise;
  const scan = await db.get(STORE_NAME, id);
  if (scan) {
    scan.synced = true;
    return db.put(STORE_NAME, scan);
  }
};

export const clearSyncedScans = async () => {
  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  let cursor = await store.openCursor();

  while (cursor) {
    if (cursor.value.synced) {
      cursor.delete();
    }
    cursor = await cursor.continue();
  }
  return tx.done;
};
