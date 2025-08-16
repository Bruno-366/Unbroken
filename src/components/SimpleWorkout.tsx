import React from 'react';
import { Workout } from '../types';
import { WORKOUT_CONFIGS } from '../config';

interface SimpleWorkoutProps {
  workoutType: string;
  workout: Workout;
  onComplete: () => void;
}

export const SimpleWorkout: React.FC<SimpleWorkoutProps> = ({ workoutType, workout, onComplete }) => {
  const config = WORKOUT_CONFIGS[workoutType as keyof typeof WORKOUT_CONFIGS];
  
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
      <button onClick={onComplete} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors mt-4">
        {config.button}
      </button>
    </div>
  );
};