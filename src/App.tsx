import { useState } from 'react';
import { Activity, Clock, CheckCircle } from 'lucide-react';
import { blockTemplates } from './blockTemplates';

// TypeScript interfaces for workouts
interface BaseWorkout {
  type: string;
}

interface StrengthWorkout extends BaseWorkout {
  type: 'strength';
  exercises: string[];
  sets: string;
  intensity: number;
}

interface HypertrophyWorkout extends BaseWorkout {
  type: 'hypertrophy';
  exercises: string[];
  sets?: string;
  intensity?: number;
}

interface CardioWorkout extends BaseWorkout {
  type: 'liss' | 'hiit';
  activity: string;
  duration: number | string;
}

interface RestWorkout extends BaseWorkout {
  type: 'rest' | 'deload';
}

type Workout = StrengthWorkout | HypertrophyWorkout | CardioWorkout | RestWorkout;

interface CustomPlanBlock {
  name: string;
  weeks: number;
  type: string;
}

interface CompletedWorkout {
  date: string;
  block: number;
  blockName: string;
  week: number;
  day: number;
  details: Workout;
}

interface AppState {
  activeTab: string;
  currentWeek: number;
  currentDay: number;
  completedWorkouts: CompletedWorkout[];
  customPlan: CustomPlanBlock[];
  maxes: Record<string, number>;
  tenRMs: Record<string, number>;
  weightUnit: string;
  completedSets: Record<string, boolean>;
  draggedIndex: number | null;
  dragOverIndex: number | null;
  showResetConfirm: boolean;
}

const App = () => {
  // Lookup tables for workout types and configurations
  const WORKOUT_CONFIGS = {
    rest: { bg: 'from-purple-500 to-pink-500', title: 'Rest Day', desc: 'Take a day off to recover', button: 'Complete Rest Day' },
    deload: { bg: 'from-blue-500 to-teal-500', title: 'Deload', desc: 'Light activity or mobility work', button: 'Complete Deload Day' },
    liss: { bg: 'from-green-500 to-blue-500', button: 'Complete LISS Cardio' },
    hiit: { bg: 'from-orange-500 to-red-500', button: 'Complete HIIT Cardio' }
  };

  const HISTORY_CONFIGS = {
    rest: { color: 'bg-slate-400', label: 'Rest', summary: 'Recovery day' },
    deload: { color: 'bg-slate-400', label: 'Deload', summary: 'Light activity' },
    liss: { color: 'bg-green-500', label: 'LISS', getSummary: (w: CardioWorkout) => `${w.activity} - ${w.duration}${typeof w.duration === 'number' ? ' min' : ''}` },
    hiit: { color: 'bg-yellow-500', label: 'HIIT', getSummary: (w: CardioWorkout) => `${w.activity} - ${w.duration}${typeof w.duration === 'number' ? ' min' : ''}` },
    strength: { color: 'bg-red-500', label: 'Strength', getSummary: (w: StrengthWorkout) => w.exercises?.join(', ') || 'Strength training' },
    hypertrophy: { color: 'bg-blue-500', label: 'Hypertrophy', getSummary: (w: HypertrophyWorkout) => w.exercises?.slice(0, 3).join(', ') + (w.exercises?.length > 3 ? '...' : '') || 'Accessory work' }
  };

  const AVAILABLE_BLOCKS = {
    endurance1: { name: "Endurance Block 1", weeks: 8 },
    powerbuilding1: { name: "Powerbuilding Block 1", weeks: 3 },
    powerbuilding2: { name: "Powerbuilding Block 2", weeks: 3 },
    powerbuilding3: { name: "Powerbuilding Block 3", weeks: 3 },
    powerbuilding3bulgarian: { name: "Powerbuilding Block 3 - Bulgarian", weeks: 3 },
    bodybuilding: { name: "Bodybuilding Block", weeks: 3 },
    strength: { name: "Strength Block", weeks: 6 }
  };

  // Helper function to generate exercise key from name
  const getExerciseKey = (exerciseName: string) => {
    return exerciseName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  };

  // Get exercises used in the current active block
  const getCurrentBlockExercises = () => {
    const currentBlock = state.customPlan[0];
    if (!currentBlock) return { strengthExercises: [], hypertrophyExercises: [] };
    
    const blockTemplate = blockTemplates[currentBlock.type as keyof typeof blockTemplates];
    if (!blockTemplate) return { strengthExercises: [], hypertrophyExercises: [] };
    
    const strengthExercises = new Set();
    const hypertrophyExercises = new Set();
    
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
    showResetConfirm: false
  });

  // Unified state update function
  const updateState = (updates: Partial<AppState>) => setState((prev: AppState) => ({ ...prev, ...updates }));

  // Consolidated utility functions
  const calculateWeight = (exercise: string, percentage: number) => {
    const exerciseKey = getExerciseKey(exercise);
    if (!exerciseKey || !state.maxes[exerciseKey]) return 0;
    
    const calculatedWeight = state.maxes[exerciseKey] * (percentage / 100);
    const barbellExercises = ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Front Squat', 'Trap Bar Deadlift', 'Power Clean', 'Romanian Deadlift'];
    
    if (barbellExercises.includes(exercise)) {
      const increment = state.weightUnit === 'kg' ? 2.5 : 5;
      return Math.round(calculatedWeight / increment) * increment;
    }
    return Math.round(calculatedWeight);
  };

  const calculateHypertrophyWeight = (exercise: string, percentage: number) => {
    const exerciseKey = getExerciseKey(exercise);
    
    // Convert 10RM input to estimated 1RM, then apply percentage
    let estimatedOneRM;
    if (state.tenRMs[exerciseKey]) {
      // Convert 10RM to 1RM: 10RM / 0.75 = 1RM
      estimatedOneRM = state.tenRMs[exerciseKey] / 0.75;
    } else if (state.maxes[exerciseKey]) {
      // Fallback to actual 1RM if available
      estimatedOneRM = state.maxes[exerciseKey];
    } else {
      return 0;
    }
    
    // Apply the block's programmed percentage to the estimated 1RM
    const calculatedWeight = estimatedOneRM * (percentage / 100);
    return Math.round(calculatedWeight);
  };

  const calculateWarmupSets = (_exercise: string, workingWeight: number) => {
    if (!workingWeight || workingWeight <= 0) return [];
    
    const barbellWeight = state.weightUnit === 'kg' ? 20 : 45;
    const plateIncrement = state.weightUnit === 'kg' ? 2.5 : 5;
    const roundToPlate = (weight: number) => Math.max(Math.round(weight / plateIncrement) * plateIncrement, barbellWeight);
    
    const warmupSets = [
      { weight: roundToPlate(workingWeight * 0.5), reps: 5, type: 'warmup' },
      { weight: roundToPlate(workingWeight * 0.65), reps: 3, type: 'warmup' },
      { weight: roundToPlate(workingWeight * 0.8), reps: 2, type: 'warmup' },
      { weight: roundToPlate(workingWeight * 0.9), reps: 1, type: 'warmup' }
    ];
    
    return warmupSets.filter(set => set.weight < workingWeight);
  };

  const getCurrentWorkout = () => {
    const block = state.customPlan[0];
    const blockTemplate = blockTemplates[block.type as keyof typeof blockTemplates];
    if (!blockTemplate) return null;
    
    const weekIndex = Math.min(state.currentWeek - 1, blockTemplate.weeks.length - 1);
    const dayIndex = state.currentDay - 1;
    return blockTemplate.weeks[weekIndex].days[dayIndex];
  };

  // Consolidated event handlers
  const handleDrag = (action: string, data: { index?: number; e?: React.DragEvent }) => {
    switch(action) {
      case 'start':
        if (!data.index || data.index === 0) { data.e?.preventDefault(); return; }
        updateState({ draggedIndex: data.index, dragOverIndex: null });
        if (data.e) {
          data.e.dataTransfer.effectAllowed = 'move';
          data.e.dataTransfer.setData('text/plain', data.index.toString());
        }
        break;
      case 'over':
        data.e?.preventDefault();
        if (data.e) data.e.dataTransfer.dropEffect = 'move';
        break;
      case 'enter':
        data.e?.preventDefault();
        if (data.index && data.index > 0 && state.draggedIndex !== null && data.index !== state.draggedIndex) {
          updateState({ dragOverIndex: data.index });
        }
        break;
      case 'leave':
        if (data.e && !data.e.currentTarget.contains(data.e.relatedTarget as Node)) {
          updateState({ dragOverIndex: null });
        }
        break;
      case 'drop': {
        data.e?.preventDefault();
        data.e?.stopPropagation();
        if (state.draggedIndex === null || !data.index || data.index === 0) {
          updateState({ draggedIndex: null, dragOverIndex: null });
          return;
        }
        const newPlan = [...state.customPlan];
        const draggedBlock = newPlan[state.draggedIndex];
        newPlan.splice(state.draggedIndex, 1);
        let insertIndex = data.index;
        if (state.draggedIndex < data.index) insertIndex = data.index - 1;
        newPlan.splice(insertIndex, 0, draggedBlock);
        updateState({ customPlan: newPlan, draggedIndex: null, dragOverIndex: null });
        break;
      }
      case 'end':
        updateState({ draggedIndex: null, dragOverIndex: null });
        break;
    }
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
      activeTab: 'overview'
    });
  };

  const toggleSet = (exerciseIndex: number | string, setIndex: number) => {
    const key = `${exerciseIndex}-${setIndex}`;
    updateState({
      completedSets: { ...state.completedSets, [key]: !state.completedSets[key] }
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
        updateState({ customPlan: state.customPlan.filter((_, i) => i !== data.index) });
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
      showResetConfirm: false
    });
  };

  // Render functions using lookup tables
  const renderSimpleWorkout = (type: string, workout: Workout) => {
    const config = WORKOUT_CONFIGS[type as keyof typeof WORKOUT_CONFIGS];
    return (
      <div>
        <div className={`bg-gradient-to-r ${config.bg} text-white p-6 rounded-lg text-center`}>
          <h3 className="text-2xl font-bold mb-2">
            {'title' in config ? config.title : 
             'activity' in workout ? workout.activity : 
             'Workout'}
          </h3>
          {'desc' in config && <p className="opacity-90">{config.desc}</p>}
          {'duration' in workout && workout.duration && (
            <>
              <div className="text-4xl font-bold">{workout.duration}</div>
              {typeof workout.duration === 'number' && <div className="text-sm opacity-90 mt-1">minutes</div>}
            </>
          )}
        </div>
        <button onClick={completeWorkout} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors mt-4">
          {config.button}
        </button>
      </div>
    );
  };

  const renderExerciseSet = (exercise: string, exerciseIndex: number, setScheme: string, schemeIndex: number, intensity: number, weight: number, workout: StrengthWorkout | HypertrophyWorkout) => {
    const [sets, reps] = setScheme.split('x');
    const warmupSets = workout.type === 'strength' && weight > 0 ? calculateWarmupSets(exercise, weight) : [];
    
    return (
      <div key={`${exerciseIndex}-${schemeIndex}`} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-2 text-lg">{exercise}</h4>
        <div className="text-sm text-gray-600 mb-4 font-medium">
          {setScheme} @ {intensity}%{weight > 0 && ` (${weight} ${state.weightUnit})`}
        </div>
        
        {warmupSets.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-semibold text-gray-700 mb-2">Warm-up Sets</h5>
            <div className="space-y-2">
              {warmupSets.map((warmupSet, warmupIndex) => (
                <div key={`warmup-${warmupIndex}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1">
                    <span className="text-xs font-medium text-blue-700 w-16 flex-shrink-0">Warm-up {warmupIndex + 1}</span>
                    <span className="text-sm text-blue-800">{warmupSet.reps} reps</span>
                    <span className="text-sm font-semibold text-blue-900">{warmupSet.weight} {state.weightUnit}</span>
                  </div>
                  <button
                    onClick={() => toggleSet(`warmup-${exerciseIndex}-${schemeIndex}-${warmupIndex}`, 0)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 self-end sm:self-center ${
                      state.completedSets[`warmup-${exerciseIndex}-${schemeIndex}-${warmupIndex}-0`]
                        ? 'bg-blue-500 border-blue-500 text-white' : 'border-blue-300 hover:border-blue-400 bg-white'
                    }`}
                  >
                    {state.completedSets[`warmup-${exerciseIndex}-${schemeIndex}-${warmupIndex}-0`] && <CheckCircle className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-gray-700">Working Sets</h5>
          {Array.from({ length: parseInt(sets) }).map((_, setIndex) => (
            <div key={setIndex} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-4 flex-1">
                <span className="text-sm font-semibold text-gray-700 w-14">Set {setIndex + 1}</span>
                <span className="text-sm font-medium text-gray-600">{reps} reps</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 justify-between sm:justify-end">
                {weight > 0 && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      defaultValue={weight}
                      placeholder="Weight"
                      step={state.weightUnit === 'kg' ? '2.5' : '5'}
                    />
                    <span className="text-xs text-gray-500 font-medium">{state.weightUnit}</span>
                  </div>
                )}
                <button
                  onClick={() => toggleSet(`${exerciseIndex}-${schemeIndex}`, setIndex)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    state.completedSets[`${exerciseIndex}-${schemeIndex}-${setIndex}`]
                      ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-green-400 bg-white'
                  }`}
                >
                  {state.completedSets[`${exerciseIndex}-${schemeIndex}-${setIndex}`] && <CheckCircle className="w-5 h-5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWorkout = () => {
    const workout = getCurrentWorkout();
    if (!workout) return <div className="text-center text-gray-500 py-8"><p>Workout template not yet implemented</p></div>;

    if (['rest', 'deload', 'liss', 'hiit'].includes(workout.type)) {
      return renderSimpleWorkout(workout.type, workout as Workout);
    }

    if (workout.type === 'strength' || workout.type === 'hypertrophy') {
      const strengthWorkout = workout as StrengthWorkout | HypertrophyWorkout;
      return (
        <div className="space-y-4">
          {(strengthWorkout.exercises || []).map((exercise: string, exerciseIndex: number) => {
            const setSchemes = (strengthWorkout.sets || '').split(',');
            const intensities = String(strengthWorkout.intensity || 0).split(',');
            const shouldMapByIndex = setSchemes.length === (strengthWorkout.exercises || []).length;
            const exerciseSetSchemes = shouldMapByIndex ? [setSchemes[exerciseIndex]] : setSchemes;
            
            return exerciseSetSchemes.map((setScheme, schemeIndex) => {
              const intensityIndex = shouldMapByIndex ? exerciseIndex : schemeIndex;
              const intensity = parseInt(intensities[intensityIndex] || intensities[0]);
              const weight = strengthWorkout.type === 'strength' ? 
                calculateWeight(exercise, intensity) : 
                calculateHypertrophyWeight(exercise, intensity);
              
              return renderExerciseSet(exercise, exerciseIndex, setScheme, schemeIndex, intensity, weight, strengthWorkout);
            });
          })}
          <button onClick={completeWorkout} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors">
            Complete Workout
          </button>
        </div>
      );
    }
    return null;
  };

  const currentBlockInfo = state.customPlan[0];
  const progressPercent = ((state.currentWeek - 1) / currentBlockInfo.weeks) * 100;
  const { strengthExercises, hypertrophyExercises } = getCurrentBlockExercises();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4 md:p-4 p-0">
      <div className="max-w-2xl mx-auto bg-white md:rounded-2xl rounded-none shadow-2xl overflow-hidden min-h-screen md:min-h-0">
        <div className="bg-gray-900 text-white p-6 text-center">
          <h1 className="text-2xl font-bold">TACTICAL BARBELL</h1>
          <p className="text-gray-400 text-sm mt-1">Hybrid Athlete Tracker</p>
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
            <div>
              {state.completedWorkouts.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No workout history yet</p>
                  <p className="text-xs mt-2">Complete your first workout to see it here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.completedWorkouts.slice(-10).reverse().map((workout: CompletedWorkout, index: number) => {
                    const date = new Date(workout.date);
                    const workoutType = workout.details?.type || 'unknown';
                    const config = HISTORY_CONFIGS[workoutType as keyof typeof HISTORY_CONFIGS] || HISTORY_CONFIGS.rest;
                    const workoutSummary = (() => {
                      switch (workoutType) {
                        case 'liss':
                          return `${(workout.details as CardioWorkout).activity} - ${(workout.details as CardioWorkout).duration}${typeof (workout.details as CardioWorkout).duration === 'number' ? ' min' : ''}`;
                        case 'hiit':
                          return `${(workout.details as CardioWorkout).activity} - ${(workout.details as CardioWorkout).duration}${typeof (workout.details as CardioWorkout).duration === 'number' ? ' min' : ''}`;
                        case 'strength':
                          return (workout.details as StrengthWorkout).exercises?.join(', ') || 'Strength training';
                        case 'hypertrophy': {
                          const hyp = workout.details as HypertrophyWorkout;
                          return hyp.exercises?.slice(0, 3).join(', ') + (hyp.exercises?.length > 3 ? '...' : '') || 'Accessory work';
                        }
                        default:
                          return 'summary' in config ? config.summary : 'Workout completed';
                      }
                    })();
                    
                    return (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 pb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-xs text-gray-600">
                            {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <span className={`${config.color} text-white text-xs px-2 py-1 rounded-full font-semibold`}>
                            {config.label}
                          </span>
                        </div>
                        <div className="font-semibold text-gray-900">{workout.blockName || 'Unknown Block'}</div>
                        <div className="text-sm text-gray-600">Week {workout.week}, Day {workout.day}</div>
                        {workoutSummary && <div className="text-sm text-gray-700 mt-1 font-medium">{workoutSummary}</div>}
                        {'sets' in workout.details && (
                          <div className="text-xs text-gray-500 mt-1">
                            Sets: {(workout.details as StrengthWorkout | HypertrophyWorkout).sets}
                            {'intensity' in workout.details && workout.details.intensity && ` @ ${workout.details.intensity}%`}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {state.activeTab === 'settings' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Training Plan</h3>
                <div className="mb-4">
                  {state.customPlan.map((block, index) => (
                    <div key={index}>
                      {index > 0 && (
                        <div 
                          onDragOver={(e) => handleDrag('over', { e })}
                          onDragEnter={(e) => handleDrag('enter', { e, index })}
                          onDragLeave={(e) => handleDrag('leave', { e })}
                          onDrop={(e) => handleDrag('drop', { e, index })}
                          className={state.draggedIndex !== null && state.dragOverIndex === index
                            ? 'min-h-16 border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg flex items-center justify-center mb-3 p-3'
                            : 'h-3 mb-3'
                          }
                        >
                          {state.draggedIndex !== null && state.dragOverIndex === index && (
                            <span className="text-xs text-blue-600 font-medium">Drop here</span>
                          )}
                        </div>
                      )}
                      
                      <div 
                        draggable={index !== 0}
                        onDragStart={(e) => handleDrag('start', { e, index })}
                        onDragEnd={() => handleDrag('end', {})}
                        className={`border rounded-lg p-3 ${
                          index === 0 ? 'border-blue-500 bg-blue-50 border-2' : 'border-gray-200 hover:shadow-md cursor-move'
                        } ${state.draggedIndex === index ? 'opacity-50 transform rotate-2' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          {index !== 0 && <div className="text-gray-400 text-sm">⋮⋮</div>}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {index === 0 && <span className="text-sm text-gray-500 font-medium">Current</span>}
                              <div className="font-semibold text-gray-900">{block.name}</div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">{block.weeks} weeks</div>
                          </div>
                          {index !== 0 && (
                            <button
                              onClick={() => manageBlocks('remove', { index })}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        {index === 0 && (
                          <div className="text-xs text-blue-600 mt-2 font-medium">
                            Week {state.currentWeek} of {block.weeks} • Day {state.currentDay}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">Add Block</label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        manageBlocks('add', { blockType: e.target.value });
                        e.target.value = '';
                      }
                    }}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer hover:border-gray-400"
                    defaultValue=""
                  >
                    <option value="" disabled>Select a block type to add...</option>
                    {Object.entries(AVAILABLE_BLOCKS).map(([key, block]) => (
                      <option key={key} value={key}>{block.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Exercise Database - {currentBlockInfo.name}</h3>
                <div className="text-sm text-gray-600 mb-4">
                  Showing exercises for your current block. Values update automatically for weight calculations.
                </div>
                
                {strengthExercises.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      Strength Exercises (1RM - {state.weightUnit})
                    </h4>
                    <div className="space-y-3">
                      {(strengthExercises as string[]).map((exercise: string) => {
                        const exerciseKey = getExerciseKey(exercise as string);
                        
                        return (
                          <div key={exerciseKey} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <label className="flex-1 text-sm text-gray-700 font-medium">{exercise as string}</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={state.maxes[exerciseKey] || ''}
                                onChange={(e) => updateState({ 
                                  maxes: { ...state.maxes, [exerciseKey]: parseFloat(e.target.value) || 0 }
                                })}
                                className="w-24 p-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                                placeholder="1RM"
                                step={state.weightUnit === 'kg' ? '2.5' : '5'}
                              />
                              <span className="text-xs text-gray-500 font-medium w-8">{state.weightUnit}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {hypertrophyExercises.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                      Hypertrophy Exercises (10RM - {state.weightUnit})
                    </h4>
                    <div className="space-y-3">
                      {(hypertrophyExercises as string[]).map((exercise: string) => {
                        const exerciseKey = getExerciseKey(exercise as string);
                        
                        return (
                          <div key={exerciseKey} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <label className="flex-1 text-sm text-gray-700 font-medium">{exercise as string}</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={state.tenRMs[exerciseKey] || ''}
                                onChange={(e) => updateState({ 
                                  tenRMs: { ...state.tenRMs, [exerciseKey]: parseFloat(e.target.value) || 0 }
                                })}
                                className="w-24 p-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                placeholder="10RM"
                                step="1"
                              />
                              <span className="text-xs text-gray-500 font-medium w-8">{state.weightUnit}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {strengthExercises.length === 0 && hypertrophyExercises.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No resistance exercises in current block</p>
                    <p className="text-xs mt-1">Switch to a strength or powerbuilding block to see exercise settings</p>
                  </div>
                )}
              </div>

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
