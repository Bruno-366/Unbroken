<script lang="ts">
  import { 
    clearAllStorage, 
    workoutStore, 
    trainingPlanStore, 
    exerciseStore, 
    preferencesStore,
    defaultWorkoutState,
    defaultTrainingPlanState,
    defaultExerciseState,
    defaultPreferencesState
  } from '$lib/stores'
  
  // Local component state for reset confirmation dialog
  let showResetConfirm = $state(false)
  
  const onShowReset = () => {
    showResetConfirm = true
  }
  
  const onCancelReset = () => {
    showResetConfirm = false
  }

  // Reset functionality - reset all stores to defaults
  const handleReset = async () => {
    try {
      await clearAllStorage()
      
      // Reset all stores to their default values - use the imported defaults from stores.ts
      workoutStore.set(defaultWorkoutState)
      trainingPlanStore.set(defaultTrainingPlanState)
      exerciseStore.set(defaultExerciseState)
      preferencesStore.set(defaultPreferencesState)

      // Close the dialog
      showResetConfirm = false
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