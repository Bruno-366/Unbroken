<script lang="ts">
  import type { AppState } from '../types'

  interface TrainingPlanProps {
    state: AppState
    onUpdateState: (updates: Partial<AppState>) => void
    onManageBlocks: (action: string, data: { blockType?: string; index?: number }) => void
  }

  let { state, onUpdateState, onManageBlocks }: TrainingPlanProps = $props()

  // Available blocks configuration
  const AVAILABLE_BLOCKS = {
    endurance1: { name: "Endurance Block 1", weeks: 8 },
    powerbuilding1: { name: "Powerbuilding Block 1", weeks: 3 },
    powerbuilding2: { name: "Powerbuilding Block 2", weeks: 3 },
    powerbuilding3: { name: "Powerbuilding Block 3", weeks: 3 },
    powerbuilding3bulgarian: { name: "Powerbuilding Block 3 - Bulgarian", weeks: 3 },
    bodybuilding: { name: "Bodybuilding Block", weeks: 3 },
    strength: { name: "Strength Block", weeks: 6 }
  }

  const handleDrag = (action: string, data: { index?: number; e?: DragEvent }) => {
    switch(action) {
      case 'start':
        if (!data.index || data.index === 0) { 
          data.e?.preventDefault()
          return
        }
        onUpdateState({ draggedIndex: data.index, dragOverIndex: null })
        if (data.e) {
          data.e.dataTransfer!.effectAllowed = 'move'
          data.e.dataTransfer!.setData('text/plain', data.index.toString())
        }
        break
      case 'over':
        data.e?.preventDefault()
        if (data.e) data.e.dataTransfer!.dropEffect = 'move'
        break
      case 'enter':
        data.e?.preventDefault()
        if (data.index && data.index > 0 && state.draggedIndex !== null && data.index !== state.draggedIndex) {
          onUpdateState({ dragOverIndex: data.index })
        }
        break
      case 'leave':
        if (data.e && !data.e.currentTarget!.contains(data.e.relatedTarget as Node)) {
          onUpdateState({ dragOverIndex: null })
        }
        break
      case 'drop': {
        data.e?.preventDefault()
        data.e?.stopPropagation()
        if (state.draggedIndex === null || !data.index || data.index === 0) {
          onUpdateState({ draggedIndex: null, dragOverIndex: null })
          return
        }
        const newPlan = [...state.customPlan]
        const draggedBlock = newPlan[state.draggedIndex]
        newPlan.splice(state.draggedIndex, 1)
        let insertIndex = data.index
        if (state.draggedIndex < data.index) insertIndex = data.index - 1
        newPlan.splice(insertIndex, 0, draggedBlock)
        onUpdateState({ customPlan: newPlan, draggedIndex: null, dragOverIndex: null })
        break
      }
      case 'end':
        onUpdateState({ draggedIndex: null, dragOverIndex: null })
        break
    }
  }

  let selectedBlockType = ''
</script>

<div class="mb-6">
  <h3 class="text-lg font-semibold mb-4">Training Plan</h3>
  <div class="mb-4">
    {#each state.customPlan as block, index}
      <div>
        {#if index > 0}
          <div 
            ondragover={(e) => handleDrag('over', { e })}
            ondragenter={(e) => handleDrag('enter', { e, index })}
            ondragleave={(e) => handleDrag('leave', { e })}
            ondrop={(e) => handleDrag('drop', { e, index })}
            class="{state.draggedIndex !== null && state.dragOverIndex === index
              ? 'min-h-16 border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg flex items-center justify-center mb-3 p-3'
              : 'h-3 mb-3'
            }"
          >
            {#if state.draggedIndex !== null && state.dragOverIndex === index}
              <span class="text-xs text-blue-600 font-medium">Drop here</span>
            {/if}
          </div>
        {/if}
        
        <div 
          draggable={index !== 0}
          ondragstart={(e) => handleDrag('start', { e, index })}
          ondragend={() => handleDrag('end', {})}
          class="border rounded-lg p-3 {
            index === 0 ? 'border-blue-500 bg-blue-50 border-2' : 'border-gray-200 hover:shadow-md cursor-move'
          } {state.draggedIndex === index ? 'opacity-50 transform rotate-2' : ''}"
        >
          <div class="flex items-center gap-3">
            {#if index !== 0}
              <div class="text-gray-400 text-sm">⋮⋮</div>
            {/if}
            <div class="flex-1">
              <div class="flex items-center gap-2">
                {#if index === 0}
                  <span class="text-sm text-gray-500 font-medium">Current</span>
                {/if}
                <div class="font-semibold text-gray-900">{block.name}</div>
              </div>
              <div class="text-xs text-gray-600 mt-1">{block.weeks} weeks</div>
            </div>
            {#if index !== 0}
              <button
                onclick={() => onManageBlocks('remove', { index })}
                class="p-1 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            {/if}
          </div>
          {#if index === 0}
            <div class="text-xs text-blue-600 mt-2 font-medium">
              Week {state.currentWeek} of {block.weeks} • Day {state.currentDay}
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <div class="mb-4">
    <label class="block text-sm text-gray-600 mb-2">Add Block</label>
    <select
      bind:value={selectedBlockType}
      onchange={(e) => {
        const target = e.target as HTMLSelectElement
        if (target.value) {
          onManageBlocks('add', { blockType: target.value })
          selectedBlockType = ''
        }
      }}
      class="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer hover:border-gray-400"
    >
      <option value="" disabled>Select a block type to add...</option>
      {#each Object.entries(AVAILABLE_BLOCKS) as [key, block]}
        <option value={key}>{block.name}</option>
      {/each}
    </select>
  </div>
</div>