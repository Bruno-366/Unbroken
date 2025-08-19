<img width="2560" height="1280" alt="image" src="https://github.com/user-attachments/assets/898953e8-f582-4d5a-86ad-f3e7769c3562" />

# Unbroken

**Tactical Barbell Tracker** - A modern Svelte 5 application for tracking strength training, cardio workouts, and training blocks following the Tactical Barbell methodology. Built with TypeScript and Vite, ready for deployment on Cloudflare Pages.

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

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run type-check` - Run Svelte type checking

## 🏗️ Tech Stack

- **Svelte 5** - Modern reactive framework with runes for state management
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Build tool and dev server with hot module replacement
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **ESLint** - Code linting and quality enforcement
- **Tactical Barbell Methodology** - Structured training approach for strength and conditioning

## 🌐 Deployment on Cloudflare Pages

### Automatic Deployment (Recommended)

1. **Connect Repository to Cloudflare Pages:**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project"
   - Connect your GitHub account
   - Select the `Bruno-366/Unbroken` repository

2. **Configure Build Settings:**
   - **Framework preset**: `None` (or `Vite` if available)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
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

2. Upload the `dist` folder contents to Cloudflare Pages using:
   - Cloudflare Pages dashboard (drag and drop)
   - Wrangler CLI: `npx wrangler pages deploy dist`

### Custom Domain

1. In Cloudflare Pages dashboard, go to your project
2. Navigate to "Custom domains"
3. Add your domain and follow DNS configuration instructions

## 🔧 Project Structure

```
Unbroken/
├── public/                      # Static assets
├── src/                         # Source code
│   ├── components/              # Svelte components (refactored from monolithic App.svelte)
│   │   ├── CardioWorkouts.svelte   # LISS and HIIT workout rendering
│   │   ├── StrengthWorkouts.svelte # Strength/hypertrophy workouts with warm-up sets
│   │   ├── RestWorkouts.svelte     # Rest and deload workout rendering
│   │   ├── History.svelte          # Workout history display
│   │   ├── TrainingPlan.svelte     # Training blocks drag & drop management
│   │   ├── ExerciseDatabase.svelte # 1RM and 10RM exercise input management
│   │   ├── RestTimer.svelte        # Rest timer with visual feedback
│   │   └── ResetProgress.svelte    # Reset confirmation modal
│   ├── App.svelte                  # Main App component with reactive state management
│   ├── types.ts                 # Centralized TypeScript interfaces and types
│   ├── utils.ts                 # Shared utility functions (weight calculations, notifications)
│   ├── blockTemplates.ts        # Training block templates and configurations
│   ├── main.ts                  # Entry point
│   └── app.css                  # Global styles with Tailwind CSS
├── .github/                     # GitHub Actions workflows
├── dist/                        # Build output (generated)
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
├── wrangler.jsonc               # Cloudflare Pages configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── svelte.config.js             # Svelte configuration
└── .eslintrc.cjs                # ESLint configuration
```

### Component Architecture

The application has been built with Svelte 5's modern reactive architecture using runes for state management:

- **Reactive State Management**: Svelte 5 runes ($state, $derived, $effect) provide automatic reactivity
- **Component Composition**: Each component handles a specific aspect of functionality
- **Type Safety**: Comprehensive TypeScript interfaces ensure code reliability
- **Reusability**: Components are designed to be easily testable and modifiable
- **Maintainability**: Svelte's compile-time optimizations and clean syntax improve maintainability

## 🚨 CI/CD

The repository includes GitHub Actions workflow that runs on every push and pull request:

- **Linting**: ESLint checks for code quality (Svelte components included)
- **Type Checking**: Svelte type checking validates components and TypeScript
- **Build**: Ensures the project builds successfully
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
# Example: Add a UI library (compatible with Tailwind and Svelte)
npm install @floating-ui/dom

# Example: Add routing (for multi-page functionality)
npm install svelte-spa-router

# Example: Add form handling and validation
npm install felte @felte/validator-zod zod

# Example: Add state management (if needed for larger scale)
npm install svelte/store

# Example: Add date/time utilities
npm install date-fns
```

### Tailwind CSS Customization
- Modify `tailwind.config.js` to extend the theme, add custom colors, or configure plugins
- Add custom utilities or components in `src/app.css`
- Use Tailwind IntelliSense extension in VS Code for better development experience
- Svelte components work seamlessly with Tailwind's utility classes

### Environment Variables
Create `.env` files for different environments:
- `.env.local` - Local development
- `.env.production` - Production builds

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [Svelte 5 Documentation](https://svelte.dev/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
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
