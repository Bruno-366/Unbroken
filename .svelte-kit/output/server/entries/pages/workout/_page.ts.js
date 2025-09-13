const load = async ({ fetch }) => {
  const currentWorkoutResponse = await fetch("/api/workout/current");
  const getCurrentWorkout = await currentWorkoutResponse.json();
  const stateResponse = await fetch("/api/workout/state");
  const state = await stateResponse.json();
  return {
    getCurrentWorkout,
    currentBlockInfo: state.currentBlockInfo,
    currentWeek: state.currentWeek,
    currentDay: state.currentDay
  };
};
export {
  load
};
