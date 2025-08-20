<script lang="ts">
  import { Clock } from 'lucide-svelte'
  import { workoutStore } from '../stores'
  import type { 
    CompletedWorkout, 
    CardioWorkout, 
    StrengthWorkout, 
    HypertrophyWorkout 
  } from '../types'
  
  // Access completed workouts directly from store
  const completedWorkouts = $derived($workoutStore.completedWorkouts)

  // History configuration for different workout types - static, no need to be reactive
  const HISTORY_CONFIGS = {
    rest: { color: 'bg-slate-400', label: 'Rest', summary: 'Recovery day' },
    deload: { color: 'bg-slate-400', label: 'Deload', summary: 'Light activity' },
    liss: { color: 'bg-green-500', label: 'LISS' },
    hiit: { color: 'bg-yellow-500', label: 'HIIT' },
    strength: { color: 'bg-red-500', label: 'Strength' },
    hypertrophy: { color: 'bg-blue-500', label: 'Hypertrophy' }
  } as const

  // Derived recent workouts (last 10, reversed) - more idiomatic than function
  const recentWorkouts = $derived(completedWorkouts.slice(-10).reverse())

  // Extract helper functions outside reactive context for better performance
  const getWorkoutSummary = (workout: CompletedWorkout): string => {
    const workoutType = workout.details?.type || 'unknown'
    
    switch (workoutType) {
      case 'liss':
      case 'hiit': {
        const cardio = workout.details as CardioWorkout
        const duration = cardio.duration
        const durationStr = typeof duration === 'number' ? ` - ${duration} min` : duration ? ` - ${duration}` : ''
        return `${cardio.activity}${durationStr}`
      }
      case 'strength': {
        const strength = workout.details as StrengthWorkout
        return strength.exercises?.join(', ') || 'Strength training'
      }
      case 'hypertrophy': {
        const hyp = workout.details as HypertrophyWorkout
        const exercises = hyp.exercises || []
        return exercises.slice(0, 3).join(', ') + (exercises.length > 3 ? '...' : '') || 'Accessory work'
      }
      default: {
        const config = HISTORY_CONFIGS[workoutType as keyof typeof HISTORY_CONFIGS] || HISTORY_CONFIGS.rest
        return 'summary' in config ? config.summary : 'Workout completed'
      }
    }
  }

  const getWorkoutConfig = (workoutType: string) => {
    return HISTORY_CONFIGS[workoutType as keyof typeof HISTORY_CONFIGS] || HISTORY_CONFIGS.rest
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }
</script>

{#if completedWorkouts.length === 0}
  <div class="text-center text-gray-400 py-12">
    <Clock class="w-16 h-16 mx-auto mb-4 opacity-50" />
    <p>No workout history yet</p>
    <p class="text-xs mt-2">Complete your first workout to see it here</p>
  </div>
{:else}
  <div class="space-y-4">
    {#each recentWorkouts as workout}
      {@const workoutType = workout.details?.type || 'unknown'}
      {@const config = getWorkoutConfig(workoutType)}
      {@const workoutSummary = getWorkoutSummary(workout)}
      {@const { date, time } = formatDateTime(workout.date)}
      
      <div class="border-l-4 border-blue-500 pl-4 pb-3">
        <div class="flex items-center gap-2 mb-1">
          <div class="text-xs text-gray-600">
            {date} at {time}
          </div>
          <span class="{config.color} text-white text-xs px-2 py-1 rounded-full font-semibold">
            {config.label}
          </span>
        </div>
        <div class="font-semibold text-gray-900">{workout.blockName || 'Unknown Block'}</div>
        <div class="text-sm text-gray-600">Week {workout.week}, Day {workout.day}</div>
        {#if workoutSummary}
          <div class="text-sm text-gray-700 mt-1 font-medium">{workoutSummary}</div>
        {/if}
        {#if 'sets' in workout.details}
          {@const workoutDetails = workout.details as StrengthWorkout | HypertrophyWorkout}
          <div class="text-xs text-gray-500 mt-1">
            Sets: {workoutDetails.sets}
            {#if 'intensity' in workoutDetails && workoutDetails.intensity}
              @ {workoutDetails.intensity}%
            {/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>
{/if}