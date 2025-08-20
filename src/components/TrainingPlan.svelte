<script lang="ts">
  import { trainingPlanStore, workoutStore } from '../stores'
  
  // Access stores directly
  let customPlan = $state($trainingPlanStore.customPlan)
  const currentWeek = $derived($workoutStore.currentWeek)
  const currentDay = $derived($workoutStore.currentDay)
  
  // Subscribe to store changes to update local state
  $effect(() => {
    customPlan = $trainingPlanStore.customPlan
  })
  
  // Update store when local state changes
  $effect(() => {
    trainingPlanStore.set({ customPlan })
  })

  // Available blocks configuration - static data, doesn't need to be reactive
  const AVAILABLE_BLOCKS = {
    endurance1: { name: "Endurance Block 1", weeks: 8 },
    powerbuilding1: { name: "Powerbuilding Block 1", weeks: 3 },
    powerbuilding2: { name: "Powerbuilding Block 2", weeks: 3 },
    powerbuilding3: { name: "Powerbuilding Block 3", weeks: 3 },
    powerbuilding3bulgarian: { name: "Powerbuilding Block 3 - Bulgarian", weeks: 3 },
    bodybuilding: { name: "Bodybuilding Block", weeks: 3 },
    strength: { name: "Strength Block", weeks: 6 }
  } as const

  // Simplify manageBlocks - more idiomatic with direct object destructuring
  const manageBlocks = (action: string, data: { blockType?: string; index?: number; draggedIndex?: number; dropIndex?: number }) => {
    const { blockType, index, draggedIndex, dropIndex } = data
    
    switch(action) {
      case 'add': {
        if (!blockType) return
        const blockConfig = AVAILABLE_BLOCKS[blockType as keyof typeof AVAILABLE_BLOCKS]
        if (!blockConfig) return
        customPlan = [...customPlan, { 
          name: blockConfig.name, 
          weeks: blockConfig.weeks, 
          type: blockType 
        }]
        break
      }
      case 'remove':
        if (customPlan.length <= 1) {
          alert('You must have at least one block in your plan.')
          return
        }
        if (index !== undefined) {
          customPlan = customPlan.filter((_, i) => i !== index)
        }
        break
      case 'reorder':
        // Handle reordering via drag & drop with cleaner logic
        if (draggedIndex !== undefined && dropIndex !== undefined && draggedIndex !== dropIndex) {
          const newPlan = [...customPlan]
          const draggedBlock = newPlan[draggedIndex]
          newPlan.splice(draggedIndex, 1)
          
          // Adjust drop index if dragging from before the drop position
          const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex
          newPlan.splice(insertIndex, 0, draggedBlock)
          customPlan = newPlan
        }
        break
    }
  }

  // Local drag state - more idiomatic than global state for UI interactions
  let dragState = $state({
    draggedIndex: null as number | null,
    dragOverIndex: null as number | null
  })

  // Extract drag handlers as standalone functions for better readability
  const handleDragStart = (e: DragEvent, index: number) => {
    if (index === 0) {
      e.preventDefault()
      return
    }
    
    dragState.draggedIndex = index
    dragState.dragOverIndex = null
    
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', index.toString())
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move'
    }
  }

  const handleDragEnter = (e: DragEvent, index: number) => {
    e.preventDefault()
    if (index > 0 && dragState.draggedIndex !== null && index !== dragState.draggedIndex) {
      dragState.dragOverIndex = index
    }
  }

  const handleDragLeave = (e: DragEvent) => {
    // Only clear drag over if actually leaving the element
    if (e.currentTarget && e.currentTarget instanceof Element && !e.currentTarget.contains(e.relatedTarget as Node)) {
      dragState.dragOverIndex = null
    }
  }

  const handleDrop = (e: DragEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (dragState.draggedIndex === null || index === 0) {
      dragState.draggedIndex = null
      dragState.dragOverIndex = null
      return
    }
    
    // Use the simplified manageBlocks interface
    manageBlocks('reorder', {
      draggedIndex: dragState.draggedIndex,
      dropIndex: index
    })
    
    // Reset drag state
    dragState.draggedIndex = null
    dragState.dragOverIndex = null
  }

  const handleDragEnd = () => {
    dragState.draggedIndex = null
    dragState.dragOverIndex = null
  }

  let selectedType = $state('')
</script>

<div class="mb-6">
  <h3 class="text-lg font-semibold mb-4">Training Plan</h3>
  <div class="mb-4">
    {#each customPlan as block, index}
      <div>
        {#if index > 0}
          <div 
            role="region"
            aria-label="Drop zone for reordering training blocks"
            ondragover={handleDragOver}
            ondragenter={(e) => handleDragEnter(e, index)}
            ondragleave={handleDragLeave}
            ondrop={(e) => handleDrop(e, index)}
            class="{dragState.draggedIndex !== null && dragState.dragOverIndex === index
              ? 'min-h-16 border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg flex items-center justify-center mb-3 p-3'
              : 'h-3 mb-3'
            }"
          >
            {#if dragState.draggedIndex !== null && dragState.dragOverIndex === index}
              <span class="text-xs text-blue-600 font-medium">Drop here</span>
            {/if}
          </div>
        {/if}
        
        <div 
          role="button"
          tabindex={index === 0 ? -1 : 0}
          aria-label={index === 0 ? 'Current training block (not draggable)' : `Drag to reorder ${block.name} training block`}
          draggable={index !== 0}
          ondragstart={(e) => handleDragStart(e, index)}
          ondragend={handleDragEnd}
          class="border rounded-lg p-3 {
            index === 0 ? 'border-blue-500 bg-blue-50 border-2' : 'border-gray-200 hover:shadow-md cursor-move'
          } {dragState.draggedIndex === index ? 'opacity-50 transform rotate-2' : ''}"
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
                onclick={() => manageBlocks('remove', { index })}
                class="p-1 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            {/if}
          </div>
          {#if index === 0}
            <div class="text-xs text-blue-600 mt-2 font-medium">
              Week {currentWeek} of {block.weeks} • Day {currentDay}
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <div class="mb-4">
    <label for="add-block-select" class="block text-sm text-gray-600 mb-2">Add Block</label>
    <select
      id="add-block-select"
      bind:value={selectedType}
      onchange={(e) => {
        const target = e.target as HTMLSelectElement
        if (target.value) {
          manageBlocks('add', { blockType: target.value })
          selectedType = ''
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