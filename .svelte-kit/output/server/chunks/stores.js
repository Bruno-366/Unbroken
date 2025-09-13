import { w as writable } from "./index.js";
const DB_NAME = "UnbrokenTracker";
const DB_VERSION = 1;
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const storeNames = ["workoutState", "trainingPlanState", "exerciseState", "preferencesState"];
      storeNames.forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          try {
            db.createObjectStore(storeName);
          } catch (e) {
            console.warn(`Failed to create object store ${storeName}:`, e);
          }
        }
      });
    };
  });
};
const saveToStorage = async (storeName, data) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    const cleanData = JSON.parse(JSON.stringify(data));
    await new Promise((resolve, reject) => {
      const request = store.put(cleanData, "data");
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    db.close();
  } catch (error) {
    console.warn(`Failed to save ${storeName} to IndexedDB:`, error);
  }
};
const loadFromStorage = async (storeName) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);
    const data = await new Promise((resolve, reject) => {
      const request = store.get("data");
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return data;
  } catch (error) {
    console.warn(`Failed to load ${storeName} from IndexedDB:`, error);
    return null;
  }
};
const isStoreInitialized = writable(false);
let storesLoadedCount = 0;
const totalStores = 4;
const checkIfAllStoresLoaded = () => {
  storesLoadedCount++;
  if (storesLoadedCount >= totalStores) {
    isStoreInitialized.set(true);
  }
};
const createPersistedStore = (storeName, defaultValue, shouldPersist = () => true) => {
  const { subscribe, set, update } = writable(defaultValue);
  let isInitialized = false;
  loadFromStorage(storeName).then((data) => {
    if (data) {
      set(data);
    }
    isInitialized = true;
    checkIfAllStoresLoaded();
  });
  return {
    subscribe,
    set: (value) => {
      set(value);
      if (isInitialized && shouldPersist(value)) {
        saveToStorage(storeName, value);
      }
    },
    update: (updater) => {
      update((value) => {
        const newValue = updater(value);
        if (isInitialized && shouldPersist(newValue)) {
          saveToStorage(storeName, newValue);
        }
        return newValue;
      });
    }
  };
};
const defaultUIState = {
  activeTab: "overview",
  showResetConfirm: false,
  restTimer: {
    isActive: false,
    timeLeft: 0,
    totalTime: 0,
    workoutType: null,
    phase: "initial",
    startTime: 0
  },
  lissTimer: {
    isActive: false,
    isPaused: false,
    timeLeft: 0,
    totalTime: 0,
    startTime: 0,
    pausedTime: 0
  }
};
const uiStore = writable(defaultUIState);
const defaultWorkoutState = {
  currentWeek: 1,
  currentDay: 1,
  completedWorkouts: [],
  completedSets: {}
};
const workoutStore = createPersistedStore("workoutState", defaultWorkoutState);
const defaultTrainingPlanState = {
  customPlan: [
    { name: "Endurance Block 1", weeks: 8, type: "endurance1" },
    { name: "Powerbuilding Block 1", weeks: 3, type: "powerbuilding1" },
    { name: "Powerbuilding Block 2", weeks: 3, type: "powerbuilding2" },
    { name: "Powerbuilding Block 3", weeks: 3, type: "powerbuilding3" },
    { name: "Bodybuilding Block", weeks: 3, type: "bodybuilding" },
    { name: "Bodybuilding Block", weeks: 3, type: "bodybuilding" },
    { name: "Bodybuilding Block", weeks: 3, type: "bodybuilding" },
    { name: "Powerbuilding Block 3 - Bulgarian", weeks: 3, type: "powerbuilding3bulgarian" },
    { name: "Strength Block", weeks: 6, type: "strength" },
    { name: "Endurance Block 1", weeks: 8, type: "endurance1" }
  ]
};
const trainingPlanStore = createPersistedStore("trainingPlanState", defaultTrainingPlanState);
const defaultExerciseState = {
  maxes: {
    benchpress: 100,
    squat: 120,
    deadlift: 140,
    trapbardeadlift: 130,
    overheadpress: 60,
    frontsquat: 90,
    weightedpullup: 20,
    powerclean: 80,
    romaniandeadlift: 120
  },
  tenRMs: {}
};
const exerciseStore = createPersistedStore("exerciseState", defaultExerciseState);
const defaultPreferencesState = {
  weightUnit: "kg"
};
const preferencesStore = createPersistedStore("preferencesState", defaultPreferencesState);
export {
  exerciseStore as e,
  isStoreInitialized as i,
  preferencesStore as p,
  trainingPlanStore as t,
  uiStore as u,
  workoutStore as w
};
