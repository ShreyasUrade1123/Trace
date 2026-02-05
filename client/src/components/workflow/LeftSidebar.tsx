'use client';

import { useState } from 'react';
import {
    Type,
    Image,
    Video,
    Bot,
    Crop,
    Film,
    Search,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useWorkflowStore } from '@/stores/workflow-store';
import { NodeType } from '@/types/nodes';

interface NodeButtonProps {
    type: NodeType;
    label: string;
    icon: React.ReactNode;
    color: string;
}

const NODE_BUTTONS: NodeButtonProps[] = [
    { type: 'text', label: 'Text', icon: <Type className="w-5 h-5" />, color: 'bg-blue-500' },
    { type: 'uploadImage', label: 'Upload Image', icon: <Image className="w-5 h-5" />, color: 'bg-purple-500' },
    { type: 'uploadVideo', label: 'Upload Video', icon: <Video className="w-5 h-5" />, color: 'bg-pink-500' },
    { type: 'llm', label: 'Run LLM', icon: <Bot className="w-5 h-5" />, color: 'bg-green-500' },
    { type: 'cropImage', label: 'Crop Image', icon: <Crop className="w-5 h-5" />, color: 'bg-amber-500' },
    { type: 'extractFrame', label: 'Extract Frame', icon: <Film className="w-5 h-5" />, color: 'bg-red-500' },
];

export function LeftSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const addNode = useWorkflowStore((state) => state.addNode);

    const filteredNodes = NODE_BUTTONS.filter(node =>
        node.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddNode = (type: NodeType) => {
        // Add node at a random position in the visible canvas area
        const position = {
            x: 200 + Math.random() * 200,
            y: 100 + Math.random() * 200,
        };
        addNode(type, position);
    };

    const handleDragStart = (e: React.DragEvent, type: NodeType) => {
        e.dataTransfer.setData('application/reactflow', type);
        e.dataTransfer.effectAllowed = 'move';
    };

    if (isCollapsed) {
        return (
            <div className="w-12 bg-[#212126] border-r border-gray-800 flex flex-col items-center py-4">
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <div className="mt-4 space-y-2">
                    {NODE_BUTTONS.map((node) => (
                        <button
                            key={node.type}
                            onClick={() => handleAddNode(node.type)}
                            draggable
                            onDragStart={(e) => handleDragStart(e, node.type)}
                            className={`p-2 ${node.color} rounded-lg text-white hover:opacity-80 transition-opacity`}
                            title={node.label}
                        >
                            {node.icon}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-[300px] bg-[#212126] border-r border-gray-800 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h2 className="font-semibold text-white">Nodes</h2>
                <button
                    onClick={() => setIsCollapsed(true)}
                    className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            {/* Search */}
            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search nodes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            </div>

            {/* Quick Access */}
            <div className="px-4 pb-2">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Quick Access</h3>
            </div>

            {/* Node Buttons */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                {filteredNodes.map((node) => (
                    <button
                        key={node.type}
                        onClick={() => handleAddNode(node.type)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, node.type)}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg transition-colors group cursor-grab active:cursor-grabbing"
                    >
                        <div className={`p-2 ${node.color} rounded-lg text-white`}>
                            {node.icon}
                        </div>
                        <span className="text-sm text-white font-medium">{node.label}</span>
                    </button>
                ))}

                {filteredNodes.length === 0 && (
                    <p className="text-center text-gray-500 text-sm py-4">
                        No nodes found
                    </p>
                )}
            </div>
        </div>
    );
}
