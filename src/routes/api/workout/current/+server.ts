import { json } from '@sveltejs/kit'
import { blockTemplates } from '../../../../blockTemplates'
import { 
  workoutStore, 
  trainingPlanStore
} from '$lib/stores'
import { get } from 'svelte/store'
import type { Workout } from '$lib/types'

export async function GET() {
  try {
    const currentWorkout = getCurrentWorkout()
    return json(currentWorkout)
  } catch (error) {
    console.error('Error fetching current workout:', error)
    return json({ error: 'Failed to fetch current workout' }, { status: 500 })
  }
}

function getCurrentWorkout(): Workout | null {
  const workoutState = get(workoutStore)
  const trainingState = get(trainingPlanStore)
  
  const block = trainingState.customPlan[0]
  if (!block) return null
  
  const blockTemplate = blockTemplates[block.type as keyof typeof blockTemplates]
  if (!blockTemplate) return null
  
  const weekIndex = Math.min(workoutState.currentWeek - 1, blockTemplate.weeks.length - 1)
  const dayIndex = workoutState.currentDay - 1
  return blockTemplate.weeks[weekIndex].days[dayIndex] as Workout
}