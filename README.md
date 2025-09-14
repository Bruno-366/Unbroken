<img width="2560" height="1280" alt="image" src="https://github.com/user-attachments/assets/898953e8-f582-4d5a-86ad-f3e7769c3562" />

# Unbroken

**Tactical Barbell Tracker** - A modern SvelteKit application for tracking strength training, cardio workouts, and training blocks following the Tactical Barbell methodology. Built with TypeScript, featuring a comprehensive REST API and server-side rendering, ready for deployment on Cloudflare Pages.

## 📋 Features

- **Training Block Management**: Organize workouts into structured training blocks (Endurance, Powerbuilding, Strength, Bodybuilding)
- **Comprehensive Workout Tracking**: Support for strength, hypertrophy, LISS cardio, HIIT, rest, and deload workouts
- **Exercise Database**: Track 1RM and 10RM personal records with automatic weight calculations
- **Smart Warm-up Sets**: Automatically calculated warm-up progressions for strength workouts
- **Rest Timer**: Built-in timer with notifications and extend options
- **Workout History**: Complete tracking of all completed workouts
- **Drag & Drop Planning**: Reorder training blocks with intuitive drag-and-drop interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)

### Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Bruno-366/Unbroken.git
   cd Unbroken
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start SvelteKit development server with hot module replacement
- `npm run build` - Build for production (includes SSR bundle generation)
- `npm run preview` - Preview production build locally
- `npm run sync` - Sync SvelteKit generated files 
- `npm run lint` - Run ESLint with Svelte support
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run type-check` - Run SvelteKit sync and Svelte type checking

## 🏗️ Tech Stack

- **SvelteKit** - Full-stack web framework with server-side rendering and API routes
- **Svelte 5** - Modern reactive framework with runes for state management
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Build tool and dev server with hot module replacement
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **ESLint v9** - Code linting with flat config structure
- **Cloudflare Adapter** - Deployment as Cloudflare Workers with assets binding
- **REST API** - Comprehensive API endpoints for workout management
- **Tactical Barbell Methodology** - Structured training approach for strength and conditioning

## 🌐 Deployment on Cloudflare Pages

### Automatic Deployment (Recommended)

1. **Connect Repository to Cloudflare Pages:**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project"
   - Connect your GitHub account
   - Select the `Bruno-366/Unbroken` repository

2. **Configure Build Settings:**
   - **Framework preset**: `SvelteKit` (or `None` if SvelteKit is not available)
   - **Build command**: `npm run build`
   - **Build output directory**: `.svelte-kit/output/client`
   - **Root directory**: `/` (leave empty)
   - **Node.js version**: `18` or higher

3. **Environment Variables (if needed):**
   - Go to Settings > Environment variables
   - Add any required environment variables

4. **Deploy:**
   - Click "Save and Deploy"
   - Your site will be built and deployed automatically
   - Future pushes to the main branch will trigger automatic deployments

### Manual Deployment

1. Build the project locally:
   ```bash
   npm run build
   ```

2. Upload the `.svelte-kit/output/client` folder contents to Cloudflare Pages using:
   - Cloudflare Pages dashboard (drag and drop)
   - Wrangler CLI: `npx wrangler pages deploy .svelte-kit/output/client`

### Custom Domain

1. In Cloudflare Pages dashboard, go to your project
2. Navigate to "Custom domains"
3. Add your domain and follow DNS configuration instructions

## 🔧 Project Structure

```
Unbroken/
├── static/                       # Static assets (icons, favicons)
├── src/                          # Source code
│   ├── routes/                   # SvelteKit file-based routing
│   │   ├── +layout.svelte           # Main layout with navigation
│   │   ├── +layout.ts               # Layout data loading
│   │   ├── +page.svelte             # Overview page (home)
│   │   ├── api/                     # REST API endpoints
│   │   │   ├── exercises/               # Exercise management endpoints
│   │   │   ├── training-blocks/         # Training block endpoints
│   │   │   ├── training-plan/           # Training plan endpoints
│   │   │   ├── workout/                 # Workout state and completion endpoints
│   │   │   └── history/                 # Workout history endpoints
│   │   ├── workout/                 # Workout page
│   │   │   ├── +page.svelte             # Strength/cardio workout interface
│   │   │   └── +page.ts                 # Workout page data loading
│   │   ├── history/                 # History page
│   │   │   └── +page.svelte             # Workout history display
│   │   └── settings/                # Settings page
│   │       └── +page.svelte             # Exercise database and training plan management
│   ├── lib/                      # Shared library code (SvelteKit convention)
│   │   ├── blockTemplates.ts        # Training block templates and configurations
│   │   ├── stores.ts                # Client-side reactive stores
│   │   ├── types.ts                 # Centralized TypeScript interfaces
│   │   └── utils.ts                 # Shared utility functions (weight calculations, notifications)
│   ├── app.html                  # HTML template with PWA meta tags
│   ├── app.d.ts                  # SvelteKit app type definitions
│   └── app.css                   # Global styles with Tailwind CSS
├── .github/                      # GitHub Actions workflows
├── .svelte-kit/                  # SvelteKit generated files (git ignored)
├── eslint.config.js              # ESLint v9 flat configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite configuration with SvelteKit
├── wrangler.jsonc                # Cloudflare Pages configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
└── svelte.config.js              # Svelte and SvelteKit configuration
```

### Component Architecture

The application has been built with SvelteKit's full-stack architecture and Svelte 5's modern reactive patterns:

- **SvelteKit Framework**: File-based routing with dedicated pages for each section
- **REST API**: Comprehensive server-side API endpoints for all data operations
- **Server-Side Rendering**: Optimized initial page loads with SSR capabilities
- **Reactive State Management**: Svelte 5 runes ($state, $derived, $effect) with client-side stores
- **Type Safety**: Comprehensive TypeScript interfaces shared between client and server
- **Modular Architecture**: Clear separation between routes, API endpoints, and shared utilities
- **Progressive Enhancement**: Works with and without JavaScript enabled

## 🚨 CI/CD

The repository includes GitHub Actions workflow that runs on every push and pull request:

- **Linting**: ESLint v9 checks for code quality (Svelte components and TypeScript)
- **Type Checking**: SvelteKit sync and Svelte type checking validates components and TypeScript
- **Build**: Ensures the project builds successfully with SSR bundle generation
- **Artifact Upload**: Stores build output for review

## 🛠️ Customization

### Styling
- Built with **Tailwind CSS** for rapid UI development
- Utility-first approach with responsive design support
- Dark mode support included out of the box
- Modify `src/index.css` to customize Tailwind configuration
- Use Tailwind classes directly in your components for styling
- Custom CSS can be added to `src/index.css` if needed

### Additional Dependencies
```bash
# Example: Add a UI library (compatible with Tailwind and SvelteKit)
npm install @floating-ui/dom

# Example: Add form handling and validation for SvelteKit
npm install @sveltejs/enhanced:$form

# Example: Add database integration
npm install drizzle-orm @libsql/client

# Example: Add authentication
npm install @auth/sveltekit

# Example: Add date/time utilities
npm install date-fns

# Example: Add additional SvelteKit adapters
npm install @sveltejs/adapter-vercel @sveltejs/adapter-netlify
```

### Tailwind CSS Customization
- Modify `tailwind.config.js` to extend the theme, add custom colors, or configure plugins
- Add custom utilities or components in `src/app.css`
- Use Tailwind IntelliSense extension in VS Code for better development experience
- SvelteKit pages and components work seamlessly with Tailwind's utility classes

### Environment Variables
Create `.env` files for different environments:
- `.env` - Environment variables for all environments
- `.env.local` - Local development (git ignored)
- `.env.production` - Production builds

## 📚 Resources

- [SvelteKit Documentation](https://kit.svelte.dev/)
- [Svelte 5 Documentation](https://svelte.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Tactical Barbell Official](https://www.tacticalbarbell.com/) - Learn about the training methodology

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run lint && npm run type-check && npm run build`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
