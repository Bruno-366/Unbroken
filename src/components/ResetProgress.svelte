<script lang="ts">
  interface Props {
    showResetConfirm: boolean
    onShowReset: () => void
    onCancelReset: () => void
    onConfirmReset: () => void
  }

  let { showResetConfirm, onShowReset, onCancelReset, onConfirmReset }: Props = $props()
</script>

<div class="mb-6">
  <button
    onclick={onShowReset}
    class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
  >
    Reset All Progress
  </button>

  {#if showResetConfirm}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Reset All Progress?</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to reset all progress? This cannot be undone.</p>
        <div class="flex gap-3">
          <button
            onclick={onCancelReset}
            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onclick={onConfirmReset}
            class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>