import { json } from '@sveltejs/kit'
import { blockTemplates } from '$lib/blockTemplates'
import type { CompletedWorkout, Workout } from '$lib/types'

export async function POST({ request }) {
  try {
    const body = await request.json()
    const { 
      currentWeek, 
      currentDay, 
      blockType, 
      blockName
    } = body
    
    const workoutDetails = getCurrentWorkout(blockType, currentWeek, currentDay)
    if (!workoutDetails) {
      return json({ error: 'No current workout found' }, { status: 400 })
    }
    
    const workout: CompletedWorkout = {
      date: new Date().toISOString(),
      block: 0,
      blockName: blockName,
      week: currentWeek,
      day: currentDay,
      details: workoutDetails as Workout
    }
    
    // Calculate next day/week progression
    let newDay = currentDay + 1
    let newWeek = currentWeek
    let moveToNextBlock = false
    
    const blockTemplate = blockTemplates[blockType as keyof typeof blockTemplates]
    const maxWeeks = blockTemplate?.weeks?.length || 8
    
    if (newDay > 7) {
      newDay = 1
      newWeek++
      if (newWeek > maxWeeks) {
        // Move to next block
        moveToNextBlock = true
        newWeek = 1
        newDay = 1
      }
    }
    
    return json({ 
      success: true, 
      workout,
      newDay,
      newWeek,
      moveToNextBlock
    })
  } catch (error) {
    console.error('Error completing workout:', error)
    return json({ error: 'Failed to complete workout' }, { status: 500 })
  }
}

function getCurrentWorkout(blockType: string, currentWeek: number, currentDay: number): Workout | null {
  const blockTemplate = blockTemplates[blockType as keyof typeof blockTemplates]
  if (!blockTemplate) return null
  
  const weekIndex = Math.min(currentWeek - 1, blockTemplate.weeks.length - 1)
  const dayIndex = currentDay - 1
  
  if (weekIndex < 0 || dayIndex < 0 || dayIndex >= 7) return null
  if (!blockTemplate.weeks[weekIndex] || !blockTemplate.weeks[weekIndex].days[dayIndex]) return null
  
  return blockTemplate.weeks[weekIndex].days[dayIndex] as Workout
}