import { json } from '@sveltejs/kit'

export async function GET({ url }) {
  try {
    // Get custom plan from query parameter
    const customPlanParam = url.searchParams.get('customPlan')
    const customPlan = customPlanParam ? JSON.parse(customPlanParam) : []
    
    return json(customPlan)
  } catch (error) {
    console.error('Error processing training plan:', error)
    return json({ error: 'Failed to process training plan' }, { status: 500 })
  }
}

export async function POST({ request }) {
  try {
    const { customPlan } = await request.json()
    
    if (!Array.isArray(customPlan)) {
      return json({ error: 'Invalid training plan format' }, { status: 400 })
    }
    
    return json({ success: true, customPlan })
  } catch (error) {
    console.error('Error updating training plan:', error)
    return json({ error: 'Failed to update training plan' }, { status: 500 })
  }
}

export async function PUT({ request }) {
  try {
    const { fromIndex, toIndex, customPlan } = await request.json()
    
    if (typeof fromIndex !== 'number' || typeof toIndex !== 'number' || !Array.isArray(customPlan)) {
      return json({ error: 'Invalid reorder parameters' }, { status: 400 })
    }
    
    const newPlan = [...customPlan]
    const [movedItem] = newPlan.splice(fromIndex, 1)
    newPlan.splice(toIndex, 0, movedItem)
    
    return json({ success: true, customPlan: newPlan })
  } catch (error) {
    console.error('Error reordering training plan:', error)
    return json({ error: 'Failed to reorder training plan' }, { status: 500 })
  }
}