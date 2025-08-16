import { CardioWorkout, StrengthWorkout, HypertrophyWorkout } from './types';

// Lookup tables for workout types and configurations
export const WORKOUT_CONFIGS = {
  rest: { bg: 'from-purple-500 to-pink-500', title: 'Rest Day', desc: 'Take a day off to recover', button: 'Complete Rest Day' },
  deload: { bg: 'from-blue-500 to-teal-500', title: 'Deload', desc: 'Light activity or mobility work', button: 'Complete Deload Day' },
  liss: { bg: 'from-green-500 to-blue-500', button: 'Complete LISS Cardio' },
  hiit: { bg: 'from-orange-500 to-red-500', button: 'Complete HIIT Cardio' }
};

export const HISTORY_CONFIGS = {
  rest: { color: 'bg-slate-400', label: 'Rest', summary: 'Recovery day' },
  deload: { color: 'bg-slate-400', label: 'Deload', summary: 'Light activity' },
  liss: { color: 'bg-green-500', label: 'LISS', getSummary: (w: CardioWorkout) => `${w.activity} - ${w.duration}${typeof w.duration === 'number' ? ' min' : ''}` },
  hiit: { color: 'bg-yellow-500', label: 'HIIT', getSummary: (w: CardioWorkout) => `${w.activity} - ${w.duration}${typeof w.duration === 'number' ? ' min' : ''}` },
  strength: { color: 'bg-red-500', label: 'Strength', getSummary: (w: StrengthWorkout) => w.exercises?.join(', ') || 'Strength training' },
  hypertrophy: { color: 'bg-blue-500', label: 'Hypertrophy', getSummary: (w: HypertrophyWorkout) => w.exercises?.slice(0, 3).join(', ') + (w.exercises?.length > 3 ? '...' : '') || 'Accessory work' }
};

export const AVAILABLE_BLOCKS = {
  endurance1: { name: "Endurance Block 1", weeks: 8 },
  powerbuilding1: { name: "Powerbuilding Block 1", weeks: 3 },
  powerbuilding2: { name: "Powerbuilding Block 2", weeks: 3 },
  powerbuilding3: { name: "Powerbuilding Block 3", weeks: 3 },
  powerbuilding3bulgarian: { name: "Powerbuilding Block 3 - Bulgarian", weeks: 3 },
  bodybuilding: { name: "Bodybuilding Block", weeks: 3 },
  strength: { name: "Strength Block", weeks: 6 }
};

export const DEFAULT_CUSTOM_PLAN = [
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
];

export const DEFAULT_MAXES = {
  benchpress: 100,
  squat: 120,
  deadlift: 140,
  trapbardeadlift: 130,
  overheadpress: 60,
  frontsquat: 90,
  weightedpullup: 20,
  powerclean: 80,
  romaniandeadlift: 120
} as Record<string, number>;