import React from 'react';
import { Activity, Clock } from 'lucide-react';
import { Workout } from '../types';
import { WORKOUT_CONFIGS } from '../config';

interface SimpleWorkoutProps {
  workoutType: string;
  workout: Workout;
  onComplete: () => void;
}

export const SimpleWorkout: React.FC<SimpleWorkoutProps> = ({ workoutType, workout, onComplete }) => {
  const config = WORKOUT_CONFIGS[workoutType as keyof typeof WORKOUT_CONFIGS];
  
  const renderContent = () => {
    if (workoutType === 'rest' || workoutType === 'deload') {
      const restConfig = config as { bg: string; title: string; desc: string; button: string };
      return (
        <div className={`p-6 rounded-lg bg-gradient-to-r ${config.bg} text-white text-center`}>
          <div className="text-6xl mb-4">🛌</div>
          <h3 className="text-2xl font-bold mb-2">{restConfig.title}</h3>
          <p className="text-white/90 mb-6">{restConfig.desc}</p>
          <button
            onClick={onComplete}
            className="bg-white/20 hover:bg-white/30 backdrop-blur text-white font-semibold py-3 px-6 rounded-lg transition-all"
          >
            {config.button}
          </button>
        </div>
      );
    }

    if (workoutType === 'liss' || workoutType === 'hiit') {
      const cardioWorkout = workout as { activity: string; duration: number | string };
      return (
        <div className={`p-6 rounded-lg bg-gradient-to-r ${config.bg} text-white`}>
          <div className="flex items-center justify-center mb-4">
            {workoutType === 'liss' ? <Activity className="w-12 h-12" /> : <Clock className="w-12 h-12" />}
          </div>
          <h3 className="text-2xl font-bold text-center mb-4">{cardioWorkout.activity}</h3>
          <div className="text-center mb-6">
            <div className="text-3xl font-bold">{cardioWorkout.duration}</div>
            <div className="text-white/80">
              {typeof cardioWorkout.duration === 'number' ? 'minutes' : ''}
            </div>
          </div>
          <button
            onClick={onComplete}
            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur text-white font-semibold py-3 rounded-lg transition-all"
          >
            {config.button}
          </button>
        </div>
      );
    }

    return null;
  };

  return renderContent();
};