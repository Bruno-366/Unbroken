import { json } from '@sveltejs/kit'
import { trainingPlanStore } from '../../../stores'
import { get } from 'svelte/store'

export async function GET() {
  try {
    const trainingState = get(trainingPlanStore)
    return json(trainingState.customPlan)
  } catch (error) {
    console.error('Error fetching training plan:', error)
    return json({ error: 'Failed to fetch training plan' }, { status: 500 })
  }
}

export async function POST({ request }) {
  try {
    const { customPlan } = await request.json()
    
    if (!Array.isArray(customPlan)) {
      return json({ error: 'Invalid training plan format' }, { status: 400 })
    }
    
    trainingPlanStore.update(state => ({
      ...state,
      customPlan
    }))
    
    return json({ success: true })
  } catch (error) {
    console.error('Error updating training plan:', error)
    return json({ error: 'Failed to update training plan' }, { status: 500 })
  }
}

export async function PUT({ request }) {
  try {
    const { fromIndex, toIndex } = await request.json()
    
    if (typeof fromIndex !== 'number' || typeof toIndex !== 'number') {
      return json({ error: 'Invalid reorder parameters' }, { status: 400 })
    }
    
    trainingPlanStore.update(state => {
      const newPlan = [...state.customPlan]
      const [movedItem] = newPlan.splice(fromIndex, 1)
      newPlan.splice(toIndex, 0, movedItem)
      
      return {
        ...state,
        customPlan: newPlan
      }
    })
    
    return json({ success: true })
  } catch (error) {
    console.error('Error reordering training plan:', error)
    return json({ error: 'Failed to reorder training plan' }, { status: 500 })
  }
}