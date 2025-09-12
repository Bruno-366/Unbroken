<script lang="ts">
  import { Timer, Play, Pause, Square } from 'lucide-svelte'
  import { showRestCompleteNotification } from '../utils'
  import { uiStore } from '../stores'
  
  interface LiSSTimerProps {
    duration: number // Duration in minutes
  }
  
  let { duration }: LiSSTimerProps = $props()
  
  // Access LiSS timer directly from store
  const lissTimer = $derived($uiStore.lissTimer)
  
  // Update store function
  const updateLissTimer = (updates: Partial<typeof lissTimer>) => {
    uiStore.update(state => ({
      ...state,
      lissTimer: { ...state.lissTimer, ...updates }
    }))
  }

  // Start LiSS timer function
  const startLissTimer = () => {
    const durationInSeconds = duration * 60
    const now = Date.now()
    
    if (lissTimer.isPaused) {
      // Resume from pause
      updateLissTimer({
        isActive: true,
        isPaused: false,
        startTime: now - (lissTimer.totalTime - lissTimer.timeLeft) * 1000
      })
    } else {
      // Start fresh
      updateLissTimer({
        isActive: true,
        isPaused: false,
        timeLeft: durationInSeconds,
        totalTime: durationInSeconds,
        startTime: now,
        pausedTime: 0
      })
    }
  }

  // Pause LiSS timer function
  const pauseLissTimer = () => {
    updateLissTimer({
      isActive: false,
      isPaused: true,
      pausedTime: Date.now()
    })
  }

  // Stop LiSS timer function
  const stopLissTimer = () => {
    updateLissTimer({
      isActive: false,
      isPaused: false,
      timeLeft: 0,
      totalTime: 0,
      startTime: 0,
      pausedTime: 0
    })
  }

  // Derived progress percentage
  const progressPercent = $derived(() => {
    if (lissTimer.totalTime === 0) return 0
    return ((lissTimer.totalTime - lissTimer.timeLeft) / lissTimer.totalTime) * 100
  })

  // Timer interval effect - timestamp-based to prevent background throttling
  $effect(() => {
    let interval: number | undefined
    
    if (lissTimer.isActive && lissTimer.timeLeft > 0) {
      interval = setInterval(() => {
        const now = Date.now()
        const elapsedSeconds = Math.floor((now - lissTimer.startTime) / 1000)
        const newTimeLeft = Math.max(0, lissTimer.totalTime - elapsedSeconds)
        
        updateLissTimer({ timeLeft: newTimeLeft })
      }, 100) // Check more frequently for smoother updates
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  })

  // Separate effect to handle notification when timer reaches 0
  $effect(() => {
    if (lissTimer.isActive && lissTimer.timeLeft === 0) {
      showRestCompleteNotification()
      // Auto-pause when complete
      updateLissTimer({ isActive: false, isPaused: false })
    }
  })

  // Derived timer display values
  const minutes = $derived(() => Math.floor(lissTimer.timeLeft / 60))
  const seconds = $derived(() => lissTimer.timeLeft % 60)
  const isTimerActive = $derived(() => lissTimer.isActive || lissTimer.isPaused || lissTimer.timeLeft > 0)
</script>

{#if isTimerActive()}
  <div class="mb-4 p-4 bg-white rounded-lg border-2 border-blue-200">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <Timer class="w-5 h-5 text-blue-600" />
        <span class="text-sm font-semibold text-gray-700">
          LiSS Timer
        </span>
      </div>
      <div class="text-lg font-bold text-gray-900">
        {minutes()}:{seconds().toString().padStart(2, '0')}
      </div>
    </div>
    
    <div class="mb-3">
      <div class="bg-gray-200 h-3 rounded-full overflow-hidden">
        <div 
          class="h-full transition-all duration-300 bg-blue-500"
          style="width: {progressPercent()}%"
        ></div>
      </div>
    </div>
    
    <div class="flex gap-2">
      {#if !lissTimer.isActive && !lissTimer.isPaused}
        <!-- Start button - only show when timer is not started -->
        <button
          onclick={startLissTimer}
          class="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
        >
          <Play class="w-4 h-4" />
          Start
        </button>
      {:else if lissTimer.isActive}
        <!-- Pause button - show when timer is running -->
        <button
          onclick={pauseLissTimer}
          class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
        >
          <Pause class="w-4 h-4" />
          Pause
        </button>
      {:else if lissTimer.isPaused}
        <!-- Resume button - show when timer is paused -->
        <button
          onclick={startLissTimer}
          class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
        >
          <Play class="w-4 h-4" />
          Resume
        </button>
      {/if}
      
      <!-- Stop button - always available when timer exists -->
      <button
        onclick={stopLissTimer}
        class="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
      >
        <Square class="w-4 h-4" />
        Stop
      </button>
    </div>
  </div>
{:else}
  <!-- Start timer button when no timer is active -->
  <div class="mb-4">
    <button
      onclick={startLissTimer}
      class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
    >
      <Timer class="w-5 h-5" />
      Start {duration} min timer
    </button>
  </div>
{/if}