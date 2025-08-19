<script lang="ts">
  import { Activity } from 'lucide-svelte'
  import { getExerciseKey } from '../utils'
  import { blockTemplates } from '../blockTemplates'
  import type { TrainingBlock } from '../types'

  interface ExerciseDatabaseProps {
    maxes: Record<string, number>
    tenRMs: Record<string, number>
    weightUnit: string
    customPlan: TrainingBlock[]
    currentBlockName: string
  }

  let { maxes = $bindable(), tenRMs = $bindable(), weightUnit, customPlan, currentBlockName }: ExerciseDatabaseProps = $props()

  // Get exercises used in the current active block
  const getCurrentBlockExercises = () => {
    const currentBlock = customPlan[0]
    if (!currentBlock) return { strengthExercises: [], hypertrophyExercises: [] }
    
    const blockTemplate = blockTemplates[currentBlock.type as keyof typeof blockTemplates]
    if (!blockTemplate) return { strengthExercises: [], hypertrophyExercises: [] }
    
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
    
    return {
      strengthExercises: Array.from(strengthExercises),
      hypertrophyExercises: Array.from(hypertrophyExercises)
    }
  }

  // Derived values using the local function
  const exerciseData = $derived(getCurrentBlockExercises())
  const strengthExercises = $derived(exerciseData.strengthExercises)
  const hypertrophyExercises = $derived(exerciseData.hypertrophyExercises)
</script>

<div class="mb-6">
  <h3 class="text-lg font-semibold mb-4">Exercise Database - {currentBlockName}</h3>
  <div class="text-sm text-gray-600 mb-4">
    Showing exercises for your current block. Values update automatically for weight calculations.
  </div>
  
  {#if strengthExercises.length > 0}
    <div class="mb-6">
      <h4 class="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span class="w-3 h-3 bg-red-500 rounded-full"></span>
        Strength Exercises (1RM - {weightUnit})
      </h4>
      <div class="space-y-3">
        {#each strengthExercises as exercise}
          {@const exerciseKey = getExerciseKey(exercise)}
          
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <label for="max-{exerciseKey}" class="flex-1 text-sm text-gray-700 font-medium">{exercise}</label>
            <div class="flex items-center gap-2">
              <input
                id="max-{exerciseKey}"
                type="number"
                bind:value={maxes[exerciseKey]}
                class="w-24 p-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                placeholder="1RM"
                step={weightUnit === 'kg' ? '2.5' : '5'}
              />
              <span class="text-xs text-gray-500 font-medium w-8">{weightUnit}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if hypertrophyExercises.length > 0}
    <div class="mb-6">
      <h4 class="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
        Hypertrophy Exercises (10RM - {weightUnit})
      </h4>
      <div class="space-y-3">
        {#each hypertrophyExercises as exercise}
          {@const exerciseKey = getExerciseKey(exercise)}
          
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <label for="tenrm-{exerciseKey}" class="flex-1 text-sm text-gray-700 font-medium">{exercise}</label>
            <div class="flex items-center gap-2">
              <input
                id="tenrm-{exerciseKey}"
                type="number"
                bind:value={tenRMs[exerciseKey]}
                class="w-24 p-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="10RM"
                step="1"
              />
              <span class="text-xs text-gray-500 font-medium w-8">{weightUnit}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if strengthExercises.length === 0 && hypertrophyExercises.length === 0}
    <div class="text-center text-gray-400 py-8">
      <Activity class="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p>No resistance exercises in current block</p>
      <p class="text-xs mt-1">Switch to a strength or powerbuilding block to see exercise settings</p>
    </div>
  {/if}
</div>