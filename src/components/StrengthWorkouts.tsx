import React, { useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import type { 
  Workout, 
  StrengthWorkout, 
  HypertrophyWorkout, 
  AppState 
} from '../types';
import { 
  calculateWeight, 
  calculateHypertrophyWeight, 
  calculateWarmupSets, 
  showRestCompleteNotification
} from '../utils';

interface StrengthWorkoutsProps {
  workout: Workout;
  state: AppState;
  onCompleteWorkout: () => void;
  onToggleSet: (exerciseAndSchemeIndex: string, setIndex: number) => Promise<void>;
  onUpdateState: (updates: Partial<AppState> | ((prev: AppState) => Partial<AppState>)) => void;
}

const StrengthWorkouts: React.FC<StrengthWorkoutsProps> = ({
  workout,
  state,
  onCompleteWorkout,
  onToggleSet,
  onUpdateState
}) => {
  // Timer effect - timestamp-based to prevent background throttling
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (state.restTimer.isActive && state.restTimer.timeLeft > 0) {
      // Use the dependency values directly to avoid stale closure issues
      const startTime = state.restTimer.startTime;
      const totalTime = state.restTimer.totalTime;
      
      interval = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        const newTimeLeft = Math.max(0, totalTime - elapsedSeconds);
        
        // Use functional update to get current state and avoid stale closure
        onUpdateState((prevState: AppState) => ({
          restTimer: {
            ...prevState.restTimer,
            timeLeft: newTimeLeft
          }
        }));
      }, 100); // Check more frequently for smoother updates
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.restTimer.isActive, state.restTimer.startTime, state.restTimer.totalTime, state.restTimer.timeLeft, onUpdateState]);

  // Separate effect to handle notification when timer reaches 0
  useEffect(() => {
    if (state.restTimer.isActive && state.restTimer.timeLeft === 0) {
      showRestCompleteNotification();
    }
  }, [state.restTimer.timeLeft, state.restTimer.isActive]);

  if (workout.type !== 'strength' && workout.type !== 'hypertrophy') {
    return null;
  }

  const strengthWorkout = workout as StrengthWorkout | HypertrophyWorkout;

  // Timer functions
  const stopRestTimer = () => {
    onUpdateState({
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

  const extendRestTimer = () => {
    if (state.restTimer.workoutType === 'strength' && state.restTimer.phase === 'initial') {
      const extendedTime = 120; // Additional 2 minutes to reach 5 minutes total
      const now = Date.now();
      onUpdateState({
        restTimer: {
          ...state.restTimer,
          timeLeft: extendedTime,
          totalTime: extendedTime,
          phase: 'extended',
          startTime: now
        }
      });
    }
  };

  const renderRestTimer = () => {
    if (!state.restTimer.isActive) return null;

    const progressPercent = ((state.restTimer.totalTime - state.restTimer.timeLeft) / state.restTimer.totalTime) * 100;
    const isExtendedPhase = state.restTimer.phase === 'extended';
    const minutes = Math.floor(state.restTimer.timeLeft / 60);
    const seconds = state.restTimer.timeLeft % 60;
    
    return (
      <div className="mb-4 p-4 bg-white rounded-lg border-2 border-orange-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-semibold text-gray-700">
              {isExtendedPhase ? 'Extended Rest' : 'Rest Time'}
            </span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>
        
        <div className="mb-3">
          <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isExtendedPhase ? 'bg-red-500' : 'bg-orange-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={stopRestTimer}
            className={`flex-1 ${
              state.restTimer.timeLeft === 0 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-gray-500 hover:bg-gray-600'
            } text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm`}
          >
            {state.restTimer.timeLeft === 0 ? 'Complete Rest' : 'Skip Rest'}
          </button>
          {state.restTimer.workoutType === 'strength' && !isExtendedPhase && state.restTimer.timeLeft === 0 && (
            <button
              onClick={extendRestTimer}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Extend to 5 min
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderExerciseSet = (
    exercise: string, 
    exerciseIndex: number, 
    setScheme: string, 
    schemeIndex: number, 
    intensity: number, 
    weight: number, 
    workout: StrengthWorkout | HypertrophyWorkout
  ) => {
    const [sets, reps] = setScheme.split('x');
    const warmupSets = workout.type === 'strength' && weight > 0 ? calculateWarmupSets(exercise, weight, state) : [];
    
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
                <div key={`warmup-${warmupIndex}`} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-blue-700 w-16">Warm-up {warmupIndex + 1}</span>
                    <span className="text-sm text-blue-800">{warmupSet.reps} reps @ {warmupSet.weight} {state.weightUnit}</span>
                  </div>
                  <button
                    onClick={() => onToggleSet(`warmup-${exerciseIndex}-${schemeIndex}-${warmupIndex}`, 0)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
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
            <div key={setIndex} className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700 w-14">Set {setIndex + 1}</span>
                <span className="text-sm font-medium text-gray-600">{reps} reps</span>
              </div>
              <div className="flex items-center gap-3">
                {weight > 0 && (
                  <input
                    type="number"
                    className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    defaultValue={weight}
                    placeholder="Weight"
                    step={state.weightUnit === 'kg' ? '2.5' : '5'}
                  />
                )}
                <button
                  onClick={() => onToggleSet(`${exerciseIndex}-${schemeIndex}`, setIndex)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
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

  return (
    <div className="space-y-4">
      {renderRestTimer()}
      {(strengthWorkout.exercises || []).map((exercise: string, exerciseIndex: number) => {
        const setSchemes = (strengthWorkout.sets || '').split(',');
        const intensities = String(strengthWorkout.intensity || 0).split(',');
        const shouldMapByIndex = setSchemes.length === (strengthWorkout.exercises || []).length;
        const exerciseSetSchemes = shouldMapByIndex ? [setSchemes[exerciseIndex]] : setSchemes;
        
        return exerciseSetSchemes.map((setScheme, schemeIndex) => {
          const intensityIndex = shouldMapByIndex ? exerciseIndex : schemeIndex;
          const intensity = parseInt(intensities[intensityIndex] || intensities[0]);
          const weight = strengthWorkout.type === 'strength' ? 
            calculateWeight(exercise, intensity, state) : 
            calculateHypertrophyWeight(exercise, intensity, state);
          
          return renderExerciseSet(exercise, exerciseIndex, setScheme, schemeIndex, intensity, weight, strengthWorkout);
        });
      })}
      <button 
        onClick={onCompleteWorkout} 
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        Complete Workout
      </button>
    </div>
  );
};

export default StrengthWorkouts;