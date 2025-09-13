<script lang="ts">
  import { goto } from '$app/navigation'
  import { 
    workoutStore, 
    trainingPlanStore
  } from '../stores'
  
  // Access stores directly
  const currentWeek = $derived($workoutStore.currentWeek)
  const customPlan = $derived($trainingPlanStore.customPlan)
  
  // Derived values
  const currentBlockInfo = $derived(customPlan[0] || { name: 'No active block', weeks: 0 })
</script>

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
    onclick={() => goto('/workout')}
    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
  >
    Start Today's Workout
  </button>
</div>