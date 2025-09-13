import { g as getContext, b as store_get, e as ensure_array_like, c as attr_class, d as escape_html, u as unsubscribe_stores, a as pop, p as push, f as stringify } from "../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "clsx";
import "../../chunks/state.svelte.js";
import { i as isStoreInitialized } from "../../chunks/stores.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  const isLoaded = store_get($$store_subs ??= {}, "$isStoreInitialized", isStoreInitialized);
  let { children } = $$props;
  const activeTab = (() => {
    const pathname = store_get($$store_subs ??= {}, "$page", page).url.pathname;
    if (pathname === "/") return "overview";
    if (pathname.startsWith("/workout")) return "workout";
    if (pathname.startsWith("/history")) return "history";
    if (pathname.startsWith("/settings")) return "settings";
    return "overview";
  })();
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-0 md:p-4"><div class="w-full md:max-w-2xl mx-auto bg-white md:rounded-2xl rounded-none shadow-2xl overflow-hidden min-h-screen md:min-h-0"><div class="bg-gray-900 text-white p-6 text-center"><h1 class="text-2xl font-bold">UNBROKEN</h1> <p class="text-gray-400 text-sm mt-1">Tactical Barbell Tracker</p></div> `);
  if (!isLoaded) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="flex items-center justify-center p-12"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div> <p class="text-gray-600">Loading...</p></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    const each_array = ensure_array_like(["overview", "workout", "history", "settings"]);
    $$payload.out.push(`<div class="flex bg-gray-100 border-b-2 border-gray-200"><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tab = each_array[$$index];
      $$payload.out.push(`<button${attr_class(`flex-1 py-4 px-2 sm:px-4 font-semibold capitalize transition-colors text-sm sm:text-base ${stringify(activeTab === tab ? "text-blue-600 bg-white border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800")}`)}>${escape_html(tab)}</button>`);
    }
    $$payload.out.push(`<!--]--></div> <div class="p-6 space-y-6">`);
    children($$payload);
    $$payload.out.push(`<!----></div>`);
  }
  $$payload.out.push(`<!--]--></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _layout as default
};
