<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { 
    uiStore, 
    isStoreInitialized
  } from '../stores'
  
  // Import global styles
  import '../app.css'

  // Access stores directly
  const isLoaded = $derived($isStoreInitialized)
  
  let { children } = $props()

  // Tab navigation helper
  const navigateToTab = (tab: string) => {
    const routes: Record<string, string> = {
      'overview': '/',
      'workout': '/workout',
      'history': '/history',
      'settings': '/settings'
    }
    goto(routes[tab] || '/')
  }

  // Derive current tab from URL
  const activeTab = $derived.by(() => {
    const pathname = $page.url.pathname
    if (pathname === '/') return 'overview'
    if (pathname.startsWith('/workout')) return 'workout'
    if (pathname.startsWith('/history')) return 'history'
    if (pathname.startsWith('/settings')) return 'settings'
    return 'overview'
  })
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-0 md:p-4">
  <div class="w-full md:max-w-2xl mx-auto bg-white md:rounded-2xl rounded-none shadow-2xl overflow-hidden min-h-screen md:min-h-0">
    <div class="bg-gray-900 text-white p-6 text-center">
      <h1 class="text-2xl font-bold">UNBROKEN</h1>
      <p class="text-gray-400 text-sm mt-1">Tactical Barbell Tracker</p>
    </div>

    {#if !isLoaded}
      <!-- Loading state -->
      <div class="flex items-center justify-center p-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading...</p>
        </div>
      </div>
    {:else}
      <!-- Navigation tabs -->
      <div class="flex bg-gray-100 border-b-2 border-gray-200">
        {#each ['overview', 'workout', 'history', 'settings'] as tab}
          <button
            onclick={() => navigateToTab(tab)}
            class="flex-1 py-4 px-2 sm:px-4 font-semibold capitalize transition-colors text-sm sm:text-base {
              activeTab === tab 
                ? 'text-blue-600 bg-white border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }"
          >
            {tab}
          </button>
        {/each}
      </div>

      <!-- Page content -->
      <div class="p-6 space-y-6">
        {@render children()}
      </div>
    {/if}
  </div>
</div>