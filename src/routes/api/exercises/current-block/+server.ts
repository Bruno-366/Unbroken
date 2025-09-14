import { json } from '@sveltejs/kit'
import { blockTemplates } from '$lib/blockTemplates'

export async function GET({ url }) {
  try {
    const blockType = url.searchParams.get('blockType')
    
    if (!blockType) {
      return json({ strengthExercises: [], hypertrophyExercises: [] })
    }
    
    const blockTemplate = blockTemplates[blockType as keyof typeof blockTemplates]
    if (!blockTemplate) {
      return json({ strengthExercises: [], hypertrophyExercises: [] })
    }
    
    const strengthExercises = new Set<string>()
    const hypertrophyExercises = new Set<string>()
    
    blockTemplate.weeks.forEach((week: { days: unknown[] }) => {
      week.days.forEach((day: unknown) => {
        const dayObj = day as Record<string, unknown>
        if ('exercises' in dayObj && Array.isArray(dayObj.exercises)) {
          (dayObj.exercises as string[]).forEach((exercise: string) => {
            if (dayObj.type === 'strength') {
              strengthExercises.add(exercise)
            } else if (dayObj.type === 'hypertrophy') {
              hypertrophyExercises.add(exercise)
            }
          })
        }
      })
    })
    
    return json({
      strengthExercises: Array.from(strengthExercises),
      hypertrophyExercises: Array.from(hypertrophyExercises)
    })
  } catch (error) {
    console.error('Error fetching current block exercises:', error)
    return json({ error: 'Failed to fetch current block exercises' }, { status: 500 })
  }
}