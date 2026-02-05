'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
    MousePointer2,
    Hand,
    Undo2,
    Redo2,
    ChevronDown,
    Play,
    Loader2
} from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { useWorkflowStore } from '@/stores/workflow-store';
import { useCanvasToolStore, CanvasTool } from '@/stores/canvas-tool-store';

interface FloatingToolbarProps {
    onRun?: (scope: 'full' | 'selected' | 'single') => Promise<void>;
    isExecuting?: boolean;
}

export default function FloatingToolbar({ onRun, isExecuting = false }: FloatingToolbarProps) {
    const reactFlowInstance = useReactFlow();
    const [zoomLevel, setZoomLevel] = React.useState(100);
    const [showRunMenu, setShowRunMenu] = useState(false);

    // Tool state from store
    const activeTool = useCanvasToolStore((state) => state.activeTool);
    const setActiveTool = useCanvasToolStore((state) => state.setActiveTool);

    const undo = useWorkflowStore((state) => state.undo);
    const redo = useWorkflowStore((state) => state.redo);
    const canUndo = useWorkflowStore((state) => state.canUndo());
    const canRedo = useWorkflowStore((state) => state.canRedo());
    const selectedNodeIds = useWorkflowStore((state) => state.selectedNodeIds);
    const nodes = useWorkflowStore((state) => state.nodes);

    // Update zoom level display
    React.useEffect(() => {
        const interval = setInterval(() => {
            setZoomLevel(Math.round(reactFlowInstance.getZoom() * 100));
        }, 100);
        return () => clearInterval(interval);
    }, [reactFlowInstance]);

    // Handle tool switching
    const handleToolChange = useCallback((tool: CanvasTool) => {
        setActiveTool(tool);
    }, [setActiveTool]);

    // Keyboard shortcuts for tool switching
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (e.key === 'v' || e.key === 'V') {
                handleToolChange('select');
            } else if (e.key === 'h' || e.key === 'H') {
                handleToolChange('pan');
            } else if (e.key === ' ' && !e.repeat) {
                // Space bar temporarily activates pan (hold to pan)
                e.preventDefault();
                handleToolChange('pan');
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            // Release space bar returns to select mode
            if (e.key === ' ') {
                handleToolChange('select');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleToolChange]);

    const handleRun = useCallback(async (scope: 'full' | 'selected' | 'single') => {
        setShowRunMenu(false);
        if (onRun) {
            await onRun(scope);
        }
    }, [onRun]);

    return (
        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#212126] border border-[#2C2C2E] rounded-lg p-1 shadow-xl z-50">
            {/* Tool Selection */}
            <div className="flex bg-[#212126] rounded-md p-0.5">
                <button
                    onClick={() => handleToolChange('select')}
                    className={`p-2 rounded-sm transition-colors ${activeTool === 'select'
                        ? 'bg-[#E1E476] text-black'
                        : 'text-gray-400 hover:text-white hover:bg-[#2C2C2E]'
                        }`}
                    title="Select Tool (V) - Click to select, drag to create selection box"
                >
                    <MousePointer2 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleToolChange('pan')}
                    className={`p-2 rounded-sm transition-colors ${activeTool === 'pan'
                        ? 'bg-[#E1E476] text-black'
                        : 'text-gray-400 hover:text-white hover:bg-[#2C2C2E]'
                        }`}
                    title="Pan Tool (H or Space) - Drag to pan canvas"
                >
                    <Hand className="w-4 h-4" />
                </button>
            </div>

            <div className="w-px h-4 bg-[#2C2C2E]" />

            {/* History Controls */}
            <div className="flex gap-0.5">
                <button
                    onClick={undo}
                    disabled={!canUndo || isExecuting}
                    className="p-2 text-gray-400 hover:text-white rounded hover:bg-[#2C2C2E] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Undo (Ctrl+Z)"
                >
                    <Undo2 className="w-4 h-4" />
                </button>
                <button
                    onClick={redo}
                    disabled={!canRedo || isExecuting}
                    className="p-2 text-gray-400 hover:text-white rounded hover:bg-[#2C2C2E] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Redo (Ctrl+Shift+Z)"
                >
                    <Redo2 className="w-4 h-4" />
                </button>
            </div>

            <div className="w-px h-4 bg-[#2C2C2E]" />

            {/* Run Controls */}
            <div className="relative">
                <button
                    onClick={() => setShowRunMenu(!showRunMenu)}
                    disabled={isExecuting || nodes.length === 0}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#E1E476] hover:bg-[#d4d765] text-black rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold"
                >
                    {isExecuting ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Running...
                        </>
                    ) : (
                        <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Run
                            <ChevronDown className="w-3 h-3" />
                        </>
                    )}
                </button>

                {/* Run Menu Dropdown */}
                {showRunMenu && !isExecuting && (
                    <div className="absolute bottom-full mb-2 left-0 bg-[#1C1C1E] border border-[#2C2C2E] rounded-lg shadow-xl overflow-hidden min-w-[200px]">
                        <button
                            onClick={() => handleRun('full')}
                            className="w-full px-4 py-2.5 text-left text-white hover:bg-[#2C2C2E] transition-colors text-xs flex items-center justify-between group"
                        >
                            <span>Run Full Workflow</span>
                            <kbd className="px-2 py-0.5 bg-[#0E0E10] rounded text-[10px] text-gray-500 group-hover:text-gray-300">
                                ⌘ R
                            </kbd>
                        </button>

                        <button
                            onClick={() => handleRun('selected')}
                            disabled={selectedNodeIds.length === 0}
                            className="w-full px-4 py-2.5 text-left text-white hover:bg-[#2C2C2E] transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Run Selected Nodes
                            {selectedNodeIds.length > 0 && (
                                <span className="ml-2 text-[#E1E476]">({selectedNodeIds.length})</span>
                            )}
                        </button>
                    </div>
                )}
            </div>

            <div className="w-px h-4 bg-[#2C2C2E]" />

            {/* Node Count */}
            <div className="px-2 text-xs text-gray-400">
                {nodes.length} {nodes.length === 1 ? 'node' : 'nodes'}
            </div>

            <div className="w-px h-4 bg-[#2C2C2E]" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
                <button
                    className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-200 hover:text-white rounded hover:bg-[#2C2C2E] transition-colors min-w-[60px] justify-center"
                    onClick={() => reactFlowInstance.zoomIn()}
                >
                    {zoomLevel}%
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>
            </div>
        </div>
    );
}
