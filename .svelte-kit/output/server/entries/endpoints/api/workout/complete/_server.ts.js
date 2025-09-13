import { json } from "@sveltejs/kit";
import { b as blockTemplates } from "../../../../../chunks/blockTemplates.js";
import { t as trainingPlanStore, w as workoutStore, u as uiStore } from "../../../../../chunks/stores.js";
import { g as get } from "../../../../../chunks/index.js";
async function POST() {
  try {
    const workoutDetails = getCurrentWorkout();
    if (!workoutDetails) {
      return json({ error: "No current workout found" }, { status: 400 });
    }
    const trainingState = get(trainingPlanStore);
    const workoutState = get(workoutStore);
    const block = trainingState.customPlan[0];
    const workout = {
      date: (/* @__PURE__ */ new Date()).toISOString(),
      block: 0,
      blockName: block.name,
      week: workoutState.currentWeek,
      day: workoutState.currentDay,
      details: workoutDetails
    };
    let newDay = workoutState.currentDay + 1;
    let newWeek = workoutState.currentWeek;
    if (newDay > 7) {
      newDay = 1;
      newWeek++;
      if (newWeek > block.weeks) {
        trainingPlanStore.update((state) => ({
          ...state,
          customPlan: state.customPlan.slice(1)
        }));
        newWeek = 1;
        newDay = 1;
      }
    }
    workoutStore.update((state) => ({
      ...state,
      completedWorkouts: [...state.completedWorkouts, workout],
      completedSets: {},
      currentDay: newDay,
      currentWeek: newWeek
    }));
    uiStore.update((state) => ({
      ...state,
      activeTab: "overview",
      restTimer: {
        isActive: false,
        timeLeft: 0,
        totalTime: 0,
        workoutType: null,
        phase: "initial",
        startTime: 0
      },
      lissTimer: {
        isActive: false,
        isPaused: false,
        timeLeft: 0,
        totalTime: 0,
        startTime: 0,
        pausedTime: 0
      }
    }));
    return json({ success: true, workout });
  } catch (error) {
    console.error("Error completing workout:", error);
    return json({ error: "Failed to complete workout" }, { status: 500 });
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
  POST
};
