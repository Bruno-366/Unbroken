import { json } from '@sveltejs/kit'
import { exerciseStore } from '$lib/stores'
import { get } from 'svelte/store'

export async function GET() {
  try {
    const exerciseState = get(exerciseStore)
    return json(exerciseState.tenRMs)
  } catch (error) {
    console.error('Error fetching exercise 10RMs:', error)
    return json({ error: 'Failed to fetch exercise 10RMs' }, { status: 500 })
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
      tenRMs: { ...state.tenRMs, [exerciseKey]: value }
    }))
    
    return json({ success: true })
  } catch (error) {
    console.error('Error updating exercise 10RM:', error)
    return json({ error: 'Failed to update exercise 10RM' }, { status: 500 })
  }
}