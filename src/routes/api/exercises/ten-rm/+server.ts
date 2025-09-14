import { json } from '@sveltejs/kit'

export async function GET({ url }) {
  try {
    // Get tenRMs from query parameter
    const tenRMsParam = url.searchParams.get('tenRMs')
    const tenRMs = tenRMsParam ? JSON.parse(tenRMsParam) : {}
    
    return json(tenRMs)
  } catch (error) {
    console.error('Error processing exercise 10RMs:', error)
    return json({ error: 'Failed to process exercise 10RMs' }, { status: 500 })
  }
}

export async function POST({ request }) {
  try {
    const { exerciseKey, value, currentTenRMs } = await request.json()
    
    if (!exerciseKey || typeof value !== 'number') {
      return json({ error: 'Invalid exercise key or value' }, { status: 400 })
    }
    
    const updatedTenRMs = { ...currentTenRMs, [exerciseKey]: value }
    
    return json({ success: true, tenRMs: updatedTenRMs })
  } catch (error) {
    console.error('Error updating exercise 10RM:', error)
    return json({ error: 'Failed to update exercise 10RM' }, { status: 500 })
  }
}