<script lang="ts">
  import { showRestCompleteNotification } from '../utils'
  import type { AppState } from '../types'

  interface Props {
    restTimer: AppState['restTimer']
  }

  let { restTimer = $bindable() }: Props = $props()

  let intervalId: number | null = null

  // Rest timer handlers
  const updateRestTimer = (updates: Partial<typeof restTimer>) => {
    Object.assign(restTimer, updates)
  }

  // Start timer interval when timer becomes active
  $effect(() => {
    if (restTimer.isActive && !intervalId) {
      intervalId = setInterval(() => {
        const now = Date.now()
        const elapsed = Math.floor((now - restTimer.startTime) / 1000)
        const newTimeLeft = Math.max(0, restTimer.totalTime - elapsed)
        
        if (newTimeLeft === 0 && restTimer.phase === 'initial') {
          // Timer completed - show notification and update phase
          showRestCompleteNotification()
          updateRestTimer({ 
            phase: 'extended',
            timeLeft: 0
          })
        } else if (newTimeLeft > 0) {
          updateRestTimer({ timeLeft: newTimeLeft })
        }
      }, 1000)
    } else if (!restTimer.isActive && intervalId) {
      // Clean up interval when timer stops
      clearInterval(intervalId)
      intervalId = null
    }
  })

  // Cleanup interval on component destroy
  $effect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  })

  const handleSkipRest = () => {
    updateRestTimer({
      isActive: false,
      timeLeft: 0,
      totalTime: 0,
      workoutType: null,
      phase: 'initial',
      startTime: 0
    })
  }

  const handleExtendRest = () => {
    const extensionTime = restTimer.workoutType === 'strength' ? 120 : 60 // 2 min for strength, 1 min for hypertrophy
    const now = Date.now()
    
    updateRestTimer({
      totalTime: restTimer.totalTime + extensionTime,
      timeLeft: restTimer.timeLeft + extensionTime,
      startTime: now - (restTimer.totalTime - restTimer.timeLeft),
      phase: 'extended'
    })
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercent = $derived(() => {
    if (restTimer.totalTime === 0) return 0
    return ((restTimer.totalTime - restTimer.timeLeft) / restTimer.totalTime) * 100
  })
</script>

{#if restTimer.isActive}
  <div class="bg-orange-100 border border-orange-300 rounded-lg p-4 mt-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold text-orange-800">Rest Timer</h3>
      <div class="text-lg font-bold text-orange-800">
        {formatTime(restTimer.timeLeft)}
      </div>
    </div>
    
    <div class="bg-orange-200 h-2 rounded-full overflow-hidden mb-3">
      <div 
        class="bg-orange-500 h-full transition-all duration-1000" 
        style="width: {progressPercent()}%"
      ></div>
    </div>
    
    <div class="flex gap-2">
      <button
        onclick={handleSkipRest}
        class="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors"
      >
        {restTimer.phase === 'extended' ? 'Complete Rest' : 'Skip Rest'}
      </button>
      
      {#if restTimer.phase !== 'extended'}
        <button
          onclick={handleExtendRest}
          class="flex-1 bg-orange-200 hover:bg-orange-300 text-orange-800 font-medium py-2 px-3 rounded-lg text-sm transition-colors"
        >
          Extend to {restTimer.workoutType === 'strength' ? '5' : '2.5'} min
        </button>
      {/if}
    </div>
  </div>
{/if}