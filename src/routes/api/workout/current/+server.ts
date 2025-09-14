import { json } from '@sveltejs/kit'
import { blockTemplates } from '$lib/blockTemplates'
import type { Workout } from '$lib/types'

export async function GET({ url }) {
  try {
    const blockType = url.searchParams.get('blockType')
    const currentWeek = parseInt(url.searchParams.get('currentWeek') || '1')
    const currentDay = parseInt(url.searchParams.get('currentDay') || '1')
    
    if (!blockType) {
      return json({ error: 'Block type is required' }, { status: 400 })
    }
    
    const currentWorkout = getCurrentWorkout(blockType, currentWeek, currentDay)
    return json(currentWorkout)
  } catch (error) {
    console.error('Error fetching current workout:', error)
    return json({ error: 'Failed to fetch current workout' }, { status: 500 })
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