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
    
    // Rounds-only workouts (Hill Sprints)
    if (!duration) {
      if (hiitTimer.currentRound === 0) {
        Object.assign(hiitTimer, {
          isActive: false, isPaused: false, timeLeft: 0, totalTime: 0,
          startTime: 0, pausedTime: 0, currentRound: 1, totalRounds: rounds, roundCompleted: true
        })
      } else if (hiitTimer.currentRound < hiitTimer.totalRounds) {
        hiitTimer.currentRound++
        hiitTimer.roundCompleted = true
      }
      return
    }
    
    // Timed workouts
    const now = Date.now()
    if (hiitTimer.isPaused) {
      hiitTimer.isActive = true
      hiitTimer.isPaused = false
      hiitTimer.startTime = now - (hiitTimer.totalTime - hiitTimer.timeLeft) * 1000
    } else if (hiitTimer.currentRound === 0) {
      Object.assign(hiitTimer, {
        isActive: true, isPaused: false, timeLeft: duration, totalTime: duration,
        startTime: now, pausedTime: 0, currentRound: 1, totalRounds: rounds, roundCompleted: false
      })
    } else {
      Object.assign(hiitTimer, {
        isActive: true, isPaused: false, timeLeft: duration, totalTime: duration,
        startTime: now, pausedTime: 0, roundCompleted: false
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
      Object.assign(hiitTimer, {
        isActive: false, isPaused: false, currentRound: hiitTimer.currentRound + 1,
        roundCompleted: true, timeLeft: 0
      })
    } else {
      Object.assign(hiitTimer, {
        isActive: false, isPaused: false, roundCompleted: true, timeLeft: 0
      })
    }
  }

  const markRoundComplete = () => {
    if (isRoundsOnly()) completeCurrentRound()
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
  const isRoundsOnly = $derived(() => workoutData().duration === undefined && hasRounds())
  const workoutComplete = $derived(() => hiitTimer.totalRounds > 0 && hiitTimer.currentRound > hiitTimer.totalRounds)
  
  const displayTime = $derived(() => {
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
    if (isRoundsOnly()) {
      const startDisabled = workoutComplete()
      const completeDisabled = hiitTimer.currentRound === 0 || workoutComplete()
      
      return {
        start: {
          disabled: startDisabled,
          text: hiitTimer.currentRound === 0 ? 'Start Round 1' : 
                workoutComplete() ? 'Workout Complete' : `Start Round ${hiitTimer.currentRound}`
        },
        complete: {
          disabled: completeDisabled
        },
        stop: {
          disabled: hiitTimer.currentRound === 0
        }
      }
    }
    
    // Timed workouts
    const startDisabled = hiitTimer.isActive
    const pauseDisabled = !hiitTimer.isActive
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
    
    {#if workoutData().duration !== undefined}
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
    
    {#if isRoundsOnly()}
      <!-- Rounds-only HIIT controls -->
      <div class="flex gap-2 mt-4">
        <button 
          onclick={states.start?.disabled ? undefined : startTimer} 
          disabled={states.start?.disabled} 
          class="btn-start {states.start?.disabled ? 'disabled' : ''}"
        >
          <Play class="w-5 h-5" stroke="none" fill="currentColor" />
          {states.start?.text}
        </button>
        {#if hiitTimer.currentRound > 0 && !workoutComplete() && states.complete}
          <button 
            onclick={states.complete?.disabled ? undefined : markRoundComplete} 
            disabled={states.complete?.disabled} 
            class="btn-complete {states.complete?.disabled ? 'disabled' : ''}"
          >
            <CheckCircle class="w-5 h-5" stroke="none" fill="currentColor" />
            Complete Round {hiitTimer.currentRound}
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
    {:else}
      <!-- Timed HIIT controls -->
      <div class="flex gap-2 mt-4">
        <button 
          onclick={states.start?.disabled ? undefined : startTimer} 
          disabled={states.start?.disabled} 
          class="btn-start {states.start?.disabled ? 'disabled' : ''}"
        >
          <Play class="w-5 h-5" stroke="none" fill="currentColor" />
          {states.start?.text}
        </button>
        {#if states.pause}
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
      
      {#if hiitTimer.roundCompleted && !workoutComplete() && states.nextRound}
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
  .btn-complete,
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
    opacity: 1;
  }

  .btn-start {
    flex: 1;
    background-color: rgb(34 197 94);
  }

  .btn-start:not(.disabled):hover {
    background-color: rgb(22 163 74);
  }

  .btn-pause {
    flex: 1;
    background-color: rgb(234 179 8);
  }

  .btn-pause:not(.disabled):hover {
    background-color: rgb(202 138 4);
  }

  .btn-stop {
    flex: 1;
    background-color: rgb(239 68 68);
  }

  .btn-stop:not(.disabled):hover {
    background-color: rgb(220 38 38);
  }

  .btn-complete {
    flex: 1;
    background-color: rgb(59 130 246);
  }

  .btn-complete:not(.disabled):hover {
    background-color: rgb(37 99 235);
  }

  .btn-next-round {
    width: 100%;
    background-color: rgb(59 130 246);
  }

  .btn-next-round:not(.disabled):hover {
    background-color: rgb(37 99 235);
  }

  .disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>