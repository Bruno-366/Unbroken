import { json } from '@sveltejs/kit'
import { blockTemplates } from '$lib/blockTemplates'

export async function GET() {
  try {
    return json(blockTemplates)
  } catch (error) {
    console.error('Error fetching all training blocks:', error)
    return json({ error: 'Failed to fetch training blocks' }, { status: 500 })
  }
}