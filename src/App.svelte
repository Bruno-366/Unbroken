<script lang="ts">
  import { blockTemplates } from './blockTemplates'
  import { 
    uiStore, 
    workoutStore, 
    trainingPlanStore, 
    preferencesStore,
    isStoreInitialized
  } from './stores'
  
  // Import types and components
  import type { CompletedWorkout, Workout } from './types'
  import CardioWorkouts from './components/CardioWorkouts.svelte'
  import StrengthWorkouts from './components/StrengthWorkouts.svelte'
  import RestWorkouts from './components/RestWorkouts.svelte'
  import History from './components/History.svelte'
  import TrainingPlan from './components/TrainingPlan.svelte'
  import ExerciseDatabase from './components/ExerciseDatabase.svelte'
  import ResetProgress from './components/ResetProgress.svelte'

  // Access stores directly
  const activeTab = $derived($uiStore.activeTab)
  const currentWeek = $derived($workoutStore.currentWeek)
  const currentDay = $derived($workoutStore.currentDay)
  const customPlan = $derived($trainingPlanStore.customPlan)
  const isLoaded = $derived($isStoreInitialized)
  let weightUnit = $state($preferencesStore.weightUnit)
  
  // Update weightUnit when store changes
  $effect(() => {
    weightUnit = $preferencesStore.weightUnit
  })

  // Helper functions

  // Convert function to derived - more idiomatic for reactive values
  const getCurrentWorkout = $derived.by((): Workout | null => {
    const block = customPlan[0]
    if (!block) return null
    
    const blockTemplate = blockTemplates[block.type as keyof typeof blockTemplates]
    if (!blockTemplate) return null
    
    const weekIndex = Math.min(currentWeek - 1, blockTemplate.weeks.length - 1)
    const dayIndex = currentDay - 1
    return blockTemplate.weeks[weekIndex].days[dayIndex] as Workout
  })

  const completeWorkout = () => {
    const workoutDetails = getCurrentWorkout
    if (!workoutDetails) return // Guard against null workout
    const block = customPlan[0]
    
    const workout: CompletedWorkout = {
      date: new Date().toISOString(),
      block: 0,
      blockName: block.name,
      week: currentWeek,
      day: currentDay,
      details: workoutDetails as Workout
    }
    
    // Progress to next day/week/block
    let newDay = currentDay + 1
    let newWeek = currentWeek
    
    if (newDay > 7) {
      newDay = 1
      newWeek++
      if (newWeek > block.weeks) {
        // Move to next block
        trainingPlanStore.update(state => ({
          ...state,
          customPlan: state.customPlan.slice(1)
        }))
        newWeek = 1
        newDay = 1
      }
    }
    
    // Update stores
    workoutStore.update(state => ({
      ...state,
      completedWorkouts: [...state.completedWorkouts, workout],
      completedSets: {},
      currentDay: newDay,
      currentWeek: newWeek
    }))
    
    uiStore.update(state => ({
      ...state,
      activeTab: 'overview',
      restTimer: {
        isActive: false,
        timeLeft: 0,
        totalTime: 0,
        workoutType: null,
        phase: 'initial',
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
    }))
  }

  // Derived values - more idiomatic than manual getter functions
  const currentBlockInfo = $derived(customPlan[0] || { name: 'No active block', weeks: 0 })

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

    {#if !isLoaded}
      <!-- Loading state -->
      <div class="flex items-center justify-center p-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading...</p>
        </div>
      </div>
    {:else}
      <!-- Main app content -->
      <div class="flex bg-gray-100 border-b-2 border-gray-200">
        {#each ['overview', 'workout', 'history', 'settings'] as tab}
          <button
            onclick={() => uiStore.update(store => ({ ...store, activeTab: tab }))}
            class="flex-1 py-4 px-2 sm:px-4 font-semibold capitalize transition-colors text-sm sm:text-base {
              activeTab === tab 
                ? 'text-blue-600 bg-white border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }"
          >
            {tab}
          </button>
        {/each}
      </div>

      <div class="p-6 space-y-6">
        {#if activeTab === 'overview'}
          <div>
            <div class="bg-gray-100 p-4 rounded-lg mb-6">
              <h3 class="text-sm text-gray-600 mb-2">Current Block</h3>
              <div class="text-xl font-bold text-gray-900 mb-3">{currentBlockInfo.name}</div>
              <div class="bg-gray-300 h-2 rounded-full overflow-hidden mb-2">
                <div class="bg-green-500 h-full transition-all duration-300" style="width: {((currentWeek - 1) / currentBlockInfo.weeks) * 100}%"></div>
              </div>
              <div class="text-xs text-gray-600">Week {currentWeek} of {currentBlockInfo.weeks}</div>
            </div>

            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-600 uppercase mb-3">Upcoming Blocks</h3>
              {#each customPlan.slice(1, 4) as block}
                <div class="bg-gray-100 p-3 rounded-lg mb-2">
                  <div class="font-semibold text-gray-800">{block.name}</div>
                  <div class="text-xs text-gray-600">{block.weeks} weeks</div>
                </div>
              {/each}
            </div>

            <button
              onclick={() => uiStore.update(store => ({ ...store, activeTab: 'workout' }))}
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Start Today's Workout
            </button>
          </div>
        {/if}

        {#if activeTab === 'workout'}
          <div>
            <div class="bg-blue-600 text-white p-4 rounded-lg mb-6 text-center">
              <div class="text-sm opacity-90 mb-1">Week {currentWeek}, Day {currentDay}</div>
              <div class="text-xl font-bold">{currentBlockInfo.name}</div>
            </div>
            
            {#if renderWorkout() === 'strength' && getCurrentWorkout}
              <StrengthWorkouts 
                workout={getCurrentWorkout}
                onCompleteWorkout={completeWorkout}
              />
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

        {#if activeTab === 'history'}
          <History />
        {/if}

        {#if activeTab === 'settings'}
          <div>
            <TrainingPlan />

            <ExerciseDatabase />

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4">Preferences</h3>
              <label for="weight-unit-select" class="block text-sm text-gray-600 mb-1">Weight Unit</label>
              <select
                id="weight-unit-select"
                bind:value={weightUnit}
                onchange={() => preferencesStore.update(state => ({ ...state, weightUnit }))}
                class="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer hover:border-gray-400"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>

            <ResetProgress />
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>