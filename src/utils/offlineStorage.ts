
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'imi-offline-store';
const DB_VERSION = 2; // Incremented version

export interface OfflineContent {
  id: string;
  type: 'course' | 'lesson' | 'progress' | 'metadata' | 'media';
  data: any;
  blob?: Blob;
  timestamp: number;
  synced: boolean;
  size?: number;
}

export interface DownloadTask {
  id: string;
  courseId: string;
  title: string;
  progress: number;
  status: 'pending' | 'downloading' | 'paused' | 'completed' | 'error';
  totalSize?: number;
  downloadedSize?: number;
}

class OfflineStorage {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion) {
        if (!db.objectStoreNames.contains('content')) {
          db.createObjectStore('content', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sync-queue')) {
          db.createObjectStore('sync-queue', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('downloads')) {
          db.createObjectStore('downloads', { keyPath: 'id' });
        }
      },
    });
  }

  async saveContent(id: string, type: OfflineContent['type'], data: any, blob?: Blob) {
    const db = await this.dbPromise;
    const size = blob ? blob.size : JSON.stringify(data).length;
    await db.put('content', {
      id,
      type,
      data,
      blob,
      timestamp: Date.now(),
      synced: true,
      size,
    });
  }

  async deleteContent(id: string) {
    const db = await this.dbPromise;
    await db.delete('content', id);
  }

  async getDownloadTasks(): Promise<DownloadTask[]> {
    const db = await this.dbPromise;
    return db.getAll('downloads');
  }

  async updateDownloadTask(task: DownloadTask) {
    const db = await this.dbPromise;
    await db.put('downloads', task);
  }

  async deleteDownloadTask(id: string) {
    const db = await this.dbPromise;
    await db.delete('downloads', id);
  }

  async getStorageUsage() {
    const db = await this.dbPromise;
    const all = await db.getAll('content');
    return all.reduce((acc, item) => acc + (item.size || 0), 0);
  }

  async clearAll() {
    const db = await this.dbPromise;
    await db.clear('content');
    await db.clear('downloads');
  }

  async addToSyncQueue(type: string, data: any) {
    const db = await this.dbPromise;
    await db.add('sync-queue', {
      type,
      data,
      timestamp: Date.now(),
    });
  }

  async getSyncQueue() {
    const db = await this.dbPromise;
    return db.getAll('sync-queue');
  }

  async clearSyncQueue() {
    const db = await this.dbPromise;
    await db.clear('sync-queue');
  }
}

export const offlineStorage = new OfflineStorage();
