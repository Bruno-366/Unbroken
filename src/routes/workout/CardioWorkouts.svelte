<script lang="ts">
  import type { Workout, CardioWorkout } from '$lib/types'
  import { Play, Pause, Square, SkipForward, CheckCircle } from 'lucide-svelte'
  import { showRestCompleteNotification } from '$lib/utils'
  import { uiStore } from '$lib/stores'

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
  
  // HIIT Timer functionality
  const hiitTimer = $derived($uiStore.hiitTimer)
  
  // Update store functions
  const updateLissTimer = (updates: Partial<typeof lissTimer>) => {
    uiStore.update(state => ({
      ...state,
      lissTimer: { ...state.lissTimer, ...updates }
    }))
  }

  const updateHiitTimer = (updates: Partial<typeof hiitTimer>) => {
    uiStore.update(state => ({
      ...state,
      hiitTimer: { ...state.hiitTimer, ...updates }
    }))
  }

  // Start LiSS timer function
  const startLissTimer = () => {
    const duration = cardioWorkout().duration
    if (duration === undefined) return
    
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

  // HIIT Timer functions
  const startHiitTimer = () => {
    const workout = cardioWorkout()
    const duration = workout.duration
    const rounds = workout.rounds
    
    if (duration === undefined || rounds === undefined) return
    
    const durationInSeconds = duration
    const now = Date.now()
    
    if (hiitTimer.isPaused) {
      // Resume from pause
      updateHiitTimer({
        isActive: true,
        isPaused: false,
        startTime: now - (hiitTimer.totalTime - hiitTimer.timeLeft) * 1000
      })
    } else if (hiitTimer.currentRound === 0) {
      // Start fresh
      updateHiitTimer({
        isActive: true,
        isPaused: false,
        timeLeft: durationInSeconds,
        totalTime: durationInSeconds,
        startTime: now,
        pausedTime: 0,
        currentRound: 1,
        totalRounds: rounds,
        roundCompleted: false
      })
    } else {
      // Continue to next round
      updateHiitTimer({
        isActive: true,
        isPaused: false,
        timeLeft: durationInSeconds,
        totalTime: durationInSeconds,
        startTime: now,
        pausedTime: 0,
        roundCompleted: false
      })
    }
  }

  const pauseHiitTimer = () => {
    updateHiitTimer({
      isActive: false,
      isPaused: true,
      pausedTime: Date.now()
    })
  }

  const stopHiitTimer = () => {
    updateHiitTimer({
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
  }

  const completeCurrentRound = () => {
    if (hiitTimer.currentRound < hiitTimer.totalRounds) {
      updateHiitTimer({
        isActive: false,
        isPaused: false,
        currentRound: hiitTimer.currentRound + 1,
        roundCompleted: true,
        timeLeft: 0
      })
    } else {
      // All rounds completed
      updateHiitTimer({
        isActive: false,
        isPaused: false,
        roundCompleted: true,
        timeLeft: 0
      })
    }
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

  // HIIT Timer interval effect - timestamp-based to prevent background throttling
  $effect(() => {
    let interval: number | undefined
    
    if (hiitTimer.isActive && hiitTimer.timeLeft > 0) {
      interval = setInterval(() => {
        const now = Date.now()
        const elapsedSeconds = Math.floor((now - hiitTimer.startTime) / 1000)
        const newTimeLeft = Math.max(0, hiitTimer.totalTime - elapsedSeconds)
        
        updateHiitTimer({ timeLeft: newTimeLeft })
      }, 100) // Check more frequently for smoother updates
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  })

  // HIIT Timer completion effect
  $effect(() => {
    if (hiitTimer.isActive && hiitTimer.timeLeft === 0) {
      showRestCompleteNotification()
      completeCurrentRound()
    }
  })

  // Derived timer display values
  const displayDuration = $derived(() => {
    if (workout.type === 'liss' && cardioWorkout().duration !== undefined) {
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
    return workout.type === 'liss' && cardioWorkout().duration !== undefined
  })

  const showHiitControls = $derived(() => {
    return workout.type === 'hiit' && cardioWorkout().duration !== undefined && cardioWorkout().rounds !== undefined
  })

  // HIIT timer display values
  const hiitDisplayTime = $derived(() => {
    if (workout.type === 'hiit' && showHiitControls()) {
      if (hiitTimer.isActive || hiitTimer.isPaused || hiitTimer.timeLeft > 0) {
        // Show countdown timer
        const minutes = Math.floor(hiitTimer.timeLeft / 60)
        const seconds = hiitTimer.timeLeft % 60
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
      } else {
        // Show initial duration
        return cardioWorkout().duration
      }
    }
    return cardioWorkout().duration
  })

  const hiitRoundDisplay = $derived(() => {
    if (workout.type === 'hiit' && cardioWorkout().rounds !== undefined) {
      if (hiitTimer.totalRounds > 0) {
        return `Round ${hiitTimer.currentRound} of ${hiitTimer.totalRounds}`
      } else {
        return `${cardioWorkout().rounds} rounds`
      }
    }
    return ''
  })

  const hiitWorkoutComplete = $derived(() => {
    return hiitTimer.totalRounds > 0 && hiitTimer.currentRound > hiitTimer.totalRounds
  })

  // Derived button states for conditional styling
  const buttonStates = $derived(() => {
    const isStartDisabled = lissTimer.isActive
    const isPauseDisabled = !lissTimer.isActive
    const isStopDisabled = !lissTimer.isActive && !lissTimer.isPaused
    
    return {
      start: {
        disabled: isStartDisabled,
        class: isStartDisabled 
          ? 'flex-1 bg-green-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-40 cursor-not-allowed'
          : 'flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-100'
      },
      pause: {
        disabled: isPauseDisabled,
        class: isPauseDisabled
          ? 'flex-1 bg-yellow-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-40 cursor-not-allowed'
          : 'flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-100'
      },
      stop: {
        disabled: isStopDisabled,
        class: isStopDisabled
          ? 'flex-1 bg-red-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-40 cursor-not-allowed'
          : 'flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-100'
      }
    }
  })

  // HIIT button states for conditional styling
  const hiitButtonStates = $derived(() => {
    const isStartDisabled = hiitTimer.isActive
    const isPauseDisabled = !hiitTimer.isActive
    const isStopDisabled = !hiitTimer.isActive && !hiitTimer.isPaused && hiitTimer.currentRound === 0
    const isNextRoundDisabled = hiitTimer.isActive || hiitTimer.currentRound === 0 || hiitWorkoutComplete()
    
    return {
      start: {
        disabled: isStartDisabled,
        text: hiitTimer.currentRound === 0 ? 'Start Round 1' : 
              hiitTimer.roundCompleted ? `Start Round ${hiitTimer.currentRound}` : 'Resume Round',
        class: isStartDisabled 
          ? 'flex-1 bg-green-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-40 cursor-not-allowed'
          : 'flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-100'
      },
      pause: {
        disabled: isPauseDisabled,
        class: isPauseDisabled
          ? 'flex-1 bg-yellow-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-40 cursor-not-allowed'
          : 'flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-100'
      },
      stop: {
        disabled: isStopDisabled,
        class: isStopDisabled
          ? 'flex-1 bg-red-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-40 cursor-not-allowed'
          : 'flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-100'
      },
      nextRound: {
        disabled: isNextRoundDisabled,
        class: isNextRoundDisabled
          ? 'w-full bg-blue-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-40 cursor-not-allowed'
          : 'w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-100'
      }
    }
  })
</script>

{#if workout.type === 'liss' || workout.type === 'hiit'}
  <div>
    <div class="bg-gradient-to-r {config().bg} text-white p-6 rounded-lg text-center">
      <h3 class="text-2xl font-bold mb-2">
        {cardioWorkout().activity}
      </h3>
      {#if cardioWorkout().duration !== undefined}
        <div class="text-4xl font-bold">
          {#if workout.type === 'hiit' && showHiitControls()}
            {hiitDisplayTime()}
          {:else}
            {displayDuration()}
          {/if}
        </div>
        <div class="text-sm opacity-90 mt-1">
          {#if workout.type === 'liss'}
            minutes
          {:else}
            seconds
          {/if}
        </div>
      {/if}
      {#if cardioWorkout().distance !== undefined}
        <div class="text-4xl font-bold">{cardioWorkout().distance}</div>
        <div class="text-sm opacity-90 mt-1">
          {#if workout.type === 'liss'}
            km
          {:else}
            m
          {/if}
        </div>
      {/if}
      {#if cardioWorkout().rounds !== undefined}
        <div class="text-2xl font-semibold mt-2">
          {#if workout.type === 'hiit' && showHiitControls()}
            {hiitRoundDisplay()}
          {:else}
            {cardioWorkout().rounds} rounds
          {/if}
        </div>
      {/if}
      
      {#if workout.type === 'hiit' && hiitWorkoutComplete()}
        <div class="text-green-300 text-lg font-semibold mt-2 flex items-center justify-center gap-2">
          <CheckCircle class="w-6 h-6" />
          All Rounds Complete!
        </div>
      {/if}
    </div>
    
    {#if showTimerControls()}
      <!-- LISS Timer control buttons -->
      <div class="flex gap-2 mt-4">
        <button 
          onclick={buttonStates().start.disabled ? undefined : startLissTimer} 
          disabled={buttonStates().start.disabled}
          class={buttonStates().start.class}
        >
          <Play class="w-5 h-5" stroke="none" fill="currentColor" />
          Start
        </button>
        <button 
          onclick={buttonStates().pause.disabled ? undefined : pauseLissTimer} 
          disabled={buttonStates().pause.disabled}
          class={buttonStates().pause.class}
        >
          <Pause class="w-5 h-5" stroke="none" fill="currentColor" />
          Pause
        </button>
        <button 
          onclick={buttonStates().stop.disabled ? undefined : stopLissTimer} 
          disabled={buttonStates().stop.disabled}
          class={buttonStates().stop.class}
        >
          <Square class="w-5 h-5" stroke="none" fill="currentColor" />
          Stop
        </button>
      </div>
    {/if}
    
    {#if showHiitControls()}
      <!-- HIIT Timer control buttons -->
      <div class="flex gap-2 mt-4">
        <button 
          onclick={hiitButtonStates().start.disabled ? undefined : startHiitTimer} 
          disabled={hiitButtonStates().start.disabled}
          class={hiitButtonStates().start.class}
        >
          <Play class="w-5 h-5" stroke="none" fill="currentColor" />
          {hiitButtonStates().start.text}
        </button>
        <button 
          onclick={hiitButtonStates().pause.disabled ? undefined : pauseHiitTimer} 
          disabled={hiitButtonStates().pause.disabled}
          class={hiitButtonStates().pause.class}
        >
          <Pause class="w-5 h-5" stroke="none" fill="currentColor" />
          Pause
        </button>
        <button 
          onclick={hiitButtonStates().stop.disabled ? undefined : stopHiitTimer} 
          disabled={hiitButtonStates().stop.disabled}
          class={hiitButtonStates().stop.class}
        >
          <Square class="w-5 h-5" stroke="none" fill="currentColor" />
          Reset
        </button>
      </div>
      
      {#if hiitTimer.roundCompleted && !hiitWorkoutComplete()}
        <!-- Next Round button -->
        <div class="mt-4">
          <button 
            onclick={hiitButtonStates().nextRound.disabled ? undefined : startHiitTimer} 
            disabled={hiitButtonStates().nextRound.disabled}
            class={hiitButtonStates().nextRound.class}
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
      {config().button}
    </button>
  </div>
{/if}