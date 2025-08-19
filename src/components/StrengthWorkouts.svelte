<script lang="ts">
  import { Clock, CheckCircle } from 'lucide-svelte'
  import type { 
    Workout, 
    StrengthWorkout, 
    HypertrophyWorkout, 
    AppState 
  } from '../types'
  import { 
    calculateWeight, 
    calculateHypertrophyWeight, 
    calculateWarmupSets,
    showRestCompleteNotification
  } from '../utils'

  interface StrengthWorkoutsProps {
    workout: Workout
    state: AppState
    onCompleteWorkout: () => void
    onToggleSet: (exerciseAndSchemeIndex: string, setIndex: number) => Promise<void>
  }

  let { workout, state, onCompleteWorkout, onToggleSet }: StrengthWorkoutsProps = $props()

  // Timer effect - timestamp-based to prevent background throttling
  let timerInterval: number
  
  $effect(() => {
    if (state.restTimer.isActive && state.restTimer.timeLeft > 0) {
      timerInterval = window.setInterval(() => {
        const now = Date.now()
        const elapsedSeconds = Math.floor((now - state.restTimer.startTime) / 1000)
        const newTimeLeft = Math.max(0, state.restTimer.totalTime - elapsedSeconds)
        
        // Update the timer directly on the state since it's passed by reference
        state.restTimer.timeLeft = newTimeLeft
      }, 100) // Check more frequently for smoother updates
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval)
    }
  })

  // Separate effect to handle notification when timer reaches 0
  $effect(() => {
    if (state.restTimer.isActive && state.restTimer.timeLeft === 0) {
      showRestCompleteNotification()
    }
  })

  // Derive strength workout with proper typing
  const strengthWorkout = $derived(() => workout as StrengthWorkout | HypertrophyWorkout)

  // Timer functions
  const stopRestTimer = () => {
    state.restTimer.isActive = false
    state.restTimer.timeLeft = 0
    state.restTimer.totalTime = 0
    state.restTimer.workoutType = null
    state.restTimer.phase = 'initial'
    state.restTimer.startTime = 0
  }

  const extendRestTimer = () => {
    if (state.restTimer.workoutType === 'strength' && state.restTimer.phase === 'initial') {
      const extendedTime = 120 // Additional 2 minutes to reach 5 minutes total
      const now = Date.now()
      state.restTimer.timeLeft = extendedTime
      state.restTimer.totalTime = extendedTime
      state.restTimer.phase = 'extended'
      state.restTimer.startTime = now
    }
  }

  // Helper function to calculate exercise data
  const getExerciseData = (exerciseIndex: number, schemeIndex: number) => {
    const setSchemes = (strengthWorkout().sets || '').split(',')
    const intensities = String(strengthWorkout().intensity || 0).split(',')
    const shouldMapByIndex = setSchemes.length === (strengthWorkout().exercises || []).length
    
    const intensityIndex = shouldMapByIndex ? exerciseIndex : schemeIndex
    const intensity = parseInt(intensities[intensityIndex] || intensities[0])
    
    return { intensity, shouldMapByIndex }
  }

  // Helper function to check if a set is completed
  const isSetCompleted = (key: string) => Boolean(state.completedSets[key])
</script>

{#if workout.type === 'strength' || workout.type === 'hypertrophy'}
  <div class="space-y-4">
    <!-- Rest Timer -->
    {#if state.restTimer.isActive}
      {@const progressPercent = ((state.restTimer.totalTime - state.restTimer.timeLeft) / state.restTimer.totalTime) * 100}
      {@const isExtendedPhase = state.restTimer.phase === 'extended'}
      {@const minutes = Math.floor(state.restTimer.timeLeft / 60)}
      {@const seconds = state.restTimer.timeLeft % 60}
      
      <div class="mb-4 p-4 bg-white rounded-lg border-2 border-orange-200">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <Clock class="w-5 h-5 text-orange-600" />
            <span class="text-sm font-semibold text-gray-700">
              {isExtendedPhase ? 'Extended Rest' : 'Rest Time'}
            </span>
          </div>
          <div class="text-lg font-bold text-gray-900">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>
        
        <div class="mb-3">
          <div class="bg-gray-200 h-3 rounded-full overflow-hidden">
            <div 
              class="h-full transition-all duration-300 {isExtendedPhase ? 'bg-red-500' : 'bg-orange-500'}"
              style="width: {progressPercent}%"
            ></div>
          </div>
        </div>
        
        <div class="flex gap-2">
          <button
            onclick={stopRestTimer}
            class="flex-1 {state.restTimer.timeLeft === 0 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-500 hover:bg-gray-600'} text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            {state.restTimer.timeLeft === 0 ? 'Complete Rest' : 'Skip Rest'}
          </button>
          {#if state.restTimer.workoutType === 'strength' && !isExtendedPhase && state.restTimer.timeLeft === 0}
            <button
              onclick={extendRestTimer}
              class="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Extend to 5 min
            </button>
          {/if}
        </div>
      </div>
    {/if}

    {#each (strengthWorkout().exercises || []) as exercise, exerciseIndex}
      {@const setSchemes = (strengthWorkout().sets || '').split(',')}
      {@const exerciseSetSchemes = getExerciseData(exerciseIndex, 0).shouldMapByIndex ? [setSchemes[exerciseIndex]] : setSchemes}
      
      {#each exerciseSetSchemes as setScheme, schemeIndex}
        {@const { intensity } = getExerciseData(exerciseIndex, schemeIndex)}
        {@const weight = strengthWorkout().type === 'strength' ? 
          calculateWeight(exercise, intensity, state) : 
          calculateHypertrophyWeight(exercise, intensity, state)}
        {@const [sets, reps] = setScheme.split('x')}
        {@const warmupSets = strengthWorkout().type === 'strength' && weight > 0 ? calculateWarmupSets(exercise, weight, state) : []}
        
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
                  {@const warmupKey = `warmup-${exerciseIndex}-${schemeIndex}-${warmupIndex}-0`}
                  
                  <div class="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div class="flex items-center gap-3">
                      <span class="text-xs font-medium text-blue-700 w-16">Warm-up {warmupIndex + 1}</span>
                      <span class="text-sm text-blue-800">{warmupSet.reps} reps @ {warmupSet.weight} {state.weightUnit}</span>
                    </div>
                    <button
                      onclick={() => onToggleSet(`warmup-${exerciseIndex}-${schemeIndex}-${warmupIndex}`, 0)}
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
                      step={state.weightUnit === 'kg' ? '2.5' : '5'}
                    />
                  {/if}
                  <button
                    onclick={() => onToggleSet(`${exerciseIndex}-${schemeIndex}`, setIndex)}
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