import { json } from '@sveltejs/kit'

export async function GET({ url }) {
  try {
    // Get maxes from query parameter
    const maxesParam = url.searchParams.get('maxes')
    const maxes = maxesParam ? JSON.parse(maxesParam) : {}
    
    return json(maxes)
  } catch (error) {
    console.error('Error processing exercise maxes:', error)
    return json({ error: 'Failed to process exercise maxes' }, { status: 500 })
  }
}

export async function POST({ request }) {
  try {
    const { exerciseKey, value, currentMaxes } = await request.json()
    
    if (!exerciseKey || typeof value !== 'number') {
      return json({ error: 'Invalid exercise key or value' }, { status: 400 })
    }
    
    const updatedMaxes = { ...currentMaxes, [exerciseKey]: value }
    
    return json({ success: true, maxes: updatedMaxes })
  } catch (error) {
    console.error('Error updating exercise max:', error)
    return json({ error: 'Failed to update exercise max' }, { status: 500 })
  }
}