import { json } from '@sveltejs/kit'

export async function GET({ url }) {
  try {
    // Extract client state from query parameters
    const currentWeek = parseInt(url.searchParams.get('currentWeek') || '1')
    const currentDay = parseInt(url.searchParams.get('currentDay') || '1')
    const blockName = url.searchParams.get('blockName') || 'No active block'
    const completedWorkouts = JSON.parse(url.searchParams.get('completedWorkouts') || '[]')
    const completedSets = JSON.parse(url.searchParams.get('completedSets') || '{}')
    
    return json({
      currentWeek,
      currentDay,
      currentBlockInfo: { name: blockName, weeks: 0 },
      completedWorkouts,
      completedSets
    })
  } catch (error) {
    console.error('Error processing workout state:', error)
    return json({ error: 'Failed to process workout state' }, { status: 500 })
  }
}