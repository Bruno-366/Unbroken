# Unbroken

A modern React application built with TypeScript and Vite, ready for deployment on Cloudflare Pages.

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
- `npm run type-check` - Run TypeScript type checking

## 🏗️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting

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
├── public/             # Static assets
├── src/                # Source code
│   ├── App.tsx         # Main App component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles with Tailwind CSS
├── .github/            # GitHub Actions workflows
├── dist/               # Build output (generated)
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
├── wrangler.jsonc      # Cloudflare Pages configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
└── .eslintrc.cjs       # ESLint configuration
```

## 🚨 CI/CD

The repository includes GitHub Actions workflow that runs on every push and pull request:

- **Linting**: ESLint checks for code quality
- **Type Checking**: TypeScript compiler validates types
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
# Example: Add a UI library (compatible with Tailwind)
npm install @headlessui/react @heroicons/react

# Example: Add routing
npm install react-router-dom
npm install --save-dev @types/react-router-dom

# Example: Add form handling
npm install react-hook-form @hookform/resolvers zod
```

### Tailwind CSS Customization
- Modify `tailwind.config.js` to extend the theme, add custom colors, or configure plugins
- Add custom utilities or components in `src/index.css`
- Use Tailwind IntelliSense extension in VS Code for better development experience

### Environment Variables
Create `.env` files for different environments:
- `.env.local` - Local development
- `.env.production` - Production builds

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

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
