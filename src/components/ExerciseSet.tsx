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
  const [sets, reps] = setScheme.split('x');

  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
      <h4 className="font-bold text-gray-900 mb-2 text-lg">{exercise}</h4>
      <div className="text-sm text-gray-600 mb-4 font-medium">
        {setScheme} @ {intensity}%{weight > 0 && ` (${weight} ${weightUnit})`}
      </div>
      
      {warmupSets.length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-semibold text-gray-700 mb-2">Warm-up Sets</h5>
          <div className="space-y-2">
            {warmupSets.map((warmupSet, warmupIndex) => (
              <div key={`warmup-${warmupIndex}`} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-blue-700 w-16">Warm-up {warmupIndex + 1}</span>
                  <span className="text-sm text-blue-800">{warmupSet.reps} reps</span>
                  <span className="text-sm font-semibold text-blue-900">{warmupSet.weight} {weightUnit}</span>
                </div>
                <button
                  onClick={() => onToggleSet(`warmup-${exerciseIndex}-${schemeIndex}-${warmupIndex}`, 0)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    completedSets[`warmup-${exerciseIndex}-${schemeIndex}-${warmupIndex}-0`]
                      ? 'bg-blue-500 border-blue-500 text-white' : 'border-blue-300 hover:border-blue-400 bg-white'
                  }`}
                >
                  {completedSets[`warmup-${exerciseIndex}-${schemeIndex}-${warmupIndex}-0`] && <CheckCircle className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <h5 className="text-sm font-semibold text-gray-700">Working Sets</h5>
        {Array.from({ length: parseInt(sets) }).map((_, setIndex) => (
          <div key={setIndex} className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-4 flex-1">
              <span className="text-sm font-semibold text-gray-700 w-14">Set {setIndex + 1}</span>
              <span className="text-sm font-medium text-gray-600">{reps} reps</span>
            </div>
            <div className="flex items-center gap-4">
              {weight > 0 && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    defaultValue={weight}
                    placeholder="Weight"
                    step={weightUnit === 'kg' ? '2.5' : '5'}
                  />
                  <span className="text-xs text-gray-500 font-medium">{weightUnit}</span>
                </div>
              )}
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
          </div>
        ))}
      </div>
    </div>
  );
};