import { json } from '@sveltejs/kit'
import { 
  workoutStore, 
  trainingPlanStore
} from '../../../../stores'
import { get } from 'svelte/store'

export async function GET() {
  try {
    const workoutState = get(workoutStore)
    const trainingState = get(trainingPlanStore)
    
    const currentBlockInfo = trainingState.customPlan[0] || { name: 'No active block', weeks: 0 }
    
    return json({
      currentWeek: workoutState.currentWeek,
      currentDay: workoutState.currentDay,
      currentBlockInfo,
      completedWorkouts: workoutState.completedWorkouts,
      completedSets: workoutState.completedSets
    })
  } catch (error) {
    console.error('Error fetching workout state:', error)
    return json({ error: 'Failed to fetch workout state' }, { status: 500 })
  }
}