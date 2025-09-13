<script lang="ts">
  import { goto } from '$app/navigation'
  import CardioWorkouts from './CardioWorkouts.svelte'
  import StrengthWorkouts from './StrengthWorkouts.svelte'
  import RestWorkouts from './RestWorkouts.svelte'

  let { data } = $props()

  // Get workout data from page load function
  const getCurrentWorkout = $derived(data.getCurrentWorkout)
  const currentBlockInfo = $derived(data.currentBlockInfo)
  const currentWeek = $derived(data.currentWeek)
  const currentDay = $derived(data.currentDay)

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

  const handleCompleteWorkout = async () => {
    await fetch('/api/workout/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })
    goto('/')
  }
</script>

<div>
  <div class="bg-blue-600 text-white p-4 rounded-lg mb-6 text-center">
    <div class="text-sm opacity-90 mb-1">Week {currentWeek}, Day {currentDay}</div>
    <div class="text-xl font-bold">{currentBlockInfo.name}</div>
  </div>
  
  {#if renderWorkout() === 'strength' && getCurrentWorkout}
    <StrengthWorkouts 
      workout={getCurrentWorkout}
      onCompleteWorkout={handleCompleteWorkout}
    />
  {:else if renderWorkout() === 'cardio' && getCurrentWorkout}
    <CardioWorkouts 
      workout={getCurrentWorkout}
      onCompleteWorkout={handleCompleteWorkout}
    />
  {:else if renderWorkout() === 'rest' && getCurrentWorkout}
    <RestWorkouts 
      workout={getCurrentWorkout}
      onCompleteWorkout={handleCompleteWorkout}
    />
  {:else}
    <p class="text-red-500 font-semibold">No workout found for the current week and day</p>
  {/if}
</div>