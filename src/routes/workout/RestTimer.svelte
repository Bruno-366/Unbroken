<script lang="ts">
  import { Clock } from 'lucide-svelte'
  import { showRestCompleteNotification } from '$lib/utils'

  interface RestTimerProps {
    workoutType: 'strength' | 'hypertrophy'
    onStop: () => void
  }

  let { workoutType, onStop }: RestTimerProps = $props()

  // Local rest timer state using runes - managed internally
  let restTimer = $state({
    isActive: false,
    timeLeft: 0,
    totalTime: 0,
    phase: 'initial' as 'initial' | 'extended',
    startTime: 0
  })

  // Start the rest timer
  export const start = () => {
    const initialTime = workoutType === 'strength' ? 180 : 90 // 3 min for strength, 1.5 min for hypertrophy
    const now = Date.now()
    
    restTimer.isActive = true
    restTimer.timeLeft = initialTime
    restTimer.totalTime = initialTime
    restTimer.phase = 'initial'
    restTimer.startTime = now
  }

  // Extend rest timer function - matching original React implementation
  const extendRestTimer = () => {
    if (workoutType === 'strength' && restTimer.phase === 'initial') {
      const extendedTime = 120 // Additional 2 minutes to reach 5 minutes total
      const now = Date.now()
      restTimer.timeLeft = extendedTime
      restTimer.totalTime = extendedTime
      restTimer.phase = 'extended'
      restTimer.startTime = now
    }
  }

  // Stop rest timer function
  const stopRestTimer = () => {
    restTimer.isActive = false
    restTimer.timeLeft = 0
    restTimer.totalTime = 0
    restTimer.phase = 'initial'
    restTimer.startTime = 0
    onStop()
  }

  // Derived progress percentage
  const progressPercent = $derived(() => {
    if (restTimer.totalTime === 0) return 0
    return ((restTimer.totalTime - restTimer.timeLeft) / restTimer.totalTime) * 100
  })

  // Timer interval effect - timestamp-based to prevent background throttling
  $effect(() => {
    let interval: number | undefined
    
    if (restTimer.isActive && restTimer.timeLeft > 0) {
      interval = setInterval(() => {
        const now = Date.now()
        const elapsedSeconds = Math.floor((now - restTimer.startTime) / 1000)
        const newTimeLeft = Math.max(0, restTimer.totalTime - elapsedSeconds)
        
        restTimer.timeLeft = newTimeLeft
      }, 100) // Check more frequently for smoother updates
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  })

  // Separate effect to handle notification when timer reaches 0
  $effect(() => {
    if (restTimer.isActive && restTimer.timeLeft === 0) {
      showRestCompleteNotification()
    }
  })
</script>

{#if restTimer.isActive}
  <div class="mb-4 p-4 bg-white rounded-lg border-2 border-orange-200">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <Clock class="w-5 h-5 text-orange-600" />
        <span class="text-sm font-semibold text-gray-700">
          {restTimer.phase === 'extended' ? 'Extended Rest' : 'Rest Time'}
        </span>
      </div>
      <div class="text-lg font-bold text-gray-900">
        {Math.floor(restTimer.timeLeft / 60)}:{(restTimer.timeLeft % 60).toString().padStart(2, '0')}
      </div>
    </div>
    
    <div class="mb-3">
      <div class="bg-gray-200 h-3 rounded-full overflow-hidden">
        <div 
          class="h-full transition-all duration-300 {restTimer.phase === 'extended' ? 'bg-red-500' : 'bg-orange-500'}"
          style="width: {progressPercent()}%"
        ></div>
      </div>
    </div>
    
    <div class="flex gap-2">
      <button
        onclick={stopRestTimer}
        class="flex-1 {restTimer.timeLeft === 0 
          ? 'bg-green-500 hover:bg-green-600' 
          : 'bg-gray-500 hover:bg-gray-600'} text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
      >
        {restTimer.timeLeft === 0 ? 'Complete Rest' : 'Skip Rest'}
      </button>
      {#if workoutType === 'strength' && restTimer.phase !== 'extended' && restTimer.timeLeft === 0}
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