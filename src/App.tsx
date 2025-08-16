import { useState } from 'react';
import { Activity, Clock } from 'lucide-react';
import { 
  AppState, 
  CompletedWorkout, 
  Workout, 
  StrengthWorkout, 
  HypertrophyWorkout,
  CardioWorkout 
} from './types';
import { 
  HISTORY_CONFIGS, 
  AVAILABLE_BLOCKS, 
  DEFAULT_CUSTOM_PLAN, 
  DEFAULT_MAXES 
} from './config';
import { 
  getCurrentWorkout, 
  getCurrentBlockExercises, 
  getExerciseKey, 
  calculateWeight, 
  calculateHypertrophyWeight 
} from './utils';
import { ExerciseSet } from './components/ExerciseSet';
import { SimpleWorkout } from './components/SimpleWorkout';
import { ConfirmDialog } from './components/ConfirmDialog';

const App = () => {
  // Consolidated state
  const [state, setState] = useState<AppState>({
    activeTab: 'overview',
    currentWeek: 1,
    currentDay: 1,
    completedWorkouts: [] as CompletedWorkout[],
    customPlan: DEFAULT_CUSTOM_PLAN,
    maxes: DEFAULT_MAXES,
    tenRMs: {} as Record<string, number>,
    weightUnit: 'kg',
    completedSets: {} as Record<string, boolean>,
    draggedIndex: null,
    dragOverIndex: null,
    showResetConfirm: false
  });

  // Unified state update function
  const updateState = (updates: Partial<AppState>) => setState((prev: AppState) => ({ ...prev, ...updates }));

  // Event handlers
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
    const workoutDetails = getCurrentWorkout(state.customPlan, state.currentWeek, state.currentDay);
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
      customPlan: DEFAULT_CUSTOM_PLAN,
      showResetConfirm: false
    });
  };

  // Render functions using lookup tables
  const renderWorkout = () => {
    const workout = getCurrentWorkout(state.customPlan, state.currentWeek, state.currentDay);
    if (!workout) return <div className="text-center text-gray-500 py-8"><p>Workout template not yet implemented</p></div>;

    if (['rest', 'deload', 'liss', 'hiit'].includes(workout.type)) {
      return <SimpleWorkout workoutType={workout.type} workout={workout as Workout} onComplete={completeWorkout} />;
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
                calculateWeight(exercise, intensity, state.maxes, state.weightUnit) : 
                calculateHypertrophyWeight(exercise, intensity, state.tenRMs, state.maxes);
              
              return (
                <ExerciseSet
                  key={`${exerciseIndex}-${schemeIndex}`}
                  exercise={exercise}
                  exerciseIndex={exerciseIndex}
                  setScheme={setScheme}
                  schemeIndex={schemeIndex}
                  intensity={intensity}
                  weight={weight}
                  completedSets={state.completedSets}
                  weightUnit={state.weightUnit}
                  onToggleSet={toggleSet}
                />
              );
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
  const { strengthExercises, hypertrophyExercises } = getCurrentBlockExercises(state.customPlan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gray-900 text-white p-6 text-center">
          <h1 className="text-2xl font-bold">TACTICAL BARBELL</h1>
          <p className="text-gray-400 text-sm mt-1">Hybrid Athlete Tracker</p>
        </div>

        <div className="flex bg-gray-100 border-b-2 border-gray-200">
          {['overview', 'workout', 'history', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => updateState({ activeTab: tab })}
              className={`flex-1 py-4 px-4 font-semibold capitalize transition-colors ${
                state.activeTab === tab ? 'text-blue-600 bg-white border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 min-h-[500px]">
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
                          <div key={exerciseKey} className="flex items-center gap-3">
                            <label className="flex-1 text-sm text-gray-700 font-medium">{exercise as string}</label>
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
                          <div key={exerciseKey} className="flex items-center gap-3">
                            <label className="flex-1 text-sm text-gray-700 font-medium">{exercise as string}</label>
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

              <ConfirmDialog
                isOpen={state.showResetConfirm}
                title="Reset All Progress?"
                message="Are you sure you want to reset all progress? This cannot be undone."
                onConfirm={resetProgress}
                onCancel={() => updateState({ showResetConfirm: false })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
