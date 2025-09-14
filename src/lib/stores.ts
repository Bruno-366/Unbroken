// Svelte stores for centralized state management with persistence
import { writable } from 'svelte/store'
import type { CompletedWorkout, CustomPlanBlock } from '$lib/types'

// Store interfaces
interface UIState {
  activeTab: string
}

interface WorkoutState {
  currentWeek: number
  currentDay: number
  completedWorkouts: CompletedWorkout[]
  completedSets: Record<string, boolean>
}

interface TrainingPlanState {
  customPlan: CustomPlanBlock[]
}

interface ExerciseState {
  maxes: Record<string, number>
  tenRMs: Record<string, number>
}

interface PreferencesState {
  weightUnit: string
}

// IndexedDB persistence utilities
const DB_NAME = 'UnbrokenTracker'
const DB_VERSION = 1

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // Check if we're in a browser environment
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not available (likely server-side rendering)'))
      return
    }
    
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      const storeNames = ['workoutState', 'trainingPlanState', 'exerciseState', 'preferencesState']
      
      storeNames.forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          try {
            db.createObjectStore(storeName)
          } catch (e) {
            console.warn(`Failed to create object store ${storeName}:`, e)
          }
        }
      })
    }
  })
}

const saveToStorage = async (storeName: string, data: unknown): Promise<void> => {
  try {
    // Skip saving during SSR
    if (typeof indexedDB === 'undefined') {
      return
    }
    
    const db = await openDB()
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    
    // Deep clone to remove any Svelte reactivity proxies
    const cleanData = JSON.parse(JSON.stringify(data))
    
    await new Promise<void>((resolve, reject) => {
      const request = store.put(cleanData, 'data')
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
    
    db.close()
  } catch (error) {
    console.warn(`Failed to save ${storeName} to IndexedDB:`, error)
  }
}

const loadFromStorage = async <T>(storeName: string): Promise<T | null> => {
  try {
    // Return null during SSR
    if (typeof indexedDB === 'undefined') {
      return null
    }
    
    const db = await openDB()
    const transaction = db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)
    
    const data = await new Promise<T | null>((resolve, reject) => {
      const request = store.get('data')
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
    
    db.close()
    return data
  } catch (error) {
    console.warn(`Failed to load ${storeName} from IndexedDB:`, error)
    return null
  }
}

// Loading state management
export const isStoreInitialized = writable<boolean>(false)
let storesLoadedCount = 0
const totalStores = 4 // workoutStore, trainingPlanStore, exerciseStore, preferencesStore

const checkIfAllStoresLoaded = () => {
  storesLoadedCount++
  if (storesLoadedCount >= totalStores) {
    isStoreInitialized.set(true)
  }
}

// Create stores with persistence
const createPersistedStore = <T>(
  storeName: string,
  defaultValue: T,
  shouldPersist: (value: T) => boolean = () => true
) => {
  const { subscribe, set, update } = writable<T>(defaultValue)
  
  let isInitialized = false
  
  // Load initial data from storage
  loadFromStorage<T>(storeName).then(data => {
    if (data) {
      set(data)
    }
    isInitialized = true
    checkIfAllStoresLoaded()
  })
  
  return {
    subscribe,
    set: (value: T) => {
      set(value)
      if (isInitialized && shouldPersist(value)) {
        saveToStorage(storeName, value)
      }
    },
    update: (updater: (value: T) => T) => {
      update(value => {
        const newValue = updater(value)
        if (isInitialized && shouldPersist(newValue)) {
          saveToStorage(storeName, newValue)
        }
        return newValue
      })
    }
  }
}

// UI Store (not persisted - transient state)
const defaultUIState: UIState = {
  activeTab: 'overview'
}

export const uiStore = writable<UIState>(defaultUIState)

// Workout Store (persisted)
const defaultWorkoutState: WorkoutState = {
  currentWeek: 1,
  currentDay: 1,
  completedWorkouts: [],
  completedSets: {}
}

export const workoutStore = createPersistedStore('workoutState', defaultWorkoutState)

// Training Plan Store (persisted)  
const defaultTrainingPlanState: TrainingPlanState = {
  customPlan: [
    { name: "Get Ready", weeks: 1, type: "getready" },
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
}

export const trainingPlanStore = createPersistedStore('trainingPlanState', defaultTrainingPlanState)

// Exercise Store (persisted)
const defaultExerciseState: ExerciseState = {
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
}

export const exerciseStore = createPersistedStore('exerciseState', defaultExerciseState)

// Preferences Store (persisted)
const defaultPreferencesState: PreferencesState = {
  weightUnit: 'kg'
}

export const preferencesStore = createPersistedStore('preferencesState', defaultPreferencesState)

// Clear all stored data
export const clearAllStorage = async (): Promise<void> => {
  try {
    // Skip during SSR
    if (typeof indexedDB === 'undefined') {
      return
    }
    
    const db = await openDB()
    const storeNames = ['workoutState', 'trainingPlanState', 'exerciseState', 'preferencesState']
    
    for (const storeName of storeNames) {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      
      await new Promise<void>((resolve, reject) => {
        const request = store.clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    }
    
    db.close()
  } catch (error) {
    console.warn('Failed to clear storage:', error)
  }
}