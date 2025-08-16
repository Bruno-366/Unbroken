import { blockTemplates } from './blockTemplates';
import { CustomPlanBlock } from './types';

// Helper function to generate exercise key from name
export const getExerciseKey = (exerciseName: string) => {
  return exerciseName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
};

// Get exercises used in the current active block
export const getCurrentBlockExercises = (customPlan: CustomPlanBlock[]) => {
  const currentBlock = customPlan[0];
  if (!currentBlock) return { strengthExercises: [], hypertrophyExercises: [] };
  
  const blockTemplate = blockTemplates[currentBlock.type as keyof typeof blockTemplates];
  if (!blockTemplate) return { strengthExercises: [], hypertrophyExercises: [] };
  
  const strengthExercises = new Set();
  const hypertrophyExercises = new Set();
  
  blockTemplate.weeks.forEach((week: { days: unknown[] }) => {
    week.days.forEach((day: unknown) => {
      const dayObj = day as Record<string, unknown>;
      if ('exercises' in dayObj && Array.isArray(dayObj.exercises)) {
        (dayObj.exercises as string[]).forEach((exercise: string) => {
          if (dayObj.type === 'strength') {
            strengthExercises.add(exercise);
          } else if (dayObj.type === 'hypertrophy') {
            hypertrophyExercises.add(exercise);
          }
        });
      }
    });
  });
  
  return {
    strengthExercises: Array.from(strengthExercises),
    hypertrophyExercises: Array.from(hypertrophyExercises)
  };
};

// Get current workout from block template
export const getCurrentWorkout = (customPlan: CustomPlanBlock[], currentWeek: number, currentDay: number) => {
  const block = customPlan[0];
  const blockTemplate = blockTemplates[block.type as keyof typeof blockTemplates];
  if (!blockTemplate) return null;
  
  const weekIndex = Math.min(currentWeek - 1, blockTemplate.weeks.length - 1);
  const dayIndex = currentDay - 1;
  return blockTemplate.weeks[weekIndex].days[dayIndex];
};

// Weight calculation utilities
export const calculateWeight = (exercise: string, percentage: number, maxes: Record<string, number>, weightUnit: string) => {
  const exerciseKey = getExerciseKey(exercise);
  if (!exerciseKey || !maxes[exerciseKey]) return 0;
  
  const calculatedWeight = maxes[exerciseKey] * (percentage / 100);
  
  // Round to appropriate plate weight for barbell exercises
  const barbellExercises = ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Front Squat', 'Trap Bar Deadlift', 'Power Clean', 'Romanian Deadlift'];
  
  if (barbellExercises.includes(exercise)) {
    const increment = weightUnit === 'kg' ? 2.5 : 5;
    return Math.round(calculatedWeight / increment) * increment;
  }
  return Math.round(calculatedWeight);
};

export const calculateHypertrophyWeight = (exercise: string, percentage: number, tenRMs: Record<string, number>, maxes: Record<string, number>) => {
  const exerciseKey = getExerciseKey(exercise);
  
  // Convert 10RM input to estimated 1RM, then apply percentage
  let estimatedOneRM;
  if (tenRMs[exerciseKey]) {
    // Convert 10RM to 1RM: 10RM / 0.75 = 1RM
    estimatedOneRM = tenRMs[exerciseKey] / 0.75;
  } else if (maxes[exerciseKey]) {
    // Fallback to actual 1RM if available
    estimatedOneRM = maxes[exerciseKey];
  } else {
    return 0;
  }
  
  // Apply the block's programmed percentage to the estimated 1RM
  const calculatedWeight = estimatedOneRM * (percentage / 100);
  return Math.round(calculatedWeight);
};

export const calculateWarmupSets = (workingWeight: number, weightUnit: string) => {
  if (!workingWeight || workingWeight <= 0) return [];
  
  const barbellWeight = weightUnit === 'kg' ? 20 : 45;
  const plateIncrement = weightUnit === 'kg' ? 2.5 : 5;
  const roundToPlate = (weight: number) => Math.max(Math.round(weight / plateIncrement) * plateIncrement, barbellWeight);
  
  const warmupSets = [
    { weight: roundToPlate(workingWeight * 0.5), reps: 5, type: 'warmup' },
    { weight: roundToPlate(workingWeight * 0.65), reps: 3, type: 'warmup' },
    { weight: roundToPlate(workingWeight * 0.8), reps: 2, type: 'warmup' },
    { weight: roundToPlate(workingWeight * 0.9), reps: 1, type: 'warmup' }
  ];
  
  return warmupSets.filter(set => set.weight < workingWeight);
};