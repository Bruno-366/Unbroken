const getExerciseKey = (exerciseName) => {
  return exerciseName.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
};
const calculateWeight = (exercise, percentage, { maxes, weightUnit }) => {
  const exerciseKey = getExerciseKey(exercise);
  if (!exerciseKey || !maxes[exerciseKey]) return 0;
  const calculatedWeight = maxes[exerciseKey] * (percentage / 100);
  const barbellExercises = ["Bench Press", "Squat", "Deadlift", "Overhead Press", "Front Squat", "Trap Bar Deadlift", "Power Clean", "Romanian Deadlift"];
  if (barbellExercises.includes(exercise)) {
    const increment = weightUnit === "kg" ? 2.5 : 5;
    return Math.round(calculatedWeight / increment) * increment;
  }
  return Math.round(calculatedWeight);
};
const calculateHypertrophyWeight = (exercise, percentage, { tenRMs, maxes }) => {
  const exerciseKey = getExerciseKey(exercise);
  let estimatedOneRM;
  if (tenRMs[exerciseKey]) {
    estimatedOneRM = tenRMs[exerciseKey] / 0.75;
  } else if (maxes && maxes[exerciseKey]) {
    estimatedOneRM = maxes[exerciseKey];
  } else {
    return 0;
  }
  const calculatedWeight = estimatedOneRM * (percentage / 100);
  return Math.round(calculatedWeight);
};
const calculateWarmupSets = (_exercise, workingWeight, { weightUnit }) => {
  if (!workingWeight || workingWeight <= 0) return [];
  const barbellWeight = weightUnit === "kg" ? 20 : 45;
  const plateIncrement = weightUnit === "kg" ? 2.5 : 5;
  const roundToPlate = (weight) => Math.max(Math.round(weight / plateIncrement) * plateIncrement, barbellWeight);
  const warmupSets = [
    { weight: roundToPlate(workingWeight * 0.5), reps: 5, type: "warmup" },
    { weight: roundToPlate(workingWeight * 0.65), reps: 3, type: "warmup" },
    { weight: roundToPlate(workingWeight * 0.8), reps: 2, type: "warmup" },
    { weight: roundToPlate(workingWeight * 0.9), reps: 1, type: "warmup" }
  ];
  return warmupSets.filter((set) => set.weight < workingWeight);
};
export {
  calculateHypertrophyWeight as a,
  calculateWarmupSets as b,
  calculateWeight as c,
  getExerciseKey as g
};
