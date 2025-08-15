import React from 'react';
import { CheckCircle } from 'lucide-react';
import { calculateWarmupSets } from '../utils';

interface ExerciseSetProps {
  exercise: string;
  exerciseIndex: number;
  setScheme: string;
  schemeIndex: number;
  intensity: number;
  weight: number;
  completedSets: Record<string, boolean>;
  weightUnit: string;
  onToggleSet: (exerciseIndex: number | string, setIndex: number) => void;
}

export const ExerciseSet: React.FC<ExerciseSetProps> = ({
  exercise,
  exerciseIndex,
  setScheme,
  schemeIndex,
  intensity,
  weight,
  completedSets,
  weightUnit,
  onToggleSet
}) => {
  const warmupSets = calculateWarmupSets(weight, weightUnit);
  const [sets, reps] = setScheme.includes('x') ? setScheme.split('x').map(Number) : [1, parseInt(setScheme)];

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-gray-900">{exercise}</h4>
        <div className="text-sm text-gray-600">
          {setScheme} @ {intensity}% = {weight}{weightUnit}
        </div>
      </div>
      
      {warmupSets.length > 0 && (
        <div className="mb-3">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Warmup Sets</h5>
          <div className="space-y-1">
            {warmupSets.map((warmupSet, idx) => (
              <div key={idx} className="text-xs text-gray-600 flex justify-between">
                <span>{warmupSet.reps} reps</span>
                <span>{warmupSet.weight}{weightUnit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700">Working Sets</h5>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: sets }, (_, setIndex) => (
            <div key={setIndex} className="text-center">
              <div className="text-xs text-gray-600 mb-1">
                {reps} reps
              </div>
              <button
                onClick={() => onToggleSet(`${exerciseIndex}-${schemeIndex}`, setIndex)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  completedSets[`${exerciseIndex}-${schemeIndex}-${setIndex}`]
                    ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-green-400 bg-white'
                }`}
              >
                {completedSets[`${exerciseIndex}-${schemeIndex}-${setIndex}`] && <CheckCircle className="w-5 h-5" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};