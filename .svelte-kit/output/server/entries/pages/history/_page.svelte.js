import "clsx";
import { b as store_get, e as ensure_array_like, d as escape_html, c as attr_class, f as stringify, u as unsubscribe_stores, a as pop, p as push } from "../../../chunks/index2.js";
import { w as workoutStore } from "../../../chunks/stores.js";
import { C as Clock } from "../../../chunks/clock.js";
function History($$payload, $$props) {
  push();
  var $$store_subs;
  const completedWorkouts = store_get($$store_subs ??= {}, "$workoutStore", workoutStore).completedWorkouts;
  const HISTORY_CONFIGS = {
    rest: {
      color: "bg-slate-400",
      label: "Rest",
      summary: "Recovery day"
    },
    deload: {
      color: "bg-slate-400",
      label: "Deload",
      summary: "Light activity"
    },
    liss: { color: "bg-green-500", label: "LISS" },
    hiit: { color: "bg-yellow-500", label: "HIIT" },
    strength: { color: "bg-red-500", label: "Strength" },
    hypertrophy: { color: "bg-blue-500", label: "Hypertrophy" }
  };
  const recentWorkouts = completedWorkouts.slice(-10).reverse();
  const getWorkoutSummary = (workout) => {
    const workoutType = workout.details?.type || "unknown";
    switch (workoutType) {
      case "liss":
      case "hiit": {
        const cardio = workout.details;
        const duration = cardio.duration;
        const durationStr = typeof duration === "number" ? ` - ${duration} min` : duration ? ` - ${duration}` : "";
        return `${cardio.activity}${durationStr}`;
      }
      case "strength": {
        const strength = workout.details;
        return strength.exercises?.join(", ") || "Strength training";
      }
      case "hypertrophy": {
        const hyp = workout.details;
        const exercises = hyp.exercises || [];
        return exercises.slice(0, 3).join(", ") + (exercises.length > 3 ? "..." : "") || "Accessory work";
      }
      default: {
        const config = HISTORY_CONFIGS[workoutType] || HISTORY_CONFIGS.rest;
        return "summary" in config ? config.summary : "Workout completed";
      }
    }
  };
  const getWorkoutConfig = (workoutType) => {
    return HISTORY_CONFIGS[workoutType] || HISTORY_CONFIGS.rest;
  };
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
  };
  if (completedWorkouts.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="text-center text-gray-400 py-12">`);
    Clock($$payload, { class: "w-16 h-16 mx-auto mb-4 opacity-50" });
    $$payload.out.push(`<!----> <p>No workout history yet</p> <p class="text-xs mt-2">Complete your first workout to see it here</p></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    const each_array = ensure_array_like(recentWorkouts);
    $$payload.out.push(`<div class="space-y-4"><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let workout = each_array[$$index];
      const workoutType = workout.details?.type || "unknown";
      const config = getWorkoutConfig(workoutType);
      const workoutSummary = getWorkoutSummary(workout);
      const { date, time } = formatDateTime(workout.date);
      $$payload.out.push(`<div class="border-l-4 border-blue-500 pl-4 pb-3"><div class="flex items-center gap-2 mb-1"><div class="text-xs text-gray-600">${escape_html(date)} at ${escape_html(time)}</div> <span${attr_class(`${stringify(config.color)} text-white text-xs px-2 py-1 rounded-full font-semibold`)}>${escape_html(config.label)}</span></div> <div class="font-semibold text-gray-900">${escape_html(workout.blockName || "Unknown Block")}</div> <div class="text-sm text-gray-600">Week ${escape_html(workout.week)}, Day ${escape_html(workout.day)}</div> `);
      if (workoutSummary) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="text-sm text-gray-700 mt-1 font-medium">${escape_html(workoutSummary)}</div>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--> `);
      if ("sets" in workout.details) {
        $$payload.out.push("<!--[-->");
        const workoutDetails = workout.details;
        $$payload.out.push(`<div class="text-xs text-gray-500 mt-1">Sets: ${escape_html(workoutDetails.sets)} `);
        if ("intensity" in workoutDetails && workoutDetails.intensity) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`@ ${escape_html(workoutDetails.intensity)}%`);
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]--></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _page($$payload) {
  History($$payload);
}
export {
  _page as default
};
