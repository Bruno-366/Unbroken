export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.Btm_mpbq.js",app:"_app/immutable/entry/app.uVp5KAUR.js",imports:["_app/immutable/entry/start.Btm_mpbq.js","_app/immutable/chunks/DYvFO2PS.js","_app/immutable/chunks/V-HCuDPE.js","_app/immutable/chunks/BLYvR1oD.js","_app/immutable/entry/app.uVp5KAUR.js","_app/immutable/chunks/BLYvR1oD.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/V-HCuDPE.js","_app/immutable/chunks/C1kZ9-bI.js","_app/immutable/chunks/CYKpd2SO.js","_app/immutable/chunks/BW8CijES.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/workout/complete",
				pattern: /^\/api\/workout\/complete\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/workout/complete/_server.ts.js'))
			},
			{
				id: "/api/workout/current",
				pattern: /^\/api\/workout\/current\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/workout/current/_server.ts.js'))
			},
			{
				id: "/api/workout/state",
				pattern: /^\/api\/workout\/state\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/workout/state/_server.ts.js'))
			},
			{
				id: "/history",
				pattern: /^\/history\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/workout",
				pattern: /^\/workout\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
