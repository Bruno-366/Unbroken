import React from 'react';
import type { Workout } from '../types';

interface CardioWorkoutsProps {
  workout: Workout;
  onCompleteWorkout: () => void;
}

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
};

const CardioWorkouts: React.FC<CardioWorkoutsProps> = ({ 
  workout, 
  onCompleteWorkout 
}) => {
  if (workout.type !== 'liss' && workout.type !== 'hiit') {
    return null;
  }

  const config = CARDIO_WORKOUT_CONFIGS[workout.type];
  const cardioWorkout = workout as Extract<Workout, { type: 'liss' | 'hiit' }>;

  return (
    <div>
      <div className={`bg-gradient-to-r ${config.bg} text-white p-6 rounded-lg text-center`}>
        <h3 className="text-2xl font-bold mb-2">
          {cardioWorkout.activity}
        </h3>
        {cardioWorkout.duration && (
          <>
            <div className="text-4xl font-bold">{cardioWorkout.duration}</div>
            {typeof cardioWorkout.duration === 'number' && (
              <div className="text-sm opacity-90 mt-1">minutes</div>
            )}
          </>
        )}
      </div>
      <button 
        onClick={onCompleteWorkout} 
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors mt-4"
      >
        {config.button}
      </button>
    </div>
  );
};

export default CardioWorkouts;