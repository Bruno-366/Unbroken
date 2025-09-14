# Unbroken - Tactical Barbell Tracker

Unbroken is a SvelteKit + TypeScript Progressive Web App (PWA) for tracking Tactical Barbell workouts. It features a comprehensive REST API, server-side rendering, workout tracking, rest timers, exercise database, and training block templates. The app is deployed on Cloudflare Pages with Cloudflare Workers.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap, Build, and Test
- Install dependencies: `npm install` -- takes 20-25 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
- Run linting: `npm run lint` -- takes 1.5 seconds. Set timeout to 30+ seconds.
- Run type checking: `npm run type-check` -- takes 3-4 seconds (includes SvelteKit sync). Set timeout to 30+ seconds.
- Build for production: `npm run build` -- takes 15-20 seconds (includes SSR bundle). NEVER CANCEL. Set timeout to 60+ seconds.
- Fix linting issues: `npm run lint:fix` -- takes 1.5 seconds. Set timeout to 30+ seconds.
- Sync SvelteKit files: `npm run sync` -- takes 1 second. Set timeout to 30+ seconds.

### Run the Application
- ALWAYS run `npm install` first if working with a fresh clone.
- Development server: `npm run dev` -- starts in 1-2 seconds, serves on http://localhost:5173
- Preview production build: `npm run preview` -- serves production build on http://localhost:4173
- Sync SvelteKit generated files: `npm run sync` -- regenerates types and routes

### Validation
- ALWAYS manually validate any new code by testing complete workout scenarios.
- Test the primary workout flow: Start app → Navigate to "Workout" tab → Click "Start Today's Workout" → Complete at least one set → Verify rest timer appears → Test weight adjustments.
- ALWAYS test at least one complete end-to-end workout scenario after making changes.
- Test on development server (npm run dev) for iterative changes.
- Always run `npm run lint && npm run type-check && npm run build` before you are done or the CI (.github/workflows/ci.yml) will fail.

## Validation Scenarios

After making changes, always test these key scenarios:

1. **Workout Flow Validation**:
   - Start development server: `npm run dev`
   - Access http://localhost:5173
   - Navigate to "Workout" tab using tab navigation
   - Click "Start Today's Workout" button
   - Complete at least one exercise set by clicking the checkmark button
   - Verify rest timer appears and counts down properly
   - Test weight adjustment using spinbutton controls
   - Verify "Complete Workout" functionality works

2. **Navigation Validation**:
   - Test all tab navigation (overview, workout, history, settings)
   - Verify SvelteKit routing works correctly between pages
   - Check that training block information displays correctly on overview
   - Verify API endpoints respond correctly (check browser network tab)

3. **Build Pipeline Validation**:
   - Ensure `npm run build` completes successfully with SSR bundle
   - Verify `.svelte-kit/output/` directory is created with proper client and server assets
   - Test production preview with `npm run preview`

## Common Tasks

### Repository Structure
```
.
├── .github/                     # GitHub Actions workflows (CI/CD)
├── eslint.config.js             # ESLint v9 flat configuration
├── .svelte-kit/                 # SvelteKit generated files (git ignored)
├── static/                      # Static assets (icons, favicons)
├── src/                         # Source code
│   ├── routes/                  # SvelteKit file-based routing
│   │   ├── +layout.svelte           # Main layout with navigation and tab system
│   │   ├── +layout.ts               # Layout data loading
│   │   ├── +page.svelte             # Overview page (home/dashboard)
│   │   ├── api/                     # REST API endpoints
│   │   │   ├── exercises/               # Exercise management (1RM, 10RM, current block)
│   │   │   ├── training-blocks/         # Training block templates and management
│   │   │   ├── training-plan/           # Training plan drag & drop management
│   │   │   ├── workout/                 # Workout state, current, completion
│   │   │   └── history/                 # Workout history endpoints
│   │   ├── workout/                 # Workout page route
│   │   │   ├── +page.svelte             # Strength/cardio workout interface with rest timer
│   │   │   └── +page.ts                 # Workout page data loading
│   │   ├── history/                 # History page route
│   │   │   └── +page.svelte             # Workout history display
│   │   └── settings/                # Settings page route
│   │       └── +page.svelte             # Exercise database and training plan management
│   ├── lib/                     # Shared library code (SvelteKit convention)
│   │   ├── blockTemplates.ts        # Training block templates and configurations
│   │   ├── stores.ts                # Client-side reactive stores for app state
│   │   ├── types.ts                 # Centralized TypeScript interfaces and types
│   │   └── utils.ts                 # Shared utility functions (weight calculations, notifications)
│   ├── app.html                 # HTML template with PWA meta tags
│   ├── app.d.ts                 # SvelteKit app type definitions
│   └── app.css                  # Global styles with Tailwind CSS
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration with SvelteKit and PWA plugin
├── svelte.config.js             # Svelte and SvelteKit configuration with Cloudflare adapter
└── wrangler.jsonc               # Cloudflare Pages configuration
```

### Key Components and Files
- `src/lib/blockTemplates.ts` - Core training block configurations (endurance, powerbuilding, strength blocks)
- `src/routes/workout/+page.svelte` - Main workout interface with rest timers and set tracking
- `src/routes/api/` - REST API endpoints for all data operations
- `src/lib/types.ts` - All TypeScript interfaces and types for workouts, exercises, and app state
- `src/lib/utils.ts` - Weight calculations, notifications, and utility functions
- `src/lib/stores.ts` - Client-side reactive stores for app state management

### Framework and Technology Stack
- **SvelteKit** - Full-stack web framework with file-based routing and server-side rendering
- **Svelte 5** with TypeScript and runes for reactive state management
- **Vite** for build tooling and development server
- **Tailwind CSS** for styling (utility-first CSS framework)
- **PWA** capabilities via vite-plugin-pwa
- **Lucide Svelte** for icons
- **ESLint v9** for code quality with flat config structure and Svelte plugin
- **Cloudflare Adapter** for deployment as Cloudflare Workers with assets binding

### Prerequisites
- Node.js 18.0.0 or higher (currently uses Node.js 20+)
- npm (comes with Node.js)

### CI/CD Pipeline
The repository includes GitHub Actions workflow (`.github/workflows/ci.yml`) that runs on every push and pull request:
- **Linting**: ESLint v9 checks for code quality (includes Svelte components and TypeScript)
- **Type Checking**: SvelteKit sync and Svelte type checking validates components and TypeScript
- **Build**: Ensures the project builds successfully with SSR bundle generation
- **Artifact Upload**: Stores build output for review

### Working with Workout Templates
- Training blocks are defined in `src/lib/blockTemplates.ts`
- Each block contains weeks, and each week contains days with different workout types
- Workout types include: strength, liss (cardio), hiit, rest, deload, hypertrophy
- Exercise database and one-rep max calculations are handled in API routes and client stores
- API endpoints provide RESTful access to all workout data and state

### Styling and Customization
- Uses Tailwind CSS utility classes for styling
- Custom styles can be added to `src/app.css`
- Tailwind configuration in `tailwind.config.js`
- PWA theming configured in `vite.config.ts` and `src/app.html`

### Common Command Outputs

#### ls -la (repo root)
```
eslint.config.js
.git/
.github/
.gitignore
README.md
_headers
index.html
package-lock.json
package.json
postcss.config.js
src/
static/
svelte.config.js
tailwind.config.js
tsconfig.json
tsconfig.node.json
vite.config.ts
wrangler.jsonc
```

#### package.json scripts
```json
{
  "dev": "vite dev",
  "build": "npx svelte-kit sync && vite build", 
  "preview": "vite preview",
  "sync": "npx svelte-kit sync",
  "lint": "eslint . --ext ts,js,svelte --report-unused-disable-directives --max-warnings 0",
  "lint:fix": "eslint . --ext ts,js,svelte --fix",
  "type-check": "npx svelte-kit sync && svelte-check --tsconfig tsconfig.json"
}
```

### Environment and Dependencies
- No additional SDKs required beyond Node.js 18+
- All dependencies are managed via npm and defined in package.json
- Build outputs to `.svelte-kit/output/` directory (client and server)
- Development server runs on http://localhost:5173
- Production preview runs on http://localhost:4173

### Timing Expectations
- `npm install`: ~20-25 seconds
- `npm run build`: ~15-20 seconds total (SvelteKit compilation with SSR bundle)
- `npm run lint`: ~1.5 seconds
- `npm run type-check`: ~3-4 seconds (includes svelte-kit sync)
- `npm run dev`: 1-2 seconds to start server
- `npm run sync`: ~1 second

### Known Issues and Warnings
- TypeScript version warning in ESLint (does not affect functionality)
- Various npm deprecation warnings during install (do not affect build or runtime)
- Svelte 5 is stable but some third-party libraries may not yet support runes syntax
- SvelteKit generates `.svelte-kit/` directory which should be git ignored