import { json } from '@sveltejs/kit'
import { workoutStore } from '$lib/stores'
import { get } from 'svelte/store'

export async function GET() {
  try {
    const workoutState = get(workoutStore)
    const recentWorkouts = workoutState.completedWorkouts
      .slice(-30) // Last 30 workouts
      .reverse() // Most recent first
    
    return json(recentWorkouts)
  } catch (error) {
    console.error('Error fetching recent workouts:', error)
    return json({ error: 'Failed to fetch recent workouts' }, { status: 500 })
  }
}