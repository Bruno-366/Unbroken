<script lang="ts">
  import type { Workout, CardioWorkout } from '$lib/types'
  import { Play, Pause, Square, SkipForward, CheckCircle } from 'lucide-svelte'
  import { showRestCompleteNotification } from '$lib/utils'

  interface HIITWorkoutProps {
    workout: Workout
    onCompleteWorkout: () => void
  }

  let { workout, onCompleteWorkout }: HIITWorkoutProps = $props()

  // Derive cardio workout with proper typing
  const cardioWorkout = $derived(() => workout as CardioWorkout)

  // HIIT timer state - using runes for reactive state management
  let hiitTimer = $state({
    isActive: false,
    isPaused: false,
    timeLeft: 0,
    totalTime: 0,
    startTime: 0,
    pausedTime: 0,
    currentRound: 0,
    totalRounds: 0,
    roundCompleted: false
  })

  // HIIT timer functions
  const startTimer = () => {
    const { duration, rounds } = workoutData()
    if (!rounds) return
    
    // Use -1 duration for rounds-only workouts (Hill Sprints)
    const effectiveDuration = duration ?? -1
    
    const now = Date.now()
    if (hiitTimer.isPaused) {
      hiitTimer.isActive = true
      hiitTimer.isPaused = false
      hiitTimer.startTime = now - (hiitTimer.totalTime - hiitTimer.timeLeft) * 1000
    } else if (hiitTimer.currentRound === 0) {
      Object.assign(hiitTimer, {
        isActive: effectiveDuration > 0, isPaused: false, 
        timeLeft: effectiveDuration > 0 ? effectiveDuration : 0, 
        totalTime: effectiveDuration > 0 ? effectiveDuration : 0,
        startTime: now, pausedTime: 0, currentRound: 1, totalRounds: rounds, 
        roundCompleted: effectiveDuration === -1
      })
    } else {
      Object.assign(hiitTimer, {
        isActive: effectiveDuration > 0, isPaused: false, 
        timeLeft: effectiveDuration > 0 ? effectiveDuration : 0, 
        totalTime: effectiveDuration > 0 ? effectiveDuration : 0,
        startTime: now, pausedTime: 0, 
        roundCompleted: effectiveDuration === -1
      })
    }
  }

  const pauseTimer = () => {
    hiitTimer.isActive = false
    hiitTimer.isPaused = true
    hiitTimer.pausedTime = Date.now()
  }

  const stopTimer = () => {
    Object.assign(hiitTimer, {
      isActive: false, isPaused: false, timeLeft: 0, totalTime: 0,
      startTime: 0, pausedTime: 0, currentRound: 0, totalRounds: 0, roundCompleted: false
    })
  }

  const completeCurrentRound = () => {
    if (hiitTimer.currentRound < hiitTimer.totalRounds) {
      // For rounds-only workouts, directly advance to next round
      if (workoutData().duration === undefined) {
        hiitTimer.currentRound++
        hiitTimer.roundCompleted = true
      } else {
        Object.assign(hiitTimer, {
          isActive: false, isPaused: false, currentRound: hiitTimer.currentRound + 1,
          roundCompleted: true, timeLeft: 0
        })
      }
    } else {
      Object.assign(hiitTimer, {
        isActive: false, isPaused: false, roundCompleted: true, timeLeft: 0
      })
    }
  }

  // Timer interval effect - timestamp-based to prevent background throttling
  $effect(() => {
    let interval: number | undefined
    
    if (hiitTimer.isActive && hiitTimer.timeLeft > 0) {
      interval = setInterval(() => {
        const now = Date.now()
        const elapsedSeconds = Math.floor((now - hiitTimer.startTime) / 1000)
        const newTimeLeft = Math.max(0, hiitTimer.totalTime - elapsedSeconds)
        
        hiitTimer.timeLeft = newTimeLeft
      }, 100) // Check more frequently for smoother updates
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  })

  // Timer completion effect
  $effect(() => {
    if (hiitTimer.isActive && hiitTimer.timeLeft === 0) {
      showRestCompleteNotification()
      completeCurrentRound()
    }
  })

  // Derived display values
  const workoutData = $derived(() => cardioWorkout())
  const hasRounds = $derived(() => workoutData().rounds !== undefined)
  const workoutComplete = $derived(() => hiitTimer.totalRounds > 0 && hiitTimer.currentRound > hiitTimer.totalRounds)
  
  const displayTime = $derived(() => {
    // Don't show time for rounds-only workouts
    if (workoutData().duration === undefined) return undefined
    
    if (hiitTimer.isActive || hiitTimer.isPaused || hiitTimer.timeLeft > 0) {
      const minutes = Math.floor(hiitTimer.timeLeft / 60)
      const seconds = hiitTimer.timeLeft % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
    return workoutData().duration
  })

  const roundDisplay = $derived(() => {
    if (!hasRounds()) return ''
    return hiitTimer.totalRounds > 0 
      ? `Round ${hiitTimer.currentRound} of ${hiitTimer.totalRounds}`
      : `${workoutData().rounds} rounds`
  })

  // Button states for conditional logic only (no styling)
  const buttonStates = $derived(() => {
    const startDisabled = hiitTimer.isActive
    const pauseDisabled = !hiitTimer.isActive || workoutData().duration === undefined
    const stopDisabled = !hiitTimer.isActive && !hiitTimer.isPaused && hiitTimer.currentRound === 0
    const nextDisabled = hiitTimer.isActive || hiitTimer.currentRound === 0 || workoutComplete()
    
    return {
      start: {
        disabled: startDisabled,
        text: hiitTimer.currentRound === 0 ? 'Start Round 1' : 
              hiitTimer.roundCompleted ? `Start Round ${hiitTimer.currentRound}` : 'Resume Round'
      },
      pause: {
        disabled: pauseDisabled
      },
      stop: {
        disabled: stopDisabled
      },
      nextRound: {
        disabled: nextDisabled
      }
    }
  })
</script>

<div>
  <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-lg text-center">
    <h3 class="text-2xl font-bold mb-2">{workoutData().activity}</h3>
    
    {#if displayTime() !== undefined}
      <div class="text-4xl font-bold">{displayTime()}</div>
      <div class="text-sm opacity-90 mt-1">seconds</div>
    {/if}
    
    {#if workoutData().distance !== undefined}
      <div class="text-4xl font-bold">{workoutData().distance}</div>
      <div class="text-sm opacity-90 mt-1">m</div>
    {/if}
    
    {#if hasRounds()}
      <div class="text-2xl font-semibold mt-2">{roundDisplay()}</div>
    {/if}
    
    {#if workoutComplete()}
      <div class="text-green-300 text-lg font-semibold mt-2 flex items-center justify-center gap-2">
        <CheckCircle class="w-6 h-6" />
        All Rounds Complete!
      </div>
    {/if}
  </div>
  
  {#if hasRounds()}
    {@const states = buttonStates()}
    
    <!-- Unified HIIT controls for all workout types -->
    <div class="flex gap-2 mt-4">
      <button 
        onclick={states.start?.disabled ? undefined : startTimer} 
        disabled={states.start?.disabled} 
        class="btn-start {states.start?.disabled ? 'disabled' : ''}"
      >
        <Play class="w-5 h-5" stroke="none" fill="currentColor" />
        {states.start?.text}
      </button>
      {#if workoutData().duration !== undefined && states.pause}
        <button 
          onclick={states.pause?.disabled ? undefined : pauseTimer} 
          disabled={states.pause?.disabled} 
          class="btn-pause {states.pause?.disabled ? 'disabled' : ''}"
        >
          <Pause class="w-5 h-5" stroke="none" fill="currentColor" />
          Pause
        </button>
      {/if}
      <button 
        onclick={states.stop?.disabled ? undefined : stopTimer} 
        disabled={states.stop?.disabled} 
        class="btn-stop {states.stop?.disabled ? 'disabled' : ''}"
      >
        <Square class="w-5 h-5" stroke="none" fill="currentColor" />
        Reset
      </button>
    </div>
    
    {#if hiitTimer.roundCompleted && !workoutComplete() && states.nextRound && workoutData().duration !== undefined}
      <div class="mt-4">
        <button 
          onclick={states.nextRound?.disabled ? undefined : startTimer} 
          disabled={states.nextRound?.disabled} 
          class="btn-next-round {states.nextRound?.disabled ? 'disabled' : ''}"
        >
          <SkipForward class="w-5 h-5" stroke="none" fill="currentColor" />
          Start Round {hiitTimer.currentRound}
        </button>
      </div>
    {/if}
  {/if}
  
  <button 
    onclick={onCompleteWorkout} 
    class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors mt-4"
  >
    Complete HIIT Cardio
  </button>
</div>

<style>
  .btn-start,
  .btn-pause,
  .btn-stop,
  .btn-next-round {
    font-weight: 600;
    padding: 0.75rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: white;
  }

  .btn-start {
    flex: 1;
    background-color: #22c55e; /* green-500 */
  }

  .btn-start:not(.disabled):hover {
    background-color: #16a34a; /* green-600 */
  }

  .btn-pause {
    flex: 1;
    background-color: #eab308; /* yellow-500 */
  }

  .btn-pause:not(.disabled):hover {
    background-color: #ca8a04; /* yellow-600 */
  }

  .btn-stop {
    flex: 1;
    background-color: #ef4444; /* red-500 */
  }

  .btn-stop:not(.disabled):hover {
    background-color: #dc2626; /* red-600 */
  }

  .btn-next-round {
    width: 100%;
    background-color: #3b82f6; /* blue-500 */
  }

  .btn-next-round:not(.disabled):hover {
    background-color: #2563eb; /* blue-600 */
  }

  .disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>