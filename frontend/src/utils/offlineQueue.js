import { openDB } from 'idb';

const DB_NAME = 'sigercap-offline';
const REQUEST_STORE = 'pending-requests';
const SCAN_STORE = 'pending-scans';

const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(REQUEST_STORE)) {
        db.createObjectStore(REQUEST_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(SCAN_STORE)) {
        db.createObjectStore(SCAN_STORE, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

// --- Generic Request Queue (Citizens) ---

export const queueOfflineRequest = async (type, data) => {
  const db = await initDB();
  const tx = db.transaction(REQUEST_STORE, 'readwrite');
  await tx.objectStore(REQUEST_STORE).add({
    type,
    data,
    timestamp: Date.now(),
  });
  await tx.done;
};

export const getQueuedRequests = async () => {
  const db = await initDB();
  return db.getAll(REQUEST_STORE);
};

export const clearQueuedRequests = async () => {
  const db = await initDB();
  const tx = db.transaction(REQUEST_STORE, 'readwrite');
  await tx.objectStore(REQUEST_STORE).clear();
  await tx.done;
};

// --- QR Scan Queue (Petugas) ---

export const saveScanOffline = async (scanData) => {
  const db = await initDB();
  const tx = db.transaction(SCAN_STORE, 'readwrite');
  await tx.objectStore(SCAN_STORE).add({
    ...scanData,
    scanned_at: new Date().toISOString()
  });
  await tx.done;
};

export const getPendingScans = async () => {
  const db = await initDB();
  return db.getAll(SCAN_STORE);
};

export const markScanAsSynced = async (id) => {
  const db = await initDB();
  const tx = db.transaction(SCAN_STORE, 'readwrite');
  await tx.objectStore(SCAN_STORE).delete(id);
  await tx.done;
};

// --- Global Sync Helper ---

export const syncOfflineData = async () => {
  if (!navigator.onLine) return;
  
  const pending = await getQueuedRequests();
  if (pending.length === 0) return;

  try {
    const response = await api.post('/sync', { requests: pending });
    if (response.data.success) {
      await clearQueuedRequests();
      console.log('Sync complete:', response.data.data);
      return true;
    }
  } catch (err) {
    console.error('Sync failed:', err);
  }
  return false;
};

// Auto-trigger sync when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Back online! Triggering sync...');
    syncOfflineData();
  });
}
