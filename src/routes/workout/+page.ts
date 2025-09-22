import type { PageLoad } from './$types'
import { browser } from '$app/environment'
import { get } from 'svelte/store'

export const load: PageLoad = async ({ fetch, url }) => {
  // Extract URL parameters for testing
  const blockParam = url.searchParams.get('block')
  const weekParam = url.searchParams.get('week')
  const dayParam = url.searchParams.get('day')
  
  // Return default data during SSR/build time
  if (!browser) {
    return {
      getCurrentWorkout: null,
      currentBlockInfo: { name: 'Loading...', weeks: 0 },
      currentWeek: weekParam ? parseInt(weekParam) : 1,
      currentDay: dayParam ? parseInt(dayParam) : 1
    }
  }

  try {
    // Import stores only in browser
    const { workoutStore, trainingPlanStore } = await import('$lib/stores')
    
    // Get current state from stores
    const workoutState = get(workoutStore)
    const trainingState = get(trainingPlanStore)
    
    // Use URL parameters to override store values if provided
    const currentWeek = weekParam ? parseInt(weekParam) : workoutState.currentWeek
    const currentDay = dayParam ? parseInt(dayParam) : workoutState.currentDay
    
    // Determine the block to use
    let currentBlock
    if (blockParam) {
      // If block parameter is provided, try to find it in the training plan or use it directly
      const foundBlock = trainingState.customPlan.find(block => 
        block.type === blockParam || block.name === blockParam
      )
      if (foundBlock) {
        currentBlock = foundBlock
      } else {
        // If not found in custom plan, create a temporary block for testing
        currentBlock = { name: blockParam, weeks: 12, type: blockParam }
      }
    } else {
      // Use the first block from the training plan as before
      currentBlock = trainingState.customPlan[0]
    }
    
    if (!currentBlock) {
      return {
        getCurrentWorkout: null,
        currentBlockInfo: { name: 'No active block', weeks: 0 },
        currentWeek,
        currentDay
      }
    }
    
    // Fetch current workout data from API with the determined parameters
    const currentWorkoutResponse = await fetch(
      `/api/workout/current?blockType=${encodeURIComponent(currentBlock.type)}&currentWeek=${currentWeek}&currentDay=${currentDay}`
    )
    const getCurrentWorkout = await currentWorkoutResponse.json()
    
    return {
      getCurrentWorkout,
      currentBlockInfo: { name: currentBlock.name, weeks: currentBlock.weeks },
      currentWeek,
      currentDay
    }
  } catch (error) {
    console.error('Error loading workout data:', error)
    return {
      getCurrentWorkout: null,
      currentBlockInfo: { name: 'Error loading', weeks: 0 },
      currentWeek: weekParam ? parseInt(weekParam) : 1,
      currentDay: dayParam ? parseInt(dayParam) : 1
    }
  }
}