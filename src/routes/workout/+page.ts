import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch }) => {
  // Fetch current workout data from API
  const currentWorkoutResponse = await fetch('/api/workout/current')
  const getCurrentWorkout = await currentWorkoutResponse.json()
  
  // Fetch workout state
  const stateResponse = await fetch('/api/workout/state')
  const state = await stateResponse.json()
  
  return {
    getCurrentWorkout,
    currentBlockInfo: state.currentBlockInfo,
    currentWeek: state.currentWeek,
    currentDay: state.currentDay
  }
}