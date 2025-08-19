<script lang="ts">
  import { Play, Pause, RotateCcw, Timer } from 'lucide-svelte'
  import { showRestCompleteNotification } from '../utils'

  interface RestTimerProps {
    isActive: boolean
    timeLeft: number
    totalTime: number
    workoutType: 'strength' | 'hypertrophy' | null
    phase: 'initial' | 'extended'
    startTime: number
  }

  let { 
    isActive = $bindable(), 
    timeLeft = $bindable(), 
    totalTime = $bindable(), 
    workoutType = $bindable(), 
    phase = $bindable(), 
    startTime = $bindable() 
  }: RestTimerProps = $props()

  // Local timer state for UI interactions
  let timerInterval: number | null = $state(null)
  let isPaused = $state(false)

  // Start timer automatically when isActive becomes true
  $effect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      startTimer()
    } else if (!isActive || isPaused || timeLeft <= 0) {
      stopTimer()
    }

    // Cleanup on unmount
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
      }
    }
  })

  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval)
    
    timerInterval = window.setInterval(() => {
      if (timeLeft > 0) {
        timeLeft -= 1
      } else {
        // Timer completed
        stopTimer()
        handleTimerComplete()
      }
    }, 1000)
  }

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  const handleTimerComplete = async () => {
    await showRestCompleteNotification()
    
    if (phase === 'initial') {
      // Extend timer for additional rest if needed
      phase = 'extended'
      timeLeft = 60 // 1 minute extension
    } else {
      // Reset timer
      resetTimer()
    }
  }

  const toggleTimer = () => {
    isPaused = !isPaused
  }

  const resetTimer = () => {
    isActive = false
    timeLeft = 0
    totalTime = 0
    workoutType = null
    phase = 'initial'
    startTime = 0
    isPaused = false
    stopTimer()
  }

  const addTime = (seconds: number) => {
    timeLeft += seconds
    if (totalTime < timeLeft) {
      totalTime = timeLeft
    }
  }

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress percentage
  const progressPercentage = $derived(() => {
    if (totalTime === 0) return 0
    return ((totalTime - timeLeft) / totalTime) * 100
  })

  // Get timer color based on time left and phase
  const getTimerColor = () => {
    if (timeLeft <= 10) return 'text-red-500'
    if (phase === 'extended') return 'text-orange-500'
    if (workoutType === 'strength') return 'text-blue-500'
    return 'text-green-500'
  }
</script>

{#if isActive}
  <div class="fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-4 min-w-[280px] z-50">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <Timer class="w-5 h-5 text-gray-600" />
        <span class="font-semibold text-gray-800">Rest Timer</span>
        {#if workoutType}
          <span class="text-xs bg-gray-100 px-2 py-1 rounded-full capitalize">
            {workoutType}
          </span>
        {/if}
      </div>
      <button
        onclick={resetTimer}
        class="p-1 hover:bg-gray-100 rounded-full transition-colors"
        title="Reset timer"
      >
        <RotateCcw class="w-4 h-4 text-gray-500" />
      </button>
    </div>

    <!-- Progress bar -->
    <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
      <div 
        class="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
        style="width: {progressPercentage}%"
      ></div>
    </div>

    <!-- Time display -->
    <div class="text-center mb-4">
      <div class="text-3xl font-bold {getTimerColor()} font-mono">
        {formatTime(timeLeft)}
      </div>
      {#if phase === 'extended'}
        <div class="text-xs text-orange-600 font-medium">Extended Rest</div>
      {/if}
    </div>

    <!-- Controls -->
    <div class="flex gap-2">
      <button
        onclick={toggleTimer}
        class="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-colors {
          isPaused 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-yellow-500 hover:bg-yellow-600 text-white'
        }"
      >
        {#if isPaused}
          <Play class="w-4 h-4" />
          Resume
        {:else}
          <Pause class="w-4 h-4" />
          Pause
        {/if}
      </button>
      
      <button
        onclick={() => addTime(30)}
        class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm"
        title="Add 30 seconds"
      >
        +30s
      </button>
      
      <button
        onclick={() => addTime(60)}
        class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm"
        title="Add 1 minute"
      >
        +1m
      </button>
    </div>

    {#if timeLeft <= 10 && timeLeft > 0}
      <div class="text-center mt-2 text-red-600 font-semibold text-sm animate-pulse">
        Almost done!
      </div>
    {/if}
  </div>
{/if}

<style>
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .animate-pulse {
    animation: pulse 1s infinite;
  }
</style>