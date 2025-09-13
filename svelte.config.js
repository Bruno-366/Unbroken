import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      // Cloudflare Pages configuration for SPA
      pages: 'dist',
      assets: 'dist',
      fallback: 'index.html',
      precompress: false,
      strict: false
    }),
    prerender: {
      handleHttpError: 'warn'
    }
  }
}

export default config