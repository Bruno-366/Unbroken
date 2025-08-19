// TypeScript interfaces for the Unbroken Tactical Barbell Tracker

export interface BaseWorkout {
  type: string;
}

export interface StrengthWorkout extends BaseWorkout {
  type: 'strength';
  exercises: string[];
  sets: string;
  intensity: number;
}

export interface HypertrophyWorkout extends BaseWorkout {
  type: 'hypertrophy';
  exercises: string[];
  sets?: string;
  intensity?: number;
}

export interface CardioWorkout extends BaseWorkout {
  type: 'liss' | 'hiit';
  activity: string;
  duration: number | string;
}

export interface RestWorkout extends BaseWorkout {
  type: 'rest' | 'deload';
}

export type Workout = StrengthWorkout | HypertrophyWorkout | CardioWorkout | RestWorkout;

export interface CustomPlanBlock {
  name: string;
  weeks: number;
  type: string;
}

// Alias for consistency
export type TrainingBlock = CustomPlanBlock;

export interface CompletedWorkout {
  date: string;
  block: number;
  blockName: string;
  week: number;
  day: number;
  details: Workout;
}

export interface AppState {
  activeTab: string;
  currentWeek: number;
  currentDay: number;
  completedWorkouts: CompletedWorkout[];
  customPlan: CustomPlanBlock[];
  maxes: Record<string, number>;
  tenRMs: Record<string, number>;
  weightUnit: string;
  completedSets: Record<string, boolean>;
  showResetConfirm: boolean;
  restTimer: {
    isActive: boolean;
    timeLeft: number;
    totalTime: number;
    workoutType: 'strength' | 'hypertrophy' | null;
    phase: 'initial' | 'extended';
    startTime: number;
  };
}

export interface WarmupSet {
  weight: number;
  reps: number;
  type: 'warmup';
}