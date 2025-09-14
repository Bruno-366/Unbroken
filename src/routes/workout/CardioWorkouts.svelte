<script lang="ts">
  import type { Workout, CardioWorkout } from '$lib/types'
  import LISSWorkout from './LISSWorkout.svelte'
  import HIITWorkout from './HIITWorkout.svelte'

  interface CardioWorkoutsProps {
    workout: Workout
    onCompleteWorkout: () => void
  }

  let { workout, onCompleteWorkout }: CardioWorkoutsProps = $props()

  // Derive cardio workout with proper typing
  const cardioWorkout = $derived(() => workout as CardioWorkout)
</script>

{#if cardioWorkout().type === 'liss'}
  <LISSWorkout 
    workout={workout}
    onCompleteWorkout={onCompleteWorkout}
  />
{:else if cardioWorkout().type === 'hiit'}
  <HIITWorkout 
    workout={workout}
    onCompleteWorkout={onCompleteWorkout}
  />
{/if}