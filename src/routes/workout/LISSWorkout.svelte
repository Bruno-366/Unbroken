<script lang="ts">
  import type { Workout, CardioWorkout } from '$lib/types'
  import { Play, Pause, Square } from 'lucide-svelte'
  import { showRestCompleteNotification } from '$lib/utils'

  interface LISSWorkoutProps {
    workout: Workout
    onCompleteWorkout: () => void
  }

  let { workout, onCompleteWorkout }: LISSWorkoutProps = $props()

  // Derive cardio workout with proper typing
  const cardioWorkout = $derived(() => workout as CardioWorkout)

  // LISS timer state - using runes for reactive state management
  let lissTimer = $state({
    isActive: false,
    isPaused: false,
    timeLeft: 0,
    totalTime: 0,
    startTime: 0,
    pausedTime: 0
  })

  // LISS timer functions
  const startTimer = () => {
    const duration = cardioWorkout().duration
    if (duration === undefined) return
    
    const durationInSeconds = duration * 60
    const now = Date.now()
    
    if (lissTimer.isPaused) {
      // Resume from pause
      lissTimer.isActive = true
      lissTimer.isPaused = false
      lissTimer.startTime = now - (lissTimer.totalTime - lissTimer.timeLeft) * 1000
    } else {
      // Start fresh
      lissTimer.isActive = true
      lissTimer.isPaused = false
      lissTimer.timeLeft = durationInSeconds
      lissTimer.totalTime = durationInSeconds
      lissTimer.startTime = now
      lissTimer.pausedTime = 0
    }
  }

  const pauseTimer = () => {
    lissTimer.isActive = false
    lissTimer.isPaused = true
    lissTimer.pausedTime = Date.now()
  }

  const stopTimer = () => {
    lissTimer.isActive = false
    lissTimer.isPaused = false
    lissTimer.timeLeft = 0
    lissTimer.totalTime = 0
    lissTimer.startTime = 0
    lissTimer.pausedTime = 0
  }

  // Timer interval effect - timestamp-based to prevent background throttling
  $effect(() => {
    let interval: number | undefined
    
    if (lissTimer.isActive && lissTimer.timeLeft > 0) {
      interval = setInterval(() => {
        const now = Date.now()
        const elapsedSeconds = Math.floor((now - lissTimer.startTime) / 1000)
        const newTimeLeft = Math.max(0, lissTimer.totalTime - elapsedSeconds)
        
        lissTimer.timeLeft = newTimeLeft
      }, 100) // Check more frequently for smoother updates
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  })

  // Timer completion effect
  $effect(() => {
    if (lissTimer.isActive && lissTimer.timeLeft === 0) {
      showRestCompleteNotification()
      // Auto-pause when complete
      lissTimer.isActive = false
      lissTimer.isPaused = false
    }
  })

  // Derived timer display values
  const displayDuration = $derived(() => {
    if (cardioWorkout().duration !== undefined) {
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
    return cardioWorkout().duration !== undefined
  })

  // Button states for conditional logic only (no styling)
  const buttonStates = $derived(() => {
    const isStartDisabled = lissTimer.isActive
    const isPauseDisabled = !lissTimer.isActive
    const isStopDisabled = !lissTimer.isActive && !lissTimer.isPaused
    
    return {
      start: {
        disabled: isStartDisabled
      },
      pause: {
        disabled: isPauseDisabled
      },
      stop: {
        disabled: isStopDisabled
      }
    }
  })
</script>

<div>
  <div class="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-lg text-center">
    <h3 class="text-2xl font-bold mb-2">
      {cardioWorkout().activity}
    </h3>
    {#if cardioWorkout().duration !== undefined}
      <div class="text-4xl font-bold">
        {displayDuration()}
      </div>
      <div class="text-sm opacity-90 mt-1">minutes</div>
    {/if}
    {#if cardioWorkout().distance !== undefined}
      <div class="text-4xl font-bold">{cardioWorkout().distance}</div>
      <div class="text-sm opacity-90 mt-1">km</div>
    {/if}
    {#if cardioWorkout().rounds !== undefined}
      <div class="text-2xl font-semibold mt-2">
        {cardioWorkout().rounds} rounds
      </div>
    {/if}
  </div>
  
  {#if showTimerControls()}
    <!-- LISS Timer control buttons -->
    <div class="flex gap-2 mt-4">
      <button 
        onclick={buttonStates().start?.disabled ? undefined : startTimer} 
        disabled={buttonStates().start?.disabled}
        class="btn-start {buttonStates().start?.disabled ? 'disabled' : ''}"
      >
        <Play class="w-5 h-5" stroke="none" fill="currentColor" />
        Start
      </button>
      <button 
        onclick={buttonStates().pause?.disabled ? undefined : pauseTimer} 
        disabled={buttonStates().pause?.disabled}
        class="btn-pause {buttonStates().pause?.disabled ? 'disabled' : ''}"
      >
        <Pause class="w-5 h-5" stroke="none" fill="currentColor" />
        Pause
      </button>
      <button 
        onclick={buttonStates().stop?.disabled ? undefined : stopTimer} 
        disabled={buttonStates().stop?.disabled}
        class="btn-stop {buttonStates().stop?.disabled ? 'disabled' : ''}"
      >
        <Square class="w-5 h-5" stroke="none" fill="currentColor" />
        Stop
      </button>
    </div>
  {/if}
  
  <button 
    onclick={onCompleteWorkout} 
    class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors mt-4"
  >
    Complete LISS Cardio
  </button>
</div>

<style>
  .btn-start,
  .btn-pause,
  .btn-stop {
    flex: 1;
    font-weight: 600;
    padding: 0.75rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: white;
    opacity: 1;
  }

  .btn-start {
    background-color: rgb(34 197 94);
  }

  .btn-start:not(.disabled):hover {
    background-color: rgb(22 163 74);
  }

  .btn-pause {
    background-color: rgb(234 179 8);
  }

  .btn-pause:not(.disabled):hover {
    background-color: rgb(202 138 4);
  }

  .btn-stop {
    background-color: rgb(239 68 68);
  }

  .btn-stop:not(.disabled):hover {
    background-color: rgb(220 38 38);
  }

  .disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>