<script lang="ts">
  import TrainingPlan from './TrainingPlan.svelte'
  import ExerciseDatabase from './ExerciseDatabase.svelte'
  import ResetProgress from './ResetProgress.svelte'
  import { preferencesStore } from '../../stores'
  
  let weightUnit = $state($preferencesStore.weightUnit)
  
  // Update weightUnit when store changes
  $effect(() => {
    weightUnit = $preferencesStore.weightUnit
  })
</script>

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