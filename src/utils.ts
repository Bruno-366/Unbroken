// Shared utility functions for the Unbroken Tactical Barbell Tracker

import type { WarmupSet } from './types';

// Helper function to generate exercise key from name
export const getExerciseKey = (exerciseName: string): string => {
  return exerciseName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
};

// Calculate weight for strength exercises based on 1RM percentage
export const calculateWeight = (exercise: string, percentage: number, { maxes, weightUnit }: { maxes: Record<string, number>, weightUnit: string }): number => {
  const exerciseKey = getExerciseKey(exercise);
  if (!exerciseKey || !maxes[exerciseKey]) return 0;
  
  const calculatedWeight = maxes[exerciseKey] * (percentage / 100);
  const barbellExercises = ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Front Squat', 'Trap Bar Deadlift', 'Power Clean', 'Romanian Deadlift'];
  
  if (barbellExercises.includes(exercise)) {
    const increment = weightUnit === 'kg' ? 2.5 : 5;
    return Math.round(calculatedWeight / increment) * increment;
  }
  return Math.round(calculatedWeight);
};

// Calculate weight for hypertrophy exercises based on 10RM
export const calculateHypertrophyWeight = (exercise: string, percentage: number, { tenRMs, maxes }: { tenRMs: Record<string, number>, maxes?: Record<string, number> }): number => {
  const exerciseKey = getExerciseKey(exercise);
  
  // Convert 10RM input to estimated 1RM, then apply percentage
  let estimatedOneRM;
  if (tenRMs[exerciseKey]) {
    // Convert 10RM to 1RM: 10RM / 0.75 = 1RM
    estimatedOneRM = tenRMs[exerciseKey] / 0.75;
  } else if (maxes && maxes[exerciseKey]) {
    // Fallback to actual 1RM if available
    estimatedOneRM = maxes[exerciseKey];
  } else {
    return 0;
  }
  
  // Apply the block's programmed percentage to the estimated 1RM
  const calculatedWeight = estimatedOneRM * (percentage / 100);
  return Math.round(calculatedWeight);
};

// Calculate warmup sets for strength exercises
export const calculateWarmupSets = (_exercise: string, workingWeight: number, { weightUnit }: { weightUnit: string }): WarmupSet[] => {
  if (!workingWeight || workingWeight <= 0) return [];
  
  const barbellWeight = weightUnit === 'kg' ? 20 : 45;
  const plateIncrement = weightUnit === 'kg' ? 2.5 : 5;
  const roundToPlate = (weight: number) => Math.max(Math.round(weight / plateIncrement) * plateIncrement, barbellWeight);
  
  const warmupSets = [
    { weight: roundToPlate(workingWeight * 0.5), reps: 5, type: 'warmup' as const },
    { weight: roundToPlate(workingWeight * 0.65), reps: 3, type: 'warmup' as const },
    { weight: roundToPlate(workingWeight * 0.8), reps: 2, type: 'warmup' as const },
    { weight: roundToPlate(workingWeight * 0.9), reps: 1, type: 'warmup' as const }
  ];
  
  return warmupSets.filter(set => set.weight < workingWeight);
};

// Request notification permission for rest timer
export const requestNotificationPermission = async (): Promise<void> => {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
};

// Detect if we're on a mobile device
export const isMobileDevice = (): boolean => {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) || false;
};

// Show notification when rest timer completes
export const showRestCompleteNotification = async (): Promise<void> => {
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      // For mobile devices, try to use service worker for better reliability
      if (isMobileDevice() && 'serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        
        // Check if the service worker supports showNotification
        if (registration.showNotification) {
          await registration.showNotification('Get back to work!', {
            body: 'Your rest time is over. Time for the next set!',
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png',
            tag: 'rest-timer',
            requireInteraction: false,
            silent: false
          });
          return;
        }
      }
      
      // Fallback to regular notification for desktop or when service worker isn't available
      new Notification('Get back to work!', {
        body: 'Your rest time is over. Time for the next set!',
        icon: '/icon-192x192.png',
        tag: 'rest-timer',
        requireInteraction: false
      });
    }
  } catch (error) {
    console.warn('Failed to show notification:', error);
  }
};