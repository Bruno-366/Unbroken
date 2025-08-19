// IndexedDB storage utility for user progress and preferences
import type { AppState } from './types';

const DB_NAME = 'UnbrokenTracker';
const DB_VERSION = 1;
const STORE_NAME = 'appState';

// Interface for the data we want to persist
interface PersistedState {
  activeTab: string;
  currentWeek: number;
  currentDay: number;
  completedWorkouts: AppState['completedWorkouts'];
  customPlan: AppState['customPlan'];
  maxes: AppState['maxes'];
  tenRMs: AppState['tenRMs'];
  weightUnit: string;
  completedSets: AppState['completedSets'];
}

// Open IndexedDB connection
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        try {
          db.createObjectStore(STORE_NAME);
        } catch (e) {
          console.warn('Failed to create object store:', e);
        }
      }
    };
  });
};

// Save state to IndexedDB
export const saveStateToStorage = async (state: AppState): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Extract only the data we want to persist
    const persistedState: PersistedState = {
      activeTab: state.activeTab,
      currentWeek: state.currentWeek,
      currentDay: state.currentDay,
      completedWorkouts: state.completedWorkouts,
      customPlan: state.customPlan,
      maxes: state.maxes,
      tenRMs: state.tenRMs,
      weightUnit: state.weightUnit,
      completedSets: state.completedSets,
    };
    
    await new Promise<void>((resolve, reject) => {
      const request = store.put(persistedState, 'state');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    
    db.close();
  } catch (error) {
    console.warn('Failed to save state to IndexedDB:', error);
  }
};

// Load state from IndexedDB
export const loadStateFromStorage = async (): Promise<Partial<AppState> | null> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    const persistedState = await new Promise<PersistedState | null>((resolve, reject) => {
      const request = store.get('state');
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
    
    db.close();
    return persistedState;
  } catch (error) {
    console.warn('Failed to load state from IndexedDB:', error);
    return null;
  }
};

// Clear all stored data
export const clearStorage = async (): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    await new Promise<void>((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    
    db.close();
  } catch (error) {
    console.warn('Failed to clear storage:', error);
  }
};