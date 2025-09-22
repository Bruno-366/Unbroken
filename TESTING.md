# Testing Guide - Unbroken Tactical Barbell Tracker

This guide explains how to test different workouts and training blocks without manually progressing through the entire program.

## Testing Different Workouts via URL Parameters (Recommended)

The easiest way to test different workouts is by using URL parameters. Simply navigate to the `/workout` route with the following query parameters:

- `block` - The block type (e.g., `endurance1`, `powerbuilding1`, `powerbuilding3`)
- `week` - The week number (1-based)
- `day` - The day number (1-based, 1-7 for each week)

### Examples:

**Test LISS workout:**
```
http://localhost:5173/workout?block=endurance1&week=1&day=2
```
Shows: LISS run for 60 minutes

**Test HIIT workout:**
```
http://localhost:5173/workout?block=powerbuilding3&week=1&day=3
```
Shows: Reset-20 HIIT with 20 seconds, 5 rounds

**Test different HIIT variation:**
```
http://localhost:5173/workout?block=powerbuilding3&week=2&day=3
```
Shows: Reset-20 HIIT with 15 seconds, 4 rounds

**Test strength workout:**
```
http://localhost:5173/workout?block=powerbuilding1&week=1&day=1
```
Shows: Bench Press and Squat strength workout

### Available Block Types:
- `getready` - Get Ready block (mostly rest days)
- `endurance1` - Endurance Block 1 (strength + LISS cardio)
- `powerbuilding1` - Powerbuilding Block 1 (strength + LISS)
- `powerbuilding2` - Powerbuilding Block 2 (strength + hypertrophy + LISS)
- `powerbuilding3` - Powerbuilding Block 3 (strength + hypertrophy + HIIT)
- `bodybuilding1` - Bodybuilding Block (hypertrophy + HIIT)
- `strength1` - Strength Block (strength + HIIT)

### Notes:
- Parameters override the stored workout state, but don't modify it permanently
- If you navigate away and come back to `/workout` without parameters, it will return to the stored state
- Parameters are case-sensitive
- If an invalid block type is provided, the app will still attempt to load the workout (useful for testing new block types)
- All three parameters are optional - you can use any combination

## Testing Different Workouts via IndexedDB (Alternative Method)

For advanced testing scenarios or when you need to persist changes, you can modify IndexedDB directly.

The app stores workout progress in IndexedDB, which can be modified directly in the browser to test different workout types (HIIT, LISS, strength, etc.) without completing entire blocks.

### Method 1: Browser DevTools (Recommended)

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the app in your browser:**
   - Navigate to http://localhost:5173

3. **Open Browser DevTools:**
   - Press F12 or right-click → Inspect
   - Go to the "Application" tab (Chrome) or "Storage" tab (Firefox)

4. **Navigate to IndexedDB:**
   - Expand "IndexedDB" in the left sidebar
   - Find "UnbrokenTracker" database
   - Expand it to see object stores:
     - `workoutState` - Contains current progress (week, day, completed workouts)
     - `trainingPlanState` - Contains the custom training plan
     - `exerciseState` - Contains maxes and rep maxes
     - `preferencesState` - Contains user preferences

5. **Modify workout progress:**
   - Click on `workoutState` object store
   - Find the record with key "data"
   - Double-click the value to edit the JSON
   - Modify these fields:
     ```json
     {
       "currentWeek": 1,     // Week number (1-based)
       "currentDay": 1,      // Day number (1-based, 1-7 for each week)
       "completedWorkouts": [], // Array of completed workouts
       "completedSets": {}   // Object tracking completed sets
     }
     ```

6. **Examples of useful test values:**

   **Test HIIT workouts (Powerbuilding Block 3):**
   ```json
   {
     "currentWeek": 1,
     "currentDay": 3,
     "completedWorkouts": [],
     "completedSets": {}
   }
   ```

   **Test different HIIT variations:**
   ```json
   {
     "currentWeek": 2,
     "currentDay": 3,
     "completedWorkouts": [],
     "completedSets": {}
   }
   ```

   **Test LISS workouts (Endurance Block):**
   ```json
   {
     "currentWeek": 1,
     "currentDay": 2,
     "completedWorkouts": [],
     "completedSets": {}
   }
   ```

7. **Refresh the page:**
   - After modifying IndexedDB values, refresh the browser page
   - Navigate to the "Workout" tab
   - Click "Start Today's Workout" to see the modified workout

### Method 2: Console Commands

You can also modify the workout state programmatically using the browser console:

1. **Open Browser Console:**
   - Press F12 → Console tab

2. **Get current state:**
   ```javascript
   // Open IndexedDB and read current state
   const request = indexedDB.open('UnbrokenTracker', 1);
   request.onsuccess = function(event) {
     const db = event.target.result;
     const transaction = db.transaction(['workoutState'], 'readonly');
     const store = transaction.objectStore('workoutState');
     const getRequest = store.get('data');
     getRequest.onsuccess = function() {
       console.log('Current workout state:', getRequest.result);
     };
   };
   ```

3. **Set new state:**
   ```javascript
   // Modify workout state to test different workouts
   const request = indexedDB.open('UnbrokenTracker', 1);
   request.onsuccess = function(event) {
     const db = event.target.result;
     const transaction = db.transaction(['workoutState'], 'readwrite');
     const store = transaction.objectStore('workoutState');
     
     const newState = {
       currentWeek: 1,    // Change this
       currentDay: 3,     // Change this (day 3 often has HIIT in powerbuilding blocks)
       completedWorkouts: [],
       completedSets: {}
     };
     
     store.put(newState, 'data');
     console.log('Updated workout state:', newState);
     // Refresh the page after this
   };
   ```

## Available Workout Types by Block and Day

### Get Ready Block (Week 1)
- Day 1: Rest day

### Endurance Block 1 (Weeks 1-8)
- Days 1, 3, 5: Strength workouts (Overhead Press, Front Squat, Weighted Pull-up)
- Days 2, 4, 6: LISS cardio (running, various durations)
- Day 7: Rest

### Powerbuilding Block 3 (Weeks 1-3) - Contains HIIT
- Days 1, 4: Strength + Hypertrophy workouts
- **Day 3: HIIT workout** - "Reset-20" activity
  - Week 1: 20 seconds, 5 rounds
  - Week 2: 15 seconds, 4 rounds  
  - Week 3: 15 seconds, 4 rounds
- Days 2, 5: Hypertrophy workouts
- Days 6, 7: Rest

### Bodybuilding Block (Weeks 1-3)
- Days 1, 3, 4: Hypertrophy workouts
- Day 2, 5: Hypertrophy workouts
- **Day 3: HIIT workout** - "Hill Sprints"
  - Week 1: 3 rounds
  - Week 2: 5 rounds
  - Week 3: 7 rounds
- Days 6, 7: Rest

### Strength Block (Weeks 1-6)
- Days 1, 2, 4, 5: Strength workouts
- **Days 3, 6: HIIT workouts** - Various activities (Tempo Run, 600m Resets, GC 9)
- Day 7: Rest

## Quick Testing Scenarios

### Test HIIT Timer Functionality
**Via URL (recommended):**
```
http://localhost:5173/workout?block=powerbuilding3&week=1&day=3
```
**Via IndexedDB:** Set `currentWeek: 1, currentDay: 3` (Powerbuilding Block 3)

Test round progression, pause/resume, reset functionality

### Test LISS Timer Functionality  
**Via URL (recommended):**
```
http://localhost:5173/workout?block=endurance1&week=1&day=2
```
**Via IndexedDB:** Set `currentWeek: 1, currentDay: 2` (Endurance Block 1)

Test timer countdown, pause/resume functionality

### Test Different HIIT Variations
**Short rounds (15s):**
```
http://localhost:5173/workout?block=powerbuilding3&week=2&day=3
```

**Longer rounds (20s):**
```
http://localhost:5173/workout?block=powerbuilding3&week=1&day=3
```

**Different activities:** Use various blocks like `strength1` for different HIIT exercises

### Test Strength Workouts
**Simple strength workout:**
```
http://localhost:5173/workout?block=powerbuilding1&week=1&day=1
```

**Complex strength workout:**
```
http://localhost:5173/workout?block=powerbuilding2&week=1&day=1
```

## Reset Progress for Clean Testing

To start fresh testing:

1. **Via Settings Page:**
   - Navigate to Settings tab
   - Click "Reset All Progress"
   - Confirm the reset

2. **Via Console:**
   ```javascript
   // Clear all IndexedDB data
   const request = indexedDB.open('UnbrokenTracker', 1);
   request.onsuccess = function(event) {
     const db = event.target.result;
     const storeNames = ['workoutState', 'trainingPlanState', 'exerciseState', 'preferencesState'];
     
     storeNames.forEach(storeName => {
       const transaction = db.transaction([storeName], 'readwrite');
       const store = transaction.objectStore(storeName);
       store.clear();
     });
     
     console.log('All data cleared');
     // Refresh the page after this
   };
   ```

## Notes

- **URL parameter testing is the recommended approach** - no IndexedDB modification needed
- URL parameters override stored values temporarily without modifying the database  
- Always refresh the page after modifying IndexedDB data (only needed for IndexedDB method)
- The app will automatically load the new state on page refresh
- Component-level timer state (HIIT/LISS timers) resets automatically when components re-render
- Workout state persistence only applies to training progression, not UI timer state
- Test on development server (`npm run dev`) for best debugging experience