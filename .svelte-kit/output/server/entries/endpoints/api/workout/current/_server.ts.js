import { json } from "@sveltejs/kit";
import { b as blockTemplates } from "../../../../../chunks/blockTemplates.js";
import { w as workoutStore, t as trainingPlanStore } from "../../../../../chunks/stores.js";
import { g as get } from "../../../../../chunks/index.js";
async function GET() {
  try {
    const currentWorkout = getCurrentWorkout();
    return json(currentWorkout);
  } catch (error) {
    console.error("Error fetching current workout:", error);
    return json({ error: "Failed to fetch current workout" }, { status: 500 });
  }
}
function getCurrentWorkout() {
  const workoutState = get(workoutStore);
  const trainingState = get(trainingPlanStore);
  const block = trainingState.customPlan[0];
  if (!block) return null;
  const blockTemplate = blockTemplates[block.type];
  if (!blockTemplate) return null;
  const weekIndex = Math.min(workoutState.currentWeek - 1, blockTemplate.weeks.length - 1);
  const dayIndex = workoutState.currentDay - 1;
  return blockTemplate.weeks[weekIndex].days[dayIndex];
}
export {
  GET
};
