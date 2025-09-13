import { json, error } from '@sveltejs/kit'
import { blockTemplates } from '../../../../blockTemplates'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { blockType } = params
    
    if (!blockType || !(blockType in blockTemplates)) {
      error(404, `Training block '${blockType}' not found`)
    }
    
    const block = blockTemplates[blockType as keyof typeof blockTemplates]
    return json(block)
  } catch (err) {
    console.error('Error fetching training block:', err)
    error(500, 'Failed to fetch training block')
  }
}