import { b as store_get, e as ensure_array_like, d as escape_html, h as attr_style, f as stringify, u as unsubscribe_stores, a as pop, p as push } from "../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "clsx";
import "../../chunks/state.svelte.js";
import { w as workoutStore, t as trainingPlanStore } from "../../chunks/stores.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  const currentWeek = store_get($$store_subs ??= {}, "$workoutStore", workoutStore).currentWeek;
  store_get($$store_subs ??= {}, "$workoutStore", workoutStore).currentDay;
  const customPlan = store_get($$store_subs ??= {}, "$trainingPlanStore", trainingPlanStore).customPlan;
  const currentBlockInfo = customPlan[0] || { name: "No active block", weeks: 0 };
  const each_array = ensure_array_like(customPlan.slice(1, 4));
  $$payload.out.push(`<div><div class="bg-gray-100 p-4 rounded-lg mb-6"><h3 class="text-sm text-gray-600 mb-2">Current Block</h3> <div class="text-xl font-bold text-gray-900 mb-3">${escape_html(currentBlockInfo.name)}</div> <div class="bg-gray-300 h-2 rounded-full overflow-hidden mb-2"><div class="bg-green-500 h-full transition-all duration-300"${attr_style(`width: ${stringify((currentWeek - 1) / currentBlockInfo.weeks * 100)}%`)}></div></div> <div class="text-xs text-gray-600">Week ${escape_html(currentWeek)} of ${escape_html(currentBlockInfo.weeks)}</div></div> <div class="mb-6"><h3 class="text-sm font-semibold text-gray-600 uppercase mb-3">Upcoming Blocks</h3> <!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let block = each_array[$$index];
    $$payload.out.push(`<div class="bg-gray-100 p-3 rounded-lg mb-2"><div class="font-semibold text-gray-800">${escape_html(block.name)}</div> <div class="text-xs text-gray-600">${escape_html(block.weeks)} weeks</div></div>`);
  }
  $$payload.out.push(`<!--]--></div> <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">Start Today's Workout</button></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
