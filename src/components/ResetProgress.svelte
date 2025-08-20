<script lang="ts">
  import { 
    clearAllStorage, 
    uiStore, 
    workoutStore, 
    trainingPlanStore, 
    exerciseStore, 
    preferencesStore 
  } from '../stores'
  
  // Access UI state directly from store
  const showResetConfirm = $derived($uiStore.showResetConfirm)
  
  const onShowReset = () => {
    uiStore.update(state => ({ ...state, showResetConfirm: true }))
  }
  
  const onCancelReset = () => {
    uiStore.update(state => ({ ...state, showResetConfirm: false }))
  }

  // Reset functionality - reset all stores to defaults
  const handleReset = async () => {
    try {
      await clearAllStorage()
      
      // Reset all stores to their default values
      uiStore.set({
        activeTab: 'overview',
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
      
      workoutStore.set({
        currentWeek: 1,
        currentDay: 1,
        completedWorkouts: [],
        completedSets: {}
      })
      
      trainingPlanStore.set({
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
      })
      
      exerciseStore.set({
        maxes: { 
          benchpress: 100, squat: 120, deadlift: 140, trapbardeadlift: 130, 
          overheadpress: 60, frontsquat: 90, weightedpullup: 20, powerclean: 80, 
          romaniandeadlift: 120 
        },
        tenRMs: {}
      })
      
      preferencesStore.set({
        weightUnit: 'kg'
      })
    } catch (error) {
      console.error('Failed to reset app:', error)
    }
  }
</script>

<div class="mb-6">
  <button
    onclick={onShowReset}
    class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
  >
    Reset All Progress
  </button>

  {#if showResetConfirm}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Reset All Progress?</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to reset all progress? This cannot be undone.</p>
        <div class="flex gap-3">
          <button
            onclick={onCancelReset}
            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onclick={handleReset}
            class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>