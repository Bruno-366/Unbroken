<script lang="ts">
  import { CheckCircle } from 'lucide-svelte'
  import { workoutStore, exerciseStore, preferencesStore, uiStore } from '../stores'
  import type { 
    Workout, 
    StrengthWorkout, 
    HypertrophyWorkout
  } from '../types'
  import { 
    calculateWeight, 
    calculateHypertrophyWeight, 
    calculateWarmupSets,
    requestNotificationPermission
  } from '../utils'

  interface StrengthWorkoutsProps {
    workout: Workout
    onCompleteWorkout: () => void
  }

  let { workout, onCompleteWorkout }: StrengthWorkoutsProps = $props()
  
  // Access stores directly
  const completedSets = $derived($workoutStore.completedSets)
  const maxes = $derived($exerciseStore.maxes)
  const tenRMs = $derived($exerciseStore.tenRMs)
  const weightUnit = $derived($preferencesStore.weightUnit)

  const toggleSet = async (exerciseAndSchemeIndex: string, setIndex: number) => {
    const key = `${exerciseAndSchemeIndex}-${setIndex}`
    const isBeingCompleted = !completedSets[key]
    
    // Update completed sets in store
    workoutStore.update(state => ({
      ...state,
      completedSets: {
        ...state.completedSets,
        [key]: isBeingCompleted
      }
    }))
    
    // Start rest timer when completing a working set (not warm-up sets)
    if (isBeingCompleted && !key.includes('warmup')) {
      if (workout && (workout.type === 'strength' || workout.type === 'hypertrophy')) {
        // Request notification permission if not already granted
        await requestNotificationPermission()
        
        const initialTime = workout.type === 'strength' ? 180 : 90 // 3 min for strength, 1.5 min for hypertrophy
        const now = Date.now()
        
        // Update rest timer state in store
        uiStore.update(state => ({
          ...state,
          restTimer: {
            isActive: true,
            timeLeft: initialTime,
            totalTime: initialTime,
            workoutType: workout.type as 'strength' | 'hypertrophy',
            phase: 'initial',
            startTime: now
          }
        }))
      }
    }
  }

  // Derive strength workout with proper typing - more idiomatic than casting everywhere
  const strengthWorkout = $derived(() => workout as StrengthWorkout | HypertrophyWorkout)

  // Extract helper functions outside reactive context - they don't need to be reactive
  const getExerciseData = (exerciseIndex: number, schemeIndex: number) => {
    const setSchemes = (strengthWorkout().sets || '').split(',')
    const intensities = String(strengthWorkout().intensity || 0).split(',')
    const shouldMapByIndex = setSchemes.length === (strengthWorkout().exercises || []).length
    
    const intensityIndex = shouldMapByIndex ? exerciseIndex : schemeIndex
    const intensity = parseInt(intensities[intensityIndex] || intensities[0])
    
    return { intensity, shouldMapByIndex }
  }

  const isSetCompleted = (key: string) => Boolean(completedSets[key])
</script>

{#if workout.type === 'strength' || workout.type === 'hypertrophy'}
  <div class="space-y-4">
    {#each (strengthWorkout().exercises || []) as exercise, exerciseIndex}
      {@const setSchemes = (strengthWorkout().sets || '').split(',')}
      {@const exerciseSetSchemes = getExerciseData(exerciseIndex, 0).shouldMapByIndex ? [setSchemes[exerciseIndex]] : setSchemes}
      
      {#each exerciseSetSchemes as setScheme, schemeIndex}
        {@const { intensity } = getExerciseData(exerciseIndex, schemeIndex)}
        {@const weight = strengthWorkout().type === 'strength' ? 
          calculateWeight(exercise, intensity, { maxes, weightUnit }) : 
          calculateHypertrophyWeight(exercise, intensity, { tenRMs, maxes })}
        {@const [sets, reps] = setScheme.split('x')}
        {@const warmupSets = strengthWorkout().type === 'strength' && weight > 0 ? calculateWarmupSets(exercise, weight, { weightUnit }) : []}
        
        <div class="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h4 class="font-bold text-gray-900 mb-2 text-lg">{exercise}</h4>
          <div class="text-sm text-gray-600 mb-4 font-medium">
            {setScheme} @ {intensity}%{weight > 0 ? ` (${weight} ${weightUnit})` : ''}
          </div>
          
          {#if warmupSets.length > 0}
            <div class="mb-4">
              <h5 class="text-sm font-semibold text-gray-700 mb-2">Warm-up Sets</h5>
              <div class="space-y-2">
                {#each warmupSets as warmupSet, warmupIndex}
                  {@const warmupKey = `warmup-${exerciseIndex}-${schemeIndex}-${warmupIndex}-0`}
                  
                  <div class="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div class="flex items-center gap-3">
                      <span class="text-xs font-medium text-blue-700 w-16">Warm-up {warmupIndex + 1}</span>
                      <span class="text-sm text-blue-800">{warmupSet.reps} reps @ {warmupSet.weight} {weightUnit}</span>
                    </div>
                    <button
                      onclick={() => toggleSet(`warmup-${exerciseIndex}-${schemeIndex}-${warmupIndex}`, 0)}
                      class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all {
                        isSetCompleted(warmupKey)
                          ? 'bg-blue-500 border-blue-500 text-white' : 'border-blue-300 hover:border-blue-400 bg-white'
                      }"
                    >
                      {#if isSetCompleted(warmupKey)}
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
              {@const setKey = `${exerciseIndex}-${schemeIndex}-${setIndex}`}
              
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
                      step={weightUnit === 'kg' ? '2.5' : '5'}
                    />
                  {/if}
                  <button
                    onclick={() => toggleSet(`${exerciseIndex}-${schemeIndex}`, setIndex)}
                    class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all {
                      isSetCompleted(setKey)
                        ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-green-400 bg-white'
                    }"
                  >
                    {#if isSetCompleted(setKey)}
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