<script lang="ts">
  import { CheckCircle } from 'lucide-svelte'
  import type { 
    Workout, 
    StrengthWorkout, 
    HypertrophyWorkout, 
    AppState 
  } from '../types'
  import { 
    calculateWeight, 
    calculateHypertrophyWeight, 
    calculateWarmupSets
  } from '../utils'

  interface StrengthWorkoutsProps {
    workout: Workout
    state: AppState
    onCompleteWorkout: () => void
    onToggleSet: (exerciseAndSchemeIndex: string, setIndex: number) => Promise<void>
    onUpdateState: (updates: Partial<AppState>) => void
  }

  let { workout, state, onCompleteWorkout, onToggleSet, onUpdateState }: StrengthWorkoutsProps = $props()

  const strengthWorkout = workout as StrengthWorkout | HypertrophyWorkout
</script>

{#if workout.type === 'strength' || workout.type === 'hypertrophy'}
  <div class="space-y-4">
    {#each (strengthWorkout.exercises || []) as exercise, exerciseIndex}
      {@const setSchemes = (strengthWorkout.sets || '').split(',')}
      {@const intensities = String(strengthWorkout.intensity || 0).split(',')}
      {@const shouldMapByIndex = setSchemes.length === (strengthWorkout.exercises || []).length}
      {@const exerciseSetSchemes = shouldMapByIndex ? [setSchemes[exerciseIndex]] : setSchemes}
      
      {#each exerciseSetSchemes as setScheme, schemeIndex}
        {@const intensityIndex = shouldMapByIndex ? exerciseIndex : schemeIndex}
        {@const intensity = parseInt(intensities[intensityIndex] || intensities[0])}
        {@const weight = strengthWorkout.type === 'strength' ? 
          calculateWeight(exercise, intensity, state) : 
          calculateHypertrophyWeight(exercise, intensity, state)}
        {@const [sets, reps] = setScheme.split('x')}
        {@const warmupSets = strengthWorkout.type === 'strength' && weight > 0 ? calculateWarmupSets(exercise, weight, state) : []}
        
        <div class="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h4 class="font-bold text-gray-900 mb-2 text-lg">{exercise}</h4>
          <div class="text-sm text-gray-600 mb-4 font-medium">
            {setScheme} @ {intensity}%{weight > 0 ? ` (${weight} ${state.weightUnit})` : ''}
          </div>
          
          {#if warmupSets.length > 0}
            <div class="mb-4">
              <h5 class="text-sm font-semibold text-gray-700 mb-2">Warm-up Sets</h5>
              <div class="space-y-2">
                {#each warmupSets as warmupSet, warmupIndex}
                  <div class="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div class="flex items-center gap-3">
                      <span class="text-xs font-medium text-blue-700 w-16">Warm-up {warmupIndex + 1}</span>
                      <span class="text-sm text-blue-800">{warmupSet.reps} reps @ {warmupSet.weight} {state.weightUnit}</span>
                    </div>
                    <button
                      onclick={() => onToggleSet(`warmup-${exerciseIndex}-${schemeIndex}-${warmupIndex}`, 0)}
                      class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all {
                        state.completedSets[`warmup-${exerciseIndex}-${schemeIndex}-${warmupIndex}-0`]
                          ? 'bg-blue-500 border-blue-500 text-white' : 'border-blue-300 hover:border-blue-400 bg-white'
                      }"
                    >
                      {#if state.completedSets[`warmup-${exerciseIndex}-${schemeIndex}-${warmupIndex}-0`]}
                        <CheckCircle class="w-4 h-4" />
                      {/if}
                    </button>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
          
          <div class="space-y-3">
            <h5 class="text-sm font-semibold text-gray-700">Working Sets</h5>
            {#each Array(parseInt(sets)) as _, setIndex}
              <div class="flex items-center justify-between bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all">
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium text-gray-600 w-12">Set {setIndex + 1}</span>
                  <span class="text-sm text-gray-800">{reps} reps</span>
                </div>
                <div class="flex items-center gap-3">
                  {#if weight > 0}
                    <input
                      type="number"
                      class="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      value={weight}
                      placeholder="Weight"
                      step={state.weightUnit === 'kg' ? '2.5' : '5'}
                    />
                  {/if}
                  <button
                    onclick={() => onToggleSet(`${exerciseIndex}-${schemeIndex}`, setIndex)}
                    class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all {
                      state.completedSets[`${exerciseIndex}-${schemeIndex}-${setIndex}`]
                        ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-green-400 bg-white'
                    }"
                  >
                    {#if state.completedSets[`${exerciseIndex}-${schemeIndex}-${setIndex}`]}
                      <CheckCircle class="w-5 h-5" />
                    {/if}
                  </button>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    {/each}
    
    <button 
      onclick={onCompleteWorkout} 
      class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
    >
      Complete Workout
    </button>
  </div>
{/if}