import * as universal from '../entries/pages/workout/_page.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/workout/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/workout/+page.ts";
export const imports = ["_app/immutable/nodes/5.6Yjg9tJ2.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/BLYvR1oD.js","_app/immutable/chunks/C1kZ9-bI.js","_app/immutable/chunks/DYvFO2PS.js","_app/immutable/chunks/V-HCuDPE.js","_app/immutable/chunks/QymdAjaL.js","_app/immutable/chunks/iL5XMXXd.js","_app/immutable/chunks/BW8CijES.js","_app/immutable/chunks/TaA13ZAX.js","_app/immutable/chunks/BLjZBFMP.js","_app/immutable/chunks/XCoXhkFK.js","_app/immutable/chunks/Dwz624zC.js","_app/immutable/chunks/CYKpd2SO.js","_app/immutable/chunks/C9d6mpJC.js"];
export const stylesheets = [];
export const fonts = [];
