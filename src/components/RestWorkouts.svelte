<script lang="ts">
  import type { Workout } from '../types'

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
  }
</script>

{#if workout.type === 'rest' || workout.type === 'deload'}
  {@const config = REST_WORKOUT_CONFIGS[workout.type]}
  
  <div>
    <div class="bg-gradient-to-r {config.bg} text-white p-6 rounded-lg text-center">
      <h3 class="text-2xl font-bold mb-2">{config.title}</h3>
      <p class="opacity-90">{config.desc}</p>
    </div>
    <button 
      onclick={onCompleteWorkout} 
      class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors mt-4"
    >
      {config.button}
    </button>
  </div>
{/if}