<script lang="ts">
  import { Clock } from 'lucide-svelte'
  import { showRestCompleteNotification } from '$lib/utils'

  interface RestTimerProps {
    isActive: boolean
    timeLeft: number
    totalTime: number
    workoutType: 'strength' | 'hypertrophy' | null
    phase: 'initial' | 'extended'
    startTime: number
    onUpdate: (updates: Partial<RestTimerState>) => void
    onStop: () => void
  }

  interface RestTimerState {
    isActive: boolean
    timeLeft: number
    totalTime: number
    workoutType: 'strength' | 'hypertrophy' | null
    phase: 'initial' | 'extended'
    startTime: number
  }

  let { 
    isActive, 
    timeLeft, 
    totalTime, 
    workoutType, 
    phase, 
    startTime, 
    onUpdate, 
    onStop 
  }: RestTimerProps = $props()

  // Extend rest timer function - matching original React implementation
  const extendRestTimer = () => {
    if (workoutType === 'strength' && phase === 'initial') {
      const extendedTime = 120 // Additional 2 minutes to reach 5 minutes total
      const now = Date.now()
      onUpdate({
        timeLeft: extendedTime,
        totalTime: extendedTime,
        phase: 'extended',
        startTime: now
      })
    }
  }

  // Derived progress percentage
  const progressPercent = $derived(() => {
    if (totalTime === 0) return 0
    return ((totalTime - timeLeft) / totalTime) * 100
  })

  // Timer interval effect - timestamp-based to prevent background throttling
  $effect(() => {
    let interval: number | undefined
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        const now = Date.now()
        const elapsedSeconds = Math.floor((now - startTime) / 1000)
        const newTimeLeft = Math.max(0, totalTime - elapsedSeconds)
        
        onUpdate({ timeLeft: newTimeLeft })
      }, 100) // Check more frequently for smoother updates
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  })

  // Separate effect to handle notification when timer reaches 0
  $effect(() => {
    if (isActive && timeLeft === 0) {
      showRestCompleteNotification()
    }
  })
</script>

{#if isActive}
  <div class="mb-4 p-4 bg-white rounded-lg border-2 border-orange-200">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <Clock class="w-5 h-5 text-orange-600" />
        <span class="text-sm font-semibold text-gray-700">
          {phase === 'extended' ? 'Extended Rest' : 'Rest Time'}
        </span>
      </div>
      <div class="text-lg font-bold text-gray-900">
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </div>
    </div>
    
    <div class="mb-3">
      <div class="bg-gray-200 h-3 rounded-full overflow-hidden">
        <div 
          class="h-full transition-all duration-300 {phase === 'extended' ? 'bg-red-500' : 'bg-orange-500'}"
          style="width: {progressPercent()}%"
        ></div>
      </div>
    </div>
    
    <div class="flex gap-2">
      <button
        onclick={onStop}
        class="flex-1 {timeLeft === 0 
          ? 'bg-green-500 hover:bg-green-600' 
          : 'bg-gray-500 hover:bg-gray-600'} text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
      >
        {timeLeft === 0 ? 'Complete Rest' : 'Skip Rest'}
      </button>
      {#if workoutType === 'strength' && phase !== 'extended' && timeLeft === 0}
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