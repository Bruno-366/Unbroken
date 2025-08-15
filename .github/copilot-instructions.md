# Tactical Barbell Hybrid Athlete Tracker

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Setup
- Prerequisites: Node.js 18.0.0+ is required
- Install dependencies: `npm install`
- Install missing lucide-react dependency: `npm install lucide-react`
- The application will start with TypeScript errors but runs successfully in development mode

### Build Process
- `npm run build` - **FAILS due to TypeScript errors. Use Vite build instead.**
- `npx vite build --mode development` - Builds successfully in ~3 seconds. NEVER CANCEL.
- Build output directory: `dist/`
- Build produces 3 main files: index.html, CSS (~4KB), and JS bundle (~180KB)

### Development Server
- `npm run dev` - Start development server on http://localhost:5173 in ~200ms. NEVER CANCEL.
- Server starts despite TypeScript errors and application is fully functional
- Hot reload works for code changes

### Preview Built Application
- `npm run preview` - Preview production build on http://localhost:4173. NEVER CANCEL.
- Must run build command first before preview

### Linting and Type Checking
- `npm run lint` - **FAILS with 8 ESLint errors (~1 second). Known issues documented below.**
- `npm run lint:fix` - Auto-fix some linting issues
- `npm run type-check` - **FAILS with 72 TypeScript errors (~2 seconds). Known issues documented below.**

### Testing
- No test suite is currently configured in this project

## Known Issues and Workarounds

### Critical Build Issues
1. **Missing Dependency**: `lucide-react` is imported but not in package.json
   - Fix: `npm install lucide-react`
   
2. **TypeScript Errors**: 72 type errors prevent `npm run build`
   - Workaround: Use `npx vite build --mode development` to build successfully
   - Main issues: missing types, implicit 'any' types, unused imports
   
3. **ESLint Errors**: 8 linting errors including unused imports and case block declarations
   - Can be partially fixed with `npm run lint:fix`

### Successful Commands Despite Errors
- Development server works perfectly: `npm run dev`
- Vite build bypasses TypeScript: `npx vite build --mode development`
- Application is fully functional despite build issues

## Validation Scenarios

Always manually validate changes by testing these user scenarios:

### Core Application Flow
1. **Start Development Server**: `npm run dev` and verify http://localhost:5173 loads
2. **Navigation Test**: Click through all tabs (Overview, Workout, History, Settings)
3. **Workout Tracking**: 
   - Go to Workout tab
   - Verify exercises display with calculated weights (e.g., Overhead Press 3x5 @ 70%)
   - Test warmup sets and working sets display correctly
   - Verify weight calculations based on 1RM values
4. **Settings Configuration**:
   - Go to Settings tab  
   - Verify training plan shows current block (Endurance Block 1)
   - Test exercise database shows correct 1RM values
   - Verify weight unit toggle (kg/lbs) functionality

### Build Validation
1. **Development Build**: Run `npx vite build --mode development`
2. **Preview Test**: Run `npm run preview` and verify application loads on http://localhost:4173
3. **Functionality Check**: Repeat core application flow on preview build

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push/PR:
- **Install**: `npm ci` (~30 seconds)
- **Lint**: `npm run lint` - **CURRENTLY FAILS**
- **Type Check**: `npm run type-check` - **CURRENTLY FAILS** 
- **Build**: `npm run build` - **CURRENTLY FAILS**
- **Artifact Upload**: Stores `dist/` for 7 days

**IMPORTANT**: CI pipeline currently fails due to TypeScript and linting errors. New changes should not introduce additional errors.

## Application Architecture

### Tech Stack
- **React 18** with TypeScript
- **Vite** for build tooling and dev server
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **ESLint** for code quality

### Key Components
- **App.tsx**: Main application component (~1000+ lines)
- **Block System**: Different training blocks (Endurance, Powerbuilding, Bodybuilding, Strength)
- **Exercise Database**: 1RM tracking for strength exercises
- **Workout Calculator**: Auto-calculates weights based on percentages
- **Training Plan**: Multi-week block progression

### Project Structure
```
Unbroken/
├── public/             # Static assets  
├── src/                # Source code
│   ├── App.tsx         # Main application (1000+ lines)
│   ├── main.tsx        # React entry point
│   └── index.css       # Global Tailwind styles
├── .github/workflows/  # CI/CD pipelines
├── dist/               # Build output (generated)
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── tsconfig.json       # TypeScript configuration
```

## Development Guidelines

### Making Changes
1. **Always test in development mode first**: `npm run dev`
2. **Validate with Vite build**: `npx vite build --mode development` 
3. **Test preview build**: `npm run preview`
4. **Check for new linting errors**: `npm run lint` (expect existing failures)
5. **Verify application functionality** with core user scenarios

### Code Quality
- Follow existing TypeScript patterns (even if not strictly typed)
- Use Tailwind CSS for styling
- Maintain existing component structure
- Add lucide-react icons consistently with existing usage

### Common File Locations
- Main application logic: `src/App.tsx`
- Styling: `src/index.css` (Tailwind utilities)
- Configuration: `vite.config.ts`, `tailwind.config.js`, `tsconfig.json`
- CI/CD: `.github/workflows/ci.yml`

## Deployment
- **Platform**: Cloudflare Pages
- **Build Command**: `npm run build` (currently fails - use `npx vite build`)
- **Build Directory**: `dist`
- **Node Version**: 18+

Always test changes thoroughly with the validation scenarios above before committing.