<script lang="ts">
  import type { Workout, CardioWorkout } from '../types'
  import { Play, Pause, Square } from 'lucide-svelte'
  import { showRestCompleteNotification } from '../utils'
  import { uiStore } from '../stores'

  interface CardioWorkoutsProps {
    workout: Workout
    onCompleteWorkout: () => void
  }

  let { workout, onCompleteWorkout }: CardioWorkoutsProps = $props()

  // Lookup tables for cardio workout configurations
  const CARDIO_WORKOUT_CONFIGS = {
    liss: { 
      bg: 'from-green-500 to-blue-500', 
      button: 'Complete LISS Cardio' 
    },
    hiit: { 
      bg: 'from-orange-500 to-red-500', 
      button: 'Complete HIIT Cardio' 
    }
  } as const

  // Derive cardio workout with proper typing
  const cardioWorkout = $derived(() => workout as CardioWorkout)
  
  // Derive config based on workout type
  const config = $derived(() => {
    const type = cardioWorkout().type
    return CARDIO_WORKOUT_CONFIGS[type as keyof typeof CARDIO_WORKOUT_CONFIGS]
  })

  // LiSS Timer functionality
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
    const duration = cardioWorkout().duration as number
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
  const displayDuration = $derived(() => {
    if (workout.type === 'liss' && typeof cardioWorkout().duration === 'number') {
      if (lissTimer.isActive || lissTimer.isPaused || lissTimer.timeLeft > 0) {
        // Show countdown timer
        const minutes = Math.floor(lissTimer.timeLeft / 60)
        const seconds = lissTimer.timeLeft % 60
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
      } else {
        // Show initial duration
        return cardioWorkout().duration
      }
    }
    return cardioWorkout().duration
  })

  const showTimerControls = $derived(() => {
    return workout.type === 'liss' && typeof cardioWorkout().duration === 'number'
  })
</script>

{#if workout.type === 'liss' || workout.type === 'hiit'}
  <div>
    <div class="bg-gradient-to-r {config().bg} text-white p-6 rounded-lg text-center">
      <h3 class="text-2xl font-bold mb-2">
        {cardioWorkout().activity}
      </h3>
      {#if cardioWorkout().duration}
        <div class="text-4xl font-bold">{displayDuration()}</div>
        {#if typeof cardioWorkout().duration === 'number'}
          <div class="text-sm opacity-90 mt-1">minutes</div>
        {/if}
      {/if}
    </div>
    
    {#if showTimerControls()}
      <!-- Timer control buttons -->
      <div class="flex gap-2 mt-4">
        <button 
          onclick={startLissTimer} 
          class="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Play class="w-4 h-4" />
          Start
        </button>
        <button 
          onclick={pauseLissTimer} 
          class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Pause class="w-4 h-4" />
          Pause
        </button>
        <button 
          onclick={stopLissTimer} 
          class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Square class="w-4 h-4" />
          Stop
        </button>
      </div>
    {/if}
    
    <button 
      onclick={onCompleteWorkout} 
      class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors mt-4"
    >
      {config().button}
    </button>
  </div>
{/if}