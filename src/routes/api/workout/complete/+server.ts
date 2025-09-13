import { json } from '@sveltejs/kit'
import { blockTemplates } from '../../../../blockTemplates'
import { 
  workoutStore, 
  trainingPlanStore,
  uiStore
} from '../../../../stores'
import { get } from 'svelte/store'
import type { CompletedWorkout, Workout } from '../../../../types'

export async function POST() {
  try {
    const workoutDetails = getCurrentWorkout()
    if (!workoutDetails) {
      return json({ error: 'No current workout found' }, { status: 400 })
    }
    
    const trainingState = get(trainingPlanStore)
    const workoutState = get(workoutStore)
    const block = trainingState.customPlan[0]
    
    const workout: CompletedWorkout = {
      date: new Date().toISOString(),
      block: 0,
      blockName: block.name,
      week: workoutState.currentWeek,
      day: workoutState.currentDay,
      details: workoutDetails as Workout
    }
    
    // Progress to next day/week/block
    let newDay = workoutState.currentDay + 1
    let newWeek = workoutState.currentWeek
    
    if (newDay > 7) {
      newDay = 1
      newWeek++
      if (newWeek > block.weeks) {
        // Move to next block
        trainingPlanStore.update(state => ({
          ...state,
          customPlan: state.customPlan.slice(1)
        }))
        newWeek = 1
        newDay = 1
      }
    }
    
    // Update stores
    workoutStore.update(state => ({
      ...state,
      completedWorkouts: [...state.completedWorkouts, workout],
      completedSets: {},
      currentDay: newDay,
      currentWeek: newWeek
    }))
    
    uiStore.update(state => ({
      ...state,
      activeTab: 'overview',
      restTimer: {
        isActive: false,
        timeLeft: 0,
        totalTime: 0,
        workoutType: null,
        phase: 'initial',
        startTime: 0
      },
      lissTimer: {
        isActive: false,
        isPaused: false,
        timeLeft: 0,
        totalTime: 0,
        startTime: 0,
        pausedTime: 0
      }
    }))
    
    return json({ success: true, workout })
  } catch (error) {
    console.error('Error completing workout:', error)
    return json({ error: 'Failed to complete workout' }, { status: 500 })
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