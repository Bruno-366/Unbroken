import { j as sanitize_props, k as spread_props, l as slot, b as store_get, c as attr_class, d as escape_html, f as stringify, m as attr, o as clsx, u as unsubscribe_stores, a as pop, p as push, h as attr_style, e as ensure_array_like } from "../../../chunks/index2.js";
import "clsx";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "../../../chunks/state.svelte.js";
import { u as uiStore, w as workoutStore, e as exerciseStore, p as preferencesStore } from "../../../chunks/stores.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { C as Clock } from "../../../chunks/clock.js";
import { c as calculateWeight, a as calculateHypertrophyWeight, b as calculateWarmupSets } from "../../../chunks/utils3.js";
function Circle_check_big($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.446.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { "d": "M21.801 10A10 10 0 1 1 17 3.335" }],
    ["path", { "d": "m9 11 3 3L22 4" }]
  ];
  Icon($$payload, spread_props([
    { name: "circle-check-big" },
    $$sanitized_props,
    {
      /**
       * @component @name CircleCheckBig
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuODAxIDEwQTEwIDEwIDAgMSAxIDE3IDMuMzM1IiAvPgogIDxwYXRoIGQ9Im05IDExIDMgM0wyMiA0IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/circle-check-big
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
function Pause($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.446.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "rect",
      { "x": "14", "y": "4", "width": "4", "height": "16", "rx": "1" }
    ],
    [
      "rect",
      { "x": "6", "y": "4", "width": "4", "height": "16", "rx": "1" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "pause" },
    $$sanitized_props,
    {
      /**
       * @component @name Pause
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB4PSIxNCIgeT0iNCIgd2lkdGg9IjQiIGhlaWdodD0iMTYiIHJ4PSIxIiAvPgogIDxyZWN0IHg9IjYiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjE2IiByeD0iMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/pause
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
function Play($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.446.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [["polygon", { "points": "6 3 20 12 6 21 6 3" }]];
  Icon($$payload, spread_props([
    { name: "play" },
    $$sanitized_props,
    {
      /**
       * @component @name Play
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cG9seWdvbiBwb2ludHM9IjYgMyAyMCAxMiA2IDIxIDYgMyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/play
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
function Square($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.446.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "rect",
      { "width": "18", "height": "18", "x": "3", "y": "3", "rx": "2" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "square" },
    $$sanitized_props,
    {
      /**
       * @component @name Square
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/square
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
function CardioWorkouts($$payload, $$props) {
  push();
  var $$store_subs;
  let { workout } = $$props;
  const CARDIO_WORKOUT_CONFIGS = {
    liss: {
      bg: "from-green-500 to-blue-500",
      button: "Complete LISS Cardio"
    },
    hiit: {
      bg: "from-orange-500 to-red-500",
      button: "Complete HIIT Cardio"
    }
  };
  const cardioWorkout = () => workout;
  const config = () => {
    const type = cardioWorkout().type;
    return CARDIO_WORKOUT_CONFIGS[type];
  };
  const lissTimer = store_get($$store_subs ??= {}, "$uiStore", uiStore).lissTimer;
  const displayDuration = () => {
    if (workout.type === "liss" && cardioWorkout().duration !== void 0) {
      if (lissTimer.isActive || lissTimer.isPaused || lissTimer.timeLeft > 0) {
        const minutes = Math.floor(lissTimer.timeLeft / 60);
        const seconds = lissTimer.timeLeft % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
      } else {
        return cardioWorkout().duration;
      }
    }
    return cardioWorkout().duration;
  };
  const showTimerControls = () => {
    return workout.type === "liss" && cardioWorkout().duration !== void 0;
  };
  const buttonStates = () => {
    const isStartDisabled = lissTimer.isActive;
    const isPauseDisabled = !lissTimer.isActive;
    const isStopDisabled = !lissTimer.isActive && !lissTimer.isPaused;
    return {
      start: {
        disabled: isStartDisabled,
        class: isStartDisabled ? "flex-1 bg-green-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-40 cursor-not-allowed" : "flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-100"
      },
      pause: {
        disabled: isPauseDisabled,
        class: isPauseDisabled ? "flex-1 bg-yellow-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-40 cursor-not-allowed" : "flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-100"
      },
      stop: {
        disabled: isStopDisabled,
        class: isStopDisabled ? "flex-1 bg-red-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-40 cursor-not-allowed" : "flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 opacity-100"
      }
    };
  };
  if (workout.type === "liss" || workout.type === "hiit") {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div><div${attr_class(`bg-gradient-to-r ${stringify(config().bg)} text-white p-6 rounded-lg text-center`)}><h3 class="text-2xl font-bold mb-2">${escape_html(cardioWorkout().activity)}</h3> `);
    if (cardioWorkout().duration !== void 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="text-4xl font-bold">${escape_html(displayDuration())}</div> <div class="text-sm opacity-90 mt-1">`);
      if (workout.type === "liss") {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`minutes`);
      } else {
        $$payload.out.push("<!--[!-->");
        $$payload.out.push(`seconds`);
      }
      $$payload.out.push(`<!--]--></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> `);
    if (cardioWorkout().distance !== void 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="text-4xl font-bold">${escape_html(cardioWorkout().distance)}</div> <div class="text-sm opacity-90 mt-1">`);
      if (workout.type === "liss") {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`km`);
      } else {
        $$payload.out.push("<!--[!-->");
        $$payload.out.push(`m`);
      }
      $$payload.out.push(`<!--]--></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> `);
    if (cardioWorkout().rounds !== void 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="text-2xl font-semibold mt-2">${escape_html(cardioWorkout().rounds)} rounds</div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div> `);
    if (showTimerControls()) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="flex gap-2 mt-4"><button${attr("disabled", buttonStates().start.disabled, true)}${attr_class(clsx(buttonStates().start.class))}>`);
      Play($$payload, { class: "w-5 h-5", stroke: "none", fill: "currentColor" });
      $$payload.out.push(`<!----> Start</button> <button${attr("disabled", buttonStates().pause.disabled, true)}${attr_class(clsx(buttonStates().pause.class))}>`);
      Pause($$payload, { class: "w-5 h-5", stroke: "none", fill: "currentColor" });
      $$payload.out.push(`<!----> Pause</button> <button${attr("disabled", buttonStates().stop.disabled, true)}${attr_class(clsx(buttonStates().stop.class))}>`);
      Square($$payload, { class: "w-5 h-5", stroke: "none", fill: "currentColor" });
      $$payload.out.push(`<!----> Stop</button></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> <button class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors mt-4">${escape_html(config().button)}</button></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function RestTimer($$payload, $$props) {
  push();
  var $$store_subs;
  const restTimer = store_get($$store_subs ??= {}, "$uiStore", uiStore).restTimer;
  const progressPercent = () => {
    if (restTimer.totalTime === 0) return 0;
    return (restTimer.totalTime - restTimer.timeLeft) / restTimer.totalTime * 100;
  };
  if (
    // Timer interval effect - timestamp-based to prevent background throttling
    // IMPORTANT: Rest timer won't show until user accepts or rejects notification permissions
    // Check more frequently for smoother updates
    // Separate effect to handle notification when timer reaches 0
    restTimer.isActive
  ) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="mb-4 p-4 bg-white rounded-lg border-2 border-orange-200"><div class="flex items-center justify-between mb-2"><div class="flex items-center gap-2">`);
    Clock($$payload, { class: "w-5 h-5 text-orange-600" });
    $$payload.out.push(`<!----> <span class="text-sm font-semibold text-gray-700">${escape_html(restTimer.phase === "extended" ? "Extended Rest" : "Rest Time")}</span></div> <div class="text-lg font-bold text-gray-900">${escape_html(Math.floor(restTimer.timeLeft / 60))}:${escape_html((restTimer.timeLeft % 60).toString().padStart(2, "0"))}</div></div> <div class="mb-3"><div class="bg-gray-200 h-3 rounded-full overflow-hidden"><div${attr_class(`h-full transition-all duration-300 ${stringify(restTimer.phase === "extended" ? "bg-red-500" : "bg-orange-500")}`)}${attr_style(`width: ${stringify(progressPercent())}%`)}></div></div></div> <div class="flex gap-2"><button${attr_class(`flex-1 ${stringify(restTimer.timeLeft === 0 ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600")} text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm`)}>${escape_html(restTimer.timeLeft === 0 ? "Complete Rest" : "Skip Rest")}</button> `);
    if (restTimer.workoutType === "strength" && restTimer.phase !== "extended" && restTimer.timeLeft === 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<button class="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">Extend to 5 min</button>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function StrengthWorkouts($$payload, $$props) {
  push();
  var $$store_subs;
  let { workout } = $$props;
  const completedSets = store_get($$store_subs ??= {}, "$workoutStore", workoutStore).completedSets;
  const maxes = store_get($$store_subs ??= {}, "$exerciseStore", exerciseStore).maxes;
  const tenRMs = store_get($$store_subs ??= {}, "$exerciseStore", exerciseStore).tenRMs;
  const weightUnit = store_get($$store_subs ??= {}, "$preferencesStore", preferencesStore).weightUnit;
  const strengthWorkout = () => workout;
  const getExerciseData = (exerciseIndex, schemeIndex) => {
    const setSchemes = (strengthWorkout().sets || "").split(",");
    const intensities = String(strengthWorkout().intensity || 0).split(",");
    const shouldMapByIndex = setSchemes.length === (strengthWorkout().exercises || []).length;
    const intensityIndex = shouldMapByIndex ? exerciseIndex : schemeIndex;
    const intensity = parseInt(intensities[intensityIndex] || intensities[0]);
    return { intensity, shouldMapByIndex };
  };
  const isSetCompleted = (key) => Boolean(completedSets[key]);
  if (workout.type === "strength" || workout.type === "hypertrophy") {
    $$payload.out.push("<!--[-->");
    const each_array = ensure_array_like(strengthWorkout().exercises || []);
    $$payload.out.push(`<div class="space-y-4">`);
    RestTimer($$payload);
    $$payload.out.push(`<!----> <!--[-->`);
    for (let exerciseIndex = 0, $$length = each_array.length; exerciseIndex < $$length; exerciseIndex++) {
      let exercise = each_array[exerciseIndex];
      const setSchemes = (strengthWorkout().sets || "").split(",");
      const exerciseSetSchemes = getExerciseData(exerciseIndex, 0).shouldMapByIndex ? [setSchemes[exerciseIndex]] : setSchemes;
      const each_array_1 = ensure_array_like(exerciseSetSchemes);
      $$payload.out.push(`<!--[-->`);
      for (let schemeIndex = 0, $$length2 = each_array_1.length; schemeIndex < $$length2; schemeIndex++) {
        let setScheme = each_array_1[schemeIndex];
        const { intensity } = getExerciseData(exerciseIndex, schemeIndex);
        const weight = strengthWorkout().type === "strength" ? calculateWeight(exercise, intensity, { maxes, weightUnit }) : calculateHypertrophyWeight(exercise, intensity, { tenRMs, maxes });
        const [sets, reps] = setScheme.split("x");
        const warmupSets = strengthWorkout().type === "strength" && weight > 0 ? calculateWarmupSets(exercise, weight, { weightUnit }) : [];
        const each_array_3 = ensure_array_like(Array(parseInt(sets)));
        $$payload.out.push(`<div class="bg-gray-50 rounded-xl p-5 border border-gray-200"><h4 class="font-bold text-gray-900 mb-2 text-lg">${escape_html(exercise)}</h4> <div class="text-sm text-gray-600 mb-4 font-medium">${escape_html(setScheme)} @ ${escape_html(intensity)}%${escape_html(weight > 0 ? ` (${weight} ${weightUnit})` : "")}</div> `);
        if (warmupSets.length > 0) {
          $$payload.out.push("<!--[-->");
          const each_array_2 = ensure_array_like(warmupSets);
          $$payload.out.push(`<div class="mb-4"><h5 class="text-sm font-semibold text-gray-700 mb-2">Warm-up Sets</h5> <div class="space-y-2"><!--[-->`);
          for (let warmupIndex = 0, $$length3 = each_array_2.length; warmupIndex < $$length3; warmupIndex++) {
            let warmupSet = each_array_2[warmupIndex];
            const warmupKey = `warmup-${exerciseIndex}-${schemeIndex}-${warmupIndex}-0`;
            $$payload.out.push(`<div class="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200"><div class="flex items-center gap-3"><span class="text-xs font-medium text-blue-700 w-16">Warm-up ${escape_html(warmupIndex + 1)}</span> <span class="text-sm text-blue-800">${escape_html(warmupSet.reps)} reps @ ${escape_html(warmupSet.weight)} ${escape_html(weightUnit)}</span></div> <button${attr_class(`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${stringify(isSetCompleted(warmupKey) ? "bg-blue-500 border-blue-500 text-white" : "border-blue-300 hover:border-blue-400 bg-white")}`)}>`);
            if (isSetCompleted(warmupKey)) {
              $$payload.out.push("<!--[-->");
              Circle_check_big($$payload, { class: "w-4 h-4" });
            } else {
              $$payload.out.push("<!--[!-->");
            }
            $$payload.out.push(`<!--]--></button></div>`);
          }
          $$payload.out.push(`<!--]--></div></div>`);
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]--> <div class="space-y-3"><h5 class="text-sm font-semibold text-gray-700">Working Sets</h5> <!--[-->`);
        for (let setIndex = 0, $$length3 = each_array_3.length; setIndex < $$length3; setIndex++) {
          each_array_3[setIndex];
          const setKey = `${exerciseIndex}-${schemeIndex}-${setIndex}`;
          $$payload.out.push(`<div class="flex items-center justify-between bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all"><div class="flex items-center gap-3"><span class="text-sm font-semibold text-gray-700 w-12">Set ${escape_html(setIndex + 1)}</span> <span class="text-sm text-gray-800">${escape_html(reps)} reps</span></div> <div class="flex items-center gap-3">`);
          if (weight > 0) {
            $$payload.out.push("<!--[-->");
            $$payload.out.push(`<input type="number" class="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"${attr("value", weight)} placeholder="Weight"${attr("step", weightUnit === "kg" ? "2.5" : "5")}/>`);
          } else {
            $$payload.out.push("<!--[!-->");
          }
          $$payload.out.push(`<!--]--> <button${attr_class(`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${stringify(isSetCompleted(setKey) ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-green-400 bg-white")}`)}>`);
          if (isSetCompleted(setKey)) {
            $$payload.out.push("<!--[-->");
            Circle_check_big($$payload, { class: "w-5 h-5" });
          } else {
            $$payload.out.push("<!--[!-->");
          }
          $$payload.out.push(`<!--]--></button></div></div>`);
        }
        $$payload.out.push(`<!--]--></div></div>`);
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]--> <button class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors">Complete Workout</button></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function RestWorkouts($$payload, $$props) {
  push();
  let { workout } = $$props;
  const REST_WORKOUT_CONFIGS = {
    rest: {
      bg: "from-purple-500 to-pink-500",
      title: "Rest Day",
      desc: "Take a day off to recover",
      button: "Complete Rest Day"
    },
    deload: {
      bg: "from-blue-500 to-teal-500",
      title: "Deload",
      desc: "Light activity or mobility work",
      button: "Complete Deload Day"
    }
  };
  const restWorkout = () => workout;
  const config = () => {
    const type = restWorkout().type;
    return REST_WORKOUT_CONFIGS[type];
  };
  if (workout.type === "rest" || workout.type === "deload") {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div><div${attr_class(`bg-gradient-to-r ${stringify(config().bg)} text-white p-6 rounded-lg text-center`)}><h3 class="text-2xl font-bold mb-2">${escape_html(config().title)}</h3> <p class="opacity-90">${escape_html(config().desc)}</p></div> <button class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors mt-4">${escape_html(config().button)}</button></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  pop();
}
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  const getCurrentWorkout = data.getCurrentWorkout;
  const currentBlockInfo = data.currentBlockInfo;
  const currentWeek = data.currentWeek;
  const currentDay = data.currentDay;
  const renderWorkout = () => {
    const workout = getCurrentWorkout;
    if (!workout) {
      return "none";
    }
    if (workout.type === "strength" || workout.type === "hypertrophy") {
      return "strength";
    } else if (workout.type === "liss" || workout.type === "hiit") {
      return "cardio";
    } else if (workout.type === "rest" || workout.type === "deload") {
      return "rest";
    }
    return "unknown";
  };
  $$payload.out.push(`<div><div class="bg-blue-600 text-white p-4 rounded-lg mb-6 text-center"><div class="text-sm opacity-90 mb-1">Week ${escape_html(currentWeek)}, Day ${escape_html(currentDay)}</div> <div class="text-xl font-bold">${escape_html(currentBlockInfo.name)}</div></div> `);
  if (renderWorkout() === "strength" && getCurrentWorkout) {
    $$payload.out.push("<!--[-->");
    StrengthWorkouts($$payload, {
      workout: getCurrentWorkout
    });
  } else {
    $$payload.out.push("<!--[!-->");
    if (renderWorkout() === "cardio" && getCurrentWorkout) {
      $$payload.out.push("<!--[-->");
      CardioWorkouts($$payload, {
        workout: getCurrentWorkout
      });
    } else {
      $$payload.out.push("<!--[!-->");
      if (renderWorkout() === "rest" && getCurrentWorkout) {
        $$payload.out.push("<!--[-->");
        RestWorkouts($$payload, {
          workout: getCurrentWorkout
        });
      } else {
        $$payload.out.push("<!--[!-->");
        $$payload.out.push(`<p class="text-red-500 font-semibold">No workout found for the current week and day</p>`);
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--></div>`);
  pop();
}
export {
  _page as default
};
