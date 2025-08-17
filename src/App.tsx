import { useState } from 'react';
import { blockTemplates } from './blockTemplates';

// Import types and components
import type { AppState, CompletedWorkout, CustomPlanBlock, Workout } from './types';
import { requestNotificationPermission } from './utils';
import CardioWorkouts from './components/CardioWorkouts';
import StrengthWorkouts from './components/StrengthWorkouts';
import RestWorkouts from './components/RestWorkouts';
import History from './components/History';
import TrainingPlan from './components/TrainingPlan';
import ExerciseDatabase from './components/ExerciseDatabase';

const App = () => {
  // Available blocks configuration
  const AVAILABLE_BLOCKS = {
    endurance1: { name: "Endurance Block 1", weeks: 8 },
    powerbuilding1: { name: "Powerbuilding Block 1", weeks: 3 },
    powerbuilding2: { name: "Powerbuilding Block 2", weeks: 3 },
    powerbuilding3: { name: "Powerbuilding Block 3", weeks: 3 },
    powerbuilding3bulgarian: { name: "Powerbuilding Block 3 - Bulgarian", weeks: 3 },
    bodybuilding: { name: "Bodybuilding Block", weeks: 3 },
    strength: { name: "Strength Block", weeks: 6 }
  };

  // Get exercises used in the current active block
  const getCurrentBlockExercises = (): { strengthExercises: string[]; hypertrophyExercises: string[] } => {
    const currentBlock = state.customPlan[0];
    if (!currentBlock) return { strengthExercises: [], hypertrophyExercises: [] };
    
    const blockTemplate = blockTemplates[currentBlock.type as keyof typeof blockTemplates];
    if (!blockTemplate) return { strengthExercises: [], hypertrophyExercises: [] };
    
    const strengthExercises = new Set<string>();
    const hypertrophyExercises = new Set<string>();
    
    blockTemplate.weeks.forEach((week: { days: unknown[] }) => {
      week.days.forEach((day: unknown) => {
        const dayObj = day as Record<string, unknown>;
        if ('exercises' in dayObj && Array.isArray(dayObj.exercises)) {
          (dayObj.exercises as string[]).forEach((exercise: string) => {
            if (dayObj.type === 'strength') {
              strengthExercises.add(exercise);
            } else if (dayObj.type === 'hypertrophy') {
              hypertrophyExercises.add(exercise);
            }
          });
        }
      });
    });
    
    return {
      strengthExercises: Array.from(strengthExercises),
      hypertrophyExercises: Array.from(hypertrophyExercises)
    };
  };

  // Consolidated state
  const [state, setState] = useState<AppState>({
    activeTab: 'overview',
    currentWeek: 1,
    currentDay: 1,
    completedWorkouts: [] as CompletedWorkout[],
    customPlan: [
      { name: "Endurance Block 1", weeks: 8, type: "endurance1" },
      { name: "Powerbuilding Block 1", weeks: 3, type: "powerbuilding1" },
      { name: "Powerbuilding Block 2", weeks: 3, type: "powerbuilding2" },
      { name: "Powerbuilding Block 3", weeks: 3, type: "powerbuilding3" },
      { name: "Bodybuilding Block", weeks: 3, type: "bodybuilding" },
      { name: "Bodybuilding Block", weeks: 3, type: "bodybuilding" },
      { name: "Bodybuilding Block", weeks: 3, type: "bodybuilding" },
      { name: "Powerbuilding Block 3 - Bulgarian", weeks: 3, type: "powerbuilding3bulgarian" },
      { name: "Strength Block", weeks: 6, type: "strength" },
      { name: "Endurance Block 1", weeks: 8, type: "endurance1" }
    ],
    maxes: { benchpress: 100, squat: 120, deadlift: 140, trapbardeadlift: 130, overheadpress: 60, frontsquat: 90, weightedpullup: 20, powerclean: 80, romaniandeadlift: 120 } as Record<string, number>,
    tenRMs: {} as Record<string, number>,
    weightUnit: 'kg',
    completedSets: {} as Record<string, boolean>,
    draggedIndex: null,
    dragOverIndex: null,
    showResetConfirm: false,
    restTimer: {
      isActive: false,
      timeLeft: 0,
      totalTime: 0,
      workoutType: null,
      phase: 'initial',
      startTime: 0
    }
  });

  // Unified state update function
  const updateState = (updates: Partial<AppState>) => setState((prev: AppState) => ({ ...prev, ...updates }));

  const getCurrentWorkout = () => {
    const block = state.customPlan[0];
    const blockTemplate = blockTemplates[block.type as keyof typeof blockTemplates];
    if (!blockTemplate) return null;
    
    const weekIndex = Math.min(state.currentWeek - 1, blockTemplate.weeks.length - 1);
    const dayIndex = state.currentDay - 1;
    return blockTemplate.weeks[weekIndex].days[dayIndex];
  };

  const toggleSet = async (exerciseAndSchemeIndex: string, setIndex: number) => {
    const key = `${exerciseAndSchemeIndex}-${setIndex}`;
    const isBeingCompleted = !state.completedSets[key];
    
    // Start rest timer when completing a working set (not warm-up sets)
    let restTimerUpdate = {};
    if (isBeingCompleted && !key.includes('warmup')) {
      const workout = getCurrentWorkout();
      if (workout && (workout.type === 'strength' || workout.type === 'hypertrophy')) {
        // Request notification permission if not already granted
        await requestNotificationPermission();
        
        const initialTime = workout.type === 'strength' ? 180 : 90; // 3 min for strength, 1.5 min for hypertrophy
        const now = Date.now();
        restTimerUpdate = {
          restTimer: {
            isActive: true,
            timeLeft: initialTime,
            totalTime: initialTime,
            workoutType: workout.type,
            phase: 'initial' as const,
            startTime: now
          }
        };
      }
    }

    // Combine both state updates into one
    updateState({
      completedSets: { ...state.completedSets, [key]: isBeingCompleted },
      ...restTimerUpdate
    });
  };

  const completeWorkout = () => {
    const workoutDetails = getCurrentWorkout();
    if (!workoutDetails) return; // Guard against null workout
    const block = state.customPlan[0];
    
    const workout: CompletedWorkout = {
      date: new Date().toISOString(),
      block: 0,
      blockName: block.name,
      week: state.currentWeek,
      day: state.currentDay,
      details: workoutDetails as Workout
    };
    
    let newDay = state.currentDay + 1;
    let newWeek = state.currentWeek;
    let newPlan = state.customPlan;
    
    if (newDay > 7) {
      newDay = 1;
      newWeek++;
      if (newWeek > block.weeks) {
        newPlan = state.customPlan.slice(1);
        newWeek = 1;
        newDay = 1;
      }
    }
    
    updateState({
      completedWorkouts: [...state.completedWorkouts, workout],
      completedSets: {},
      currentDay: newDay,
      currentWeek: newWeek,
      customPlan: newPlan,
      activeTab: 'overview',
      restTimer: {
        isActive: false,
        timeLeft: 0,
        totalTime: 0,
        workoutType: null,
        phase: 'initial',
        startTime: 0
      }
    });
  };

  const manageBlocks = (action: string, data: { blockType?: string; index?: number }) => {
    switch(action) {
      case 'add': {
        if (!data.blockType) return;
        const blockConfig = AVAILABLE_BLOCKS[data.blockType as keyof typeof AVAILABLE_BLOCKS];
        if (!blockConfig) return;
        updateState({
          customPlan: [...state.customPlan, { 
            name: blockConfig.name, 
            weeks: blockConfig.weeks, 
            type: data.blockType 
          }]
        });
        break;
      }
      case 'remove':
        if (state.customPlan.length <= 1) {
          alert('You must have at least one block in your plan.');
          return;
        }
        if (data.index === 0) {
          alert('Cannot remove the currently active block. Complete it first or reset your progress.');
          return;
        }
        updateState({ customPlan: state.customPlan.filter((_: CustomPlanBlock, i: number) => i !== data.index) });
        break;
    }
  };

  const resetProgress = () => {
    updateState({
      currentWeek: 1,
      currentDay: 1,
      completedWorkouts: [],
      completedSets: {},
      customPlan: [
        { name: "Endurance Block 1", weeks: 8, type: "endurance1" },
        { name: "Powerbuilding Block 1", weeks: 3, type: "powerbuilding1" },
        { name: "Powerbuilding Block 2", weeks: 3, type: "powerbuilding2" },
        { name: "Powerbuilding Block 3", weeks: 3, type: "powerbuilding3" },
        { name: "Bodybuilding Block", weeks: 3, type: "bodybuilding" },
        { name: "Bodybuilding Block", weeks: 3, type: "bodybuilding" },
        { name: "Bodybuilding Block", weeks: 3, type: "bodybuilding" },
        { name: "Powerbuilding Block 3 - Bulgarian", weeks: 3, type: "powerbuilding3bulgarian" },
        { name: "Strength Block", weeks: 6, type: "strength" },
        { name: "Endurance Block 1", weeks: 8, type: "endurance1" }
      ],
      showResetConfirm: false,
      restTimer: {
        isActive: false,
        timeLeft: 0,
        totalTime: 0,
        workoutType: null,
        phase: 'initial',
        startTime: 0
      }
    });
  };

  // Render workout using appropriate component
  const renderWorkout = () => {
    const workout = getCurrentWorkout();
    if (!workout) return <div className="text-center text-gray-500 py-8"><p>Workout template not yet implemented</p></div>;

    // Rest and Deload workouts
    if (workout.type === 'rest' || workout.type === 'deload') {
      return (
        <RestWorkouts 
          workout={workout as Workout} 
          onCompleteWorkout={completeWorkout} 
        />
      );
    }

    // Cardio workouts (LISS and HIIT)
    if (workout.type === 'liss' || workout.type === 'hiit') {
      return (
        <CardioWorkouts 
          workout={workout as Workout} 
          onCompleteWorkout={completeWorkout} 
        />
      );
    }

    // Strength and Hypertrophy workouts
    if (workout.type === 'strength' || workout.type === 'hypertrophy') {
      return (
        <StrengthWorkouts 
          workout={workout as Workout}
          state={state}
          onCompleteWorkout={completeWorkout}
          onToggleSet={toggleSet}
          onUpdateState={updateState}
        />
      );
    }

    return null;
  };

  const currentBlockInfo = state.customPlan[0];
  const progressPercent = ((state.currentWeek - 1) / currentBlockInfo.weeks) * 100;
  const { strengthExercises, hypertrophyExercises } = getCurrentBlockExercises();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-0 md:p-4">
      <div className="w-full md:max-w-2xl mx-auto bg-white md:rounded-2xl rounded-none shadow-2xl overflow-hidden min-h-screen md:min-h-0">
        <div className="bg-gray-900 text-white p-6 text-center">
          <h1 className="text-2xl font-bold">UNBROKEN</h1>
          <p className="text-gray-400 text-sm mt-1">Tactical Barbell Tracker</p>
        </div>

        <div className="flex bg-gray-100 border-b-2 border-gray-200">
          {['overview', 'workout', 'history', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => updateState({ activeTab: tab })}
              className={`flex-1 py-4 px-2 sm:px-4 font-semibold capitalize transition-colors text-sm sm:text-base ${
                state.activeTab === tab ? 'text-blue-600 bg-white border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 min-h-[500px]">
          {state.activeTab === 'overview' && (
            <div>
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h3 className="text-sm text-gray-600 mb-2">Current Block</h3>
                <div className="text-xl font-bold text-gray-900 mb-3">{currentBlockInfo.name}</div>
                <div className="bg-gray-300 h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                </div>
                <div className="text-xs text-gray-600">Week {state.currentWeek} of {currentBlockInfo.weeks}</div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Upcoming Blocks</h3>
                {state.customPlan.slice(1, 4).map((block, index) => (
                  <div key={index} className="bg-gray-100 p-3 rounded-lg mb-2">
                    <div className="font-semibold text-gray-800">{block.name}</div>
                    <div className="text-xs text-gray-600">{block.weeks} weeks</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => updateState({ activeTab: 'workout' })}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Start Today's Workout
              </button>
            </div>
          )}

          {state.activeTab === 'workout' && (
            <div>
              <div className="bg-blue-600 text-white p-4 rounded-lg mb-6 text-center">
                <div className="text-sm opacity-90 mb-1">Week {state.currentWeek}, Day {state.currentDay}</div>
                <div className="text-xl font-bold">{currentBlockInfo.name}</div>
              </div>
              {renderWorkout()}
            </div>
          )}

          {state.activeTab === 'history' && (
            <History completedWorkouts={state.completedWorkouts} />
          )}

          {state.activeTab === 'settings' && (
            <div>
              <TrainingPlan 
                state={state}
                onUpdateState={updateState}
                onManageBlocks={manageBlocks}
              />

              <ExerciseDatabase 
                state={state}
                strengthExercises={strengthExercises}
                hypertrophyExercises={hypertrophyExercises}
                currentBlockName={currentBlockInfo.name}
                onUpdateState={updateState}
              />

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                <label className="block text-sm text-gray-600 mb-1">Weight Unit</label>
                <select
                  value={state.weightUnit}
                  onChange={(e) => updateState({ weightUnit: e.target.value })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer hover:border-gray-400"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lbs">Pounds (lbs)</option>
                </select>
              </div>

              <button
                onClick={() => updateState({ showResetConfirm: true })}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Reset All Progress
              </button>

              {state.showResetConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Reset All Progress?</h3>
                    <p className="text-gray-600 mb-6">Are you sure you want to reset all progress? This cannot be undone.</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateState({ showResetConfirm: false })}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={resetProgress}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
