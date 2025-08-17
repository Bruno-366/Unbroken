import React from 'react';
import { Activity } from 'lucide-react';
import type { AppState } from '../types';
import { getExerciseKey } from '../utils';

interface ExerciseDatabaseProps {
  state: AppState;
  strengthExercises: string[];
  hypertrophyExercises: string[];
  currentBlockName: string;
  onUpdateState: (updates: Partial<AppState>) => void;
}

const ExerciseDatabase: React.FC<ExerciseDatabaseProps> = ({
  state,
  strengthExercises,
  hypertrophyExercises,
  currentBlockName,
  onUpdateState
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Exercise Database - {currentBlockName}</h3>
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
            {strengthExercises.map((exercise: string) => {
              const exerciseKey = getExerciseKey(exercise);
              
              return (
                <div key={exerciseKey} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <label className="flex-1 text-sm text-gray-700 font-medium">{exercise}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={state.maxes[exerciseKey] || ''}
                      onChange={(e) => onUpdateState({ 
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
            {hypertrophyExercises.map((exercise: string) => {
              const exerciseKey = getExerciseKey(exercise);
              
              return (
                <div key={exerciseKey} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <label className="flex-1 text-sm text-gray-700 font-medium">{exercise}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={state.tenRMs[exerciseKey] || ''}
                      onChange={(e) => onUpdateState({ 
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
  );
};

export default ExerciseDatabase;