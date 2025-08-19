<script lang="ts">
  import type { Workout, RestWorkout } from '../types'

  interface RestWorkoutsProps {
    workout: Workout
    onCompleteWorkout: () => void
  }

  let { workout, onCompleteWorkout }: RestWorkoutsProps = $props()

  // Lookup tables for rest workout configurations
  const REST_WORKOUT_CONFIGS = {
    rest: { 
      bg: 'from-purple-500 to-pink-500', 
      title: 'Rest Day', 
      desc: 'Take a day off to recover', 
      button: 'Complete Rest Day' 
    },
    deload: { 
      bg: 'from-blue-500 to-teal-500', 
      title: 'Deload', 
      desc: 'Light activity or mobility work', 
      button: 'Complete Deload Day' 
    }
  } as const

  // Derive rest workout with proper typing
  const restWorkout = $derived(() => workout as RestWorkout)
  
  // Derive config based on workout type
  const config = $derived(() => {
    const type = restWorkout().type
    return REST_WORKOUT_CONFIGS[type as keyof typeof REST_WORKOUT_CONFIGS]
  })
</script>

{#if workout.type === 'rest' || workout.type === 'deload'}
  <div>
    <div class="bg-gradient-to-r {config().bg} text-white p-6 rounded-lg text-center">
      <h3 class="text-2xl font-bold mb-2">{config().title}</h3>
      <p class="opacity-90">{config().desc}</p>
    </div>
    <button 
      onclick={onCompleteWorkout} 
      class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors mt-4"
    >
      {config().button}
    </button>
  </div>
{/if}