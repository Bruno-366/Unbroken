import { json } from '@sveltejs/kit'

export async function GET({ url }) {
  try {
    // Get completed workouts from query parameter
    const completedWorkoutsParam = url.searchParams.get('completedWorkouts')
    const completedWorkouts = completedWorkoutsParam ? JSON.parse(completedWorkoutsParam) : []
    
    const recentWorkouts = completedWorkouts
      .slice(-30) // Last 30 workouts
      .reverse() // Most recent first
    
    return json(recentWorkouts)
  } catch (error) {
    console.error('Error processing recent workouts:', error)
    return json({ error: 'Failed to process recent workouts' }, { status: 500 })
  }
}