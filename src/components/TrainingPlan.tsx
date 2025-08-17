import React from 'react';
import type { AppState } from '../types';

interface TrainingPlanProps {
  state: AppState;
  onUpdateState: (updates: Partial<AppState>) => void;
  onManageBlocks: (action: string, data: { blockType?: string; index?: number }) => void;
}

// Available blocks configuration
const AVAILABLE_BLOCKS = {
  endurance1: { name: "Endurance Block 1", weeks: 8 },
  powerbuilding1: { name: "Powerbuilding Block 1", weeks: 3 },
  powerbuilding2: { name: "Powerbuilding Block 2", weeks: 3 },
  powerbuilding3: { name: "Powerbuilding Block 3", weeks: 3 },
  powerbuilding3bulgarian: { name: "Powerbuilding Block 3 - Bulgarian", weeks: 3 },
  bodybuilding: { name: "Bodybuilding Block", weeks: 3 },
  strength: { name: "Strength Block", weeks: 6 }
};

const TrainingPlan: React.FC<TrainingPlanProps> = ({
  state,
  onUpdateState,
  onManageBlocks
}) => {
  const handleDrag = (action: string, data: { index?: number; e?: React.DragEvent<HTMLDivElement> }) => {
    switch(action) {
      case 'start':
        if (!data.index || data.index === 0) { data.e?.preventDefault(); return; }
        onUpdateState({ draggedIndex: data.index, dragOverIndex: null });
        if (data.e) {
          data.e.dataTransfer.effectAllowed = 'move';
          data.e.dataTransfer.setData('text/plain', data.index.toString());
        }
        break;
      case 'over':
        data.e?.preventDefault();
        if (data.e) data.e.dataTransfer.dropEffect = 'move';
        break;
      case 'enter':
        data.e?.preventDefault();
        if (data.index && data.index > 0 && state.draggedIndex !== null && data.index !== state.draggedIndex) {
          onUpdateState({ dragOverIndex: data.index });
        }
        break;
      case 'leave':
        if (data.e && !data.e.currentTarget.contains(data.e.relatedTarget as Node)) {
          onUpdateState({ dragOverIndex: null });
        }
        break;
      case 'drop': {
        data.e?.preventDefault();
        data.e?.stopPropagation();
        if (state.draggedIndex === null || !data.index || data.index === 0) {
          onUpdateState({ draggedIndex: null, dragOverIndex: null });
          return;
        }
        const newPlan = [...state.customPlan];
        const draggedBlock = newPlan[state.draggedIndex];
        newPlan.splice(state.draggedIndex, 1);
        let insertIndex = data.index;
        if (state.draggedIndex < data.index) insertIndex = data.index - 1;
        newPlan.splice(insertIndex, 0, draggedBlock);
        onUpdateState({ customPlan: newPlan, draggedIndex: null, dragOverIndex: null });
        break;
      }
      case 'end':
        onUpdateState({ draggedIndex: null, dragOverIndex: null });
        break;
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Training Plan</h3>
      <div className="mb-4">
        {state.customPlan.map((block, index) => (
          <div key={index}>
            {index > 0 && (
              <div 
                onDragOver={(e) => handleDrag('over', { e })}
                onDragEnter={(e) => handleDrag('enter', { e, index })}
                onDragLeave={(e) => handleDrag('leave', { e })}
                onDrop={(e) => handleDrag('drop', { e, index })}
                className={state.draggedIndex !== null && state.dragOverIndex === index
                  ? 'min-h-16 border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg flex items-center justify-center mb-3 p-3'
                  : 'h-3 mb-3'
                }
              >
                {state.draggedIndex !== null && state.dragOverIndex === index && (
                  <span className="text-xs text-blue-600 font-medium">Drop here</span>
                )}
              </div>
            )}
            
            <div 
              draggable={index !== 0}
              onDragStart={(e) => handleDrag('start', { e, index })}
              onDragEnd={() => handleDrag('end', {})}
              className={`border rounded-lg p-3 ${
                index === 0 ? 'border-blue-500 bg-blue-50 border-2' : 'border-gray-200 hover:shadow-md cursor-move'
              } ${state.draggedIndex === index ? 'opacity-50 transform rotate-2' : ''}`}
            >
              <div className="flex items-center gap-3">
                {index !== 0 && <div className="text-gray-400 text-sm">⋮⋮</div>}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {index === 0 && <span className="text-sm text-gray-500 font-medium">Current</span>}
                    <div className="font-semibold text-gray-900">{block.name}</div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{block.weeks} weeks</div>
                </div>
                {index !== 0 && (
                  <button
                    onClick={() => onManageBlocks('remove', { index })}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
              {index === 0 && (
                <div className="text-xs text-blue-600 mt-2 font-medium">
                  Week {state.currentWeek} of {block.weeks} • Day {state.currentDay}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-2">Add Block</label>
        <select
          onChange={(e) => {
            if (e.target.value) {
              onManageBlocks('add', { blockType: e.target.value });
              e.target.value = '';
            }
          }}
          className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer hover:border-gray-400"
          defaultValue=""
        >
          <option value="" disabled>Select a block type to add...</option>
          {Object.entries(AVAILABLE_BLOCKS).map(([key, block]) => (
            <option key={key} value={key}>{block.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TrainingPlan;