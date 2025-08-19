<script lang="ts">
  import { onMount } from 'svelte'
  import { blockTemplates } from './blockTemplates'
  
  // Import types and components
  import type { AppState, CompletedWorkout, Workout } from './types'
  import { requestNotificationPermission } from './utils'
  import { loadStateFromStorage, saveStateToStorage, clearStorage } from './storage'
  import CardioWorkouts from './components/CardioWorkouts.svelte'
  import StrengthWorkouts from './components/StrengthWorkouts.svelte'
  import RestWorkouts from './components/RestWorkouts.svelte'
  import History from './components/History.svelte'
  import TrainingPlan from './components/TrainingPlan.svelte'
  import ExerciseDatabase from './components/ExerciseDatabase.svelte'

  // Available blocks configuration
  const AVAILABLE_BLOCKS = {
    endurance1: { name: "Endurance Block 1", weeks: 8 },
    powerbuilding1: { name: "Powerbuilding Block 1", weeks: 3 },
    powerbuilding2: { name: "Powerbuilding Block 2", weeks: 3 },
    powerbuilding3: { name: "Powerbuilding Block 3", weeks: 3 },
    powerbuilding3bulgarian: { name: "Powerbuilding Block 3 - Bulgarian", weeks: 3 },
    bodybuilding: { name: "Bodybuilding Block", weeks: 3 },
    strength: { name: "Strength Block", weeks: 6 }
  }

  // Reactive state using Svelte 5 runes
  let state = $state<AppState>({
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
    draggedIndex: null,
    dragOverIndex: null,
    showResetConfirm: false,
    restTimer: {
      isActive: false,
      timeLeft: 0,
      totalTime: 0,
      workoutType: null,
      phase: 'initial',
      startTime: 0
    }
  })

  // Get exercises used in the current active block
  const getCurrentBlockExercises = () => {
    const currentBlock = state.customPlan[0]
    if (!currentBlock) return { strengthExercises: [], hypertrophyExercises: [] }
    
    const blockTemplate = blockTemplates[currentBlock.type as keyof typeof blockTemplates]
    if (!blockTemplate) return { strengthExercises: [], hypertrophyExercises: [] }
    
    const strengthExercises = new Set<string>()
    const hypertrophyExercises = new Set<string>()
    
    blockTemplate.weeks.forEach((week: { days: unknown[] }) => {
      week.days.forEach((day: unknown) => {
        const dayObj = day as Record<string, unknown>
        if ('exercises' in dayObj && Array.isArray(dayObj.exercises)) {
          (dayObj.exercises as string[]).forEach((exercise: string) => {
            if (dayObj.type === 'strength') {
              strengthExercises.add(exercise)
            } else if (dayObj.type === 'hypertrophy') {
              hypertrophyExercises.add(exercise)
            }
          })
        }
      })
    })
    
    return {
      strengthExercises: Array.from(strengthExercises),
      hypertrophyExercises: Array.from(hypertrophyExercises)
    }
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
          draggedIndex: null,
          dragOverIndex: null,
          showResetConfirm: false,
          restTimer: {
            isActive: false,
            timeLeft: 0,
            totalTime: 0,
            workoutType: null,
            phase: 'initial',
            startTime: 0
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load persisted state:', error)
    }
  })

  // Automatic state persistence using $effect - more idiomatic than manual updateState
  $effect(() => {
    // Create a clean state object for persistence (exclude transient UI state)
    const stateToSave: AppState = {
      ...state,
      // Don't persist transient UI state
      draggedIndex: null,
      dragOverIndex: null,
      showResetConfirm: false,
      restTimer: {
        isActive: false,
        timeLeft: 0,
        totalTime: 0,
        workoutType: null,
        phase: 'initial',
        startTime: 0
      }
    }

    // Save to IndexedDB asynchronously (don't wait for it)
    saveStateToStorage(stateToSave).catch(error => {
      console.warn('Failed to save state to IndexedDB:', error)
    })
  })

  const getCurrentWorkout = (): Workout | null => {
    const block = state.customPlan[0]
    const blockTemplate = blockTemplates[block.type as keyof typeof blockTemplates]
    if (!blockTemplate) return null
    
    const weekIndex = Math.min(state.currentWeek - 1, blockTemplate.weeks.length - 1)
    const dayIndex = state.currentDay - 1
    return blockTemplate.weeks[weekIndex].days[dayIndex] as Workout
  }

  const toggleSet = async (exerciseAndSchemeIndex: string, setIndex: number) => {
    const key = `${exerciseAndSchemeIndex}-${setIndex}`
    const isBeingCompleted = !state.completedSets[key]
    
    // Update completed sets directly
    state.completedSets[key] = isBeingCompleted
    
    // Start rest timer when completing a working set (not warm-up sets)
    if (isBeingCompleted && !key.includes('warmup')) {
      const workout = getCurrentWorkout()
      if (workout && (workout.type === 'strength' || workout.type === 'hypertrophy')) {
        // Request notification permission if not already granted
        await requestNotificationPermission()
        
        const initialTime = workout.type === 'strength' ? 180 : 90 // 3 min for strength, 1.5 min for hypertrophy
        const now = Date.now()
        
        // Update rest timer state directly
        state.restTimer.isActive = true
        state.restTimer.timeLeft = initialTime
        state.restTimer.totalTime = initialTime
        state.restTimer.workoutType = workout.type
        state.restTimer.phase = 'initial'
        state.restTimer.startTime = now
      }
    }
  }

  const completeWorkout = () => {
    const workoutDetails = getCurrentWorkout()
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
    
    // Add completed workout
    state.completedWorkouts = [...state.completedWorkouts, workout]
    
    // Reset completed sets
    state.completedSets = {}
    
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
    
    state.currentDay = newDay
    state.currentWeek = newWeek
    state.customPlan = newPlan
    state.activeTab = 'overview'
    
    // Reset rest timer
    state.restTimer.isActive = false
    state.restTimer.timeLeft = 0
    state.restTimer.totalTime = 0
    state.restTimer.workoutType = null
    state.restTimer.phase = 'initial'
    state.restTimer.startTime = 0
  }

  const manageBlocks = (action: string, data: { blockType?: string; index?: number }) => {
    switch(action) {
      case 'add': {
        if (!data.blockType) return
        const blockConfig = AVAILABLE_BLOCKS[data.blockType as keyof typeof AVAILABLE_BLOCKS]
        if (!blockConfig) return
        state.customPlan = [...state.customPlan, { 
          name: blockConfig.name, 
          weeks: blockConfig.weeks, 
          type: data.blockType 
        }]
        break
      }
      case 'remove':
        if (state.customPlan.length <= 1) {
          alert('You must have at least one block in your plan.')
          return
        }
        if (data.index !== undefined) {
          const newPlan = [...state.customPlan]
          newPlan.splice(data.index, 1)
          state.customPlan = newPlan
        }
        break
      case 'reorder':
        // Handle reordering via drag & drop
        if (state.draggedIndex !== null && state.dragOverIndex !== null) {
          const newPlan = [...state.customPlan]
          const draggedBlock = newPlan[state.draggedIndex]
          newPlan.splice(state.draggedIndex, 1)
          newPlan.splice(state.dragOverIndex, 0, draggedBlock)
          state.customPlan = newPlan
          state.draggedIndex = null
          state.dragOverIndex = null
        }
        break
    }
  }

  // Reset functionality
  const handleReset = async () => {
    try {
      await clearStorage()
      
      // Reset all state to defaults using direct assignment
      state.activeTab = 'overview'
      state.currentWeek = 1
      state.currentDay = 1
      state.completedWorkouts = []
      state.customPlan = [
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
      state.maxes = { 
        benchpress: 100, squat: 120, deadlift: 140, trapbardeadlift: 130, 
        overheadpress: 60, frontsquat: 90, weightedpullup: 20, powerclean: 80, 
        romaniandeadlift: 120 
      }
      state.tenRMs = {}
      state.weightUnit = 'kg'
      state.completedSets = {}
      state.draggedIndex = null
      state.dragOverIndex = null
      state.showResetConfirm = false
      state.restTimer = {
        isActive: false,
        timeLeft: 0,
        totalTime: 0,
        workoutType: null,
        phase: 'initial',
        startTime: 0
      }
    } catch (error) {
      console.error('Failed to reset app:', error)
    }
  }

  // Derived values
  const currentBlockInfo = $derived(() => {
    return state.customPlan[0] || { name: 'No active block', weeks: 0 }
  })

  const currentWorkout = $derived(() => getCurrentWorkout())

  const strengthExercises = $derived(() => getCurrentBlockExercises().strengthExercises)
  const hypertrophyExercises = $derived(() => getCurrentBlockExercises().hypertrophyExercises)

  const renderWorkout = () => {
    const workout = getCurrentWorkout()
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
  }
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
          onclick={() => state.activeTab = tab}
          class="flex-1 py-4 px-2 sm:px-4 font-semibold capitalize transition-colors text-sm sm:text-base {
            state.activeTab === tab 
              ? 'bg-white text-gray-900 border-b-2 border-blue-500' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }"
        >
          {tab}
        </button>
      {/each}
    </div>

    <div class="p-6 space-y-6">
      {#if state.activeTab === 'overview'}
        <div class="text-center space-y-4">
          <div class="text-sm opacity-90 mb-1">Week {state.currentWeek}, Day {state.currentDay}</div>
          <div class="text-xl font-bold">{currentBlockInfo.name}</div>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onclick={() => state.activeTab = 'workout'}
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
          >
            Start Today's Workout
          </button>
          <button 
            onclick={() => state.activeTab = 'history'}
            class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
          >
            View History
          </button>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-semibold mb-3">Upcoming Blocks</h3>
          <div class="space-y-2">
            {#each state.customPlan.slice(0, 5) as block, index}
              <div class="flex justify-between items-center py-2 px-3 bg-white rounded border {index === 0 ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}">
                <span class="font-medium {index === 0 ? 'text-blue-700' : 'text-gray-700'}">{block.name}</span>
                <span class="text-sm text-gray-500">{block.weeks} weeks</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      {#if state.activeTab === 'workout'}
        <div>
          <div class="text-center mb-6">
            <div class="text-sm opacity-90 mb-1">Week {state.currentWeek}, Day {state.currentDay}</div>
            <div class="text-xl font-bold">{currentBlockInfo.name}</div>
          </div>
          
          {#if renderWorkout() === 'strength' && currentWorkout()}
            <StrengthWorkouts 
              workout={currentWorkout()!}
              {state}
              onCompleteWorkout={completeWorkout}
              onToggleSet={toggleSet}
            />
          {:else if renderWorkout() === 'cardio' && currentWorkout()}
            <CardioWorkouts 
              workout={currentWorkout()!}
              onCompleteWorkout={completeWorkout}
            />
          {:else if renderWorkout() === 'rest' && currentWorkout()}
            <RestWorkouts 
              workout={currentWorkout()!}
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
            {state}
            onUpdateState={(updates) => {
              if ('draggedIndex' in updates) state.draggedIndex = updates.draggedIndex ?? null
              if ('dragOverIndex' in updates) state.dragOverIndex = updates.dragOverIndex ?? null
            }}
            onManageBlocks={manageBlocks}
          />

          <ExerciseDatabase 
            {state}
            strengthExercises={strengthExercises()}
            hypertrophyExercises={hypertrophyExercises()}
            currentBlockName={currentBlockInfo.name}
            onUpdateState={(updates) => {
              if ('maxes' in updates) state.maxes = updates.maxes || state.maxes
              if ('tenRMs' in updates) state.tenRMs = updates.tenRMs || state.tenRMs
            }}
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

          <button
            onclick={() => state.showResetConfirm = true}
            class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Reset All Progress
          </button>

          {#if state.showResetConfirm}
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
                <h3 class="text-lg font-semibold mb-4 text-gray-900">Reset Confirmation</h3>
                <p class="text-gray-600 mb-6">This will permanently delete all your workout data, progress, and settings. This action cannot be undone.</p>
                <div class="flex gap-3">
                  <button
                    onclick={handleReset}
                    class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Delete Everything
                  </button>
                  <button
                    onclick={() => state.showResetConfirm = false}
                    class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>