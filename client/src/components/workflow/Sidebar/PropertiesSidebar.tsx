'use client';

import React from 'react';
import { useWorkflowStore } from '@/stores/workflow-store';
import { Info, Sparkles } from 'lucide-react';
import { LLMNodeData } from '@/types/nodes';

const MODELS = [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
    { id: 'gemini-1.5-pro-002', name: 'Gemini 1.5 Pro' },
    { id: 'gemini-1.5-flash-002', name: 'Gemini 1.5 Flash' },
    { id: 'gpt-4o', name: 'GPT-4o' },
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
];

export default function PropertiesSidebar() {
    const selectedNodeIds = useWorkflowStore((state) => state.selectedNodeIds);
    const nodes = useWorkflowStore((state) => state.nodes);
    const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

    const selectedNode = nodes.find(n => n.id === selectedNodeIds[0]);

    if (!selectedNode || selectedNodeIds.length !== 1) {
        return null; // Only show when exactly one node is selected
    }

    // Only supporting LLM node properties for now as per request
    if (selectedNode.type !== 'llm') {
        return null;
    }

    const data = selectedNode.data as LLMNodeData;

    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateNodeData(selectedNode.id, { model: e.target.value });
    };

    const handleThinkingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeData(selectedNode.id, { thinking: e.target.checked });
    };

    const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeData(selectedNode.id, { temperature: parseFloat(e.target.value) });
    };

    return (
        <div className="w-[300px] bg-[#212126] h-full border-l border-[#2C2C2E] flex flex-col z-20">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#2C2C2E]">
                <h2 className="text-sm font-semibold text-gray-200">Run Any LLM</h2>
            </div>

            {/* Content */}
            <div className="p-5 space-y-6 overflow-y-auto">
                {/* Inputs / Outputs Info */}
                <div className="space-y-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <span>Inputs / Outputs</span>
                        <Info className="w-3.5 h-3.5" />
                    </div>

                    <div className="space-y-3">
                        <div>
                            <span className="text-[11px] font-medium text-gray-500 block mb-1.5">From</span>
                            <div className="px-3 py-1.5 bg-[#1C1C1E] border border-[#2C2C2E] rounded text-xs text-gray-400 w-fit">
                                Input
                            </div>
                        </div>
                        <div>
                            <span className="text-[11px] font-medium text-gray-500 block mb-1.5">To</span>
                            <div className="px-3 py-1.5 bg-[#1C1C1E] border border-[#2C2C2E] rounded text-xs text-gray-400 w-fit">
                                Output
                            </div>
                        </div>
                    </div>
                </div>

                {/* Model Selection */}
                <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                        <label className="text-xs font-medium text-gray-400">Model Name</label>
                        <Info className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    <div className="relative">
                        <select
                            value={data.model || 'gemini-2.0-flash'}
                            onChange={handleModelChange}
                            className="w-full bg-[#1C1C1E] border border-[#2C2C2E] rounded-lg px-3 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-gray-500 appearance-none"
                        >
                            {MODELS.map(model => (
                                <option key={model.id} value={model.id}>{model.name}</option>
                            ))}
                        </select>
                        {/* Custom arrow could go here */}
                    </div>
                </div>

                {/* Thinking Toggle */}
                <div className="flex items-center gap-2">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            checked={data.thinking || false}
                            onChange={handleThinkingChange}
                            id="thinking-toggle"
                            className="peer w-4 h-4 rounded border border-[#2C2C2E] bg-[#1C1C1E] text-purple-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                    </div>
                    <label htmlFor="thinking-toggle" className="text-xs text-gray-400 cursor-pointer select-none">Thinking</label>
                    <Info className="w-3.5 h-3.5 text-gray-600" />
                </div>

                {/* Temperature Slider */}
                <div className="space-y-3">
                    <div className="flex items-center gap-1.5">
                        <label className="text-xs font-medium text-gray-400">Temperature</label>
                        <Info className="w-3.5 h-3.5 text-gray-600" />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 h-1 bg-[#2C2C2E] rounded-full">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={data.temperature ?? 0}
                                onChange={handleTemperatureChange}
                                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div
                                className="absolute h-full bg-gray-500 rounded-full"
                                style={{ width: `${(data.temperature ?? 0) * 100}%` }}
                            />
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow cursor-pointer"
                                style={{ left: `${(data.temperature ?? 0) * 100}%` }}
                            />
                        </div>
                        <div className="w-10 px-2 py-1 bg-[#1C1C1E] border border-[#2C2C2E] rounded text-center text-xs text-gray-300">
                            {data.temperature ?? 0}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
