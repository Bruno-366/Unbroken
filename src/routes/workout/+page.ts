import type { PageLoad } from './$types'
import { browser } from '$app/environment'
import { get } from 'svelte/store'

export const load: PageLoad = async ({ fetch }) => {
  // Return default data during SSR/build time
  if (!browser) {
    return {
      getCurrentWorkout: null,
      currentBlockInfo: { name: 'Loading...', weeks: 0 },
      currentWeek: 1,
      currentDay: 1
    }
  }

  try {
    // Import stores only in browser
    const { workoutStore, trainingPlanStore } = await import('$lib/stores')
    
    // Get current state from stores
    const workoutState = get(workoutStore)
    const trainingState = get(trainingPlanStore)
    const currentBlock = trainingState.customPlan[0]
    
    if (!currentBlock) {
      return {
        getCurrentWorkout: null,
        currentBlockInfo: { name: 'No active block', weeks: 0 },
        currentWeek: workoutState.currentWeek,
        currentDay: workoutState.currentDay
      }
    }
    
    // Fetch current workout data from API with client state
    const currentWorkoutResponse = await fetch(
      `/api/workout/current?blockType=${encodeURIComponent(currentBlock.type)}&currentWeek=${workoutState.currentWeek}&currentDay=${workoutState.currentDay}`
    )
    const getCurrentWorkout = await currentWorkoutResponse.json()
    
    // We could prepare state data for API calls if needed in the future
    // const stateParams = new URLSearchParams({
    //   currentWeek: workoutState.currentWeek.toString(),
    //   currentDay: workoutState.currentDay.toString(),
    //   blockName: currentBlock.name,
    //   completedWorkouts: JSON.stringify(workoutState.completedWorkouts),
    //   completedSets: JSON.stringify(workoutState.completedSets)
    // })
    
    return {
      getCurrentWorkout,
      currentBlockInfo: { name: currentBlock.name, weeks: currentBlock.weeks },
      currentWeek: workoutState.currentWeek,
      currentDay: workoutState.currentDay
    }
  } catch (error) {
    console.error('Error loading workout data:', error)
    return {
      getCurrentWorkout: null,
      currentBlockInfo: { name: 'Error loading', weeks: 0 },
      currentWeek: 1,
      currentDay: 1
    }
  }
}