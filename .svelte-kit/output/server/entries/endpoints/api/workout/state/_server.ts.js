import { json } from "@sveltejs/kit";
import { w as workoutStore, t as trainingPlanStore } from "../../../../../chunks/stores.js";
import { g as get } from "../../../../../chunks/index.js";
async function GET() {
  try {
    const workoutState = get(workoutStore);
    const trainingState = get(trainingPlanStore);
    const currentBlockInfo = trainingState.customPlan[0] || { name: "No active block", weeks: 0 };
    return json({
      currentWeek: workoutState.currentWeek,
      currentDay: workoutState.currentDay,
      currentBlockInfo,
      completedWorkouts: workoutState.completedWorkouts,
      completedSets: workoutState.completedSets
    });
  } catch (error) {
    console.error("Error fetching workout state:", error);
    return json({ error: "Failed to fetch workout state" }, { status: 500 });
  }
}
export {
  GET
};
