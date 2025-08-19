<script lang="ts">
  import { onMount } from 'svelte'
  import { blockTemplates } from './blockTemplates'
  
  // Import types and components
  import type { AppState, CompletedWorkout, Workout } from './types'
  import { loadStateFromStorage, saveStateToStorage } from './storage'
  import CardioWorkouts from './components/CardioWorkouts.svelte'
  import StrengthWorkouts from './components/StrengthWorkouts.svelte'
  import RestWorkouts from './components/RestWorkouts.svelte'
  import History from './components/History.svelte'
  import TrainingPlan from './components/TrainingPlan.svelte'
  import ExerciseDatabase from './components/ExerciseDatabase.svelte'
  import RestTimer from './components/RestTimer.svelte'
  import ResetProgress from './components/ResetProgress.svelte'

  // Reactive state using Svelte 5 runes
  let state: AppState = $state({
    activeTab: 'overview',
    currentWeek: 1,
    currentDay: 1,
    completedWorkouts: [] as CompletedWorkout[],
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
    ],
    maxes: { benchpress: 100, squat: 120, deadlift: 140, trapbardeadlift: 130, overheadpress: 60, frontsquat: 90, weightedpullup: 20, powerclean: 80, romaniandeadlift: 120 } as Record<string, number>,
    tenRMs: {} as Record<string, number>,
    weightUnit: 'kg',
    completedSets: {} as Record<string, boolean>,
    showResetConfirm: false,
    restTimer: {
      isActive: false,
      timeLeft: 0,
      totalTime: 0,
      workoutType: null,
      phase: 'initial',
      startTime: 0
    }
  } as AppState)

  // Flag to track if state has been loaded from storage
  let isStateLoaded = false

  // Helper function to update state and save to storage
  const updateState = (newState: AppState) => {
    // Only save if state has been loaded to prevent overwriting persisted data
    if (!isStateLoaded) return

    // Create a clean state object for persistence (exclude transient UI state)
    const stateToSave = {
      ...newState,
      // Don't persist transient UI state
      showResetConfirm: false,
      restTimer: {
        isActive: false,
        timeLeft: 0,
        totalTime: 0,
        workoutType: null as "strength" | "hypertrophy" | null,
        phase: 'initial' as "initial" | "extended",
        startTime: 0
      }
    } as AppState

    // Save to IndexedDB asynchronously (don't wait for it)
    saveStateToStorage(stateToSave).catch(error => {
      console.warn('Failed to save state to IndexedDB:', error)
    })

    state = newState
  }

  // Load state from IndexedDB on mount
  onMount(async () => {
    try {
      const persistedState = await loadStateFromStorage()
      if (persistedState) {
        // Merge persisted state with current state, excluding transient UI state
        state = {
          ...state,
          ...persistedState,
          // Always reset transient UI state to defaults
          showResetConfirm: false,
          restTimer: {
            isActive: false,
            timeLeft: 0,
            totalTime: 0,
            workoutType: null as "strength" | "hypertrophy" | null,
            phase: 'initial' as "initial" | "extended",
            startTime: 0
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load persisted state:', error)
    } finally {
      // Mark state as loaded, enabling automatic persistence
      isStateLoaded = true
    }
  })

  // Watch for changes to bound properties and save them
  $effect(() => {
    if (!isStateLoaded) return

    // Save changes to bound properties automatically
    const stateToSave = {
      ...state,
      // Don't persist transient UI state
      showResetConfirm: false,
      restTimer: {
        isActive: false,
        timeLeft: 0,
        totalTime: 0,
        workoutType: null as "strength" | "hypertrophy" | null,
        phase: 'initial' as "initial" | "extended",
        startTime: 0
      }
    } as AppState

    saveStateToStorage(stateToSave).catch(error => {
      console.warn('Failed to save state to IndexedDB:', error)
    })
  })

  // Convert function to derived - more idiomatic for reactive values
  const getCurrentWorkout = $derived.by((): Workout | null => {
    const block = state.customPlan[0]
    if (!block) return null
    
    const blockTemplate = blockTemplates[block.type as keyof typeof blockTemplates]
    if (!blockTemplate) return null
    
    const weekIndex = Math.min(state.currentWeek - 1, blockTemplate.weeks.length - 1)
    const dayIndex = state.currentDay - 1
    return blockTemplate.weeks[weekIndex].days[dayIndex] as Workout
  })

  const completeWorkout = () => {
    const workoutDetails = getCurrentWorkout
    if (!workoutDetails) return // Guard against null workout
    const block = state.customPlan[0]
    
    const workout: CompletedWorkout = {
      date: new Date().toISOString(),
      block: 0,
      blockName: block.name,
      week: state.currentWeek,
      day: state.currentDay,
      details: workoutDetails as Workout
    }
    
    // Progress to next day/week/block
    let newDay = state.currentDay + 1
    let newWeek = state.currentWeek
    let newPlan = state.customPlan
    
    if (newDay > 7) {
      newDay = 1
      newWeek++
      if (newWeek > block.weeks) {
        newPlan = state.customPlan.slice(1)
        newWeek = 1
        newDay = 1
      }
    }
    
    // Update state with all changes
    updateState({
      ...state,
      completedWorkouts: [...state.completedWorkouts, workout],
      completedSets: {},
      currentDay: newDay,
      currentWeek: newWeek,
      customPlan: newPlan,
      activeTab: 'overview',
      restTimer: {
        isActive: false,
        timeLeft: 0,
        totalTime: 0,
        workoutType: null as "strength" | "hypertrophy" | null,
        phase: 'initial' as "initial" | "extended",
        startTime: 0
      }
    })
  }

  // Derived values - more idiomatic than manual getter functions
  const currentBlockInfo = $derived(state.customPlan[0] || { name: 'No active block', weeks: 0 })

  const renderWorkout = $derived(() => {
    const workout = getCurrentWorkout
    if (!workout) {
      return 'none'
    }

    if (workout.type === 'strength' || workout.type === 'hypertrophy') {
      return 'strength'
    } else if (workout.type === 'liss' || workout.type === 'hiit') {
      return 'cardio'
    } else if (workout.type === 'rest' || workout.type === 'deload') {
      return 'rest'
    }
    return 'unknown'
  })
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-0 md:p-4">
  <div class="w-full md:max-w-2xl mx-auto bg-white md:rounded-2xl rounded-none shadow-2xl overflow-hidden min-h-screen md:min-h-0">
    <div class="bg-gray-900 text-white p-6 text-center">
      <h1 class="text-2xl font-bold">UNBROKEN</h1>
      <p class="text-gray-400 text-sm mt-1">Tactical Barbell Tracker</p>
    </div>

    <div class="flex bg-gray-100 border-b-2 border-gray-200">
      {#each ['overview', 'workout', 'history', 'settings'] as tab}
        <button
          onclick={() => updateState({ ...state, activeTab: tab } as AppState)}
          class="flex-1 py-4 px-2 sm:px-4 font-semibold capitalize transition-colors text-sm sm:text-base {
            state.activeTab === tab 
              ? 'text-blue-600 bg-white border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-800'
          }"
        >
          {tab}
        </button>
      {/each}
    </div>

    <div class="p-6 space-y-6">
      {#if state.activeTab === 'overview'}
        <div>
          <div class="bg-gray-100 p-4 rounded-lg mb-6">
            <h3 class="text-sm text-gray-600 mb-2">Current Block</h3>
            <div class="text-xl font-bold text-gray-900 mb-3">{currentBlockInfo.name}</div>
            <div class="bg-gray-300 h-2 rounded-full overflow-hidden mb-2">
              <div class="bg-green-500 h-full transition-all duration-300" style="width: {((state.currentWeek - 1) / currentBlockInfo.weeks) * 100}%"></div>
            </div>
            <div class="text-xs text-gray-600">Week {state.currentWeek} of {currentBlockInfo.weeks}</div>
          </div>

          <div class="mb-6">
            <h3 class="text-sm font-semibold text-gray-600 uppercase mb-3">Upcoming Blocks</h3>
            {#each state.customPlan.slice(1, 4) as block}
              <div class="bg-gray-100 p-3 rounded-lg mb-2">
                <div class="font-semibold text-gray-800">{block.name}</div>
                <div class="text-xs text-gray-600">{block.weeks} weeks</div>
              </div>
            {/each}
          </div>

          <button
            onclick={() => updateState({ ...state, activeTab: 'workout' } as AppState)}
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Start Today's Workout
          </button>
        </div>
      {/if}

      {#if state.activeTab === 'workout'}
        <div>
          <div class="bg-blue-600 text-white p-4 rounded-lg mb-6 text-center">
            <div class="text-sm opacity-90 mb-1">Week {state.currentWeek}, Day {state.currentDay}</div>
            <div class="text-xl font-bold">{currentBlockInfo.name}</div>
          </div>
          
          {#if renderWorkout() === 'strength' && getCurrentWorkout}
            <StrengthWorkouts 
              workout={getCurrentWorkout}
              {state}
              onCompleteWorkout={completeWorkout}
              onUpdateRestTimer={(updates) => updateState({ 
                ...state, 
                restTimer: { ...state.restTimer, ...updates } 
              } as AppState)}
            />
            <RestTimer bind:restTimer={state.restTimer} />
          {:else if renderWorkout() === 'cardio' && getCurrentWorkout}
            <CardioWorkouts 
              workout={getCurrentWorkout}
              onCompleteWorkout={completeWorkout}
            />
          {:else if renderWorkout() === 'rest' && getCurrentWorkout}
            <RestWorkouts 
              workout={getCurrentWorkout}
              onCompleteWorkout={completeWorkout}
            />
          {:else}
            <p class="text-red-500 font-semibold">No workout found for the current week and day</p>
          {/if}
        </div>
      {/if}

      {#if state.activeTab === 'history'}
        <History completedWorkouts={state.completedWorkouts} />
      {/if}

      {#if state.activeTab === 'settings'}
        <div>
          <TrainingPlan 
            bind:customPlan={state.customPlan}
            currentWeek={state.currentWeek}
            currentDay={state.currentDay}
          />

          <ExerciseDatabase 
            bind:maxes={state.maxes}
            bind:tenRMs={state.tenRMs}
            weightUnit={state.weightUnit}
            customPlan={state.customPlan}
            currentBlockName={currentBlockInfo.name}
          />

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Preferences</h3>
            <label for="weight-unit-select" class="block text-sm text-gray-600 mb-1">Weight Unit</label>
            <select
              id="weight-unit-select"
              bind:value={state.weightUnit}
              class="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer hover:border-gray-400"
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="lbs">Pounds (lbs)</option>
            </select>
          </div>

          <ResetProgress 
            showResetConfirm={state.showResetConfirm}
            {state}
            onShowReset={() => updateState({ ...state, showResetConfirm: true } as AppState)}
            onCancelReset={() => updateState({ ...state, showResetConfirm: false } as AppState)}
          />
        </div>
      {/if}
    </div>
  </div>
</div>