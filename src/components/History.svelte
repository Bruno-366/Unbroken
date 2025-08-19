<script lang="ts">
  import { Clock } from 'lucide-svelte'
  import type { 
    CompletedWorkout, 
    CardioWorkout, 
    StrengthWorkout, 
    HypertrophyWorkout 
  } from '../types'

  interface HistoryProps {
    completedWorkouts: CompletedWorkout[]
  }

  let { completedWorkouts }: HistoryProps = $props()

  // History configuration for different workout types
  const HISTORY_CONFIGS = {
    rest: { color: 'bg-slate-400', label: 'Rest', summary: 'Recovery day' },
    deload: { color: 'bg-slate-400', label: 'Deload', summary: 'Light activity' },
    liss: { color: 'bg-green-500', label: 'LISS' },
    hiit: { color: 'bg-yellow-500', label: 'HIIT' },
    strength: { color: 'bg-red-500', label: 'Strength' },
    hypertrophy: { color: 'bg-blue-500', label: 'Hypertrophy' }
  }

  const getWorkoutSummary = (workout: CompletedWorkout) => {
    const workoutType = workout.details?.type || 'unknown'
    
    switch (workoutType) {
      case 'liss':
        return `${(workout.details as CardioWorkout).activity} - ${(workout.details as CardioWorkout).duration}${typeof (workout.details as CardioWorkout).duration === 'number' ? ' min' : ''}`
      case 'hiit':
        return `${(workout.details as CardioWorkout).activity} - ${(workout.details as CardioWorkout).duration}${typeof (workout.details as CardioWorkout).duration === 'number' ? ' min' : ''}`
      case 'strength':
        return (workout.details as StrengthWorkout).exercises?.join(', ') || 'Strength training'
      case 'hypertrophy': {
        const hyp = workout.details as HypertrophyWorkout
        return hyp.exercises?.slice(0, 3).join(', ') + (hyp.exercises?.length > 3 ? '...' : '') || 'Accessory work'
      }
      default: {
        const config = HISTORY_CONFIGS[workoutType as keyof typeof HISTORY_CONFIGS] || HISTORY_CONFIGS.rest
        return 'summary' in config ? config.summary : 'Workout completed'
      }
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
    {#each completedWorkouts.slice(-10).reverse() as workout}
      {@const date = new Date(workout.date)}
      {@const workoutType = workout.details?.type || 'unknown'}
      {@const config = HISTORY_CONFIGS[workoutType as keyof typeof HISTORY_CONFIGS] || HISTORY_CONFIGS.rest}
      {@const workoutSummary = getWorkoutSummary(workout)}
      
      <div class="border-l-4 border-blue-500 pl-4 pb-3">
        <div class="flex items-center gap-2 mb-1">
          <div class="text-xs text-gray-600">
            {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
          <div class="text-xs text-gray-500 mt-1">
            Sets: {(workout.details as StrengthWorkout | HypertrophyWorkout).sets}
            {#if 'intensity' in workout.details && workout.details.intensity}
              @ {workout.details.intensity}%
            {/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>
{/if}