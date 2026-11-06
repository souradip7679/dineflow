import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private memoryStore: Record<string, string> = {};
  private isLocalStorageAvailable: boolean = true;

  constructor() {
    try {
      const testKey = '__df_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      this.isLocalStorageAvailable = true;
    } catch {
      this.isLocalStorageAvailable = false;
      console.warn('LocalStorage unavailable; falling back to in-memory store.');
    }
  }

  get<T>(key: string, defaultValue: T): T {
    try {
      const raw = this.isLocalStorageAvailable
        ? localStorage.getItem(key)
        : this.memoryStore[key];
      if (raw === null || raw === undefined) {
        return defaultValue;
      }
      return JSON.parse(raw) as T;
    } catch (err) {
      console.error(`Error reading key "${key}" from storage:`, err);
      return defaultValue;
    }
  }

  set<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      if (this.isLocalStorageAvailable) {
        localStorage.setItem(key, serialized);
      } else {
        this.memoryStore[key] = serialized;
      }
      return true;
    } catch (err) {
      console.error(`Error saving key "${key}" to storage:`, err);
      return false;
    }
  }

  remove(key: string): void {
    try {
      if (this.isLocalStorageAvailable) {
        localStorage.removeItem(key);
      } else {
        delete this.memoryStore[key];
      }
    } catch (err) {
      console.error(`Error removing key "${key}":`, err);
    }
  }

  clear(): void {
    try {
      if (this.isLocalStorageAvailable) {
        localStorage.clear();
      } else {
        this.memoryStore = {};
      }
    } catch (err) {
      console.error('Error clearing storage:', err);
    }
  }
}
