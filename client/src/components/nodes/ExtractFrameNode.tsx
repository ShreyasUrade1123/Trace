'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { Film, MoreHorizontal, Loader2 } from 'lucide-react';
import { ExtractFrameNodeData } from '@/types/nodes';
import { useWorkflowStore } from '@/stores/workflow-store';
import { NodeContextMenu } from '../ui/NodeContextMenu';
import { RenameModal } from '../ui/RenameModal';

function ExtractFrameNodeComponent({ id, data, selected }: NodeProps) {
    const nodeData = data as ExtractFrameNodeData;
    const { updateNodeData, deleteNode } = useWorkflowStore();
    const edges = useWorkflowStore((state) => state.edges);
    const { getNode } = useReactFlow();
    const isExecuting = nodeData.status === 'running';

    // Local State
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

    // Actions
    const handleDuplicate = () => {
        setIsMenuOpen(false);
    };

    const handleRename = (newName: string) => {
        updateNodeData(id, { label: newName });
        setIsRenameModalOpen(false);
    };

    const handleLock = () => {
        updateNodeData(id, { isLocked: !nodeData.isLocked });
        setIsMenuOpen(false);
    };

    const handleDelete = () => {
        deleteNode(id);
        setIsMenuOpen(false);
    };

    // Check connections
    const hasVideoConnection = edges.some(
        e => e.target === id && e.targetHandle === 'video_url'
    );
    const hasTimestampConnection = edges.some(
        e => e.target === id && e.targetHandle === 'timestamp'
    );

    return (
        <>
            <div
                className={`
                    group relative rounded-2xl min-w-[300px] shadow-2xl transition-all duration-200
                    ${selected ? 'bg-[#2B2B2F] ring-2 ring-inset ring-[#333337]' : 'bg-[#212126]'}
                    ${isExecuting ? 'ring-2 ring-[#C084FC]/50' : ''}
                    ${nodeData.status === 'error' ? 'ring-2 ring-red-500' : ''}
                `}
            >
                {/* Input Handles - Left Side */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-10">
                    {/* Video Handle */}
                    <div className="relative group/handle">
                        <Handle
                            type="target"
                            position={Position.Left}
                            id="video_url"
                            className={`!w-3 !h-3 !bg-[#2B2B2F] !border-[2px] !border-pink-500 transition-transform duration-200 hover:scale-125`}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 opacity-0 group-hover/handle:opacity-100 transition-opacity bg-black/80 px-1 rounded whitespace-nowrap pointer-events-none">
                            Video Source
                        </span>
                    </div>

                    {/* Timestamp Handle */}
                    <div className="relative group/handle">
                        <Handle
                            type="target"
                            position={Position.Left}
                            id="timestamp"
                            className={`!w-3 !h-3 !bg-[#2B2B2F] !border-[2px] !border-blue-400 transition-transform duration-200 hover:scale-125`}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 opacity-0 group-hover/handle:opacity-100 transition-opacity bg-black/80 px-1 rounded whitespace-nowrap pointer-events-none">
                            Timestamp
                        </span>
                    </div>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-4.5 pt-4 pb-2">
                    <div className="flex items-center gap-2">
                        <Film className="w-4 h-4 text-gray-400" />
                        <span
                            className="font-normal text-gray-200 text-[16px]"
                            style={{ fontFamily: 'var(--font-dm-sans)' }}
                        >
                            {nodeData.label || 'Extract Frame'}
                        </span>
                    </div>

                    <div className="relative">
                        <button
                            className="text-gray-500 hover:text-white transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                        {isExecuting && <Loader2 className="w-4 h-4 text-[#C084FC] animate-spin absolute right-8 top-0.5" />}

                        <NodeContextMenu
                            isOpen={isMenuOpen}
                            position={{ x: -10, y: -2 }}
                            onClose={() => setIsMenuOpen(false)}
                            onDuplicate={handleDuplicate}
                            onRename={() => {
                                setIsMenuOpen(false);
                                setIsRenameModalOpen(true);
                            }}
                            onLock={handleLock}
                            onDelete={handleDelete}
                            isLocked={nodeData.isLocked}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="px-4.5 pb-4 space-y-4">
                    {/* Status Indicators */}
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-500">Video:</span>
                            {hasVideoConnection ? (
                                <span className="text-pink-500">Connected</span>
                            ) : (
                                <span className="text-gray-600 italic">Waiting...</span>
                            )}
                        </div>
                    </div>

                    {/* Timestamp Input */}
                    <div className="relative">
                        <label className="block text-[10px] text-gray-500 mb-1 ml-1">
                            Timestamp (Sec or %)
                        </label>
                        <input
                            type="text"
                            value={nodeData.timestamp || ''}
                            onChange={(e) => updateNodeData(id, { timestamp: e.target.value })}
                            placeholder="e.g. 10 or 50%"
                            disabled={isExecuting || hasTimestampConnection || nodeData.isLocked}
                            className={`
                                w-full bg-[#353539] rounded-lg px-3 py-2 text-sm text-gray-200
                                focus:outline-none focus:ring-1 focus:ring-[#55555A]
                                placeholder-gray-600
                                ${hasTimestampConnection ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        />
                        {hasTimestampConnection && <span className="absolute right-3 top-7 text-[10px] text-blue-400">Linked</span>}
                    </div>

                    {/* Extracted Frame Preview */}
                    {nodeData.frameUrl && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-[#353539]">
                            <img
                                src={nodeData.frameUrl}
                                alt="Extracted frame"
                                className="w-full h-32 object-cover"
                            />
                        </div>
                    )}

                    {/* Error Display */}
                    {nodeData.error && (
                        <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                            <p className="text-xs text-red-400">{nodeData.error}</p>
                        </div>
                    )}
                </div>

                {/* Handle Container - Floating Output */}
                <div
                    className={`
                        absolute top-[60px] -right-4 w-8 h-8 rounded-full flex items-center justify-center
                        transition-colors duration-200 pointer-events-auto
                        ${selected ? 'bg-[#2B2B2F]' : 'bg-[#212126]'}
                    `}
                >
                    <div className="relative z-10 flex items-center justify-center">
                        <Handle
                            type="source"
                            position={Position.Right}
                            id="output"
                            className={`!w-4 !h-4 !bg-[#2B2B2F] !border-[3.3px] !border-[#EF4444] transition-transform duration-200 hover:scale-110 flex items-center justify-center`}
                        />
                    </div>
                </div>
            </div>

            <RenameModal
                isOpen={isRenameModalOpen}
                initialValue={nodeData.label || 'Extract Frame'}
                onClose={() => setIsRenameModalOpen(false)}
                onRename={handleRename}
            />
        </>
    );
}

export const ExtractFrameNode = memo(ExtractFrameNodeComponent);
