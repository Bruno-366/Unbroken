import { j as sanitize_props, k as spread_props, l as slot, b as store_get, e as ensure_array_like, c as attr_class, m as attr, d as escape_html, n as maybe_selected, u as unsubscribe_stores, a as pop, p as push, f as stringify } from "../../../chunks/index2.js";
import { t as trainingPlanStore, w as workoutStore, e as exerciseStore, p as preferencesStore, u as uiStore } from "../../../chunks/stores.js";
import { g as getExerciseKey } from "../../../chunks/utils3.js";
import { b as blockTemplates } from "../../../chunks/blockTemplates.js";
import { I as Icon } from "../../../chunks/Icon.js";
function Activity($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.446.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "path",
      {
        "d": "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "activity" },
    $$sanitized_props,
    {
      /**
       * @component @name Activity
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMTJoLTIuNDhhMiAyIDAgMCAwLTEuOTMgMS40NmwtMi4zNSA4LjM2YS4yNS4yNSAwIDAgMS0uNDggMEw5LjI0IDIuMThhLjI1LjI1IDAgMCAwLS40OCAwbC0yLjM1IDguMzZBMiAyIDAgMCAxIDQuNDkgMTJIMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/activity
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function TrainingPlan($$payload, $$props) {
  push();
  var $$store_subs;
  let customPlan = store_get($$store_subs ??= {}, "$trainingPlanStore", trainingPlanStore).customPlan;
  const currentWeek = store_get($$store_subs ??= {}, "$workoutStore", workoutStore).currentWeek;
  const currentDay = store_get($$store_subs ??= {}, "$workoutStore", workoutStore).currentDay;
  const AVAILABLE_BLOCKS = {
    endurance1: { name: "Endurance Block 1", weeks: 8 },
    powerbuilding1: { name: "Powerbuilding Block 1", weeks: 3 },
    powerbuilding2: { name: "Powerbuilding Block 2", weeks: 3 },
    powerbuilding3: { name: "Powerbuilding Block 3", weeks: 3 },
    powerbuilding3bulgarian: { name: "Powerbuilding Block 3 - Bulgarian", weeks: 3 },
    bodybuilding: { name: "Bodybuilding Block", weeks: 3 },
    strength: { name: "Strength Block", weeks: 6 }
  };
  let dragState = { draggedIndex: null };
  let selectedType = "";
  const each_array = ensure_array_like(customPlan);
  const each_array_1 = ensure_array_like(Object.entries(AVAILABLE_BLOCKS));
  $$payload.out.push(`<div class="mb-6"><h3 class="text-lg font-semibold mb-4">Training Plan</h3> <div class="mb-4"><!--[-->`);
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let block = each_array[index];
    $$payload.out.push(`<div>`);
    if (index > 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div role="region" aria-label="Drop zone for reordering training blocks"${attr_class("h-3 mb-3")}>`);
      {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> <div role="button"${attr("tabindex", index === 0 ? -1 : 0)}${attr("aria-label", index === 0 ? "Current training block (not draggable)" : `Drag to reorder ${block.name} training block`)}${attr("draggable", index !== 0)}${attr_class(`border rounded-lg p-3 ${stringify(index === 0 ? "border-blue-500 bg-blue-50 border-2" : "border-gray-200 hover:shadow-md cursor-move")} ${stringify(dragState.draggedIndex === index ? "opacity-50 transform rotate-2" : "")}`)}><div class="flex items-center gap-3">`);
    if (index !== 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="text-gray-400 text-sm">⋮⋮</div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> <div class="flex-1"><div class="flex items-center gap-2">`);
    if (index === 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<span class="text-sm text-gray-500 font-medium">Current</span>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> <div class="font-semibold text-gray-900">${escape_html(block.name)}</div></div> <div class="text-xs text-gray-600 mt-1">${escape_html(block.weeks)} weeks</div></div> `);
    if (index !== 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<button class="p-1 text-red-500 hover:text-red-700">✕</button>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div> `);
    if (index === 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="text-xs text-blue-600 mt-2 font-medium">Week ${escape_html(currentWeek)} of ${escape_html(block.weeks)} • Day ${escape_html(currentDay)}</div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div></div>`);
  }
  $$payload.out.push(`<!--]--></div> <div class="mb-4"><label for="add-block-select" class="block text-sm text-gray-600 mb-2">Add Block</label> <select id="add-block-select" class="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer hover:border-gray-400">`);
  $$payload.select_value = selectedType;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")} disabled>Select a block type to add...</option><!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let [key, block] = each_array_1[$$index_1];
    $$payload.out.push(`<option${attr("value", key)}${maybe_selected($$payload, key)}>${escape_html(block.name)}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function ExerciseDatabase($$payload, $$props) {
  push();
  var $$store_subs;
  const exerciseState = store_get($$store_subs ??= {}, "$exerciseStore", exerciseStore);
  const maxes = exerciseState.maxes;
  const tenRMs = exerciseState.tenRMs;
  const weightUnit = store_get($$store_subs ??= {}, "$preferencesStore", preferencesStore).weightUnit;
  const customPlan = store_get($$store_subs ??= {}, "$trainingPlanStore", trainingPlanStore).customPlan;
  const currentBlockName = customPlan[0]?.name || "No active block";
  const getCurrentBlockExercises = () => {
    const currentBlock = customPlan[0];
    if (!currentBlock) return { strengthExercises: [], hypertrophyExercises: [] };
    const blockTemplate = blockTemplates[currentBlock.type];
    if (!blockTemplate) return { strengthExercises: [], hypertrophyExercises: [] };
    const strengthExercises2 = /* @__PURE__ */ new Set();
    const hypertrophyExercises2 = /* @__PURE__ */ new Set();
    blockTemplate.weeks.forEach((week) => {
      week.days.forEach((day) => {
        const dayObj = day;
        if ("exercises" in dayObj && Array.isArray(dayObj.exercises)) {
          dayObj.exercises.forEach((exercise) => {
            if (dayObj.type === "strength") {
              strengthExercises2.add(exercise);
            } else if (dayObj.type === "hypertrophy") {
              hypertrophyExercises2.add(exercise);
            }
          });
        }
      });
    });
    return {
      strengthExercises: Array.from(strengthExercises2),
      hypertrophyExercises: Array.from(hypertrophyExercises2)
    };
  };
  const exerciseData = getCurrentBlockExercises();
  const strengthExercises = exerciseData.strengthExercises;
  const hypertrophyExercises = exerciseData.hypertrophyExercises;
  $$payload.out.push(`<div class="mb-6"><h3 class="text-lg font-semibold mb-4">Exercise Database - ${escape_html(currentBlockName)}</h3> <div class="text-sm text-gray-600 mb-4">Showing exercises for your current block. Values update automatically for weight calculations.</div> `);
  if (strengthExercises.length > 0) {
    $$payload.out.push("<!--[-->");
    const each_array = ensure_array_like(strengthExercises);
    $$payload.out.push(`<div class="mb-6"><h4 class="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2"><span class="w-3 h-3 bg-red-500 rounded-full"></span> Strength Exercises (1RM - ${escape_html(weightUnit)})</h4> <div class="space-y-3"><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let exercise = each_array[$$index];
      const exerciseKey = getExerciseKey(exercise);
      $$payload.out.push(`<div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"><label${attr("for", `max-${stringify(exerciseKey)}`)} class="flex-1 text-sm text-gray-700 font-medium">${escape_html(exercise)}</label> <div class="flex items-center gap-2"><input${attr("id", `max-${stringify(exerciseKey)}`)} type="number"${attr("value", maxes[exerciseKey] || "")} class="w-24 p-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all" placeholder="1RM"${attr("step", weightUnit === "kg" ? "2.5" : "5")}/> <span class="text-xs text-gray-500 font-medium w-8">${escape_html(weightUnit)}</span></div></div>`);
    }
    $$payload.out.push(`<!--]--></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (hypertrophyExercises.length > 0) {
    $$payload.out.push("<!--[-->");
    const each_array_1 = ensure_array_like(hypertrophyExercises);
    $$payload.out.push(`<div class="mb-6"><h4 class="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2"><span class="w-3 h-3 bg-blue-500 rounded-full"></span> Hypertrophy Exercises (10RM - ${escape_html(weightUnit)})</h4> <div class="space-y-3"><!--[-->`);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let exercise = each_array_1[$$index_1];
      const exerciseKey = getExerciseKey(exercise);
      $$payload.out.push(`<div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"><label${attr("for", `tenrm-${stringify(exerciseKey)}`)} class="flex-1 text-sm text-gray-700 font-medium">${escape_html(exercise)}</label> <div class="flex items-center gap-2"><input${attr("id", `tenrm-${stringify(exerciseKey)}`)} type="number"${attr("value", tenRMs[exerciseKey] || "")} class="w-24 p-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" placeholder="10RM" step="1"/> <span class="text-xs text-gray-500 font-medium w-8">${escape_html(weightUnit)}</span></div></div>`);
    }
    $$payload.out.push(`<!--]--></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (strengthExercises.length === 0 && hypertrophyExercises.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="text-center text-gray-400 py-8">`);
    Activity($$payload, { class: "w-12 h-12 mx-auto mb-3 opacity-50" });
    $$payload.out.push(`<!----> <p>No resistance exercises in current block</p> <p class="text-xs mt-1">Switch to a strength or powerbuilding block to see exercise settings</p></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function ResetProgress($$payload, $$props) {
  push();
  var $$store_subs;
  const showResetConfirm = store_get($$store_subs ??= {}, "$uiStore", uiStore).showResetConfirm;
  $$payload.out.push(`<div class="mb-6"><button class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors">Reset All Progress</button> `);
  if (showResetConfirm) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div class="bg-white rounded-lg p-6 max-w-sm mx-4"><h3 class="text-lg font-semibold text-gray-900 mb-3">Reset All Progress?</h3> <p class="text-gray-600 mb-6">Are you sure you want to reset all progress? This cannot be undone.</p> <div class="flex gap-3"><button class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors">Cancel</button> <button class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Reset</button></div></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let weightUnit = store_get($$store_subs ??= {}, "$preferencesStore", preferencesStore).weightUnit;
  $$payload.out.push(`<div>`);
  TrainingPlan($$payload);
  $$payload.out.push(`<!----> `);
  ExerciseDatabase($$payload);
  $$payload.out.push(`<!----> <div class="mb-6"><h3 class="text-lg font-semibold mb-4">Preferences</h3> <label for="weight-unit-select" class="block text-sm text-gray-600 mb-1">Weight Unit</label> <select id="weight-unit-select" class="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer hover:border-gray-400">`);
  $$payload.select_value = // Update weightUnit when store changes
  weightUnit;
  $$payload.out.push(`<option value="kg"${maybe_selected($$payload, "kg")}>Kilograms (kg)</option><option value="lbs"${maybe_selected($$payload, "lbs")}>Pounds (lbs)</option>`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div> `);
  ResetProgress($$payload);
  $$payload.out.push(`<!----></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
