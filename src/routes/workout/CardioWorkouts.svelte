<script lang="ts">
  import type { Workout, CardioWorkout } from '$lib/types'
  import { Play, Pause, Square, SkipForward, CheckCircle } from 'lucide-svelte'
  import { showRestCompleteNotification } from '$lib/utils'

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

  // Unified timer state - using runes for reactive state management
  let cardioTimer = $state({
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

  // Unified timer functions that work for both LISS and HIIT
  const startTimer = () => {
    const workout = cardioWorkout()
    const workoutType = workout.type
    
    if (workoutType === 'liss') {
      const duration = workout.duration
      if (duration === undefined) return
      
      const durationInSeconds = duration * 60
      const now = Date.now()
      
      if (cardioTimer.isPaused) {
        // Resume from pause
        cardioTimer.isActive = true
        cardioTimer.isPaused = false
        cardioTimer.startTime = now - (cardioTimer.totalTime - cardioTimer.timeLeft) * 1000
      } else {
        // Start fresh
        cardioTimer.isActive = true
        cardioTimer.isPaused = false
        cardioTimer.timeLeft = durationInSeconds
        cardioTimer.totalTime = durationInSeconds
        cardioTimer.startTime = now
        cardioTimer.pausedTime = 0
      }
    } else if (workoutType === 'hiit') {
      const duration = workout.duration
      const rounds = workout.rounds
      
      if (rounds === undefined) return
      
      // Handle workouts without duration (rounds-only like Hill Sprints)
      if (duration === undefined) {
        if (cardioTimer.currentRound === 0) {
          // Start first round
          cardioTimer.isActive = false
          cardioTimer.isPaused = false
          cardioTimer.timeLeft = 0
          cardioTimer.totalTime = 0
          cardioTimer.startTime = 0
          cardioTimer.pausedTime = 0
          cardioTimer.currentRound = 1
          cardioTimer.totalRounds = rounds
          cardioTimer.roundCompleted = true // For rounds-only, mark as completed immediately
        } else if (cardioTimer.currentRound < cardioTimer.totalRounds) {
          // Move to next round
          cardioTimer.currentRound = cardioTimer.currentRound + 1
          cardioTimer.roundCompleted = true
        }
        return
      }
      
      // Handle workouts with duration
      const durationInSeconds = duration
      const now = Date.now()
      
      if (cardioTimer.isPaused) {
        // Resume from pause
        cardioTimer.isActive = true
        cardioTimer.isPaused = false
        cardioTimer.startTime = now - (cardioTimer.totalTime - cardioTimer.timeLeft) * 1000
      } else if (cardioTimer.currentRound === 0) {
        // Start fresh
        cardioTimer.isActive = true
        cardioTimer.isPaused = false
        cardioTimer.timeLeft = durationInSeconds
        cardioTimer.totalTime = durationInSeconds
        cardioTimer.startTime = now
        cardioTimer.pausedTime = 0
        cardioTimer.currentRound = 1
        cardioTimer.totalRounds = rounds
        cardioTimer.roundCompleted = false
      } else {
        // Continue to next round
        cardioTimer.isActive = true
        cardioTimer.isPaused = false
        cardioTimer.timeLeft = durationInSeconds
        cardioTimer.totalTime = durationInSeconds
        cardioTimer.startTime = now
        cardioTimer.pausedTime = 0
        cardioTimer.roundCompleted = false
      }
    }
  }

  const pauseTimer = () => {
    cardioTimer.isActive = false
    cardioTimer.isPaused = true
    cardioTimer.pausedTime = Date.now()
  }

  const stopTimer = () => {
    cardioTimer.isActive = false
    cardioTimer.isPaused = false
    cardioTimer.timeLeft = 0
    cardioTimer.totalTime = 0
    cardioTimer.startTime = 0
    cardioTimer.pausedTime = 0
    cardioTimer.currentRound = 0
    cardioTimer.totalRounds = 0
    cardioTimer.roundCompleted = false
  }

  const completeCurrentRound = () => {
    if (cardioTimer.currentRound < cardioTimer.totalRounds) {
      cardioTimer.isActive = false
      cardioTimer.isPaused = false
      cardioTimer.currentRound = cardioTimer.currentRound + 1
      cardioTimer.roundCompleted = true
      cardioTimer.timeLeft = 0
    } else {
      // All rounds completed
      cardioTimer.isActive = false
      cardioTimer.isPaused = false
      cardioTimer.roundCompleted = true
      cardioTimer.timeLeft = 0
    }
  }

  const markRoundComplete = () => {
    const workout = cardioWorkout()
    
    // For rounds-only workouts, just mark current round complete and move to next
    if (workout.duration === undefined && workout.rounds !== undefined) {
      completeCurrentRound()
    }
  }

  // Unified timer interval effect - timestamp-based to prevent background throttling
  $effect(() => {
    let interval: number | undefined
    
    if (cardioTimer.isActive && cardioTimer.timeLeft > 0) {
      interval = setInterval(() => {
        const now = Date.now()
        const elapsedSeconds = Math.floor((now - cardioTimer.startTime) / 1000)
        const newTimeLeft = Math.max(0, cardioTimer.totalTime - elapsedSeconds)
        
        cardioTimer.timeLeft = newTimeLeft
      }, 100) // Check more frequently for smoother updates
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  })

  // Unified timer completion effect
  $effect(() => {
    if (cardioTimer.isActive && cardioTimer.timeLeft === 0) {
      showRestCompleteNotification()
      
      // Handle completion based on workout type
      const workoutType = workout.type
      if (workoutType === 'liss') {
        // Auto-pause when complete
        cardioTimer.isActive = false
        cardioTimer.isPaused = false
      } else if (workoutType === 'hiit') {
        completeCurrentRound()
      }
    }
  })

  // Derived timer display values
  const displayDuration = $derived(() => {
    if (workout.type === 'liss' && cardioWorkout().duration !== undefined) {
      if (cardioTimer.isActive || cardioTimer.isPaused || cardioTimer.timeLeft > 0) {
        // Show countdown timer
        const minutes = Math.floor(cardioTimer.timeLeft / 60)
        const seconds = cardioTimer.timeLeft % 60
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
    return workout.type === 'hiit' && cardioWorkout().rounds !== undefined
  })

  // HIIT timer display values
  const hiitDisplayTime = $derived(() => {
    if (workout.type === 'hiit' && showHiitControls()) {
      if (cardioTimer.isActive || cardioTimer.isPaused || cardioTimer.timeLeft > 0) {
        // Show countdown timer
        const minutes = Math.floor(cardioTimer.timeLeft / 60)
        const seconds = cardioTimer.timeLeft % 60
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
      if (cardioTimer.totalRounds > 0) {
        return `Round ${cardioTimer.currentRound} of ${cardioTimer.totalRounds}`
      } else {
        return `${cardioWorkout().rounds} rounds`
      }
    }
    return ''
  })

  const hiitWorkoutComplete = $derived(() => {
    return cardioTimer.totalRounds > 0 && cardioTimer.currentRound > cardioTimer.totalRounds
  })

  // Unified button states for conditional styling
  const buttonStates = $derived(() => {
    const workoutType = workout.type
    const baseButtonClass = 'font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2'
    const enabledClass = 'opacity-100'
    const disabledClass = 'opacity-40 cursor-not-allowed'
    
    if (workoutType === 'liss') {
      const isStartDisabled = cardioTimer.isActive
      const isPauseDisabled = !cardioTimer.isActive
      const isStopDisabled = !cardioTimer.isActive && !cardioTimer.isPaused
      
      return {
        start: {
          disabled: isStartDisabled,
          class: `flex-1 bg-green-500 text-white ${baseButtonClass} ${isStartDisabled ? disabledClass : `hover:bg-green-600 ${enabledClass}`}`
        },
        pause: {
          disabled: isPauseDisabled,
          class: `flex-1 bg-yellow-500 text-white ${baseButtonClass} ${isPauseDisabled ? disabledClass : `hover:bg-yellow-600 ${enabledClass}`}`
        },
        stop: {
          disabled: isStopDisabled,
          class: `flex-1 bg-red-500 text-white ${baseButtonClass} ${isStopDisabled ? disabledClass : `hover:bg-red-600 ${enabledClass}`}`
        }
      }
    } else if (workoutType === 'hiit') {
      const workout = cardioWorkout()
      const isRoundsOnly = workout.duration === undefined && workout.rounds !== undefined
      
      if (isRoundsOnly) {
        // For rounds-only workouts (like Hill Sprints)
        const isStartDisabled = hiitWorkoutComplete()
        const isCompleteDisabled = cardioTimer.currentRound === 0 || hiitWorkoutComplete()
        
        return {
          start: {
            disabled: isStartDisabled,
            text: cardioTimer.currentRound === 0 ? 'Start Round 1' : 
                  hiitWorkoutComplete() ? 'Workout Complete' :
                  `Start Round ${cardioTimer.currentRound}`,
            class: `flex-1 bg-green-500 text-white ${baseButtonClass} ${isStartDisabled ? disabledClass : `hover:bg-green-600 ${enabledClass}`}`
          },
          complete: {
            disabled: isCompleteDisabled,
            class: `flex-1 bg-blue-500 text-white ${baseButtonClass} ${isCompleteDisabled ? disabledClass : `hover:bg-blue-600 ${enabledClass}`}`
          },
          stop: {
            disabled: cardioTimer.currentRound === 0,
            class: `flex-1 bg-red-500 text-white ${baseButtonClass} ${cardioTimer.currentRound === 0 ? disabledClass : `hover:bg-red-600 ${enabledClass}`}`
          }
        }
      } else {
        // For timed workouts (with duration)
        const isStartDisabled = cardioTimer.isActive
        const isPauseDisabled = !cardioTimer.isActive
        const isStopDisabled = !cardioTimer.isActive && !cardioTimer.isPaused && cardioTimer.currentRound === 0
        const isNextRoundDisabled = cardioTimer.isActive || cardioTimer.currentRound === 0 || hiitWorkoutComplete()
        
        return {
          start: {
            disabled: isStartDisabled,
            text: cardioTimer.currentRound === 0 ? 'Start Round 1' : 
                  cardioTimer.roundCompleted ? `Start Round ${cardioTimer.currentRound}` : 'Resume Round',
            class: `flex-1 bg-green-500 text-white ${baseButtonClass} ${isStartDisabled ? disabledClass : `hover:bg-green-600 ${enabledClass}`}`
          },
          pause: {
            disabled: isPauseDisabled,
            class: `flex-1 bg-yellow-500 text-white ${baseButtonClass} ${isPauseDisabled ? disabledClass : `hover:bg-yellow-600 ${enabledClass}`}`
          },
          stop: {
            disabled: isStopDisabled,
            class: `flex-1 bg-red-500 text-white ${baseButtonClass} ${isStopDisabled ? disabledClass : `hover:bg-red-600 ${enabledClass}`}`
          },
          nextRound: {
            disabled: isNextRoundDisabled,
            class: `w-full bg-blue-500 text-white ${baseButtonClass} ${isNextRoundDisabled ? disabledClass : `hover:bg-blue-600 ${enabledClass}`}`
          }
        }
      }
    }
    
    // Default fallback for other workout types
    return {
      start: { disabled: true, class: '', text: '' },
      pause: { disabled: true, class: '' },
      stop: { disabled: true, class: '' }
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
          onclick={buttonStates().start?.disabled ? undefined : startTimer} 
          disabled={buttonStates().start?.disabled}
          class={buttonStates().start?.class}
        >
          <Play class="w-5 h-5" stroke="none" fill="currentColor" />
          Start
        </button>
        <button 
          onclick={buttonStates().pause?.disabled ? undefined : pauseTimer} 
          disabled={buttonStates().pause?.disabled}
          class={buttonStates().pause?.class}
        >
          <Pause class="w-5 h-5" stroke="none" fill="currentColor" />
          Pause
        </button>
        <button 
          onclick={buttonStates().stop?.disabled ? undefined : stopTimer} 
          disabled={buttonStates().stop?.disabled}
          class={buttonStates().stop?.class}
        >
          <Square class="w-5 h-5" stroke="none" fill="currentColor" />
          Stop
        </button>
      </div>
    {/if}
    
    {#if showHiitControls()}
      {@const workout = cardioWorkout()}
      {@const isRoundsOnly = workout.duration === undefined && workout.rounds !== undefined}
      {@const states = buttonStates()}
      
      {#if isRoundsOnly}
        <!-- Rounds-only HIIT controls (like Hill Sprints) -->
        <div class="flex gap-2 mt-4">
          <button 
            onclick={states.start?.disabled ? undefined : startTimer} 
            disabled={states.start?.disabled}
            class={states.start?.class}
          >
            <Play class="w-5 h-5" stroke="none" fill="currentColor" />
            {states.start?.text}
          </button>
          {#if cardioTimer.currentRound > 0 && !hiitWorkoutComplete() && states.complete}
            <button 
              onclick={states.complete?.disabled ? undefined : markRoundComplete} 
              disabled={states.complete?.disabled}
              class={states.complete?.class}
            >
              <CheckCircle class="w-5 h-5" stroke="none" fill="currentColor" />
              Complete Round {cardioTimer.currentRound}
            </button>
          {/if}
          <button 
            onclick={states.stop?.disabled ? undefined : stopTimer} 
            disabled={states.stop?.disabled}
            class={states.stop?.class}
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
            class={states.start?.class}
          >
            <Play class="w-5 h-5" stroke="none" fill="currentColor" />
            {states.start?.text}
          </button>
          {#if states.pause}
            <button 
              onclick={states.pause?.disabled ? undefined : pauseTimer} 
              disabled={states.pause?.disabled}
              class={states.pause?.class}
            >
              <Pause class="w-5 h-5" stroke="none" fill="currentColor" />
              Pause
            </button>
          {/if}
          <button 
            onclick={states.stop?.disabled ? undefined : stopTimer} 
            disabled={states.stop?.disabled}
            class={states.stop?.class}
          >
            <Square class="w-5 h-5" stroke="none" fill="currentColor" />
            Reset
          </button>
        </div>
        
        {#if cardioTimer.roundCompleted && !hiitWorkoutComplete() && states.nextRound}
          <!-- Next Round button -->
          <div class="mt-4">
            <button 
              onclick={states.nextRound?.disabled ? undefined : startTimer} 
              disabled={states.nextRound?.disabled}
              class={states.nextRound?.class}
            >
              <SkipForward class="w-5 h-5" stroke="none" fill="currentColor" />
              Start Round {cardioTimer.currentRound}
            </button>
          </div>
        {/if}
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