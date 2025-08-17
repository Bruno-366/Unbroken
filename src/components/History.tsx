import React from 'react';
import { Clock } from 'lucide-react';
import type { 
  CompletedWorkout, 
  CardioWorkout, 
  StrengthWorkout, 
  HypertrophyWorkout 
} from '../types';

interface HistoryProps {
  completedWorkouts: CompletedWorkout[];
}

// History configuration for different workout types
const HISTORY_CONFIGS = {
  rest: { color: 'bg-slate-400', label: 'Rest', summary: 'Recovery day' },
  deload: { color: 'bg-slate-400', label: 'Deload', summary: 'Light activity' },
  liss: { color: 'bg-green-500', label: 'LISS' },
  hiit: { color: 'bg-yellow-500', label: 'HIIT' },
  strength: { color: 'bg-red-500', label: 'Strength' },
  hypertrophy: { color: 'bg-blue-500', label: 'Hypertrophy' }
};

const History: React.FC<HistoryProps> = ({ completedWorkouts }) => {
  if (completedWorkouts.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>No workout history yet</p>
        <p className="text-xs mt-2">Complete your first workout to see it here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {completedWorkouts.slice(-10).reverse().map((workout: CompletedWorkout, index: number) => {
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
  );
};

export default History;