
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/exercises" | "/api/training-blocks" | "/api/workout" | "/api/workout/complete" | "/api/workout/current" | "/api/workout/state" | "/history" | "/settings" | "/workout";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/api": Record<string, never>;
			"/api/exercises": Record<string, never>;
			"/api/training-blocks": Record<string, never>;
			"/api/workout": Record<string, never>;
			"/api/workout/complete": Record<string, never>;
			"/api/workout/current": Record<string, never>;
			"/api/workout/state": Record<string, never>;
			"/history": Record<string, never>;
			"/settings": Record<string, never>;
			"/workout": Record<string, never>
		};
		Pathname(): "/" | "/api" | "/api/" | "/api/exercises" | "/api/exercises/" | "/api/training-blocks" | "/api/training-blocks/" | "/api/workout" | "/api/workout/" | "/api/workout/complete" | "/api/workout/complete/" | "/api/workout/current" | "/api/workout/current/" | "/api/workout/state" | "/api/workout/state/" | "/history" | "/history/" | "/settings" | "/settings/" | "/workout" | "/workout/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}