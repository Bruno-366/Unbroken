<script lang="ts">
  import type { Workout, CardioWorkout } from '../types'

  interface CardioWorkoutsProps {
    workout: Workout
    onCompleteWorkout: () => void
  }

  let { workout, onCompleteWorkout }: CardioWorkoutsProps = $props()

  // Lookup tables for cardio workout configurations
  const CARDIO_WORKOUT_CONFIGS = {
    liss: { 
      bg: 'from-green-500 to-blue-500', 
      button: 'Complete LISS Cardio' 
    },
    hiit: { 
      bg: 'from-orange-500 to-red-500', 
      button: 'Complete HIIT Cardio' 
    }
  } as const

  // Derive cardio workout with proper typing
  const cardioWorkout = $derived(() => workout as CardioWorkout)
  
  // Derive config based on workout type
  const config = $derived(() => {
    const type = cardioWorkout().type
    return CARDIO_WORKOUT_CONFIGS[type as keyof typeof CARDIO_WORKOUT_CONFIGS]
  })
</script>

{#if workout.type === 'liss' || workout.type === 'hiit'}
  <div>
    <div class="bg-gradient-to-r {config().bg} text-white p-6 rounded-lg text-center">
      <h3 class="text-2xl font-bold mb-2">
        {cardioWorkout().activity}
      </h3>
      {#if cardioWorkout().duration}
        <div class="text-4xl font-bold">{cardioWorkout().duration}</div>
        {#if typeof cardioWorkout().duration === 'number'}
          <div class="text-sm opacity-90 mt-1">minutes</div>
        {/if}
      {/if}
    </div>
    <button 
      onclick={onCompleteWorkout} 
      class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors mt-4"
    >
      {config().button}
    </button>
  </div>
{/if}