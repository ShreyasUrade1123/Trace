/**
 * Canvas Tool Store
 * 
 * Manages the active tool state for the workflow canvas.
 * This is separate from workflow-store to avoid circular dependencies.
 */

import { create } from 'zustand';

export type CanvasTool = 'select' | 'pan';

interface CanvasToolState {
    activeTool: CanvasTool;
    setActiveTool: (tool: CanvasTool) => void;
}

export const useCanvasToolStore = create<CanvasToolState>((set) => ({
    activeTool: 'select',
    setActiveTool: (tool) => set({ activeTool: tool }),
}));
