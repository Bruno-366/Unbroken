import { json } from '@sveltejs/kit'
import { exerciseStore } from '../../../../stores'
import { get } from 'svelte/store'

export async function GET() {
  try {
    const exerciseState = get(exerciseStore)
    return json(exerciseState.maxes)
  } catch (error) {
    console.error('Error fetching exercise maxes:', error)
    return json({ error: 'Failed to fetch exercise maxes' }, { status: 500 })
  }
}

export async function POST({ request }) {
  try {
    const { exerciseKey, value } = await request.json()
    
    if (!exerciseKey || typeof value !== 'number') {
      return json({ error: 'Invalid exercise key or value' }, { status: 400 })
    }
    
    exerciseStore.update(state => ({
      ...state,
      maxes: { ...state.maxes, [exerciseKey]: value }
    }))
    
    return json({ success: true })
  } catch (error) {
    console.error('Error updating exercise max:', error)
    return json({ error: 'Failed to update exercise max' }, { status: 500 })
  }
}